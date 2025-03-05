
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Calendar, ChevronDown, Heart, LogIn, Menu, Search, User, UserPlus, X, Plus, UserRound } from "lucide-react";
import UserAvatar from "./UserAvatar";
import { currentUser } from "@/lib/data";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [{
  label: "Home",
  href: "/"
}, {
  label: "Events",
  href: "/events"
}, {
  label: "Organizers",
  href: "/organizers"
}];

// Added new prop to simulate unauthenticated state
const Navbar = ({ isAuthenticated = true }: { isAuthenticated?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navigation = navItems.map(item => ({
    ...item,
    active: location.pathname === item.href
  }));

  return <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300", 
      isScrolled 
        ? "py-2 bg-background/80 backdrop-blur-md shadow-sm" 
        : "py-3 bg-primary text-white"
    )}>
      <div className="container flex items-center justify-between">
        {/* Desktop Navigation - Left */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item, index) => index < Math.floor(navigation.length / 2) && (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild className={cn(
                    navigationMenuTriggerStyle(), 
                    "bg-transparent font-medium text-base tracking-wide transition-all duration-200",
                    "hover:text-primary hover:bg-primary/10 hover:scale-105",
                    item.active 
                      ? "text-primary font-semibold border-b-2 border-primary" 
                      : isScrolled ? "text-foreground/80" : "text-white"
                  )}>
                    <Link to={item.href}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Logo - Centered */}
        <Link to="/" className="font-heading text-xl tracking-tight flex items-center gap-2 text-white mx-auto absolute left-1/2 -translate-x-1/2">
          <Heart className="h-6 w-6 fill-white stroke-white" />
          <span className={cn(
            "font-semibold", 
            isScrolled ? "text-primary" : "text-white"
          )}>LaunchGood</span>
        </Link>
        
        {/* Desktop Navigation - Right */}
        <div className="hidden md:flex items-center">
          <NavigationMenu>
            <NavigationMenuList>
              {navigation.map((item, index) => index >= Math.floor(navigation.length / 2) && (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild className={cn(
                    navigationMenuTriggerStyle(), 
                    "bg-transparent font-medium text-base tracking-wide transition-all duration-200",
                    "hover:text-primary hover:bg-primary/10 hover:scale-105",
                    item.active 
                      ? "text-primary font-semibold border-b-2 border-primary" 
                      : isScrolled ? "text-foreground/80" : "text-white"
                  )}>
                    <Link to={item.href}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="icon" className={cn(
            "hover:bg-primary/10 transition-all duration-200",
            isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-white/80"
          )}>
            <Search className="h-5 w-5" />
          </Button>
          
          {/* Create Event Button */}
          <Link to="/events/create">
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105">
              <Plus className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className={cn(
                "hover:bg-primary/10 transition-all duration-200",
                isScrolled ? "text-foreground hover:text-primary" : "text-white hover:text-white/80"
              )}>
                <Bell className="h-5 w-5" />
              </Button>
              
              {/* My Profile Button */}
              <Link to="/dashboard/profile">
                <Button variant="outline" className={cn(
                  "flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200",
                  !isScrolled && "border-white text-white hover:text-white/80 hover:bg-white/10"
                )}>
                  <UserRound className="h-4 w-4" />
                  My Profile
                </Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className={cn(
                    "flex items-center gap-2 hover:bg-primary/10 transition-all duration-200",
                    isScrolled ? "hover:text-primary" : "text-white hover:text-white/80"
                  )}>
                    <UserAvatar user={currentUser} size="sm" />
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <Link to="/dashboard">
                    <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/dashboard/events">
                    <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary">
                      <Calendar className="mr-2 h-4 w-4" />
                      My Events
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className={cn(
                  "flex items-center gap-2 hover:bg-primary/10 hover:text-primary",
                  !isScrolled && "border-white text-white hover:text-white/80 hover:bg-white/10"
                )}>
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className={cn(
                  "flex items-center gap-2",
                  isScrolled ? "bg-primary hover:bg-primary/90" : "bg-white text-primary hover:bg-white/90"
                )}>
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className={cn(
          "md:hidden hover:bg-primary/10",
          isScrolled ? "hover:text-primary" : "text-white hover:text-white/80"
        )} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-x-0 top-[57px] z-50 h-[calc(100vh-57px)] bg-background/90 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden", 
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="container py-4">
          <div className="flex flex-col space-y-4">
            {/* Mobile Logo */}
            <Link to="/" className="font-heading text-xl tracking-tight flex items-center gap-2 text-primary justify-center mb-4">
              <Heart className="h-6 w-6 fill-primary stroke-primary" />
              <span className="font-semibold">LaunchGood</span>
            </Link>
            
            {navigation.map(item => <Link 
              key={item.href} 
              to={item.href} 
              className={cn(
                "px-4 py-3 text-lg rounded-md transition-all duration-200 font-medium", 
                item.active 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
              )}
            >
                {item.label}
              </Link>)}
            
            {/* Create Event Button for Mobile */}
            <Link to="/events/create" className="px-4 py-3 text-lg bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Create Event
            </Link>
            
            <div className="border-t my-2" />
            
            {isAuthenticated ? (
              <>
                {/* Updated to show My Profile link in mobile menu */}
                <Link to="/dashboard/profile" className="px-4 py-3 text-lg rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <UserRound className="mr-2 h-5 w-5" />
                  My Profile
                </Link>
                <Link to="/dashboard" className="px-4 py-3 text-lg rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Dashboard
                </Link>
                <Link to="/dashboard/events" className="px-4 py-3 text-lg rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  My Events
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-3 text-lg rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-3 text-lg rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>;
};

export default Navbar;

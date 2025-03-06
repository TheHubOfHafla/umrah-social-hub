
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Calendar, ChevronDown, LogIn, Menu, User, UserPlus, X, Plus, UserRound, Zap } from "lucide-react";
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
        : "py-2 md:py-3 bg-transparent"
    )}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map(item => <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild className={cn(
                    navigationMenuTriggerStyle(), 
                    "bg-transparent font-medium text-base tracking-wide transition-all duration-200",
                    "hover:text-primary hover:bg-primary/10 hover:scale-105",
                    item.active 
                      ? "text-primary font-semibold border-b-2 border-primary" 
                      : "text-foreground/80"
                  )}>
                    <Link to={item.href}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>)}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link to="/" className="flex items-center gap-1 md:gap-2 group">
            <Zap className="h-5 w-5 md:h-7 md:w-7 text-primary group-hover:animate-pulse-soft" />
            <span className="font-heading text-xl md:text-2xl tracking-tight text-primary font-bold">EventHub</span>
          </Link>
        </div>

        <div className="flex items-center">
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/events/create">
              <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </Link>
            
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-all duration-200">
                  <Bell className="h-5 w-5" />
                </Button>
                
                <Link to="/dashboard/profile">
                  <Button variant="outline" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                    <UserRound className="h-4 w-4" />
                    My Profile
                  </Button>
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200">
                      <UserAvatar user={currentUser} size="sm" />
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
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
                  <Button variant="outline" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden hover:bg-primary/10 hover:text-primary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className={cn(
        "fixed inset-x-0 top-[57px] z-50 h-[calc(100vh-57px)] bg-background/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden overflow-y-auto", 
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="container py-4">
          <div className="flex flex-col space-y-3">
            {navigation.map(item => <Link 
              key={item.href} 
              to={item.href} 
              className={cn(
                "px-4 py-2.5 text-base rounded-md transition-all duration-200 font-medium", 
                item.active 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
              )}
            >
                {item.label}
              </Link>)}
            
            <Link to="/events/create" className="px-4 py-2.5 text-base bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Link>
            
            <div className="border-t my-2" />
            
            {isAuthenticated ? (
              <>
                <Link to="/dashboard/profile" className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <UserRound className="mr-2 h-4 w-4" />
                  My Profile
                </Link>
                <Link to="/dashboard" className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
                <Link to="/dashboard/events" className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  My Events
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Link>
                <Link to="/signup" className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center">
                  <UserPlus className="mr-2 h-4 w-4" />
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


import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Calendar, ChevronDown, Menu, Search, User, X } from "lucide-react";
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

const Navbar = () => {
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
        : "py-4 bg-transparent"
    )}>
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-xl font-semibold mr-8">Islamic Social</Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map(item => <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild className={cn(
                    navigationMenuTriggerStyle(), 
                    "bg-transparent hover:bg-secondary/80", 
                    item.active && "text-primary font-medium"
                  )}>
                    <Link to={item.href}>
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>)}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserAvatar user={currentUser} size="sm" />
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <Link to="/dashboard">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
              </Link>
              <Link to="/dashboard/events">
                <DropdownMenuItem>
                  <Calendar className="mr-2 h-4 w-4" />
                  My Events
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
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
            {navigation.map(item => <Link 
              key={item.href} 
              to={item.href} 
              className={cn(
                "px-4 py-3 text-lg rounded-md", 
                item.active ? "bg-secondary font-medium" : "hover:bg-secondary/80"
              )}
            >
                {item.label}
              </Link>)}
            <div className="border-t my-2" />
            <Link to="/dashboard" className="px-4 py-3 text-lg rounded-md hover:bg-secondary/80 flex items-center">
              <User className="mr-2 h-5 w-5" />
              Dashboard
            </Link>
            <Link to="/dashboard/events" className="px-4 py-3 text-lg rounded-md hover:bg-secondary/80 flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              My Events
            </Link>
          </div>
        </div>
      </div>
    </header>;
};

export default Navbar;

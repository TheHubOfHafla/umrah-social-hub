
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/App";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input"; 
import { 
  Logo,
  NavLinks,
  AuthButtons,
  UserMenu,
  NotificationsButton,
  ProfileButton,
  CreateEventButton,
  MobileMenu,
  MobileMenuButton
} from "./navbar";

const Navbar = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const auth = useContext(AuthContext);

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

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300", 
        isScrolled 
          ? "bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100" 
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-14">
        {/* Logo */}
        <div className="relative flex items-center z-10">
          <Logo />
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
          <NavLinks />
        </div>

        {/* Search Input - Desktop */}
        <div className="hidden md:flex items-center ml-auto mr-4 relative">
          <div className="relative group flex items-center">
            <Input 
              type="search" 
              placeholder="Search events..." 
              className={cn(
                "py-1 pl-8 pr-4 w-[250px] focus:w-[300px] transition-all duration-300 border border-gray-200 focus:border-purple-300 rounded-md",
                "text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-purple-200 focus:outline-none",
                searchFocused && "border-purple-300 ring-2 ring-purple-100"
              )}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className={cn(
              "absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors duration-300",
              searchFocused ? "text-purple-500" : "text-gray-400"
            )} />
          </div>
        </div>

        {/* Right Side - User Actions */}
        <div className="flex items-center ml-auto gap-2 flex-shrink-0">
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {/* Create Event Button */}
            <CreateEventButton />
            
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <NotificationsButton />
                
                {/* Profile Quick Access */}
                <ProfileButton />
                
                {/* User Menu */}
                <UserMenu />
              </>
            ) : (
              <AuthButtons />
            )}
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton isOpen={mobileMenuOpen} toggleMenu={toggleMobileMenu} />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={mobileMenuOpen} isAuthenticated={isAuthenticated} />
    </header>
  );
};

export default Navbar;

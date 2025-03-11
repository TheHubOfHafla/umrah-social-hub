
import { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/App";
import { ChevronDown } from "lucide-react";
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

const Navbar = ({ isAuthenticated = true }: { isAuthenticated?: boolean }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const auth = useContext(AuthContext);
  
  const userRole = auth.currentUser?.role || 'attendee';
  const isOrganizer = userRole === 'organizer';

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
          ? "py-2 bg-background/95 backdrop-blur-md shadow-sm border-b border-primary/10" 
          : "py-2 md:py-3 bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between">
        {/* Logo */}
        <div className="relative flex items-center z-10">
          <Logo />
        </div>

        {/* Center Navigation */}
        <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
          <NavLinks />
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
                <ProfileButton isOrganizer={isOrganizer} />
                
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

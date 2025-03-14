
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRound, Calendar, LogIn, UserPlus, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/App";
import UserAvatar from "../UserAvatar";
import { currentUser } from "@/lib/data/users";
import CreateEventButton from "./CreateEventButton";

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

interface MobileMenuProps {
  isOpen: boolean;
  isAuthenticated: boolean;
}

const MobileMenu = ({ isOpen, isAuthenticated }: MobileMenuProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const navigation = navItems.map(item => ({
    ...item,
    active: location.pathname === item.href
  }));

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div 
      className={cn(
        "fixed inset-x-0 top-[57px] z-50 h-[calc(100vh-57px)] bg-background/95 backdrop-blur-md transition-transform duration-300 ease-in-out md:hidden overflow-y-auto", 
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="container py-4">
        {isAuthenticated && (
          <div className="flex items-center gap-3 p-4 mb-3 border rounded-lg bg-muted/30">
            <UserAvatar user={auth.currentUser || currentUser} size="md" />
            <div className="flex flex-col">
              <span className="font-medium">{auth.currentUser?.name || currentUser.name}</span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <UserRound className="h-3 w-3" />
                Attendee Account
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          {navigation.map(item => (
            <button 
              key={item.href} 
              onClick={() => handleNavigation(item.href)}
              className={cn(
                "px-4 py-2.5 text-base rounded-md transition-all duration-200 font-medium w-full text-left", 
                item.active 
                  ? "bg-primary/10 text-primary font-semibold" 
                  : "text-foreground/80 hover:bg-primary/10 hover:text-primary"
              )}
            >
              {item.label}
            </button>
          ))}
          
          <CreateEventButton mobile />
          
          <div className="border-t my-2" />
          
          {isAuthenticated ? (
            <>
              <button 
                onClick={() => handleNavigation("/dashboard/profile")} 
                className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center w-full text-left"
              >
                <UserRound className="mr-2 h-4 w-4" />
                My Profile
              </button>
              <button 
                onClick={() => handleNavigation("/dashboard/events")} 
                className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center w-full text-left"
              >
                <Calendar className="mr-2 h-4 w-4" />
                My Events
              </button>
              <button 
                onClick={auth.onSignOut} 
                className="px-4 py-2.5 text-base rounded-md hover:bg-red-100 text-red-600 transition-all duration-200 flex items-center w-full text-left mt-4"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => handleNavigation("/login")} 
                className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center w-full text-left"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </button>
              <button 
                onClick={() => handleNavigation("/signup")} 
                className="px-4 py-2.5 text-base rounded-md hover:bg-primary/10 hover:text-primary transition-all duration-200 flex items-center w-full text-left"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

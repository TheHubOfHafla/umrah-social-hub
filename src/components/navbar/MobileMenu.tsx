
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserRound, Calendar, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AuthContext } from "@/App";
import UserAvatar from "../UserAvatar";
import { currentUser } from "@/lib/data/users";
import CreateEventButton from "./CreateEventButton";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [{
  label: "Home",
  href: "/"
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
        "fixed inset-x-0 top-[57px] z-50 h-[calc(100vh-57px)] bg-white border-t border-gray-100 transition-transform duration-300 ease-in-out md:hidden overflow-y-auto", 
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
                  ? "bg-purple-50 text-purple-600 font-semibold" 
                  : "text-gray-700 hover:bg-purple-50 hover:text-purple-600"
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
                className="px-4 py-2.5 text-base rounded-md hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center w-full text-left"
              >
                <UserRound className="mr-2 h-4 w-4" />
                My Profile
              </button>
              <button 
                onClick={() => handleNavigation("/dashboard/events")} 
                className="px-4 py-2.5 text-base rounded-md hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center w-full text-left"
              >
                <Calendar className="mr-2 h-4 w-4" />
                My Events
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-3 px-4 py-2">
              <Button
                variant="outline"
                className="w-full justify-center text-purple-600 border-purple-200 hover:bg-purple-50"
                onClick={() => handleNavigation("/login")}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Sign In
              </Button>
              <Button
                className="w-full justify-center bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => handleNavigation("/signup")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;

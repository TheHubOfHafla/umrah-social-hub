
import { useNavigate } from "react-router-dom";
import { User, UserRound, Calendar, Settings, Building, ChevronDown } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserAvatar from "../UserAvatar";
import { AuthContext } from "@/App";
import { currentUser } from "@/lib/data/users";
import { useContext } from "react";

interface UserMenuProps {
  className?: string;
}

const UserMenu = ({ className }: UserMenuProps) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const userRole = auth.currentUser?.role || 'attendee';
  const isOrganizer = userRole === 'organizer';

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className={cn("flex items-center", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-all duration-200 px-1">
            <UserAvatar user={auth.currentUser || currentUser} size="sm" />
            <ChevronDown className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 md:w-56">
          <div className="flex items-center gap-2 p-2 border-b">
            <UserAvatar user={auth.currentUser || currentUser} size="sm" />
            <div className="flex flex-col">
              <span className="font-medium text-sm">Guest User</span>
              <span className="text-xs text-muted-foreground">
                {isOrganizer ? (
                  <span className="flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    Organizer
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <UserRound className="h-3 w-3" />
                    Attendee
                  </span>
                )}
              </span>
            </div>
          </div>

          <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary" onClick={() => 
            handleNavigation(isOrganizer ? "/dashboard/events" : "/dashboard/events")
          }>
            <Calendar className="mr-2 h-4 w-4" />
            {isOrganizer ? "My Events" : "Events I'm Attending"}
          </DropdownMenuItem>

          {!isOrganizer && (
            <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary" onClick={() => 
              handleNavigation("/dashboard/organizer/signup")
            }>
              <Building className="mr-2 h-4 w-4" />
              Become an Organizer
            </DropdownMenuItem>
          )}

          <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary" onClick={() => 
            handleNavigation(isOrganizer ? "/dashboard/profile" : "/dashboard/profile")
          }>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserMenu;


import { useNavigate } from "react-router-dom";
import { Settings, ChevronDown } from "lucide-react";
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
            </div>
          </div>

          <DropdownMenuItem className="hover:bg-primary/10 hover:text-primary" onClick={() => 
            handleNavigation("/")
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

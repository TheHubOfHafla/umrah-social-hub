
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

const AuthButtons = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex items-center gap-1.5">
      <button onClick={() => handleNavigation("/login")}>
        <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-all duration-200 text-xs md:text-sm">
          <LogIn className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden md:inline">Sign In</span>
        </Button>
      </button>
      <button onClick={() => handleNavigation("/signup")}>
        <Button size="sm" className="flex items-center gap-1 transition-all duration-200 hover:scale-105 text-xs md:text-sm">
          <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
          <span className="hidden md:inline">Sign Up</span>
        </Button>
      </button>
    </div>
  );
};

export default AuthButtons;

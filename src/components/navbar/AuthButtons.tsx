
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuthButtonsProps {
  isScrolled?: boolean;
}

const AuthButtons = ({ isScrolled = false }: AuthButtonsProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className={cn(
          isScrolled
            ? "text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
            : "text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/40"
        )}
        onClick={() => handleNavigation("/login")}
      >
        Sign In
      </Button>
      <Button
        size="sm"
        className={cn(
          isScrolled
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
        )}
        onClick={() => handleNavigation("/signup")}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;

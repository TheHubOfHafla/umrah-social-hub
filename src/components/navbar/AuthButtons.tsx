
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AuthButtons = () => {
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
        className="text-purple-600 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
        onClick={() => handleNavigation("/login")}
      >
        Sign In
      </Button>
      <Button
        size="sm"
        className="bg-purple-600 hover:bg-purple-700 text-white"
        onClick={() => handleNavigation("/signup")}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;

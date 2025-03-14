
import { useNavigate } from "react-router-dom";
import { UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProfileButton = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  return (
    <button onClick={() => handleNavigation("/")}>
      <Button variant="outline" size="sm" className="flex items-center gap-1 hover:bg-primary/10 hover:text-primary transition-all duration-200 hidden lg:flex">
        <UserRound className="h-3 w-3 md:h-4 md:w-4" />
        <span className="text-xs md:text-sm">Home</span>
      </Button>
    </button>
  );
};

export default ProfileButton;

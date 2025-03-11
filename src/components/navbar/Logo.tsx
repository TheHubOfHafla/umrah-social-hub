
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

const Logo = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/");
    window.scrollTo(0, 0);
  };

  return (
    <button 
      onClick={handleNavigation} 
      className="flex items-center gap-1 md:gap-2 group"
    >
      <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:animate-pulse-soft" />
      <span className="font-heading text-lg md:text-xl lg:text-2xl tracking-tight text-primary font-bold">
        HaflaHub
      </span>
    </button>
  );
};

export default Logo;

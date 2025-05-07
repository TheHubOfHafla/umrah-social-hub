
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
      <Zap className="h-5 w-5 md:h-6 md:w-6 text-purple-600 group-hover:animate-pulse-soft" />
      <span className="font-heading text-lg md:text-xl lg:text-2xl tracking-tight font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
        HaflaHub
      </span>
    </button>
  );
};

export default Logo;

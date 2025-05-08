
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileMenuButtonProps {
  isOpen: boolean;
  toggleMenu: () => void;
  isScrolled?: boolean;
}

const MobileMenuButton = ({ isOpen, toggleMenu, isScrolled = false }: MobileMenuButtonProps) => {
  return (
    <button
      onClick={toggleMenu}
      className={cn(
        "md:hidden flex items-center justify-center w-8 h-8 rounded-md",
        isScrolled 
          ? "text-gray-700 hover:bg-gray-100" 
          : "text-white hover:bg-white/20"
      )}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <Menu className="h-5 w-5" />
    </button>
  );
};

export default MobileMenuButton;

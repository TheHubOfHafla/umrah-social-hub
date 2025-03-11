
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CreateEventButtonProps {
  mobile?: boolean;
  className?: string;
}

const CreateEventButton = ({ mobile = false, className }: CreateEventButtonProps) => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate("/events/create");
    window.scrollTo(0, 0);
  };

  if (mobile) {
    return (
      <button 
        onClick={handleNavigation} 
        className={cn("px-4 py-2.5 text-base bg-primary text-white rounded-md hover:bg-primary/90 transition-all duration-200 flex items-center w-full", className)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Event
      </button>
    );
  }

  return (
    <button 
      onClick={handleNavigation}
      className={cn("transition-all duration-200 hover:scale-105", className)}
    >
      <Button size="sm" variant="default" className="flex items-center gap-1 text-xs md:text-sm">
        <Plus className="h-3 w-3 md:h-4 md:w-4" />
        <span className="hidden sm:inline">Create</span>
        <span className="hidden md:inline"> Event</span>
      </Button>
    </button>
  );
};

export default CreateEventButton;

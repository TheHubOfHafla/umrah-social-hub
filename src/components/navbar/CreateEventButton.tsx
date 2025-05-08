
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateEventButtonProps {
  mobile?: boolean;
  isScrolled?: boolean;
}

const CreateEventButton = ({ mobile = false, isScrolled = false }: CreateEventButtonProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/events/create");
    window.scrollTo(0, 0);
  };

  if (mobile) {
    return (
      <button
        onClick={handleClick}
        className="px-4 py-2.5 text-base rounded-md hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 flex items-center w-full text-left"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Event
      </button>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      className={cn(
        "transition-colors mr-1",
        isScrolled 
          ? "text-gray-700 hover:text-purple-600 border-gray-200" 
          : "text-white border-white/30 bg-white/10 backdrop-blur-sm hover:bg-white/20 hover:border-white/40"
      )}
      onClick={handleClick}
    >
      <Plus className="h-4 w-4 mr-1" /> Create
    </Button>
  );
};

export default CreateEventButton;

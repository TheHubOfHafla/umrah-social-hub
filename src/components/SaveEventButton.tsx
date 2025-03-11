
import { useState, useContext } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/App";
import { saveEvent, unsaveEvent } from "@/lib/data/queries";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface SaveEventButtonProps {
  eventId: string;
  isSaved?: boolean;
  variant?: "icon" | "default";
  className?: string;
}

const SaveEventButton = ({ 
  eventId, 
  isSaved: initialIsSaved = false,
  variant = "default",
  className = ""
}: SaveEventButtonProps) => {
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, currentUser } = useContext(AuthContext);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to save events",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (isSaved) {
        // Unsave the event
        const success = await unsaveEvent(eventId, currentUser.id);
        if (success) {
          setIsSaved(false);
          toast({
            title: "Event removed",
            description: "Event removed from your saved list"
          });
        } else {
          throw new Error("Failed to remove event");
        }
      } else {
        // Save the event
        const success = await saveEvent(eventId, currentUser.id);
        if (success) {
          setIsSaved(true);
          toast({
            title: "Event saved",
            description: "Event added to your saved list"
          });
        } else {
          throw new Error("Failed to save event");
        }
      }
    } catch (error) {
      console.error("Error toggling save event:", error);
      toast({
        title: "Operation failed",
        description: "Could not update saved events. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={className}
        onClick={handleSaveToggle}
        disabled={isLoading}
      >
        {isSaved ? (
          <BookmarkCheck className="h-5 w-5 text-primary" />
        ) : (
          <Bookmark className="h-5 w-5" />
        )}
      </Button>
    );
  }

  return (
    <Button
      variant={isSaved ? "outline" : "secondary"}
      size="sm"
      className={className}
      onClick={handleSaveToggle}
      disabled={isLoading}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="mr-2 h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Bookmark className="mr-2 h-4 w-4" />
          Save Event
        </>
      )}
    </Button>
  );
};

export default SaveEventButton;


import { useState } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsLoading(true);
    
    try {
      // Just toggle the saved state locally without authentication
      setIsSaved(!isSaved);
      toast({
        title: isSaved ? "Event removed" : "Event saved",
        description: isSaved ? "Event removed from your saved list" : "Event added to your saved list"
      });
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

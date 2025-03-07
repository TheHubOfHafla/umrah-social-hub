
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Chatbot from "./Chatbot";
import { cn } from "@/lib/utils";

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasBounced, setHasBounced] = useState(false);

  // Delay showing the button for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  // Add initial bounce animation after a delay
  useEffect(() => {
    if (isVisible && !hasBounced) {
      const bounceTimer = setTimeout(() => {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
          setHasBounced(true);
        }, 1000);
      }, 3000);
      
      return () => clearTimeout(bounceTimer);
    }
  }, [isVisible, hasBounced]);

  const handleToggleChat = () => {
    setIsAnimating(true);
    setIsOpen(!isOpen);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleCloseChat = () => {
    setIsAnimating(true);
    setIsOpen(false);
    setTimeout(() => setIsAnimating(false), 500);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className={cn(
        "fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50 transition-all duration-500",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleToggleChat}
                size="icon"
                className={cn(
                  "h-12 w-12 sm:h-14 sm:w-14 rounded-full shadow-lg transition-all duration-300",
                  isOpen ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90",
                  isAnimating && "animate-pulse",
                  !isOpen && !hasBounced && "animate-bounce",
                  "hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
                )}
                aria-label={isOpen ? "Close chat" : "Open chat"}
              >
                {isOpen ? (
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-black text-white border-black">
              <p>{isOpen ? "Close chat" : "Chat with us"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Chatbot 
        isOpen={isOpen}
        onClose={handleCloseChat}
        initialMessage="👋 Hi there! I'm your Event Buddy. I can help you find events, answer questions about the platform, or assist with any issues you're having. How can I help you today?"
      />
    </>
  );
};

export default ChatbotButton;

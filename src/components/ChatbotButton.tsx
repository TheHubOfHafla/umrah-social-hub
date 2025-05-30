
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
  const [isPulsing, setIsPulsing] = useState(false);

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
    // Start pulsing animation
    setIsPulsing(true);
    
    // Short delay before changing state to allow animation to be seen
    setTimeout(() => {
      setIsAnimating(true);
      setIsOpen(!isOpen);
      
      // Stop pulsing after animation is complete
      setTimeout(() => {
        setIsPulsing(false);
        setIsAnimating(false);
      }, 500);
    }, 150);
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
                  isOpen ? "bg-purple-200 text-purple-800 hover:bg-purple-300" : "bg-purple-600 hover:bg-purple-700 text-white",
                  isAnimating && "animate-pulse",
                  isPulsing && !isOpen && "animate-[scale-in_0.3s_ease-out]",
                  isPulsing && isOpen && "animate-[scale-out_0.3s_ease-out]",
                  !isOpen && !hasBounced && "animate-bounce",
                  "hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                )}
                aria-label={isOpen ? "Close chat" : "Open chat"}
              >
                {isOpen ? (
                  <X className={cn("h-5 w-5 sm:h-6 sm:w-6", isPulsing && "animate-spin")} />
                ) : (
                  <MessageCircle className={cn("h-5 w-5 sm:h-6 sm:w-6", isPulsing && "animate-spin")} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="bg-purple-900 text-white border-purple-900">
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

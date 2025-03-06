
import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Chatbot from "./Chatbot";

// Note: We're adding this comment to signal to the app router that we need a new route
// In a real implementation, you would add this to your router configuration
// Route: /admin/crm - Component: CrmDashboard

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseChat = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 z-50">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={handleToggleChat}
                size="icon"
                className={`h-11 w-11 sm:h-14 sm:w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
                  isOpen ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90"
                }`}
              >
                <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p>Chat with us</p>
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

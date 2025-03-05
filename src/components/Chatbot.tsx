
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, User, Bot, ChevronDown, CornerDownLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  status: "sending" | "sent" | "error";
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const Chatbot = ({ isOpen, onClose, initialMessage = "Hi there! How can I help you today?" }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: initialMessage,
          role: "assistant",
          timestamp: new Date(),
          status: "sent"
        }
      ]);
    }
  }, [isOpen, initialMessage, messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Generate a unique ID for the message
    const messageId = crypto.randomUUID();
    
    // Add user message to chat
    const userMessage: Message = {
      id: messageId,
      content: input,
      role: "user",
      timestamp: new Date(),
      status: "sent"
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Simulate AI response with a delay
      // In a real implementation, you would call your AI service here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample responses - in a real implementation, this would come from your AI service
      const responses = [
        "That's a great question! I'd be happy to help with that.",
        "I understand what you're looking for. Here's what I can tell you...",
        "Thanks for asking! Based on what you're describing, I would recommend...",
        "I'm here to help with any questions about our events platform.",
        "Great! I can definitely assist with finding events that match your interests."
      ];
      
      const responseIndex = Math.floor(Math.random() * responses.length);
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: responses[responseIndex],
        role: "assistant",
        timestamp: new Date(),
        status: "sent"
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Update the message status to error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, status: "error" as const } 
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (without shift for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 z-50 w-full max-w-[380px] rounded-lg shadow-xl transition-all duration-300 ease-in-out">
      <div className="flex flex-col h-[500px] bg-card border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5" />
            <h3 className="font-semibold">Event Buddy</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <ChevronDown className={cn("h-5 w-5 transition-transform", !isExpanded && "rotate-180")} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary-foreground hover:bg-primary/90"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Chat content */}
        {isExpanded && (
          <>
            <ScrollArea className="flex-grow p-4 bg-accent/10">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "mb-4 max-w-[85%] rounded-lg p-3",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="flex items-center mb-1 space-x-2">
                    {message.role === "user" ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">
                      {message.role === "user" ? "You" : "Event Buddy"}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex justify-end mt-1">
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.status === "sending" && " · Sending..."}
                      {message.status === "error" && " · Failed to send"}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            {/* Input area */}
            <div className="border-t p-3 bg-background">
              <div className="flex items-end space-x-2">
                <div className="flex-grow relative">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="min-h-[60px] max-h-[120px] py-2 pr-10 resize-none"
                    disabled={isLoading}
                  />
                  <CornerDownLeft 
                    className="absolute right-3 bottom-3 h-4 w-4 text-muted-foreground pointer-events-none" 
                  />
                </div>
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Ask me about events, recommendations, or how to use the platform
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;

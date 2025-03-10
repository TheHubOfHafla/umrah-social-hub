
import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, User, Bot, ChevronDown, CornerDownLeft, ThumbsUp, ThumbsDown, Copy, Check, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { callDeepseekChat } from "@/lib/aiHelpers";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  status: "sending" | "sent" | "error";
  feedback?: "like" | "dislike";
  source?: "deepseek" | "openai" | "fallback" | "error";
}

interface SuggestedPrompt {
  id: string;
  text: string;
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
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [suggestedPrompts, setSuggestedPrompts] = useState<SuggestedPrompt[]>([
    { id: "events", text: "Find events near me" },
    { id: "tickets", text: "How do I buy tickets?" },
    { id: "refunds", text: "What's your refund policy?" },
    { id: "account", text: "How do I create an account?" },
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          content: initialMessage,
          role: "assistant",
          timestamp: new Date(),
          status: "sent",
          source: "deepseek"
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
      // Show typing indicator
      setIsTyping(true);
      
      // Get message history for context (excluding the user message we just added)
      const messageHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Call the DeepSeek function
      const response = await callDeepseekChat(input, messageHistory);
      
      setIsTyping(false);
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: crypto.randomUUID(),
        content: response.message,
        role: "assistant",
        timestamp: new Date(),
        status: "sent",
        source: response.source
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Check if response contains navigation intent
      const navigationCheck = checkForNavigation(response.message);
      if (navigationCheck.shouldNavigate) {
        toast({
          title: "Navigation assistance",
          description: `I can take you to ${navigationCheck.pageName}. Click to navigate.`,
          action: (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigate(navigationCheck.path);
                onClose();
              }}
            >
              Go to {navigationCheck.pageName}
            </Button>
          ),
        });
      }
      
      // Generate new suggested prompts based on the conversation
      generateSuggestedPrompts(aiMessage.content);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      setIsTyping(false);
      
      // Add AI error response
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
        status: "error",
        source: "error"
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkForNavigation = (message: string): { shouldNavigate: boolean, path: string, pageName: string } => {
    // Default response
    const defaultResponse = { shouldNavigate: false, path: "/", pageName: "home" };
    
    // Check for navigation intents in the message
    const navigationPatterns = [
      { regex: /go to (event|events|all events)/i, path: "/events", pageName: "Events" },
      { regex: /create (an |a |)event/i, path: "/events/create", pageName: "Create Event" },
      { regex: /view (my |)dashboard/i, path: "/dashboard", pageName: "Dashboard" },
      { regex: /check (my |)profile/i, path: "/dashboard/profile", pageName: "Profile" },
      { regex: /my events/i, path: "/dashboard/events", pageName: "My Events" },
      { regex: /sign (in|up)|login|register/i, path: "/login", pageName: "Login" },
      { regex: /about/i, path: "/about", pageName: "About Us" },
      { regex: /help/i, path: "/help", pageName: "Help Center" },
      { regex: /home/i, path: "/", pageName: "Home" },
    ];
    
    for (const pattern of navigationPatterns) {
      if (pattern.regex.test(message)) {
        return { shouldNavigate: true, path: pattern.path, pageName: pattern.pageName };
      }
    }
    
    return defaultResponse;
  };
  
  const generateSuggestedPrompts = (aiResponse: string) => {
    // Base prompts that are always relevant
    const basePrompts = [
      { id: "help", text: "What can you help me with?" },
      { id: "features", text: "What features does this app have?" },
    ];
    
    // Contextual prompts based on conversation
    const contextualPrompts: SuggestedPrompt[] = [];
    
    // Add event-related prompts
    if (aiResponse.toLowerCase().includes("event")) {
      contextualPrompts.push({ id: "create", text: "How do I create an event?" });
      contextualPrompts.push({ id: "find", text: "Find events near me" });
    }
    
    // Add dashboard-related prompts
    if (aiResponse.toLowerCase().includes("dashboard")) {
      contextualPrompts.push({ id: "dashboard", text: "What can I do in my dashboard?" });
    }
    
    // Add profile-related prompts
    if (aiResponse.toLowerCase().includes("profile")) {
      contextualPrompts.push({ id: "edit", text: "How do I edit my profile?" });
    }
    
    // Add ticket-related prompts
    if (aiResponse.toLowerCase().includes("ticket")) {
      contextualPrompts.push({ id: "refund", text: "What's the refund policy?" });
    }
    
    // Combine and limit prompts
    const allPrompts = [...contextualPrompts, ...basePrompts];
    setSuggestedPrompts(allPrompts.slice(0, 4));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send message on Enter (without shift for new line)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleCopyMessage = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMessageId(id);
    
    toast({
      title: "Copied to clipboard",
      description: "Message content copied to clipboard",
      duration: 2000,
    });
    
    // Reset copy icon after 2 seconds
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };
  
  const handleFeedback = (messageId: string, feedback: "like" | "dislike") => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback } 
          : msg
      )
    );
    
    toast({
      title: "Thank you for your feedback",
      description: feedback === "like" ? "We're glad this was helpful!" : "We'll work on improving our responses.",
      duration: 3000,
    });
  };
  
  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-24 right-4 sm:right-6 z-50 w-[92%] sm:w-full max-w-[380px] rounded-lg shadow-xl transition-all duration-300 ease-in-out">
      <div className="flex flex-col h-[60vh] sm:h-[500px] bg-card border border-border rounded-lg overflow-hidden animate-in slide-in-from-bottom-5">
        {/* Header */}
        <div className="flex items-center justify-between bg-primary/90 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-3 text-primary-foreground border-b">
          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6 sm:h-8 sm:w-8 ring-2 ring-background/20">
              <AvatarImage src="/placeholder.svg" alt="AI Assistant" />
              <AvatarFallback className="bg-primary-foreground text-primary">
                <Bot className="h-3 w-3 sm:h-4 sm:w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm sm:text-base font-semibold">Event Buddy</h3>
              <p className="text-[10px] sm:text-xs text-primary-foreground/80">Always here to help</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <ChevronDown className={cn("h-4 w-4 sm:h-5 sm:w-5 transition-transform", !isExpanded && "rotate-180")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>{isExpanded ? "Minimize" : "Expand"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 sm:h-8 sm:w-8 text-primary-foreground hover:bg-primary/90"
                    onClick={onClose}
                  >
                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Close</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Chat content */}
        {isExpanded && (
          <>
            <ScrollArea className="flex-grow p-3 sm:p-4 bg-accent/5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "mb-3 sm:mb-4 max-w-[90%] group animate-in",
                    message.role === "user"
                      ? "ml-auto slide-in-from-right-3"
                      : "slide-in-from-left-3"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg p-2 sm:p-3 relative",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-muted rounded-tl-none"
                    )}
                  >
                    <div className="flex items-center mb-1 space-x-1 sm:space-x-2">
                      {message.role === "user" ? (
                        <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
                          <AvatarFallback className="text-[8px]">
                            <User className="h-2 w-2 sm:h-3 sm:w-3" />
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
                          <AvatarFallback className="bg-primary text-primary-foreground text-[8px]">
                            <Bot className="h-2 w-2 sm:h-3 sm:w-3" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="text-[10px] sm:text-xs font-medium flex items-center">
                        {message.role === "user" ? "You" : "Event Buddy"}
                        {message.source === "deepseek" && (
                          <Tooltip>
                            <TooltipTrigger>
                              <Sparkles className="ml-1 h-2 w-2 sm:h-3 sm:w-3 text-purple-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">Powered by DeepSeek AI</p>
                            </TooltipContent>
                          </Tooltip>
                        )}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    
                    {/* Message actions */}
                    {message.role === "assistant" && (
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-background/10"
                            onClick={() => handleFeedback(message.id, "like")}
                            disabled={message.feedback !== undefined}
                          >
                            <ThumbsUp className={cn("h-3 w-3", message.feedback === "like" && "fill-current")} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-background/10"
                            onClick={() => handleFeedback(message.id, "dislike")}
                            disabled={message.feedback !== undefined}
                          >
                            <ThumbsDown className={cn("h-3 w-3", message.feedback === "dislike" && "fill-current")} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded-full hover:bg-background/10"
                            onClick={() => handleCopyMessage(message.content, message.id)}
                          >
                            {copiedMessageId === message.id ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                        <span className="text-[9px] sm:text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    )}
                    
                    {message.role === "user" && (
                      <div className="mt-1 flex justify-end">
                        <span className="text-[9px] sm:text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {message.status === "sending" && " · Sending..."}
                          {message.status === "error" && " · Failed to send"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 mb-4 max-w-[60%] animate-in fade-in-50">
                  <div className="bg-muted p-3 rounded-lg rounded-tl-none">
                    <div className="flex space-x-1">
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-2 w-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </ScrollArea>
            
            {/* Suggested prompts */}
            {messages.length > 0 && !isLoading && !isTyping && (
              <div className="px-3 pt-2">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {suggestedPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      onClick={() => handleSuggestedPrompt(prompt.text)}
                      className="shrink-0 text-xs px-3 py-1.5 bg-accent/50 hover:bg-accent rounded-full transition-colors whitespace-nowrap"
                    >
                      {prompt.text}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Input area */}
            <div className="border-t p-2 sm:p-3 bg-background">
              <div className="flex items-end space-x-2">
                <div className="flex-grow relative">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message..."
                    className="min-h-[50px] sm:min-h-[60px] max-h-[100px] sm:max-h-[120px] py-2 pr-8 sm:pr-10 resize-none text-xs sm:text-sm shadow-sm focus-visible:ring-primary/50"
                    disabled={isLoading || isTyping}
                    autoResize={true}
                  />
                  <CornerDownLeft 
                    className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground pointer-events-none" 
                  />
                </div>
                <Button
                  size="icon"
                  className="h-8 w-8 sm:h-10 sm:w-10 rounded-full shadow-sm"
                  onClick={handleSendMessage}
                  disabled={isLoading || isTyping || !input.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  ) : (
                    <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                </Button>
              </div>
              <div className="mt-1 sm:mt-2 text-center">
                <p className="text-[9px] sm:text-xs text-muted-foreground">
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

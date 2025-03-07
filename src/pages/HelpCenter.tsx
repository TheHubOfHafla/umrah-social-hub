
import { useState, useRef, useEffect } from "react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Search, Bot, Book, FileQuestion, LifeBuoy, MessageSquare, 
  LoaderCircle, ArrowRight, ThumbsUp, ThumbsDown, 
  Lightbulb, BookOpen, HelpCircle, AlertCircle, Send
} from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const HelpCenter = () => {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [feedbackSent, setFeedbackSent] = useState<Record<string, boolean>>({});
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // Popular search suggestions
  const popularSearches = [
    "How do I create an event?",
    "Can I get a refund?",
    "How to contact organizers?",
    "Find events near me",
    "Privacy settings"
  ];

  // Track if the page has been mounted for animations
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    // Focus input on page load
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    // Hide suggestions when search is submitted
    setShowSuggestions(false);
    setIsLoading(true);
    setAiResponse("");
    
    try {
      // Add to search history 
      if (!searchHistory.includes(query)) {
        setSearchHistory(prev => [query, ...prev].slice(0, 5));
      }
      
      // Simulate an AI response with a delay
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = [
        "Events can be created by clicking on the 'Create Event' button in the navigation bar. You'll need to provide details like the event name, date, location, and description. Make sure to include clear instructions for attendees and set any attendance limits or requirements.",
        "You can manage your event registrations from your dashboard. Navigate to 'My Profile' and then 'My Events' to see all the events you've registered for. From there, you can view event details, download tickets, or manage your registration status.",
        "If you need to cancel your registration, please go to your dashboard, find the event, and click on the 'Cancel Registration' button. Refund policies vary by event and are set by the organizer. Some events offer full refunds until a certain date, while others may offer partial refunds or credit towards future events.",
        "Organizers can access analytics for their events by going to the Organizer Dashboard and selecting the specific event they want to analyze. The analytics section provides valuable insights including attendance rates, registration timelines, demographic information, and engagement metrics.",
        "Payment methods currently accepted include credit/debit cards and PayPal. We're working on adding more payment options in the future. All transactions are processed securely through our payment system, and you'll receive a confirmation email once your payment is complete."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiResponse(randomResponse);
      
      // Scroll to response
      setTimeout(() => {
        responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiResponse("I'm sorry, I encountered an error while processing your question. Please try again later.");
      toast.error("Error processing your question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const commonQuestions = [
    { 
      category: "events",
      question: "How do I create an event?",
      answer: "To create an event, click on the 'Create Event' button in the navigation bar. You'll need to fill out a form with details about your event, including title, date, time, location, and description."
    },
    {
      category: "events",
      question: "How do I register for an event?",
      answer: "To register for an event, navigate to the event page and click the 'Register' button. You'll be prompted to provide your information and complete any payment if required."
    },
    {
      category: "payments",
      question: "Can I get a refund if I cancel my registration?",
      answer: "Refund policies are set by event organizers. Check the event details page for specific refund policies. Generally, you can request a refund by contacting the organizer directly or through your dashboard."
    },
    {
      category: "support",
      question: "How do I contact an event organizer?",
      answer: "You can contact an event organizer by visiting the event page and clicking on the organizer's name. This will take you to their profile where you can find contact information or a message option."
    },
    {
      category: "account",
      question: "How do I update my profile information?",
      answer: "To update your profile information, go to 'My Profile' in the dashboard. From there, you can edit your personal details, change your password, and update your preferences."
    },
    {
      category: "account",
      question: "How do I reset my password?",
      answer: "To reset your password, click on the 'Forgot Password' link on the login page. You'll receive an email with instructions to reset your password. Make sure to check your spam folder if you don't see the email in your inbox."
    },
    {
      category: "payments",
      question: "What payment methods are accepted?",
      answer: "We currently accept credit/debit cards and PayPal. All transactions are processed securely through our payment system. You'll receive a confirmation email once your payment is complete."
    },
    {
      category: "support",
      question: "How do I report an issue with the platform?",
      answer: "To report an issue, please visit the 'Contact Us' page or email our support team at support@eventhub.com. Please include as much detail as possible, including screenshots if applicable."
    }
  ];

  const filteredQuestions = activeCategory === "all" 
    ? commonQuestions 
    : commonQuestions.filter(q => q.category === activeCategory);

  const categories = [
    { id: "all", name: "All Questions", icon: <HelpCircle className="h-4 w-4" /> },
    { id: "events", name: "Events", icon: <FileQuestion className="h-4 w-4" /> },
    { id: "account", name: "Account", icon: <BookOpen className="h-4 w-4" /> },
    { id: "payments", name: "Payments", icon: <Lightbulb className="h-4 w-4" /> },
    { id: "support", name: "Support", icon: <AlertCircle className="h-4 w-4" /> }
  ];

  const handleFeedback = (type: "helpful" | "not-helpful") => {
    // Simulate sending feedback to an API
    toast.success(`Thank you for your ${type === "helpful" ? "positive" : "negative"} feedback!`);
    setFeedbackSent({ ...feedbackSent, [aiResponse]: true });
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestions(false);
    // Auto-submit after a short delay
    setTimeout(() => {
      if (inputRef.current) {
        const form = inputRef.current.form;
        if (form) {
          form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
      }
    }, 100);
  };

  return (
    <PageWrapper background="subtle">
      {/* Hero section with background */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/20 to-primary/10 pt-16 pb-20 mb-10">
        <Container>
          <div className={cn(
            "max-w-4xl mx-auto text-center transition-all duration-700",
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}>
            <div className="inline-flex items-center justify-center p-2 bg-white rounded-xl shadow-soft mb-6">
              <Bot className="h-6 w-6 text-primary mr-2" />
              <span className="text-sm font-medium">AI-Powered Help Center</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold mb-4 font-heading bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              How Can We Help You Today?
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Get instant answers to your questions with our AI assistant, browse our guides, or explore FAQs
            </p>
            
            <Card className="shadow-medium border border-primary/10 bg-card/80 backdrop-blur-sm">
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="relative">
                  <div className="flex gap-2 relative">
                    <div className="relative flex-1">
                      <Input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setShowSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowSuggestions(query.length > 0)}
                        placeholder="Ask anything about events, accounts, or payments..."
                        className="pr-10 py-6 text-lg shadow-inner bg-white/70"
                      />
                      {showSuggestions && query.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-white rounded-lg mt-1 shadow-medium border z-50">
                          <div className="p-2">
                            <div className="text-xs font-medium text-muted-foreground mb-1 px-2">Suggestions</div>
                            {popularSearches
                              .filter(s => s.toLowerCase().includes(query.toLowerCase()))
                              .map((suggestion, i) => (
                                <div 
                                  key={i}
                                  className="px-3 py-2 hover:bg-primary/10 rounded cursor-pointer text-sm flex items-center"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  <Search className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                  {suggestion}
                                </div>
                              ))
                            }
                            {searchHistory.length > 0 && (
                              <>
                                <div className="text-xs font-medium text-muted-foreground mb-1 mt-2 px-2">Recent searches</div>
                                {searchHistory
                                  .filter(s => s.toLowerCase().includes(query.toLowerCase()))
                                  .slice(0, 3)
                                  .map((history, i) => (
                                    <div 
                                      key={`history-${i}`}
                                      className="px-3 py-2 hover:bg-primary/10 rounded cursor-pointer text-sm flex items-center"
                                      onClick={() => handleSuggestionClick(history)}
                                    >
                                      <ArrowRight className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                                      {history}
                                    </div>
                                  ))
                                }
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      size="lg" 
                      disabled={isLoading || !query.trim()}
                      className="px-8 hover:scale-105 transition-all duration-300"
                    >
                      {isLoading ? 
                        <LoaderCircle className="h-5 w-5 animate-spin mr-2" /> : 
                        query.trim() ? <Send className="h-5 w-5 mr-2" /> : <Search className="h-5 w-5 mr-2" />
                      }
                      {query.trim() ? "Ask" : "Search"}
                    </Button>
                  </div>
                </form>
                
                {/* Popular searches */}
                {!showSuggestions && !aiResponse && !isLoading && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    <div className="w-full text-center text-sm text-muted-foreground mb-2">Popular searches:</div>
                    {popularSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="text-sm px-3 py-1.5 rounded-full bg-secondary/20 hover:bg-primary/20 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
          </div>
        </Container>
      </div>
      
      <Container className="max-w-5xl">
        {/* AI Response section */}
        {(isLoading || aiResponse) && (
          <div className="mb-12 scroll-mt-10" ref={responseRef}>
            <Card className={cn(
              "border-primary/20 shadow-medium overflow-hidden transition-all duration-500",
              isLoading || aiResponse ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}>
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="flex items-center text-xl">
                  <Bot className="h-5 w-5 text-primary mr-2" />
                  AI Assistant Response
                </CardTitle>
                <CardDescription>
                  Based on your question: <span className="font-medium">{query}</span>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <div className="text-center">
                      <LoaderCircle className="h-8 w-8 animate-spin text-primary mb-4 mx-auto" />
                      <p className="text-muted-foreground">Finding the best answer for you...</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary/10 p-6 rounded-lg border border-secondary/20">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Bot className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-2">EventHub Assistant</h3>
                        <p className="text-muted-foreground leading-relaxed">{aiResponse}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              
              {aiResponse && !feedbackSent[aiResponse] && (
                <CardFooter className="border-t bg-muted/20 flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">Was this response helpful?</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleFeedback("helpful")}
                      className="hover:bg-green-100 hover:text-green-700 hover:border-green-300"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" /> Yes
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleFeedback("not-helpful")}
                      className="hover:bg-red-100 hover:text-red-700 hover:border-red-300"
                    >
                      <ThumbsDown className="h-4 w-4 mr-1" /> No
                    </Button>
                  </div>
                </CardFooter>
              )}
              
              {aiResponse && feedbackSent[aiResponse] && (
                <CardFooter className="border-t bg-muted/20">
                  <p className="text-sm text-muted-foreground w-full text-center">
                    Thank you for your feedback! This helps us improve our AI responses.
                  </p>
                </CardFooter>
              )}
            </Card>
          </div>
        )}
        
        {/* Tabs section */}
        <div className={cn(
          "transition-all duration-500 delay-300",
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <Tabs defaultValue="faq" className="mb-12">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="faq" className="flex items-center gap-2 py-3">
                <FileQuestion className="h-4 w-4" />
                <span>FAQ</span>
              </TabsTrigger>
              <TabsTrigger value="guides" className="flex items-center gap-2 py-3">
                <Book className="h-4 w-4" />
                <span>Guides</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="faq">
              <Card>
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-xl">Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Browse through our categorized help topics to find answers quickly
                  </CardDescription>
                  
                  <div className="flex flex-wrap gap-2 mt-4 pb-2">
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        variant={activeCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setActiveCategory(category.id)}
                        className="flex items-center gap-1.5"
                      >
                        {category.icon}
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full">
                    {filteredQuestions.map((item, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`item-${index}`}
                        className="border border-primary/10 px-4 rounded-lg mb-3 overflow-hidden bg-white/60"
                      >
                        <AccordionTrigger className="hover:no-underline hover:bg-primary/5 -mx-4 px-4 py-3 font-medium">
                          <span className="text-left">{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="bg-card/90 -mx-4 px-6 py-4 border-t text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="guides">
              <Card>
                <CardHeader className="bg-primary/5">
                  <CardTitle className="text-xl">User Guides</CardTitle>
                  <CardDescription>
                    Comprehensive guides to help you make the most of EventHub
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-medium transition-all duration-300">
                      <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-1.5 w-full"></div>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg mb-1.5">Getting Started</h3>
                            <p className="text-sm text-muted-foreground mb-3">Learn the basics of using EventHub as an attendee.</p>
                            <Button variant="link" size="sm" className="px-0">
                              Read Guide <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-medium transition-all duration-300">
                      <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-1.5 w-full"></div>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg mb-1.5">Event Creation</h3>
                            <p className="text-sm text-muted-foreground mb-3">How to create and manage your events as an organizer.</p>
                            <Button variant="link" size="sm" className="px-0">
                              Read Guide <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-medium transition-all duration-300">
                      <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-1.5 w-full"></div>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg mb-1.5">Ticket Management</h3>
                            <p className="text-sm text-muted-foreground mb-3">Managing tickets, attendees, and check-ins.</p>
                            <Button variant="link" size="sm" className="px-0">
                              Read Guide <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="overflow-hidden border border-primary/20 hover:border-primary/50 hover:shadow-medium transition-all duration-300">
                      <div className="bg-gradient-to-r from-primary/20 to-primary/5 h-1.5 w-full"></div>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-lg mb-1.5">Analytics & Reporting</h3>
                            <p className="text-sm text-muted-foreground mb-3">Understanding your event performance metrics.</p>
                            <Button variant="link" size="sm" className="px-0">
                              Read Guide <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Need more help section */}
        <div className={cn(
          "border-t pt-8 mt-10 transition-all duration-500 delay-500",
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        )}>
          <h2 className="text-2xl font-semibold mb-6 text-center font-heading">Still Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:scale-[1.02]">
              <div className="bg-gradient-to-r from-primary to-primary/70 h-2 w-full"></div>
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <MessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Contact Support</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Get in touch with our customer support team for personalized assistance.
                    Our team is available 24/7 to help resolve your issues.
                  </p>
                  <Button asChild size="lg" className="px-8 hover:scale-105 transition-transform duration-300">
                    <a href="/contact">Contact Us</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 hover:scale-[1.02]">
              <div className="bg-gradient-to-r from-primary/70 to-primary h-2 w-full"></div>
              <CardContent className="pt-8">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 p-4 rounded-full mb-4">
                    <LifeBuoy className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Community Forum</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Join our community forum to discuss with other users and share your experiences.
                    Get solutions from our global community of users and experts.
                  </p>
                  <Button variant="outline" size="lg" className="px-8 hover:scale-105 transition-transform duration-300">
                    Visit Forum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default HelpCenter;

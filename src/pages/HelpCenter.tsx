
import { useState, useRef } from "react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Bot, Book, FileQuestion, LifeBuoy, MessageSquare, LoaderCircle } from "lucide-react";

const HelpCenter = () => {
  const [query, setQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsLoading(true);
    setAiResponse("");
    
    try {
      // Simulating an AI response with a delay
      // In a real implementation, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const responses = [
        "Events can be created by clicking on the 'Create Event' button in the navigation bar. You'll need to provide details like the event name, date, location, and description.",
        "You can manage your event registrations from your dashboard. Navigate to 'My Profile' and then 'My Events' to see all the events you've registered for.",
        "If you need to cancel your registration, please go to your dashboard, find the event, and click on the 'Cancel Registration' button. Refund policies vary by event.",
        "Organizers can access analytics for their events by going to the Organizer Dashboard and selecting the specific event they want to analyze.",
        "Payment methods currently accepted include credit/debit cards and PayPal. We're working on adding more payment options in the future."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setAiResponse(randomResponse);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiResponse("I'm sorry, I encountered an error while processing your question. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const commonQuestions = [
    { 
      question: "How do I create an event?",
      answer: "To create an event, click on the 'Create Event' button in the navigation bar. You'll need to fill out a form with details about your event, including title, date, time, location, and description."
    },
    {
      question: "How do I register for an event?",
      answer: "To register for an event, navigate to the event page and click the 'Register' button. You'll be prompted to provide your information and complete any payment if required."
    },
    {
      question: "Can I get a refund if I cancel my registration?",
      answer: "Refund policies are set by event organizers. Check the event details page for specific refund policies. Generally, you can request a refund by contacting the organizer directly or through your dashboard."
    },
    {
      question: "How do I contact an event organizer?",
      answer: "You can contact an event organizer by visiting the event page and clicking on the organizer's name. This will take you to their profile where you can find contact information or a message option."
    },
    {
      question: "How do I update my profile information?",
      answer: "To update your profile information, go to 'My Profile' in the dashboard. From there, you can edit your personal details, change your password, and update your preferences."
    }
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="bg-primary/10 py-12 mb-10">
        <Container>
          <h1 className="text-4xl font-bold text-center mb-4">Help Center</h1>
          <p className="text-lg text-center max-w-3xl mx-auto text-muted-foreground">
            Find answers to your questions or chat with our AI assistant
          </p>
        </Container>
      </div>
      
      <Container className="max-w-5xl">
        <Tabs defaultValue="ai-assistant" className="mb-10">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="ai-assistant" className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span>AI Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="flex items-center gap-2">
              <FileQuestion className="h-4 w-4" />
              <span>FAQ</span>
            </TabsTrigger>
            <TabsTrigger value="guides" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>Guides</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-assistant">
            <Card>
              <CardHeader>
                <CardTitle>Ask Our AI Assistant</CardTitle>
                <CardDescription>
                  Have a question? Our AI assistant is here to help you find the answers you need.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="mb-6">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g., How do I create an event?"
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading || !query.trim()}>
                      {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                      Search
                    </Button>
                  </div>
                </form>
                
                {isLoading && (
                  <div className="flex items-center justify-center p-8">
                    <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
                
                {!isLoading && aiResponse && (
                  <div className="bg-secondary/30 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Bot className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium mb-2">EventHub Assistant</h3>
                        <p className="text-muted-foreground">{aiResponse}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {!isLoading && !aiResponse && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-primary/40" />
                    <h3 className="text-lg font-medium mb-2">Ask me anything about EventHub</h3>
                    <p>I can help with event creation, registration, user accounts, and more.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Find answers to the most common questions about using EventHub.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {commonQuestions.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>{item.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="guides">
            <Card>
              <CardHeader>
                <CardTitle>User Guides</CardTitle>
                <CardDescription>
                  Comprehensive guides to help you make the most of EventHub.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <h3 className="font-medium mb-2">Getting Started</h3>
                    <p className="text-sm text-muted-foreground mb-3">Learn the basics of using EventHub as an attendee.</p>
                    <Button variant="link" size="sm" className="px-0">Read Guide</Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <h3 className="font-medium mb-2">Event Creation</h3>
                    <p className="text-sm text-muted-foreground mb-3">How to create and manage your events as an organizer.</p>
                    <Button variant="link" size="sm" className="px-0">Read Guide</Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <h3 className="font-medium mb-2">Ticket Management</h3>
                    <p className="text-sm text-muted-foreground mb-3">Managing tickets, attendees, and check-ins.</p>
                    <Button variant="link" size="sm" className="px-0">Read Guide</Button>
                  </div>
                  <div className="border rounded-lg p-4 hover:border-primary/50 hover:bg-primary/5 transition-all">
                    <h3 className="font-medium mb-2">Analytics & Reporting</h3>
                    <p className="text-sm text-muted-foreground mb-3">Understanding your event performance metrics.</p>
                    <Button variant="link" size="sm" className="px-0">Read Guide</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="border-t pt-8 mt-10">
          <h2 className="text-xl font-semibold mb-6 text-center">Still Need Help?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <MessageSquare className="h-10 w-10 text-primary mb-3" />
                  <h3 className="text-lg font-medium mb-2">Contact Support</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get in touch with our customer support team for personalized assistance.
                  </p>
                  <Button asChild>
                    <a href="/contact">Contact Us</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <LifeBuoy className="h-10 w-10 text-primary mb-3" />
                  <h3 className="text-lg font-medium mb-2">Community Forum</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Join our community forum to discuss with other users and share your experiences.
                  </p>
                  <Button variant="outline">Visit Forum</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default HelpCenter;

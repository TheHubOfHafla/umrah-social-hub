import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Send, Sparkles, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface GeneratedEvent {
  title: string;
  description: string;
  venue: string;
  city: string;
  country?: string;
  date: string;
  category: string;
  price: number;
  capacity?: number;
  image?: string;
}

const AiEventCreator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEvent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerateEvent = async () => {
    setIsLoading(true);
    try {
      // Simulate AI event generation (replace with actual API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock AI-generated event data
      const mockEvent: GeneratedEvent = {
        title: `AI Generated ${prompt}`,
        description: `This is an AI-generated event based on the prompt: ${prompt}. It will be an amazing experience!`,
        venue: "Virtual Venue",
        city: "Online",
        country: "United States",
        date: new Date().toISOString().split("T")[0],
        category: "technology",
        price: 0,
        capacity: 100,
        image: "/placeholder.svg",
      };

      setGeneratedEvent(mockEvent);
    } catch (error) {
      console.error("Error generating event:", error);
      toast({
        title: "Error",
        description: "Failed to generate event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUseAiEvent = async () => {
    if (!generatedEvent) return;
    
    try {
      // Get the current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to create an event",
          variant: "destructive"
        });
        return;
      }
      
      const userId = sessionData.session.user.id;
      
      // Get organizer profile or create if not exists
      const { data: organizerData, error: organizerError } = await supabase
        .from('organizers')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      let organizerId;
      
      if (organizerError || !organizerData) {
        // Create a new organizer profile if one doesn't exist
        const { data: newOrganizer, error: createError } = await supabase
          .from('organizers')
          .insert([
            { 
              user_id: userId,
              name: sessionData.session.user.email?.split('@')[0] || 'New Organizer',
            }
          ])
          .select('id')
          .single();
        
        if (createError || !newOrganizer) {
          toast({
            title: "Error",
            description: "Failed to create organizer profile",
            variant: "destructive"
          });
          return;
        }
        
        organizerId = newOrganizer.id;
      } else {
        organizerId = organizerData.id;
      }
      
      // Format the event data for database insertion
      const eventStartDate = new Date(generatedEvent.date);
      const eventEndDate = new Date(eventStartDate);
      eventEndDate.setHours(eventEndDate.getHours() + 2); // Default 2 hour duration
      
      // Insert the event into the database
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .insert([
          {
            title: generatedEvent.title,
            description: generatedEvent.description,
            short_description: generatedEvent.description.substring(0, 120) + '...',
            organizer_id: organizerId,
            location_name: generatedEvent.venue,
            location_city: generatedEvent.city, 
            location_country: generatedEvent.country || "United States",
            start_date: eventStartDate.toISOString(),
            end_date: eventEndDate.toISOString(),
            capacity: generatedEvent.capacity || 100,
            is_free: generatedEvent.price === 0,
            base_price: generatedEvent.price || 0,
            categories: [generatedEvent.category],
            image: generatedEvent.image || "/placeholder.svg",
            tickets_remaining: generatedEvent.capacity || 100
          }
        ])
        .select('id')
        .single();
      
      if (eventError || !eventData) {
        toast({
          title: "Error",
          description: "Failed to save AI-generated event to database",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Event Created!",
        description: "Your AI-generated event has been saved successfully",
      });
      
      // Navigate to the event page
      navigate(`/events/${eventData.id}`);
    } catch (error) {
      console.error("Error saving AI event:", error);
      toast({
        title: "Error",
        description: "Failed to save event. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-2xl p-6 space-y-4 border-2 border-purple-200 shadow-lg">
        <h2 className="text-2xl font-bold text-center text-purple-700">
          AI Event Creator <Bot className="inline-block ml-2 h-6 w-6" />
        </h2>
        <p className="text-muted-foreground text-center">
          Describe your event idea, and let AI generate the details!
        </p>
        <div className="flex rounded-md shadow-sm">
          <Input
            type="text"
            placeholder="e.g., A tech conference in London"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="rounded-r-none"
          />
          <Button
            onClick={handleGenerateEvent}
            disabled={isLoading}
            className="rounded-l-none bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
          >
            {isLoading ? (
              <>
                Generating <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Generate <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </Card>

      {generatedEvent && (
        <Card className="w-full max-w-2xl p-6 mt-8 space-y-4 border-2 border-blue-200 shadow-lg">
          <h3 className="text-xl font-semibold text-blue-700">
            Generated Event Details <Sparkles className="inline-block ml-2 h-5 w-5" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium">Title:</p>
              <p>{generatedEvent.title}</p>
            </div>
            <div>
              <p className="font-medium">Venue:</p>
              <p>{generatedEvent.venue}</p>
            </div>
            <div>
              <p className="font-medium">Date:</p>
              <p>{generatedEvent.date}</p>
            </div>
            <div>
              <p className="font-medium">Category:</p>
              <p>{generatedEvent.category}</p>
            </div>
            <div className="md:col-span-2">
              <p className="font-medium">Description:</p>
              <p>{generatedEvent.description}</p>
            </div>
          </div>
          <Button
            onClick={handleUseAiEvent}
            className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500 text-white"
          >
            Use this Event
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AiEventCreator;

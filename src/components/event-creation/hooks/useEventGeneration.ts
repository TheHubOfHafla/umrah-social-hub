
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateBasicEvent } from "@/lib/data";
import { EventCategory } from "@/types";

export const mapToEventCategory = (categoryId: string): EventCategory => {
  const categoryMap: { [key: string]: EventCategory } = {
    "islamic-talk": "lecture",
    "charity-fundraiser": "charity",
    "umrah-trip": "umrah",
    "business-networking": "social",
    "workshop": "workshop",
    "other": "other"
  };
  return categoryMap[categoryId] || "other";
};

export const useEventGeneration = (selectedCategory: string, eventDetails: string) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const progressIntervalRef = useRef<number | null>(null);
  
  const startGenerationProgress = () => {
    setProgress(0);
    setError(null);
    
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          return 95;
        }
        return prev + Math.random() * 2;
      });
    }, 100);
  };
  
  const stopGenerationProgress = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgress(100);
  };
  
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);
  
  const fetchGeneratedEvent = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-event-generator', {
        body: {
          eventCategory: selectedCategory,
          eventDetails: eventDetails
        }
      });
      
      if (error) {
        console.error("Error from Supabase function:", error);
        throw new Error("Failed to generate event");
      }
      
      if (data?.event) {
        if (data.source === 'fallback') {
          toast({
            title: "Using Simplified Generator",
            description: "We used a simplified event generator. Please review and edit the details.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Event Generated!",
            description: "Your AI-generated event is ready for review.",
          });
        }
        return data.event;
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Error calling AI function:", err);
      throw err;
    }
  };
  
  const generateEvent = async () => {
    startGenerationProgress();
    setError(null);
    
    let generationPromise: Promise<any>;
    let minimumTimePromise: Promise<void>;
    
    minimumTimePromise = new Promise(resolve => setTimeout(resolve, 5000));
    generationPromise = fetchGeneratedEvent();
    
    try {
      const [eventData] = await Promise.all([generationPromise, minimumTimePromise]);
      
      stopGenerationProgress();
      
      if (eventData) {
        return eventData;
      } else {
        const fallbackEvent = generateBasicEvent(selectedCategory, eventDetails);
        
        toast({
          title: "Using Fallback Generator",
          description: "We couldn't connect to the AI service, but we've created a basic event for you to edit.",
          variant: "destructive"
        });
        
        return fallbackEvent;
      }
    } catch (err) {
      console.error("Error in generation process:", err);
      
      await minimumTimePromise;
      stopGenerationProgress();
      
      const fallbackEvent = generateBasicEvent(selectedCategory, eventDetails);
      
      toast({
        title: "Using Fallback Generator",
        description: "We ran into an issue, but we've created a basic event for you to edit.",
        variant: "destructive"
      });
      
      return fallbackEvent;
    }
  };
  
  const saveEventToDatabase = async (eventData: any, currentUserId: string, bannerPreview: string | null) => {
    if (!eventData || !currentUserId) return false;
    
    setIsSaving(true);
    
    try {
      const data = {
        title: eventData.title,
        description: eventData.description,
        start_date: eventData.date.start,
        end_date: eventData.date.end,
        organizer_id: currentUserId,
        capacity: eventData.capacity,
        is_free: eventData.isFree,
        base_price: eventData.price,
        location_name: eventData.location.name,
        location_address: eventData.location.address,
        location_city: eventData.location.city,
        location_country: eventData.location.country,
        image: bannerPreview || '/placeholder.svg',
        categories: [mapToEventCategory(selectedCategory)],
      };
      
      const { data: result, error } = await supabase
        .from('events')
        .insert(data)
        .select('id');
      
      if (error) {
        console.error("Error saving event:", error);
        toast({
          title: "Error",
          description: "Failed to save your event. Please try again.",
          variant: "destructive"
        });
        setIsSaving(false);
        return false;
      }
      
      console.log("Event created with ID:", result[0].id);
      return true;
    } catch (err) {
      console.error("Error in saveEventToDatabase:", err);
      toast({
        title: "Error",
        description: "An unexpected error occurred while saving your event.",
        variant: "destructive"
      });
      setIsSaving(false);
      return false;
    }
  };
  
  return {
    progress,
    error,
    isSaving,
    setIsSaving,
    generateEvent,
    saveEventToDatabase,
    getProgressText: () => {
      if (error) return "Error occurred. Please try again.";
      if (progress < 30) return "Analyzing your requirements...";
      if (progress < 60) return "Crafting your event details...";
      if (progress < 90) return "Adding finishing touches...";
      return "Almost ready!";
    }
  };
};

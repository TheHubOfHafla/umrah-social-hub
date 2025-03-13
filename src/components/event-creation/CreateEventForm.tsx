
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEventForm } from "@/hooks/useEventForm";
import { saveEventToDatabase } from "@/services/eventService";
import EventForm from "./EventForm";
import LaunchEvent from "./LaunchEvent";
import EventSuccessMessage from "./EventSuccessMessage";

export default function CreateEventForm() {
  const {
    step,
    setStep,
    isLoading,
    setIsLoading,
    eventId,
    setEventId,
    formData,
    setFormData,
    handleInputChange,
    handleToggleFree,
    validateForm,
    formatPreviewData
  } = useEventForm();
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Move to preview step
    setStep("preview");
  };

  const handleSaveEdits = (updatedData: any) => {
    // Extract and update the form data from the preview step
    setFormData(prev => ({
      ...prev,
      title: updatedData.title,
      description: updatedData.description,
      location: updatedData.location.name,
      city: updatedData.location.city,
      country: updatedData.location.country,
      price: updatedData.price,
      capacity: updatedData.capacity,
      isFree: updatedData.isFree
    }));
  };

  const handleLaunch = async () => {
    setIsLoading(true);
    
    try {
      // Save event to database
      const newEventId = await saveEventToDatabase(formData);
      
      // Set the event ID from the database response
      setEventId(newEventId);
      
      toast({
        title: "Event Created!",
        description: "Your event has been successfully published.",
      });
      
      setStep("success");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (step === "success") {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-0">
        <EventSuccessMessage eventId={eventId} />
      </div>
    );
  }

  if (step === "preview") {
    return (
      <div className="max-w-3xl mx-auto p-4 md:p-0">
        <LaunchEvent 
          eventData={formatPreviewData()}
          onSave={handleSaveEdits}
          onBack={() => setStep("form")}
          onLaunch={handleLaunch}
          isProcessing={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-0">
      <EventForm 
        formData={formData}
        onInputChange={handleInputChange}
        onToggleFree={handleToggleFree}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

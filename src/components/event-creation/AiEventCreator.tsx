import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, Edit, CheckCircle, Wand2, PenLine, ArrowRight, ArrowLeft, RefreshCw, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { AuthContext } from "@/App";
import { useFormSteps } from "./hooks/useFormSteps";
import { useEventGeneration } from "./hooks/useEventGeneration";
import { useEventBanner } from "./hooks/useEventBanner";
import { getSelectedCategoryInfo, handleGeneratedEventData, validateBannerBeforeLaunch } from "./utils";
import ProgressSteps from "./components/ProgressSteps";
import CategorySelect from "./components/CategorySelect";
import EventDetails from "./components/EventDetails";
import GenerationProgress from "./components/GenerationProgress";
import EventEditor from "./components/EventEditor";
import EventReview from "./components/EventReview";
import EventSuccessCard from "./components/EventSuccessCard";
import LaunchConfirmationDialog from "./components/LaunchConfirmationDialog";

export interface AiEventCreatorProps {
  initialCategory?: string;
  initialDetails?: string;
  onEventGenerated?: (event: any) => void;
  showBackButton?: boolean;
  onBack?: () => void;
}

const AiEventCreator: React.FC<AiEventCreatorProps> = ({
  initialCategory = "",
  initialDetails = "",
  onEventGenerated,
  showBackButton = false,
  onBack
}) => {
  const [generatedEvent, setGeneratedEvent] = useState<any>(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  
  const {
    stage, setStage,
    selectedCategory, setSelectedCategory,
    eventDetails, setEventDetails,
    showLaunchConfirmation, setShowLaunchConfirmation,
    categoryForm, detailsForm, editForm
  } = useFormSteps(initialCategory, initialDetails);
  
  const {
    progress,
    isSaving, setIsSaving,
    generateEvent,
    saveEventToDatabase,
    getProgressText
  } = useEventGeneration(selectedCategory, eventDetails);

  const {
    bannerPreview,
    setBannerPreview,
    handleBannerUpload,
    selectSampleBanner
  } = useEventBanner();
  
  useEffect(() => {
    if (initialCategory) {
      categoryForm.setValue("category", initialCategory);
      setSelectedCategory(initialCategory);
    }
    if (initialDetails) {
      detailsForm.setValue("details", initialDetails);
      setEventDetails(initialDetails);
    }
  }, [initialCategory, initialDetails]);

  const onCategorySubmit = (values: any) => {
    setSelectedCategory(values.category);
    setStage("add-details");
    
    const selectedCategoryObj = getSelectedCategoryInfo(values.category);
    if (selectedCategoryObj) {
      const starterText = `I'm planning a ${selectedCategoryObj.name}. `;
      detailsForm.setValue("details", starterText);
      setEventDetails(starterText);
    }
  };

  const onDetailsSubmit = async (values: any) => {
    setEventDetails(values.details);
    setStage("generating");
    
    try {
      const eventData = await generateEvent();
      const formattedEvent = handleGeneratedEventData(eventData, selectedCategory, values.details);
      
      setGeneratedEvent(formattedEvent);
      
      editForm.setValue("title", formattedEvent.title);
      editForm.setValue("description", formattedEvent.description);
      editForm.setValue("location", formattedEvent.location.name);
      editForm.setValue("city", formattedEvent.location.city);
      editForm.setValue("country", formattedEvent.location.country);
      editForm.setValue("date", formattedEvent.date.start.toLocaleDateString());
      editForm.setValue("capacity", String(formattedEvent.capacity));
      editForm.setValue("price", formattedEvent.price);
      
      setTimeout(() => {
        setStage("review");
      }, 500);
    } catch (error) {
      console.error("Error generating event:", error);
      toast({
        title: "Error Generating Event",
        description: "There was a problem generating your event. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLaunchEvent = async () => {
    if (!validateBannerBeforeLaunch(bannerPreview)) return;
    
    const success = await saveEventToDatabase(generatedEvent, currentUser?.id, bannerPreview);
    
    if (success) {
      setStage("complete");
      toast({
        title: "Event Created Successfully!",
        description: "Your event has been published and added to your dashboard.",
      });
      
      setTimeout(() => {
        navigate("/organizer/events");
      }, 2000);
    } else {
      setShowLaunchConfirmation(false);
      setIsSaving(false);
    }
  };

  const handleEditEvent = () => {
    if (generatedEvent) {
      generatedEvent.image = bannerPreview || "";
      navigate("/events/create", { state: { event: generatedEvent } });
    }
  };

  const handleShowLaunchConfirmation = () => {
    if (!validateBannerBeforeLaunch(bannerPreview)) return;
    setShowLaunchConfirmation(true);
  };

  const handleReset = () => {
    setStage("select-category");
    setSelectedCategory("");
    setEventDetails("");
    setGeneratedEvent(null);
    setBannerPreview(null);
    categoryForm.reset();
    detailsForm.reset();
    editForm.reset();
  };

  const handleToggleEditMode = () => {
    setStage(stage === "review" ? "edit-details" : "review");
  };

  const handleEditSubmit = (data: any) => {
    if (generatedEvent) {
      const updatedEvent = {
        ...generatedEvent,
        title: data.title,
        description: data.description,
        location: {
          ...generatedEvent.location,
          name: data.location,
          city: data.city,
          country: data.country,
        },
        capacity: parseInt(data.capacity) || 50,
        price: parseFloat(data.price) || 0,
        image: bannerPreview,
      };
      
      setGeneratedEvent(updatedEvent);
      setStage("review");
      
      toast({
        title: "Changes Saved",
        description: "Your event details have been updated.",
      });
      
      if (onEventGenerated) {
        onEventGenerated(updatedEvent);
      }
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-0">
      <ProgressSteps stage={stage} />
      
      {stage === "select-category" && (
        <Card className="border-purple-200 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                <Bot className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-900">What type of event are you hosting?</CardTitle>
                <CardDescription>Select a category that best describes your event</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <CategorySelect 
              form={categoryForm} 
              onSubmit={onCategorySubmit} 
            />
          </CardContent>
        </Card>
      )}

      {stage === "add-details" && (
        <Card className="border-purple-200 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                <PenLine className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-900">Tell us about your {getSelectedCategoryInfo(selectedCategory)?.name}</CardTitle>
                <CardDescription>
                  Add details about your event to help our AI generate a great event page
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <EventDetails 
              form={detailsForm}
              onSubmit={onDetailsSubmit}
              onBack={() => setStage("select-category")}
              selectedCategory={selectedCategory}
              setEventDetails={setEventDetails}
              eventDetails={eventDetails}
            />
          </CardContent>
        </Card>
      )}

      {stage === "generating" && (
        <Card className="border-purple-200 shadow-lg transition-all animate-fade-in">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-center text-xl text-purple-900">Creating Your Event</CardTitle>
            <CardDescription className="text-center">
              Our AI is crafting the perfect {getSelectedCategoryInfo(selectedCategory)?.name} based on your details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <GenerationProgress progress={progress} progressText={getProgressText()} />
          </CardContent>
        </Card>
      )}

      {stage === "edit-details" && generatedEvent && (
        <Card className="border-purple-200 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                <Edit className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-900">Edit Your Event</CardTitle>
                <CardDescription>Make changes to your {getSelectedCategoryInfo(selectedCategory)?.name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <EventEditor 
              form={editForm}
              onSubmit={handleEditSubmit}
              onCancel={() => setStage("review")}
              bannerPreview={bannerPreview}
              handleBannerUpload={handleBannerUpload}
              selectSampleBanner={selectSampleBanner}
            />
          </CardContent>
        </Card>
      )}

      {stage === "review" && generatedEvent && (
        <Card className="border-purple-200 shadow-lg transition-all duration-300 hover:shadow-xl animate-fade-in">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-purple-700" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple-900">Your Event is Ready!</CardTitle>
                <CardDescription>Review and launch your event, or make additional edits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <EventReview 
              generatedEvent={generatedEvent}
              bannerPreview={bannerPreview}
              handleBannerUpload={handleBannerUpload}
              selectSampleBanner={selectSampleBanner}
              handleToggleEditMode={handleToggleEditMode}
              handleReset={handleReset}
              handleShowLaunchConfirmation={handleShowLaunchConfirmation}
              isSaving={isSaving}
              selectedCategory={selectedCategory}
            />
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 pt-2 border-t border-purple-100 bg-purple-50">
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="border-purple-200 text-purple-700 hover:bg-purple-50 flex-1 sm:flex-initial"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Reset
              </Button>
              <Button 
                onClick={handleToggleEditMode}
                variant="default"
                className="bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-initial"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Details
              </Button>
            </div>
            {showBackButton && (
              <Button 
                variant="outline" 
                onClick={onBack}
                className="w-full sm:w-auto border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            )}
            <Button 
              onClick={handleShowLaunchConfirmation}
              className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium w-full sm:w-auto"
              disabled={!bannerPreview || isSaving}
            >
              Launch Event <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {stage === "complete" && (
        <Card className="border-purple-200 shadow-lg transition-all animate-fade-in">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-center text-xl text-purple-900">Event Created Successfully!</CardTitle>
            <CardDescription className="text-center">
              Your event has been published and is now live
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventSuccessCard />
          </CardContent>
        </Card>
      )}

      <LaunchConfirmationDialog 
        open={showLaunchConfirmation}
        onOpenChange={setShowLaunchConfirmation}
        onLaunch={handleLaunchEvent}
        isSaving={isSaving}
      />
    </div>
  );
};

export default AiEventCreator;

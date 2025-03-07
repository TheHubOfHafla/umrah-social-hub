
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Button from "@/components/Button";
import AiEventCreator from "@/components/event-creation/AiEventCreator";
import EventForm from "@/components/event-creation/EventForm";
import { ArrowLeft, Bot, PenLine } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CreateEventPage = () => {
  const [activeTab, setActiveTab] = useState<string>("manual");
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if there is event data from AI creator
  const eventFromAi = location.state?.event;
  const editMode = location.state?.editMode;
  
  useEffect(() => {
    document.title = "Create Event | Islamic Social";
    
    // If event data exists from AI, switch to manual tab automatically
    if (eventFromAi) {
      setActiveTab("manual");
      
      // Notify user they are in edit mode if coming from AI creator
      if (editMode) {
        toast({
          title: "Edit Your Event",
          description: "Make changes to your AI-generated event before launching.",
        });
      }
    }
  }, [eventFromAi, editMode, toast]);
  
  return (
    <PageWrapper className="py-8">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="mb-8 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="mr-2"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                {eventFromAi && editMode ? "Edit Your Event" : "Create an Event"}
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground">
            {eventFromAi && editMode 
              ? "Make changes to your AI-generated event before launching." 
              : "Fill out the form to create your new event or let AI help you."}
          </p>
        </div>

        {!eventFromAi ? (
          <>
            <Tabs 
              defaultValue="manual" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto">
                <TabsTrigger value="manual" className="flex items-center gap-2">
                  <PenLine className="h-4 w-4" />
                  <span>Manual</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span>AI-Assisted</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual">
                <EventForm prefilledEvent={null} />
              </TabsContent>
              
              <TabsContent value="ai">
                <AiEventCreator />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <EventForm 
            prefilledEvent={eventFromAi} 
            editMode={editMode} 
            requiresBannerUpload={eventFromAi.requiresBannerUpload}
          />
        )}
      </div>
    </PageWrapper>
  );
};

export default CreateEventPage;

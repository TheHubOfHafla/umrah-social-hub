import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Bot, Edit, CheckCircle, ArrowRight, 
  Loader2, Sparkles, AlertTriangle, 
  PenLine, Send, RefreshCw, FileImage,
  Camera, Upload
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { generateBasicEvent } from "@/lib/data";
import { useContext } from "react";
import { AuthContext } from "@/App";
import { EventCategory } from "@/types";

const eventCategories = [
  { id: "islamic-talk", name: "Islamic Talk", icon: "🕌" },
  { id: "charity-fundraiser", name: "Charity Fundraiser", icon: "🤲" },
  { id: "umrah-trip", name: "Umrah Trip", icon: "✈️" },
  { id: "business-networking", name: "Business Networking", icon: "💼" },
  { id: "workshop", name: "Workshop", icon: "🔧" },
  { id: "other", name: "Other", icon: "📝" },
];

const mapToEventCategory = (categoryId: string): EventCategory => {
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

const categoryFormSchema = z.object({
  category: z.string().min(1, { message: "Please select an event category" }),
});

const detailsFormSchema = z.object({
  details: z.string()
    .min(20, { 
      message: "Please provide at least 20 characters about your event" 
    })
});

type CreationStage = 
  | "select-category" 
  | "add-details" 
  | "generating" 
  | "review" 
  | "edit-details" 
  | "complete";

const AiEventCreator = () => {
  const [stage, setStage] = useState<CreationStage>("select-category");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [generatedEvent, setGeneratedEvent] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [showLaunchConfirmation, setShowLaunchConfirmation] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const progressIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category: "",
    },
  });

  const detailsForm = useForm<z.infer<typeof detailsFormSchema>>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      details: "",
    },
  });

  const editForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      location: "",
      city: "",
      country: "",
      date: "",
      capacity: "",
      price: 0,
    }
  });

  const onCategorySubmit = (values: z.infer<typeof categoryFormSchema>) => {
    setSelectedCategory(values.category);
    setStage("add-details");
    
    const selectedCategoryObj = eventCategories.find(cat => cat.id === values.category);
    if (selectedCategoryObj) {
      const starterText = `I'm planning a ${selectedCategoryObj.name}. `;
      detailsForm.setValue("details", starterText);
      setEventDetails(starterText);
    }
  };

  const onDetailsSubmit = async (values: z.infer<typeof detailsFormSchema>) => {
    setEventDetails(values.details);
    setStage("generating");
    setProgress(0);
    setError(null);
    
    let generationPromise: Promise<any>;
    let minimumTimePromise: Promise<void>;
    
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          return 95;
        }
        return prev + Math.random() * 2;
      });
    }, 100);
    
    minimumTimePromise = new Promise(resolve => setTimeout(resolve, 5000));
    
    generationPromise = fetchGeneratedEvent(selectedCategory, values.details);
    
    try {
      const [eventData] = await Promise.all([generationPromise, minimumTimePromise]);
      
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
      setProgress(100);
      
      if (eventData) {
        handleGeneratedEventData(eventData);
      } else {
        const fallbackEvent = generateBasicEvent(selectedCategory, values.details);
        handleGeneratedEventData(fallbackEvent);
        
        toast({
          title: "Using Fallback Generator",
          description: "We couldn't connect to the AI service, but we've created a basic event for you to edit.",
          variant: "destructive"
        });
      }
    } catch (err) {
      console.error("Error in generation process:", err);
      
      await minimumTimePromise;
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
      setProgress(100);
      
      setTimeout(() => {
        const fallbackEvent = generateBasicEvent(selectedCategory, values.details);
        handleGeneratedEventData(fallbackEvent);
        
        toast({
          title: "Using Fallback Generator",
          description: "We ran into an issue, but we've created a basic event for you to edit.",
          variant: "destructive"
        });
      }, 500);
    }
  };

  const fetchGeneratedEvent = async (category: string, details: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-event-generator', {
        body: {
          eventCategory: category,
          eventDetails: details
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

  const handleGeneratedEventData = (eventData: any) => {
    const suggestedDate = eventData.suggestedDate 
      ? new Date(eventData.suggestedDate) 
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const formattedEvent = {
      title: eventData.title || `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Event`,
      description: eventData.description || eventDetails,
      location: {
        name: eventData.location?.name || "To be determined",
        address: eventData.location?.address || "Address pending",
        city: eventData.location?.city || "City",
        country: eventData.location?.country || "Country",
      },
      date: {
        start: suggestedDate,
        end: new Date(suggestedDate.getTime() + 2 * 60 * 60 * 1000),
      },
      category: selectedCategory,
      capacity: eventData.capacity || 50,
      isFree: eventData.isFree !== undefined ? eventData.isFree : true,
      price: eventData.suggestedPrice || 0,
    };

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
  };

  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const saveEventToDatabase = async () => {
    if (!generatedEvent || !currentUser) return false;
    
    setIsSaving(true);
    
    try {
      const eventData = {
        title: generatedEvent.title,
        description: generatedEvent.description,
        start_date: generatedEvent.date.start,
        end_date: generatedEvent.date.end,
        organizer_id: currentUser.id,
        capacity: generatedEvent.capacity,
        is_free: generatedEvent.isFree,
        base_price: generatedEvent.price,
        location_name: generatedEvent.location.name,
        location_address: generatedEvent.location.address,
        location_city: generatedEvent.location.city,
        location_country: generatedEvent.location.country,
        image: bannerPreview || '/placeholder.svg',
        categories: [mapToEventCategory(selectedCategory)],
      };
      
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
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
      
      console.log("Event created with ID:", data[0].id);
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

  const handleLaunchEvent = async () => {
    if (!bannerPreview) {
      toast({
        title: "Banner Required",
        description: "Please upload a banner image before launching your event.",
        variant: "destructive",
      });
      return;
    }
    
    const success = await saveEventToDatabase();
    
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
    if (!bannerPreview) {
      toast({
        title: "Banner Required",
        description: "Please upload a banner image before launching your event.",
        variant: "destructive",
      });
      return;
    }
    setShowLaunchConfirmation(true);
  };

  const handleReset = () => {
    setStage("select-category");
    setSelectedCategory("");
    setEventDetails("");
    setGeneratedEvent(null);
    setProgress(0);
    setBannerPreview(null);
    setError(null);
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
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);
      
      toast({
        title: "Banner Uploaded",
        description: "Your event banner has been uploaded successfully.",
      });
    }
  };

  const selectSampleBanner = (imageUrl: string) => {
    setBannerPreview(imageUrl);
    
    toast({
      title: "Banner Selected",
      description: "Sample banner has been selected for your event.",
    });
  };

  const getSelectedCategoryInfo = () => {
    return eventCategories.find(cat => cat.id === selectedCategory);
  };

  const getProgressText = () => {
    if (error) return "Error occurred. Please try again.";
    if (progress < 30) return "Analyzing your requirements...";
    if (progress < 60) return "Crafting your event details...";
    if (progress < 90) return "Adding finishing touches...";
    return "Almost ready!";
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-0">
      <div className="w-full mb-8">
        <div className="flex justify-between items-center">
          <div className={cn(
            "flex flex-col items-center",
            (stage === "select-category" || stage === "add-details" || stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
              ? "text-purple-700" : "text-gray-400"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
              (stage === "select-category" || stage === "add-details" || stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
                ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
            )}>
              {stage === "select-category" ? "1" : <CheckCircle className="h-5 w-5" />}
            </div>
            <span className="text-xs sm:text-sm font-medium">Category</span>
          </div>
          
          <div className="flex-1 h-0.5 mx-2 bg-gray-200">
            <div className={cn(
              "h-full bg-purple-500 transition-all duration-500",
              stage === "select-category" ? "w-0" : "w-full"
            )} />
          </div>
          
          <div className={cn(
            "flex flex-col items-center",
            (stage === "add-details" || stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
              ? "text-purple-700" : "text-gray-400"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
              (stage === "add-details" || stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
                ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
            )}>
              {stage === "add-details" ? "2" : (stage === "select-category" ? "2" : <CheckCircle className="h-5 w-5" />)}
            </div>
            <span className="text-xs sm:text-sm font-medium">Details</span>
          </div>
          
          <div className="flex-1 h-0.5 mx-2 bg-gray-200">
            <div className={cn(
              "h-full bg-purple-500 transition-all duration-500",
              stage === "select-category" || stage === "add-details" ? "w-0" : "w-full"
            )} />
          </div>
          
          <div className={cn(
            "flex flex-col items-center",
            (stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
              ? "text-purple-700" : "text-gray-400"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
              (stage === "generating" || stage === "review" || stage === "edit-details" || stage === "complete") 
                ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
            )}>
              {stage === "generating" ? <Loader2 className="h-5 w-5 animate-spin" /> : 
               (stage === "review" || stage === "edit-details" || stage === "complete" ? <CheckCircle className="h-5 w-5" /> : "3")}
            </div>
            <span className="text-xs sm:text-sm font-medium">Generate</span>
          </div>
          
          <div className="flex-1 h-0.5 mx-2 bg-gray-200">
            <div className={cn(
              "h-full bg-purple-500 transition-all duration-500",
              stage === "select-category" || stage === "add-details" || stage === "generating" ? "w-0" : "w-full"
            )} />
          </div>
          
          <div className={cn(
            "flex flex-col items-center",
            (stage === "review" || stage === "edit-details" || stage === "complete") 
              ? "text-purple-700" : "text-gray-400"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
              (stage === "review" || stage === "edit-details" || stage === "complete") 
                ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
            )}>
              {stage === "complete" ? <CheckCircle className="h-5 w-5" /> : "4"}
            </div>
            <span className="text-xs sm:text-sm font-medium">Launch</span>
          </div>
        </div>
      </div>

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
            <Form {...categoryForm}>
              <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)} className="space-y-6">
                <FormField
                  control={categoryForm.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {eventCategories.map((category) => (
                          <div key={category.id}>
                            <RadioGroupItem
                              value={category.id}
                              id={category.id}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={category.id}
                              className="flex items-center space-x-3 rounded-lg border-2 border-purple-100 p-4 cursor-pointer transition-all hover:bg-purple-50 peer-data-[state=checked]:border-purple-600 peer-data-[state=checked]:bg-purple-50"
                            >
                              <span className="text-2xl">{category.icon}</span>
                              <div className="font-medium">{category.name}</div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium"
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
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
                <CardTitle className="text-xl text-purple-900">Tell us about your {getSelectedCategoryInfo()?.name}</CardTitle>
                <CardDescription>
                  Add details about your event to help our AI generate a great event page
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...detailsForm}>
              <form onSubmit={detailsForm.handleSubmit(onDetailsSubmit)} className="space-y-6">
                <FormField
                  control={detailsForm.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Event Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Describe your ${getSelectedCategoryInfo()?.name} in detail. Include information like the purpose, target audience, expected size, special features, etc.`}
                          className="min-h-[150px] resize-y text-base"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setEventDetails(e.target.value);
                          }}
                        />
                      </FormControl>
                      <div className="flex justify-between mt-2 text-sm">
                        <FormMessage />
                        <div className="text-right text-green-600">
                          {getWordCount(field.value)} words
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="text-amber-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                    <div className="text-sm text-amber-800">
                      <p className="font-medium">Helpful tips:</p>
                      <ul className="mt-1 list-disc list-inside space-y-1">
                        <li>Include the location and date if possible</li>
                        <li>Mention any special requirements for attendees</li>
                        <li>Describe what makes your event unique</li>
                        <li>The more details you provide, the better the AI can help you</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStage("select-category")}
                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium"
                  >
                    Generate Event <Sparkles className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {stage === "generating" && (
        <Card className="border-purple-200 shadow-lg transition-all animate-fade-in">
          <CardHeader className="bg-purple-50 border-b border-purple-100">
            <CardTitle className="text-center text-xl text-purple-900">Creating Your Event</CardTitle>
            <CardDescription className="text-center">
              Our AI is crafting the perfect {getSelectedCategoryInfo()?.name} based on your details
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            <div className="flex flex-col items-center">
              <div className="relative h-40 w-40 mb-6">
                <div className="absolute inset-0 rounded-full bg-purple-100 animate-pulse"></div>
                <div className="absolute inset-6 rounded-full bg-purple-200 animate-pulse [animation-delay:200ms]"></div>
                <div className="absolute inset-12 rounded-full bg-purple-300 animate-pulse [animation-delay:400ms]"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Bot className="h-12 w-12 text-purple-700 animate-bounce" />
                </div>
              </div>
              
              <div className="w-full max-w-md mb-8">
                <div className="relative pt-1">
                  <div className="overflow-hidden h-4 text-xs flex rounded-full bg-purple-100">
                    <div 
                      style={{ width: `${progress}%` }} 
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300 ease-out"
                    ></div>
                  </div>
                </div>
                <p className="text-center text-sm text-purple-700 mt-2">{getProgressText()}</p>
              </div>
              
              <div className="text-center text-gray-600 text-sm max-w-sm">
                <p className="animate-pulse"><span className="font-medium">Please wait</span> while we analyze your inputs and generate your event details</p>
              </div>
              
              <div className="flex justify-center mt-4 space-x-1">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:200ms]"></div>
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:400ms]"></div>
              </div>
            </div>
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
                <CardDescription>Make changes to your {getSelectedCategoryInfo()?.name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-base font-medium">Event Title</Label>
                  <Input
                    id="title"
                    className="mt-1"
                    {...editForm.register("title")}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-base font-medium">Description</Label>
                  <Textarea
                    id="description"
                    className="mt-1 min-h-[100px]"
                    {...editForm.register("description")}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-base font-medium">Location</Label>
                    <Input
                      id="location"
                      className="mt-1"
                      {...editForm.register("location")}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city" className="text-base font-medium">City</Label>
                    <Input
                      id="city"
                      className="mt-1"
                      {...editForm.register("city")}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="text-base font-medium">Date</Label>
                    <Input
                      id="date"
                      className="mt-1"
                      {...editForm.register("date")}
                    />
                  </div>

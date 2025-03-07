
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Bot, Edit, CheckCircle, ArrowRight, 
  Loader2, Sparkles, AlertTriangle, 
  PenLine, Send, RefreshCw, FileImage
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

const eventCategories = [
  { id: "islamic-talk", name: "Islamic Talk", icon: "🕌" },
  { id: "charity-fundraiser", name: "Charity Fundraiser", icon: "🤲" },
  { id: "umrah-trip", name: "Umrah Trip", icon: "✈️" },
  { id: "business-networking", name: "Business Networking", icon: "💼" },
  { id: "workshop", name: "Workshop", icon: "🔧" },
  { id: "other", name: "Other", icon: "📝" },
];

// Form schemas for different steps
const categoryFormSchema = z.object({
  category: z.string().min(1, { message: "Please select an event category" }),
});

const detailsFormSchema = z.object({
  details: z.string().min(20, { 
    message: "Please provide at least 20 characters about your event" 
  }),
});

// Stages of the event creation process
type CreationStage = 
  | "select-category" 
  | "add-details" 
  | "generating" 
  | "review" 
  | "complete";

const AiEventCreator = () => {
  const [stage, setStage] = useState<CreationStage>("select-category");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [generatedEvent, setGeneratedEvent] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [showLaunchConfirmation, setShowLaunchConfirmation] = useState(false);
  const progressIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form for category selection
  const categoryForm = useForm<z.infer<typeof categoryFormSchema>>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      category: "",
    },
  });

  // Form for event details
  const detailsForm = useForm<z.infer<typeof detailsFormSchema>>({
    resolver: zodResolver(detailsFormSchema),
    defaultValues: {
      details: "",
    },
  });

  // Handle category selection
  const onCategorySubmit = (values: z.infer<typeof categoryFormSchema>) => {
    setSelectedCategory(values.category);
    setStage("add-details");
    
    // Pre-fill the details field with a helpful starter
    const selectedCategoryObj = eventCategories.find(cat => cat.id === values.category);
    if (selectedCategoryObj) {
      const starterText = `I'm planning a ${selectedCategoryObj.name}. `;
      detailsForm.setValue("details", starterText);
      setEventDetails(starterText);
    }
  };

  // Handle details submission
  const onDetailsSubmit = (values: z.infer<typeof detailsFormSchema>) => {
    setEventDetails(values.details);
    setStage("generating");
    simulateEventGeneration();
  };

  // Simulate AI generating the event
  const simulateEventGeneration = () => {
    // Reset progress
    setProgress(0);
    
    // Animate progress over 10 seconds
    progressIntervalRef.current = window.setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current!);
          return 100;
        }
        return prev + 1;
      });
    }, 100);

    // Generate fake event data after 10 seconds
    setTimeout(() => {
      clearInterval(progressIntervalRef.current!);
      setProgress(100);

      // Get selected category name
      const categoryName = eventCategories.find(c => c.id === selectedCategory)?.name || "Event";
      
      // Generate placeholder event
      const event = {
        title: `${categoryName} - ${new Date().toLocaleDateString()}`,
        description: eventDetails,
        location: {
          name: "To be determined",
          address: "Address pending",
          city: "City",
          country: "Country",
        },
        date: {
          start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
          end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours after start
        },
        category: selectedCategory,
        capacity: 50,
        isFree: selectedCategory === "charity-fundraiser" ? false : true,
        price: selectedCategory === "charity-fundraiser" ? 25 : 0,
      };

      setGeneratedEvent(event);
      
      setTimeout(() => {
        setStage("review");
        toast({
          title: "Event Generated!",
          description: "Review your event details before launching.",
        });
      }, 500);
    }, 10000);
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Launch event handler
  const handleLaunchEvent = () => {
    setStage("complete");
    toast({
      title: "Event Created Successfully!",
      description: "Your event has been published.",
    });
    
    setTimeout(() => {
      navigate("/events");
    }, 2000);
  };

  // Edit event handler - navigate to manual creation with prefilled data
  const handleEditEvent = () => {
    // Format the event data to match what the CreateEventPage expects
    const formattedEvent = {
      ...generatedEvent,
      // Ensure dates are properly formatted as ISO strings if they're Date objects
      date: {
        start: generatedEvent.date.start instanceof Date 
          ? generatedEvent.date.start.toISOString() 
          : generatedEvent.date.start,
        end: generatedEvent.date.end instanceof Date 
          ? generatedEvent.date.end.toISOString() 
          : generatedEvent.date.end,
      },
      // Add any other required fields for the form
      categories: [generatedEvent.category], // Convert single category to array
      shortDescription: generatedEvent.description.substring(0, 150) + (generatedEvent.description.length > 150 ? '...' : ''),
      // Add a flag to indicate this event was created with AI
      fromAiCreator: true,
      // Add empty image field that will be required in the edit form
      image: "",
      requiresBannerUpload: true // Flag to indicate banner upload is required
    };
    
    // Navigate to the create event page with the formatted event data
    navigate("/events/create", { 
      state: { 
        event: formattedEvent,
        editMode: true 
      } 
    });
  };

  // Show launch confirmation dialog
  const handleShowLaunchConfirmation = () => {
    setShowLaunchConfirmation(true);
  };

  // Reset the process
  const handleReset = () => {
    setStage("select-category");
    setSelectedCategory("");
    setEventDetails("");
    setGeneratedEvent(null);
    setProgress(0);
    categoryForm.reset();
    detailsForm.reset();
  };

  // Get selected category info
  const getSelectedCategoryInfo = () => {
    return eventCategories.find(cat => cat.id === selectedCategory);
  };

  const getProgressText = () => {
    if (progress < 30) return "Analyzing your requirements...";
    if (progress < 60) return "Crafting your event details...";
    if (progress < 90) return "Adding finishing touches...";
    return "Almost ready!";
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 md:p-0">
      {/* Progress Steps */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-center">
          <div className={cn(
            "flex flex-col items-center",
            (stage === "select-category" || stage === "add-details" || stage === "generating" || stage === "review" || stage === "complete") 
              ? "text-purple-700" : "text-gray-400"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
              (stage === "select-category" || stage === "add-details" || stage === "generating" || stage === "review" || stage === "complete") 
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
            (stage === "add-details" || stage === "generating" || stage === "review" || stage === "complete") 
              ? "text-purple-700" : "text-gray-400"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
              (stage === "add-details" || stage === "generating" || stage === "review" || stage === "complete") 
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
            (stage === "generating" || stage === "review" || stage === "complete") 
              ? "text-purple-700" : "text-gray-400"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
              (stage === "generating" || stage === "review" || stage === "complete") 
                ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
            )}>
              {stage === "generating" ? <Loader2 className="h-5 w-5 animate-spin" /> : 
               (stage === "review" || stage === "complete" ? <CheckCircle className="h-5 w-5" /> : "3")}
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
            (stage === "review" || stage === "complete") 
              ? "text-purple-700" : "text-gray-400"
          )}>
            <div className={cn(
              "h-10 w-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300",
              (stage === "review" || stage === "complete") 
                ? "bg-purple-100 text-purple-700 border-2 border-purple-700"
                : "bg-gray-100 text-gray-400 border-2 border-gray-200"
            )}>
              {stage === "complete" ? <CheckCircle className="h-5 w-5" /> : "4"}
            </div>
            <span className="text-xs sm:text-sm font-medium">Launch</span>
          </div>
        </div>
      </div>

      {/* Category Selection */}
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

      {/* Add Details */}
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
                        />
                      </FormControl>
                      <FormMessage />
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

      {/* Generating Event */}
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
              
              {/* Loading animation dots */}
              <div className="flex justify-center mt-4 space-x-1">
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce"></div>
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:200ms]"></div>
                <div className="h-2 w-2 rounded-full bg-purple-500 animate-bounce [animation-delay:400ms]"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review & Launch */}
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
            <div className="space-y-6">
              <div className="rounded-lg border border-purple-100 p-4 bg-white">
                <h3 className="font-bold text-xl mb-2">{generatedEvent.title}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-1">{generatedEvent.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Location</h4>
                      <p className="mt-1">{generatedEvent.location.name}, {generatedEvent.location.city}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                      <p className="mt-1">{generatedEvent.date.start.toLocaleDateString()}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category</h4>
                      <p className="mt-1">{getSelectedCategoryInfo()?.name}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Capacity</h4>
                      <p className="mt-1">{generatedEvent.capacity} attendees</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Pricing</h4>
                      <p className="mt-1">
                        {generatedEvent.isFree ? "Free" : `$${generatedEvent.price}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <Bot className="text-blue-500 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">AI Notes:</p>
                    <p className="mt-1">
                      I've generated basic event details based on your inputs. You should edit this event to add a banner 
                      image before launching. This will make your event more attractive to attendees.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="border-2 border-dashed border-purple-200 rounded-lg p-4 text-center bg-purple-50/50">
                <FileImage className="h-10 w-10 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-purple-700">
                  <span className="font-medium">Note:</span> Don't forget to add a banner/flyer image 
                  when you edit this event. Events with images get more attendees!
                </p>
              </div>
            </div>
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
                onClick={handleEditEvent}
                variant="default"
                className="bg-purple-600 hover:bg-purple-700 text-white flex-1 sm:flex-initial"
              >
                <Edit className="mr-2 h-4 w-4" /> Edit Details
              </Button>
            </div>
            <Button 
              onClick={handleShowLaunchConfirmation}
              className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium w-full sm:w-auto"
            >
              Launch Event <Send className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Launch Confirmation Dialog */}
      <AlertDialog open={showLaunchConfirmation} onOpenChange={setShowLaunchConfirmation}>
        <AlertDialogContent className="border border-purple-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-purple-900">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You haven't edited your event yet. Events with complete details and banner images get more attendees.
              Would you like to edit your event before launching?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-900">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEditEvent}
              className="bg-purple-600 text-white hover:bg-purple-700"
            >
              Edit Event
            </AlertDialogAction>
            <AlertDialogAction
              onClick={handleLaunchEvent}
              className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white"
            >
              Launch Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Complete */}
      {stage === "complete" && (
        <Card className="border-purple-200 shadow-lg animate-fade-in">
          <CardHeader className="bg-purple-50 border-b border-purple-100 text-center">
            <CardTitle className="text-xl text-purple-900">Event Successfully Created!</CardTitle>
            <CardDescription>Your event is now live and ready for attendees</CardDescription>
          </CardHeader>
          <CardContent className="pt-8 pb-8 flex flex-col items-center">
            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <p className="text-center max-w-md">
              Congratulations! Your {getSelectedCategoryInfo()?.name} has been created and published. 
              You can now share it with your potential attendees.
            </p>
          </CardContent>
          <CardFooter className="justify-center border-t border-purple-100 bg-purple-50">
            <Button 
              onClick={() => navigate("/events")}
              className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium"
            >
              View All Events
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default AiEventCreator;

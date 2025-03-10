
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  CalendarIcon, Clock, MapPin, Users, 
  Image as ImageIcon, Upload, Check, Info, 
  CircleHelp, ChevronRight, Sparkles,
  Bot, Edit, FileImage, Rocket, Wand2,
  CheckCircle, ArrowRight, ArrowLeft,
  Building, Globe, Ticket, PencilLine
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { EventCategory, EventLocation, Event } from "@/types";
import { categories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import AiEventCreator from "@/components/event-creation/AiEventCreator";
import { Separator } from "@/components/ui/separator";
import EventTicketCard from "@/components/event-detail/EventTicketCard";
import EventHeader from "@/components/event-detail/EventHeader";

const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Event title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  location: z.object({
    name: z.string().min(3, { message: "Location name is required" }),
    address: z.string().min(5, { message: "Address is required" }),
    city: z.string().min(2, { message: "City is required" }),
    country: z.string().min(2, { message: "Country is required" }),
  }),
  date: z.object({
    start: z.date({ required_error: "Start date is required" }),
    end: z.date().optional(),
  }),
  category: z.string(),
  isFree: z.boolean().default(false),
  price: z.number().optional(),
  capacity: z.number().optional(),
  image: z.string().min(1, { message: "Event banner/flyer is required" }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const CreateEventPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isFree, setIsFree] = useState(false);
  const [step, setStep] = useState<"details" | "generate" | "launch">("details");
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [creationMode, setCreationMode] = useState<"manual" | "ai">("ai");
  const [eventDetails, setEventDetails] = useState("");
  const [eventCategory, setEventCategory] = useState("");
  const [generatedEvent, setGeneratedEvent] = useState<Event | null>(null);
  const [editSection, setEditSection] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we have event data from AI to pre-fill
  const prefilledEvent = location.state?.event || generatedEvent;
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: prefilledEvent || {
      title: "",
      description: "",
      location: {
        name: "",
        address: "",
        city: "",
        country: "",
      },
      isFree: false,
      category: "",
      image: "",
    }
  });
  
  const onSubmit = (values: EventFormValues) => {
    console.log(values);
    // Here you would typically send the data to your backend
    toast({
      title: "Event created!",
      description: "Your event has been created successfully.",
    });
    
    setTimeout(() => {
      navigate('/events');
    }, 1500);
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload this file to your server
      // For now, we'll just create a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);
      form.setValue("image", imageUrl);
    }
  };

  // Function to select a sample banner
  const selectSampleBanner = (imageUrl: string) => {
    setBannerPreview(imageUrl);
    form.setValue("image", imageUrl);
  };

  const handleGenerateEvent = (event: Event) => {
    setGeneratedEvent(event);
    setStep("launch");
  };

  const handleEditSection = (section: 'details' | 'tickets' | 'date' | 'location') => {
    setEditSection(section);
    // In a real implementation, you would open a form to edit the section
    toast({
      title: `Edit ${section}`,
      description: `You are now editing the ${section} section.`,
    });
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Create Your Event</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Let's bring people together! Follow these three steps to create your event.</p>
        </div>
        
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step === "details" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"}`}>
                <Edit className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${step === "details" ? "text-purple-600" : "text-gray-700"}`}>Details</h3>
                <p className="text-xs text-muted-foreground">Add your event information</p>
              </div>
            </div>
            <div className="w-20 h-[2px] bg-purple-200 mx-4"></div>
            <div className="flex-1 flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step === "generate" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"}`}>
                <Wand2 className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${step === "generate" ? "text-purple-600" : "text-gray-700"}`}>Generate</h3>
                <p className="text-xs text-muted-foreground">AI creates your event</p>
              </div>
            </div>
            <div className="w-20 h-[2px] bg-purple-200 mx-4"></div>
            <div className="flex-1 flex items-center">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center ${step === "launch" ? "bg-purple-600 text-white" : "bg-purple-100 text-purple-600"}`}>
                <Rocket className="h-5 w-5" />
              </div>
              <div className="ml-3">
                <h3 className={`font-medium ${step === "launch" ? "text-purple-600" : "text-gray-700"}`}>Launch</h3>
                <p className="text-xs text-muted-foreground">Review and publish</p>
              </div>
            </div>
          </div>
        </div>
        
        {step === "details" && (
          <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-2xl">Tell us about your event</CardTitle>
                <CardDescription>
                  Start with the basics - we'll use AI to help you fill in the details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <FormLabel className="text-base font-medium">Event category</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                      {categories.slice(0, 9).map((category) => (
                        <div 
                          key={category.value}
                          onClick={() => setEventCategory(category.value)}
                          className={`flex flex-col items-center justify-center p-4 border rounded-lg cursor-pointer transition-all hover:border-purple-400 hover:bg-purple-50 ${
                            eventCategory === category.value ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200' : 'border-gray-200'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                            {/* Render appropriate icon based on category */}
                            {category.value === 'charity' && <Globe className="h-5 w-5 text-purple-600" />}
                            {category.value === 'community' && <Users className="h-5 w-5 text-purple-600" />}
                            {category.value === 'education' && <Book className="h-5 w-5 text-purple-600" />}
                            {category.value === 'mosque' && <Building className="h-5 w-5 text-purple-600" />}
                            {category.value === 'other' && <CircleHelp className="h-5 w-5 text-purple-600" />}
                          </div>
                          <span className="text-sm font-medium text-center">{category.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <FormLabel className="text-base font-medium">Tell us about your event</FormLabel>
                    <Textarea 
                      placeholder="Describe your event - what is it about? When and where will it take place? Who should attend?"
                      className="min-h-32 text-base mt-2" 
                      value={eventDetails}
                      onChange={(e) => setEventDetails(e.target.value)}
                    />
                    <FormDescription className="mt-2">
                      The more details you provide, the better our AI can help you create your event.
                    </FormDescription>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                  <Info className="text-blue-500 mr-4 mt-1 h-5 w-5 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-blue-700">Tips for a great AI-generated event</h3>
                    <ul className="mt-2 space-y-1 text-sm text-blue-600">
                      <li>• Include the purpose and theme of your event</li>
                      <li>• Mention date, time, and location if you have them</li>
                      <li>• Describe your target audience and expected turnout</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 py-4 flex justify-end">
                <Button 
                  onClick={() => setStep("generate")}
                  disabled={!eventCategory || !eventDetails}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Continue to Generate <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
        
        {step === "generate" && (
          <div className="max-w-5xl mx-auto">
            <Card className="shadow-lg border-none overflow-hidden">
              <CardHeader className="bg-purple-50">
                <CardTitle className="text-2xl flex items-center">
                  <Wand2 className="mr-2 h-6 w-6 text-purple-500" />
                  AI Event Generator
                </CardTitle>
                <CardDescription>
                  Our AI will now create your event based on your description
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <AiEventCreator 
                  category={eventCategory}
                  description={eventDetails}
                  onEventGenerated={handleGenerateEvent}
                  onBack={() => setStep("details")}
                />
              </CardContent>
            </Card>
          </div>
        )}
        
        {step === "launch" && generatedEvent && (
          <div className="max-w-6xl mx-auto">
            <div className="bg-purple-50 p-6 rounded-xl mb-8 text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">Your event is ready to launch!</h2>
              <p className="text-purple-600 max-w-2xl mx-auto">
                Review your event details below and make any final adjustments. This is how attendees will see your event page.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="shadow-md border-none overflow-hidden mb-6">
                  <CardContent className="p-0">
                    <div className="relative h-64 w-full bg-gray-200">
                      <img 
                        src={generatedEvent.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"} 
                        alt={generatedEvent.title} 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-4 right-4">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-white text-gray-700 hover:bg-gray-100 rounded-full px-3"
                          onClick={() => document.getElementById('event-banner')?.click()}
                        >
                          <PencilLine className="h-4 w-4 mr-1" /> Edit Cover
                        </Button>
                        <input 
                          type="file" 
                          className="hidden" 
                          id="event-banner"
                          accept="image/*"
                          onChange={handleBannerUpload}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mb-8 flex items-center justify-between">
                  <h1 className="text-3xl font-bold">{generatedEvent.title}</h1>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => handleEditSection('details')}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
                
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
                      About this event
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-purple-600 border-purple-200 hover:bg-purple-50"
                        onClick={() => handleEditSection('details')}
                      >
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </h2>
                    <div className="prose text-gray-700 max-w-none">
                      <p>{generatedEvent.description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-1">
                <EventTicketCard 
                  event={generatedEvent} 
                  isPreview={true}
                  onEdit={handleEditSection}
                />
                
                <div className="mt-6">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                    onClick={() => {
                      // Submit the form with the generated event data
                      toast({
                        title: "Event published!",
                        description: "Your event has been published successfully.",
                      });
                      
                      setTimeout(() => {
                        navigate('/events');
                      }, 1500);
                    }}
                  >
                    <Rocket className="mr-2 h-5 w-5" /> Publish Event
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setStep("generate")}
                    className="w-full mt-2 border-purple-200 text-purple-600 hover:bg-purple-50"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Generator
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Import the Book icon we're using
import { Book } from "lucide-react";

export default CreateEventPage;

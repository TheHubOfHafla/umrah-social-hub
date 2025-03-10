import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users, DollarSign, Image as ImageIcon, Upload, Check, Info, CircleHelp, ChevronRight, Sparkles, Bot, UserCircle2, LightbulbIcon, Edit, FileImage } from "lucide-react";
import { categories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { EventCategory, EventLocation } from "@/types";
import { generateBasicEvent } from "@/lib/data";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const aiEventSchema = z.object({
  category: z.string().min(1, { message: "Category is required" }),
  details: z.string().min(10, { message: "Details must be at least 10 characters" }),
});

const generatedEventSchema = z.object({
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

type AiEventFormValues = z.infer<typeof aiEventSchema>;
type GeneratedEventFormValues = z.infer<typeof generatedEventSchema>;

const AiEventCreator = () => {
  const [stage, setStage] = useState<"input" | "generate" | "edit" | "complete">("input");
  const [generatedEvent, setGeneratedEvent] = useState<GeneratedEventFormValues | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFree, setIsFree] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const aiForm = useForm<AiEventFormValues>({
    resolver: zodResolver(aiEventSchema),
    defaultValues: {
      category: "",
      details: "",
    },
  });

  const generatedForm = useForm<GeneratedEventFormValues>({
    resolver: zodResolver(generatedEventSchema),
    defaultValues: {
      title: "",
      description: "",
      location: {
        name: "",
        address: "",
        city: "",
        country: "",
      },
      date: {
        start: new Date(),
      },
      isFree: false,
      category: "",
      image: "",
    },
  });

  const handleGenerateEvent = async (values: AiEventFormValues) => {
    setStage("generate");
    
    // Simulate AI event generation
    const newEvent = generateBasicEvent(values.category, values.details);
    
    // Set default values for the generated event form
    generatedForm.reset({
      title: newEvent.title,
      description: newEvent.description,
      location: {
        name: newEvent.location.name,
        address: newEvent.location.address,
        city: newEvent.location.city,
        country: newEvent.location.country,
      },
      date: {
        start: new Date(newEvent.suggestedDate),
      },
      isFree: newEvent.isFree,
      price: newEvent.suggestedPrice,
      capacity: newEvent.capacity,
      category: newEvent.categoryRecommendations[0],
      image: "",
    });
    
    setGeneratedEvent({
      title: newEvent.title,
      description: newEvent.description,
      location: {
        name: newEvent.location.name,
        address: newEvent.location.address,
        city: newEvent.location.city,
        country: newEvent.location.country,
      },
      date: {
        start: new Date(newEvent.suggestedDate),
      },
      isFree: newEvent.isFree,
      price: newEvent.suggestedPrice,
      capacity: newEvent.capacity,
      category: newEvent.categoryRecommendations[0],
      image: "",
    });
    
    setStage("edit");
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setBannerPreview(imageUrl);
      generatedForm.setValue("image", imageUrl);
    }
  };

  const selectSampleBanner = (imageUrl: string) => {
    setBannerPreview(imageUrl);
    generatedForm.setValue("image", imageUrl);
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
    
    setStage("complete");
    
    try {
      // Prepare event data
      const eventData = {
        ...generatedEvent,
        image: bannerPreview,
        // Convert category string to array of categories as needed by the API
        categories: [generatedEvent.category],
        // Add organizer information
        organizer_id: currentUser.id,
        // Format dates for API
        start_date: generatedEvent.date.start.toISOString(),
        end_date: generatedEvent.date.end ? generatedEvent.date.end.toISOString() : null,
        // Map location data to API format
        location_name: generatedEvent.location.name,
        location_address: generatedEvent.location.address,
        location_city: generatedEvent.location.city,
        location_country: generatedEvent.location.country,
        // Set other required fields
        featured: false,
        is_free: generatedEvent.isFree,
        base_price: generatedEvent.price || 0
      };
      
      // In a real app, save to database - for now, we'll add to our mock data
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: eventData.title,
          description: eventData.description,
          short_description: eventData.description.substring(0, 150) + (eventData.description.length > 150 ? '...' : ''),
          organizer_id: eventData.organizer_id,
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          location_name: eventData.location_name,
          location_address: eventData.location_address,
          location_city: eventData.location_city,
          location_country: eventData.location_country,
          categories: eventData.categories,
          capacity: eventData.capacity,
          is_free: eventData.is_free,
          base_price: eventData.base_price,
          image: eventData.image,
          featured: eventData.featured
        })
        .select();
      
      if (error) {
        console.error("Error saving event:", error);
        toast({
          title: "Error Saving Event",
          description: "There was a problem saving your event. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Event Created Successfully!",
        description: "Your event has been published and is now visible on the events page.",
      });
      
      // Redirect to organizer dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard/organizer/events");
      }, 2000);
      
    } catch (err) {
      console.error("Error creating event:", err);
      toast({
        title: "Error Creating Event",
        description: "There was a problem creating your event. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditEvent = () => {
    setStage("edit");
  };

  const handleShowLaunchConfirmation = () => {
    setStage("complete");
  };

  if (stage === "input") {
    return (
      <Card className="w-full max-w-2xl mx-auto border-none shadow-lg">
        <CardHeader className="bg-purple-50 rounded-t-lg">
          <CardTitle className="flex items-center">
            <Bot className="mr-2 h-5 w-5 text-purple-500" />
            AI Event Creation
          </CardTitle>
          <CardDescription>Let our AI help you create your event</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <Form {...aiForm}>
            <form onSubmit={aiForm.handleSubmit(handleGenerateEvent)} className="space-y-4">
              <FormField
                control={aiForm.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Event Category</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormDescription>
                      Choose the category that best fits your event
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={aiForm.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Event Details</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter a brief description of your event" 
                        className="min-h-32 text-base" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Provide as much detail as possible for better results
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 w-full"
                size="lg"
              >
                Generate Event
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  if (stage === "generate") {
    return (
      <Card className="w-full max-w-2xl mx-auto border-none shadow-lg">
        <CardHeader className="bg-blue-50 rounded-t-lg">
          <CardTitle className="flex items-center">
            <Sparkles className="mr-2 h-5 w-5 text-blue-500" />
            Generating Event...
          </CardTitle>
          <CardDescription>Please wait while our AI creates your event</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
          <p className="text-center text-muted-foreground">
            Generating event details based on your input. This may take a few moments.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (stage === "edit") {
    return (
      <Card className="w-full max-w-3xl mx-auto border-none shadow-lg">
        <CardHeader className="bg-purple-50 rounded-t-lg">
          <CardTitle className="flex items-center">
            <Edit className="mr-2 h-5 w-5 text-purple-500" />
            Edit Generated Event
          </CardTitle>
          <CardDescription>Review and adjust the details of your event</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <Form {...generatedForm}>
            <form onSubmit={generatedForm.handleSubmit(() => handleShowLaunchConfirmation())} className="space-y-6">
              <FormField
                control={generatedForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Event Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Give your event a catchy name" 
                        className="h-12 text-lg" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Make it clear and exciting
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={generatedForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Event Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell people what your event is all about" 
                        className="min-h-32 text-base" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Be descriptive to get people excited
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={generatedForm.control}
                name="location.name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Venue Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g. Central Conference Hall" 
                        className="h-12 text-base" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={generatedForm.control}
                name="location.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Address</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Street address" 
                        className="h-12 text-base" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={generatedForm.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">City</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="City" 
                          className="h-12 text-base" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={generatedForm.control}
                  name="location.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Country</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Country" 
                          className="h-12 text-base" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={generatedForm.control}
                name="date.start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-base font-medium">Event Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-12 pl-3 text-left font-normal flex justify-between items-center",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Select date</span>
                            )}
                            <CalendarIcon className="h-5 w-5 opacity-70" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => {
                            field.onChange(date);
                            setSelectedDate(date);
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={generatedForm.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Event Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1" 
                        placeholder="How many people can attend?" 
                        className="h-12 text-base"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                      />
                    </FormControl>
                    <FormDescription>
                      Leave blank for unlimited capacity
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <FormField
                  control={generatedForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Event Banner/Flyer <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormDescription>
                        Upload an eye-catching banner to attract more attendees. Events with images receive 2x more interest.
                      </FormDescription>
                      
                      {bannerPreview ? (
                        <div className="mt-2 rounded-lg overflow-hidden border border-purple-200 relative group">
                          <img 
                            src={bannerPreview} 
                            alt="Event banner preview" 
                            className="w-full h-[200px] object-cover"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                            <Button 
                              type="button"
                              variant="default"
                              className="bg-purple-600 hover:bg-purple-700"
                              onClick={() => document.getElementById('event-banner')?.click()}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Change Banner
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center hover:bg-purple-50 transition-colors cursor-pointer"
                          onClick={() => document.getElementById('event-banner')?.click()}
                        >
                          <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                            <FileImage className="h-6 w-6 text-purple-500" />
                          </div>
                          <h4 className="text-base font-medium text-gray-700">Upload event banner/flyer</h4>
                          <p className="text-sm text-gray-500 mt-1">
                            Drag and drop or click to browse
                          </p>
                          <input 
                            type="file" 
                            className="hidden" 
                            id="event-banner"
                            accept="image/*"
                            onChange={handleBannerUpload}
                          />
                          <Button
                            type="button" 
                            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            Select File
                          </Button>
                        </div>
                      )}
                      
                      <FormMessage />
                      
                      {!bannerPreview && (
                        <div className="mt-4">
                          <p className="text-sm font-medium mb-2">Or choose a sample banner:</p>
                          <div className="grid grid-cols-3 gap-2">
                            <img 
                              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                              alt="Sample banner 1" 
                              className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                              onClick={() => selectSampleBanner("https://images.unsplash.com/photo-1605810230434-7631ac76ec81")}
                            />
                            <img 
                              src="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7" 
                              alt="Sample banner 2" 
                              className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                              onClick={() => selectSampleBanner("https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7")}
                            />
                            <img 
                              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                              alt="Sample banner 3" 
                              className="h-20 w-full object-cover rounded-md cursor-pointer border-2 hover:border-purple-500 transition-all"
                              onClick={() => selectSampleBanner("https://images.unsplash.com/photo-1519389950473-47ba0277781c")}
                            />
                          </div>
                        </div>
                      )}
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <FormLabel className="text-base font-medium">Pricing</FormLabel>
                <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-md">
                  <input
                    type="checkbox"
                    id="is-free"
                    className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary"
                    checked={isFree}
                    onChange={(e) => {
                      setIsFree(e.target.checked);
                      generatedForm.setValue("isFree", e.target.checked);
                      if (e.target.checked) {
                        generatedForm.setValue("price", 0);
                      }
                    }}
                  />
                  <label htmlFor="is-free" className="text-base">This is a free event</label>
                </div>
                
                {!isFree && (
                  <FormField
                    control={generatedForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">Ticket Price ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0" 
                            step="0.01" 
                            placeholder="0.00" 
                            className="h-12 text-base"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStage("input")}>
                  Back
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                >
                  Launch Event
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  if (stage === "complete") {
    return (
      <Card className="w-full max-w-2xl mx-auto border-none shadow-lg">
        <CardHeader className="bg-green-50 rounded-t-lg">
          <CardTitle className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            Event Ready to Launch!
          </CardTitle>
          <CardDescription>Review and launch your event to the world</CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {bannerPreview && (
            <div className="rounded-lg overflow-hidden border border-purple-200">
              <img 
                src={bannerPreview} 
                alt="Event banner preview" 
                className="w-full h-[200px] object-cover"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Event Details</h3>
            <p><strong>Title:</strong> {generatedEvent?.title}</p>
            <p><strong>Description:</strong> {generatedEvent?.description}</p>
            <p><strong>Location:</strong> {generatedEvent?.location.name}, {generatedEvent?.location.address}, {generatedEvent?.location.city}, {generatedEvent?.location.country}</p>
            <p><strong>Date:</strong> {generatedEvent?.date.start.toLocaleDateString()}</p>
            <p><strong>Capacity:</strong> {generatedEvent?.capacity || 'Unlimited'}</p>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStage("edit")}>
              Edit Event
            </Button>
            <Button 
              className="bg-gradient-to-r from-green-600 to-blue-500 hover:from-green-700 hover:to-blue-600"
              onClick={handleLaunchEvent}
            >
              Launch Event
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

// Add this near the top of the component to get the current user
const [currentUser, setCurrentUser] = useState<any>(() => {
  // In a real app, get from auth context or API
  return {
    id: "1", // Default ID for demo purposes
    name: "Current User"
  };
});

// Add this effect to get the user information from Supabase
useEffect(() => {
  const getUserProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setCurrentUser({
          id: user.id,
          ...profile
        });
      }
    }
  };
  
  getUserProfile();
}, []);

export default AiEventCreator;

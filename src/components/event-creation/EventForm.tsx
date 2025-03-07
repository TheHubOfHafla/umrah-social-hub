
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarIcon, CircleDollarSign, Clock, ImageIcon, InfoIcon, MapPin } from "lucide-react";
import { EventCategory } from "@/types";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle } from "lucide-react";

// Event categories for selection
const eventCategoryOptions: { value: EventCategory; label: string }[] = [
  { value: "charity", label: "Charity" },
  { value: "community", label: "Community" },
  { value: "education", label: "Education" },
  { value: "mosque", label: "Mosque" },
  { value: "travel", label: "Travel" },
  { value: "umrah", label: "Umrah" },
  { value: "lecture", label: "Lecture" },
  { value: "workshop", label: "Workshop" },
  { value: "social", label: "Social" },
  { value: "other", label: "Other" },
];

// Form schema
const eventFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  shortDescription: z.string().min(10, { message: "Short description must be at least 10 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  image: z.string().min(1, { message: "Event image is required" }),
  isFree: z.boolean().default(true),
  price: z.coerce.number().optional().nullable(),
  capacity: z.coerce.number().optional().nullable(),
  locationName: z.string().min(1, { message: "Location name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  startDate: z.date(),
  endDate: z.date().optional().nullable(),
  categories: z.array(z.string()).min(1, { message: "Select at least one category" }),
});

// Types
type EventFormValues = z.infer<typeof eventFormSchema>;

// Convert from prefilled event to form values
const convertToFormValues = (event: any): EventFormValues => {
  return {
    title: event.title || "",
    shortDescription: event.shortDescription || "",
    description: event.description || "",
    image: event.image || "",
    isFree: event.isFree ?? true,
    price: event.price || null,
    capacity: event.capacity || null,
    locationName: event.location?.name || "",
    address: event.location?.address || "",
    city: event.location?.city || "",
    country: event.location?.country || "",
    startDate: event.date?.start ? new Date(event.date.start) : new Date(),
    endDate: event.date?.end ? new Date(event.date.end) : null,
    categories: Array.isArray(event.categories) ? event.categories : 
               event.category ? [event.category] : [],
  };
};

// Props interface
interface EventFormProps {
  prefilledEvent: any | null;
  editMode?: boolean;
  requiresBannerUpload?: boolean;
}

const EventForm = ({ prefilledEvent, editMode = false, requiresBannerUpload = false }: EventFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    prefilledEvent?.categories || []
  );

  // Initialize form with prefilled values if available
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: prefilledEvent 
      ? convertToFormValues(prefilledEvent)
      : {
          title: "",
          shortDescription: "",
          description: "",
          image: "",
          isFree: true,
          price: null,
          capacity: null,
          locationName: "",
          address: "",
          city: "",
          country: "",
          startDate: new Date(),
          endDate: null,
          categories: [],
        },
  });

  // Form submission handler
  const onSubmit = async (data: EventFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would send data to your backend
      console.log("Submitting event data:", data);
      
      // Simulate a delay for the save operation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: editMode ? "Event Updated!" : "Event Created!",
        description: editMode 
          ? "Your event has been updated successfully." 
          : "Your event has been created successfully.",
      });
      
      // Redirect to events page
      navigate("/events");
    } catch (error) {
      console.error("Error submitting event:", error);
      toast({
        title: "Error",
        description: "There was a problem saving your event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
    
    // Update form value
    const currentCategories = form.getValues("categories");
    if (currentCategories.includes(category)) {
      form.setValue(
        "categories", 
        currentCategories.filter(c => c !== category)
      );
    } else {
      form.setValue("categories", [...currentCategories, category]);
    }
  };

  // Mock image upload handler - in a real app, this would upload to your storage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulate image upload by creating an object URL
      const imageUrl = URL.createObjectURL(file);
      form.setValue("image", imageUrl);
    }
  };

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <InfoIcon className="h-5 w-5 text-primary" />
                    Event Details
                  </CardTitle>
                  <CardDescription>
                    Provide the basic information about your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Title*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter the title of your event" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="shortDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="A brief summary of your event (appears in cards)" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This will appear in event cards and listings
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Description*</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Provide details about your event" 
                            className="min-h-32 resize-y"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="categories"
                    render={() => (
                      <FormItem>
                        <FormLabel>Categories*</FormLabel>
                        <FormDescription>
                          Select at least one category that best describes your event
                        </FormDescription>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2">
                          {eventCategoryOptions.map((category) => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${category.value}`}
                                checked={selectedCategories.includes(category.value)}
                                onCheckedChange={() => handleCategoryToggle(category.value)}
                              />
                              <label
                                htmlFor={`category-${category.value}`}
                                className="text-sm cursor-pointer"
                              >
                                {category.label}
                              </label>
                            </div>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Location */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </CardTitle>
                  <CardDescription>
                    Where will your event take place?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="locationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Central Mosque, Conference Hall" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address*</FormLabel>
                        <FormControl>
                          <Input placeholder="Street address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City*</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country*</FormLabel>
                          <FormControl>
                            <Input placeholder="Country" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Date and Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Date and Time
                  </CardTitle>
                  <CardDescription>
                    When will your event take place?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Start Date*</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>End Date (Optional)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              {/* Tickets and Capacity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CircleDollarSign className="h-5 w-5 text-primary" />
                    Tickets and Capacity
                  </CardTitle>
                  <CardDescription>
                    Set pricing and attendee limits for your event
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Free Event</FormLabel>
                          <FormDescription>
                            Toggle if this is a free event
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {!form.watch("isFree") && (
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ticket Price ($)*</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="e.g. 10.00" 
                              {...field}
                              onChange={(e) => {
                                const value = e.target.value === "" ? null : Number(e.target.value);
                                field.onChange(value);
                              }}
                              value={field.value === null ? "" : field.value}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Event Capacity (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Maximum number of attendees" 
                            {...field}
                            onChange={(e) => {
                              const value = e.target.value === "" ? null : Number(e.target.value);
                              field.onChange(value);
                            }}
                            value={field.value === null ? "" : field.value}
                          />
                        </FormControl>
                        <FormDescription>
                          Leave blank for unlimited capacity
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
            
            <div className="md:col-span-1 space-y-6">
              {/* Event Image */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Event Image
                  </CardTitle>
                  <CardDescription>
                    Upload a banner image for your event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex flex-col items-center justify-center gap-4">
                          <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden border-2 border-dashed border-muted-foreground/25 flex items-center justify-center relative">
                            {field.value ? (
                              <img
                                src={field.value}
                                alt="Event banner"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                                <ImageIcon className="h-10 w-10 mb-2" />
                                <p className="text-sm">
                                  Drag and drop or click to upload
                                </p>
                                <p className="text-xs mt-1">
                                  Recommended size: 1200 x 630px
                                </p>
                              </div>
                            )}
                          </div>
                          
                          <FormControl>
                            <div className="flex justify-center">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                              />
                              <label htmlFor="image-upload">
                                <Button
                                  type="button"
                                  variant="outline"
                                  className="cursor-pointer"
                                  as="span"
                                >
                                  Upload Image
                                </Button>
                              </label>
                            </div>
                          </FormControl>
                          
                          {requiresBannerUpload && !field.value && (
                            <div className="w-full p-3 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="flex items-start text-amber-800">
                                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                                <span className="text-sm">
                                  A banner image is required before you can launch your event.
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="mr-2 h-4 w-4 animate-spin" />
                        {editMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editMode ? "Save and Launch Event" : "Create Event"
                    )}
                  </Button>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-center">
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => navigate("/events")}
                  >
                    Cancel
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EventForm;

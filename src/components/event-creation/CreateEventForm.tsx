
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Clock, MapPin, Sparkles, PenLine } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { EventCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import LaunchEvent from "./LaunchEvent";
import EventSuccessMessage from "./EventSuccessMessage";

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  country: string;
  category: EventCategory;
  price: number;
  capacity: number;
  isFree: boolean;
}

type CreateEventStep = "form" | "preview" | "success";

export default function CreateEventForm() {
  const [step, setStep] = useState<CreateEventStep>("form");
  const [isLoading, setIsLoading] = useState(false);
  const [eventId, setEventId] = useState<string>();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    city: "",
    country: "",
    category: "other",
    price: 0,
    capacity: 100,
    isFree: true,
  });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If price is set above 0, set isFree to false
    if (field === 'price' && Number(value) > 0) {
      setFormData(prev => ({
        ...prev,
        isFree: false
      }));
    } else if (field === 'price' && Number(value) === 0) {
      setFormData(prev => ({
        ...prev,
        isFree: true
      }));
    }
  };

  const handleToggleFree = () => {
    setFormData(prev => {
      const newIsFree = !prev.isFree;
      return {
        ...prev,
        isFree: newIsFree,
        price: newIsFree ? 0 : prev.price
      };
    });
  };

  const validateForm = (): boolean => {
    const requiredFields = ['title', 'description', 'date', 'time', 'location', 'city', 'country', 'category'];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Missing Information",
          description: `Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`,
          variant: "destructive"
        });
        return false;
      }
    }
    
    if (!formData.isFree && formData.price <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please set a price greater than 0 for paid events.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Format date and time for preview
    const dateObj = new Date(`${formData.date}T${formData.time}`);
    const endDateObj = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration
    
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
      // Format date and time for API
      const dateObj = new Date(`${formData.date}T${formData.time}`);
      const endDateObj = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration
      
      // Simulate saving to database (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Set mock event ID (replace with actual ID from API response)
      setEventId("event-" + Date.now().toString());
      
      toast({
        title: "Event Created!",
        description: "Your event has been successfully published.",
      });
      
      setStep("success");
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatPreviewData = () => {
    // Format date and time for preview
    const dateObj = new Date(`${formData.date}T${formData.time}`);
    const endDateObj = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration
    
    return {
      title: formData.title,
      description: formData.description,
      date: {
        start: dateObj,
        end: endDateObj
      },
      location: {
        name: formData.location,
        city: formData.city,
        country: formData.country
      },
      category: formData.category,
      capacity: formData.capacity,
      isFree: formData.isFree,
      price: formData.price,
      image: undefined
    };
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
      <Card className="border-purple-200 shadow-lg">
        <CardHeader className="bg-purple-50 border-b border-purple-100">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-purple-200 flex items-center justify-center">
              <PenLine className="h-5 w-5 text-purple-700" />
            </div>
            <div>
              <CardTitle className="text-xl text-purple-900">Create a New Event</CardTitle>
              <CardDescription>Fill in the details to create your event</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6 pt-6">
            <div>
              <Label htmlFor="title" className="text-base font-medium">Event Title</Label>
              <Input 
                id="title" 
                className="mt-1.5" 
                placeholder="Enter your event title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="date" className="text-base font-medium">Date</Label>
                <div className="relative mt-1.5">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="date" 
                    type="date" 
                    className="pl-10"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="time" className="text-base font-medium">Time</Label>
                <div className="relative mt-1.5">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="time" 
                    type="time" 
                    className="pl-10"
                    value={formData.time}
                    onChange={(e) => handleInputChange('time', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="location" className="text-base font-medium">Venue / Location Name</Label>
              <div className="relative mt-1.5">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="location" 
                  className="pl-10" 
                  placeholder="e.g. Grand Masjid Hall"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="city" className="text-base font-medium">City</Label>
                <Input 
                  id="city" 
                  className="mt-1.5" 
                  placeholder="e.g. London"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="country" className="text-base font-medium">Country</Label>
                <Input 
                  id="country" 
                  className="mt-1.5" 
                  placeholder="e.g. United Kingdom"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-base font-medium">Description</Label>
              <Textarea 
                id="description" 
                className="mt-1.5 min-h-[120px]" 
                placeholder="Describe your event in detail. What can attendees expect?"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="category" className="text-base font-medium">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="capacity" className="text-base font-medium">Capacity</Label>
                <Input 
                  id="capacity" 
                  type="number" 
                  className="mt-1.5"
                  placeholder="Maximum number of attendees"
                  min={1}
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="price" className="text-base font-medium">Ticket Price</Label>
                <div>
                  <Badge
                    onClick={handleToggleFree}
                    className={cn(
                      "cursor-pointer transition-all",
                      formData.isFree 
                        ? "bg-green-100 hover:bg-green-200 text-green-800" 
                        : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    )}
                  >
                    Free
                  </Badge>
                </div>
              </div>
              <div className="mt-1.5">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input 
                    id="price" 
                    type="number" 
                    className="pl-8" 
                    placeholder="0.00"
                    min={0}
                    step="0.01"
                    disabled={formData.isFree}
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formData.isFree 
                    ? "This event will be free for all attendees." 
                    : "Set the price for a standard ticket to your event."}
                </p>
              </div>
            </div>
            
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-start">
                <Sparkles className="text-purple-600 mr-3 mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="text-sm text-purple-900">
                  <p className="font-medium">Create with AI Assistance</p>
                  <p className="mt-1 text-purple-800">
                    Want to generate a complete event using AI? Try our AI Event Creator for a faster setup experience.
                  </p>
                  <Button 
                    type="button"
                    className="mt-3 bg-white text-purple-700 border border-purple-300 hover:bg-purple-100"
                    onClick={() => navigate("/events/ai-create")}
                  >
                    <Sparkles className="mr-2 h-4 w-4" /> 
                    Try AI Event Creator
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end border-t border-gray-200 pt-6 pb-6">
            <Button 
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-purple-400 hover:from-purple-700 hover:to-purple-500 text-white transition-all duration-300 hover:scale-[1.02] font-medium"
            >
              Preview & Launch
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

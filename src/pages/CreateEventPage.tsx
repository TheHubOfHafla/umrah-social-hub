import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { 
  CalendarIcon, Clock, MapPin, Users, DollarSign, 
  Image as ImageIcon, Upload, Check, Info, 
  CircleHelp, ChevronRight, Sparkles 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { EventCategory, EventLocation } from "@/types";
import { categories } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

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
  image: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const CreateEventPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [isFree, setIsFree] = useState(false);
  const [activeTab, setActiveTab] = useState("basics");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
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

  const isTabComplete = (tab: string) => {
    if (tab === "basics") {
      return !!form.watch("title") && !!form.watch("description") && !!form.watch("category");
    } else if (tab === "location") {
      const location = form.watch("location");
      return !!location.name && !!location.address && !!location.city && !!location.country;
    } else if (tab === "details") {
      return !!form.watch("date.start");
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Create Your Event</h1>
          <p className="text-muted-foreground mt-2 max-w-xl mx-auto">Let's bring people together! Fill out the details below to create your amazing event.</p>
        </div>
        
        <Tabs defaultValue="basics" className="space-y-8" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-3 w-full max-w-xl">
              <TabsTrigger value="basics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <div className="flex items-center">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs">
                    {isTabComplete("basics") ? <Check className="h-3 w-3" /> : "1"}
                  </span>
                  Basics
                </div>
              </TabsTrigger>
              <TabsTrigger value="location" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <div className="flex items-center">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs">
                    {isTabComplete("location") ? <Check className="h-3 w-3" /> : "2"}
                  </span>
                  Location
                </div>
              </TabsTrigger>
              <TabsTrigger value="details" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <div className="flex items-center">
                  <span className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center mr-2 text-xs">
                    {isTabComplete("details") ? <Check className="h-3 w-3" /> : "3"}
                  </span>
                  Details
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <TabsContent value="basics" className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-purple-50 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Sparkles className="mr-2 h-5 w-5 text-purple-500" />
                      Event Basics
                    </CardTitle>
                    <CardDescription>What are you planning?</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                    
                    <div className="pt-4 flex justify-end">
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab("location")}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                        size="lg"
                      >
                        Continue to Location <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <Info className="text-blue-500 mr-4 mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-blue-700">Tips for a great event title</h3>
                      <ul className="mt-2 space-y-1 text-sm text-blue-600">
                        <li>• Keep it concise but descriptive</li>
                        <li>• Include location or venue for in-person events</li>
                        <li>• Mention the main activity or purpose</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="location" className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-blue-50 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <MapPin className="mr-2 h-5 w-5 text-blue-500" />
                      Location Details
                    </CardTitle>
                    <CardDescription>Where will your event take place?</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                        control={form.control}
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
                        control={form.control}
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
                    
                    <div className="pt-4 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("basics")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setActiveTab("details")}
                        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                        size="lg"
                      >
                        Continue to Details <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                  <div className="flex items-start">
                    <CircleHelp className="text-green-500 mr-4 mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-green-700">Location Tips</h3>
                      <p className="mt-1 text-sm text-green-600">
                        Providing complete location details helps attendees plan their trip and increases attendance rates.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-purple-50 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-purple-500" />
                      Event Details
                    </CardTitle>
                    <CardDescription>When is it happening and what else should people know?</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                            form.setValue("isFree", e.target.checked);
                            if (e.target.checked) {
                              form.setValue("price", 0);
                            }
                          }}
                        />
                        <label htmlFor="is-free" className="text-base">This is a free event</label>
                      </div>
                      
                      {!isFree && (
                        <FormField
                          control={form.control}
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
                    
                    <div className="space-y-4">
                      <FormLabel className="text-base font-medium">Event Image</FormLabel>
                      <div className="border-2 border-dashed border-purple-200 rounded-lg p-8 text-center hover:bg-purple-50 transition-colors cursor-pointer">
                        <div className="mx-auto h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                          <Upload className="h-6 w-6 text-purple-500" />
                        </div>
                        <h4 className="text-base font-medium text-gray-700">Upload event image</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Drag and drop or click to browse
                        </p>
                        <input type="file" className="hidden" id="event-image" />
                        <label htmlFor="event-image" className="mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 cursor-pointer">
                          Select File
                        </label>
                      </div>
                    </div>
                    
                    <div className="pt-6 flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveTab("location")}
                      >
                        Back
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600"
                        size="lg"
                      >
                        Create Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-100">
                  <div className="flex items-start">
                    <Info className="text-yellow-500 mr-4 mt-1 h-5 w-5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-yellow-700">Almost Done!</h3>
                      <p className="mt-1 text-sm text-yellow-600">
                        Events with images receive 2x more interest from potential attendees. Make sure to add a compelling image!
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </form>
          </Form>
        </Tabs>
      </div>
    </div>
  );
};

export default CreateEventPage;


import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Clock, MapPin, Users, DollarSign, Info, Plus, Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";

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
    }
  });
  
  const onSubmit = (values: EventFormValues) => {
    console.log(values);
    // Here you would typically send the data to your backend
    alert("Event creation form submitted!");
  };

  return (
    <div className="min-h-screen bg-muted/20 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl font-bold">Create New Event</h1>
          <p className="text-muted-foreground mt-2">Fill out the form below to create your event</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Provide the main details about your event</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Event Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Give your event a name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Make it clear and catchy
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
                          <FormLabel>Event Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your event" 
                              className="min-h-32" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Tell people what your event is about
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="date.start"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Event Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Select date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                      
                      <div className="space-y-2">
                        <Label>Event Category</Label>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={form.watch("category")}
                          onChange={(e) => form.setValue("category", e.target.value)}
                        >
                          <option value="">Select a category</option>
                          {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                              {category.label}
                            </option>
                          ))}
                        </select>
                        {form.formState.errors.category && (
                          <p className="text-sm font-medium text-destructive">
                            {form.formState.errors.category.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Location Details</CardTitle>
                    <CardDescription>Where will your event take place?</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <FormField
                      control={form.control}
                      name="location.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Venue Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Central Conference Hall" {...field} />
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
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Street address" {...field} />
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
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City" {...field} />
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
                            <FormLabel>Country</FormLabel>
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
                
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing & Capacity</CardTitle>
                    <CardDescription>Set attendance details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is-free"
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        checked={isFree}
                        onChange={(e) => {
                          setIsFree(e.target.checked);
                          form.setValue("isFree", e.target.checked);
                          if (e.target.checked) {
                            form.setValue("price", 0);
                          }
                        }}
                      />
                      <Label htmlFor="is-free">This is a free event</Label>
                    </div>
                    
                    {!isFree && (
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ticket Price ($)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                placeholder="0.00" 
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                          <FormLabel>Event Capacity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              placeholder="Unlimited if left blank" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                            />
                          </FormControl>
                          <FormDescription>
                            How many people can attend?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Event Image</CardTitle>
                    <CardDescription>Upload an image for your event</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4 flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex justify-between pt-6">
                  <Link to="/">
                    <Button variant="outline">Cancel</Button>
                  </Link>
                  <Button type="submit">Create Event</Button>
                </div>
              </form>
            </Form>
          </div>
          
          <div>
            <div className="sticky top-20">
              <Card>
                <CardHeader>
                  <CardTitle>Event Preview</CardTitle>
                  <CardDescription>How your event will appear to attendees</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden bg-gray-100 h-40 mb-4 flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-gray-400" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">
                    {form.watch("title") || "Untitled Event"}
                  </h3>
                  
                  <div className="space-y-4 text-sm">
                    {selectedDate && (
                      <div className="flex items-start">
                        <CalendarIcon className="mr-2 h-4 w-4 mt-0.5" />
                        <div>
                          <div>{format(selectedDate, "EEEE, MMMM d, yyyy")}</div>
                          <div className="text-muted-foreground">{format(selectedDate, "h:mm a")}</div>
                        </div>
                      </div>
                    )}
                    
                    {form.watch("location.name") && (
                      <div className="flex items-start">
                        <MapPin className="mr-2 h-4 w-4 mt-0.5" />
                        <div>
                          <div>{form.watch("location.name")}</div>
                          {form.watch("location.city") && (
                            <div className="text-muted-foreground">
                              {form.watch("location.city")}, {form.watch("location.country")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {form.watch("price") !== undefined && (
                      <div className="flex items-center">
                        <DollarSign className="mr-2 h-4 w-4" />
                        <div>{isFree ? "Free" : `$${form.watch("price")?.toFixed(2)}`}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Tips for a Great Event</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Be clear and specific about what attendees can expect</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Add a compelling image that represents your event</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Provide detailed location information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Consider your pricing strategy carefully</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEventPage;

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import EventGrid from "@/components/EventGrid";
import CategoryChips from "@/components/CategoryChips";
import EventSearch from "@/components/EventSearch";
import Button from "@/components/Button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { mockEvents, currentUser } from "@/lib/data";
import { Event, EventCategory } from "@/types";
import { Calendar, CalendarIcon, Filter, MapPin, Search, X } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Helper function to filter events
const filterEvents = (
  events: Event[],
  searchQuery: string,
  selectedCategories: EventCategory[],
  selectedLocation: string,
  selectedDate: Date | undefined,
  isFreeOnly: boolean
): Event[] => {
  return events.filter(event => {
    // Search query
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Categories
    const matchesCategory = selectedCategories.length === 0 ||
      selectedCategories.some(cat => event.categories.includes(cat));
    
    // Location
    const matchesLocation = selectedLocation === "" ||
      `${event.location.city}, ${event.location.country}`.includes(selectedLocation);
    
    // Date
    const matchesDate = !selectedDate ||
      format(new Date(event.date.start), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    
    // Free only
    const matchesFree = !isFreeOnly || event.isFree;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesDate && matchesFree;
  });
};

const Events = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isFreeOnly, setIsFreeOnly] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [activeTab, setActiveTab] = useState("all");
  
  // Parse query parameters on mount
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const categoryParam = searchParams.get("category");
    
    if (categoryParam) {
      setSelectedCategories([categoryParam as EventCategory]);
    }
  }, [location.search]);
  
  // Filter events when filters change
  useEffect(() => {
    let result = filterEvents(
      mockEvents,
      searchQuery,
      selectedCategories,
      selectedLocation,
      selectedDate,
      isFreeOnly
    );
    
    // Sort events
    if (sortBy === "date") {
      result = [...result].sort((a, b) => 
        new Date(a.date.start).getTime() - new Date(b.date.start).getTime()
      );
    } else if (sortBy === "price") {
      result = [...result].sort((a, b) => {
        if (a.isFree && !b.isFree) return -1;
        if (!a.isFree && b.isFree) return 1;
        return (a.price || 0) - (b.price || 0);
      });
    }
    
    // Handle tabs
    if (activeTab === "attending") {
      result = result.filter(event => 
        currentUser.eventsAttending?.includes(event.id)
      );
    }
    
    setFilteredEvents(result);
  }, [
    searchQuery, 
    selectedCategories, 
    selectedLocation, 
    selectedDate, 
    isFreeOnly, 
    sortBy,
    activeTab
  ]);
  
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedLocation("");
    setSelectedDate(undefined);
    setIsFreeOnly(false);
  };
  
  const hasActiveFilters = 
    searchQuery !== "" || 
    selectedCategories.length > 0 || 
    selectedLocation !== "" || 
    selectedDate !== undefined || 
    isFreeOnly;
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Explore Events</h1>
              <p className="text-muted-foreground">
                Discover and connect with events in your community
              </p>
            </div>
            
            <Tabs 
              defaultValue="all" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="attending">My Events</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Search and Filter */}
          <div className="bg-secondary/40 rounded-lg p-4 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search events, organizers, locations..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <EventSearch
                  onLocationSelect={setSelectedLocation}
                  initialLocation={selectedLocation}
                  className="w-full md:w-48"
                />
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full md:w-auto justify-start text-left font-normal",
                        selectedDate && "text-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                    {selectedDate && (
                      <div className="p-3 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="w-full"
                          onClick={() => setSelectedDate(undefined)}
                        >
                          Clear Date
                        </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="w-full">
                <CategoryChips
                  selectedCategories={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Date: Soonest</SelectItem>
                    <SelectItem value="price">Price: Low-High</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(isFreeOnly && "bg-primary text-primary-foreground hover:bg-primary/90")}
                  onClick={() => setIsFreeOnly(!isFreeOnly)}
                  title="Show only free events"
                >
                  <span className="text-xs font-semibold">FREE</span>
                </Button>
                
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-muted-foreground"
                  >
                    <X className="mr-1 h-4 w-4" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Results */}
          <div className="mb-4">
            <h2 className="text-lg font-medium">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} found
              {hasActiveFilters && " matching your filters"}
            </h2>
            {activeTab === "attending" && filteredEvents.length === 0 && (
              <p className="text-muted-foreground">
                You're not attending any events yet.
              </p>
            )}
          </div>
          
          <EventGrid 
            events={filteredEvents} 
            columns={3} 
            emptyMessage={
              hasActiveFilters 
                ? "No events match your current filters. Try adjusting your search."
                : "No events found."
            }
          />
        </div>
      </main>
    </div>
  );
};

export default Events;

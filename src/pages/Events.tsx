import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, Calendar, MapPin, ChevronDown, ChevronUp, Grid2X2, LayoutList } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { mockEvents } from "@/lib/data/events";
import { Event, EventCategory } from "@/types";
import CategoryChips from "@/components/CategoryChips";
import EventCard from "@/components/EventCard";
import EventGrid from "@/components/EventGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import AttendeeTypeFilter from "@/components/AttendeeTypeFilter";
import LocationFilter from "@/components/LocationFilter";

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAttendeeType, setSelectedAttendeeType] = useState<string>("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("London");
  const [sortBy, setSortBy] = useState<string>("date-asc");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    // Get tab from URL or set default
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  useEffect(() => {
    let filtered = [...mockEvents];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.city.toLowerCase().includes(query) ||
          event.location.country.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) =>
        event.categories.includes(selectedCategory as EventCategory)
      );
    }

    if (selectedAttendeeType !== "all") {
      filtered = filtered.filter(
        (event) => event.attendeeType === selectedAttendeeType
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (event) => event.location.city === selectedLocation
      );
    }

    // Filter by tab selection
    if (activeTab === "upcoming") {
      filtered = filtered.filter(
        (event) => new Date(event.date.start) > new Date()
      );
    } else if (activeTab === "weekend") {
      const today = new Date();
      const nextWeekend = new Date(today);
      const dayOfWeek = today.getDay();
      const daysUntilWeekend = dayOfWeek === 6 ? 0 : dayOfWeek === 0 ? 6 : 6 - dayOfWeek;
      nextWeekend.setDate(today.getDate() + daysUntilWeekend);
      
      filtered = filtered.filter(
        (event) => {
          const eventDate = new Date(event.date.start);
          const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
          return isWeekend && eventDate >= today;
        }
      );
    } else if (activeTab === "free") {
      filtered = filtered.filter((event) => event.isFree);
    }

    filtered = sortEvents(filtered, sortBy);
    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategory, selectedAttendeeType, selectedLocation, sortBy, activeTab]);

  const sortEvents = (events: Event[], sortOption: string): Event[] => {
    switch (sortOption) {
      case "date-asc":
        return [...events].sort(
          (a, b) => new Date(a.date.start).getTime() - new Date(b.date.start).getTime()
        );
      case "date-desc":
        return [...events].sort(
          (a, b) => new Date(b.date.start).getTime() - new Date(a.date.start).getTime()
        );
      case "price-asc":
        return [...events].sort((a, b) => {
          const aPrice = a.isFree ? 0 : a.price || 0;
          const bPrice = b.isFree ? 0 : b.price || 0;
          return aPrice - bPrice;
        });
      case "price-desc":
        return [...events].sort((a, b) => {
          const aPrice = a.isFree ? 0 : a.price || 0;
          const bPrice = b.isFree ? 0 : b.price || 0;
          return bPrice - aPrice;
        });
      default:
        return events;
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    if (category !== "all") {
      searchParams.set("category", category);
    } else {
      searchParams.delete("category");
    }
    setSearchParams(searchParams);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    searchParams.set("tab", value);
    setSearchParams(searchParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAttendeeType("all");
    setSelectedLocation("London");
    setSortBy("date-asc");
    setSearchParams(new URLSearchParams());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-background pt-14">
      {/* Hero Section with increased top padding to account for smaller navbar */}
      <div className="relative bg-gradient-to-r from-[#EAF2FD] to-[#E6E9FF] dark:from-[#1F2937]/30 dark:to-[#1F1F3F]/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#2C5282] to-[#4A5568] dark:from-white dark:to-blue-200">
              Discover Islamic Events Near You
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Find community gatherings, educational seminars, religious ceremonies, and more happening in your area
            </p>
            
            <div className="relative max-w-2xl mx-auto">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative flex items-center overflow-hidden rounded-xl bg-white dark:bg-[#171727] border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-300 focus-within:ring-2 focus-within:ring-[#4A90E2] focus-within:border-transparent">
                  <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search for events..."
                    className="pl-12 py-6 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base transition-all duration-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    className="absolute right-1 top-1 bottom-1 px-6 rounded-lg bg-[#4A90E2] hover:bg-[#3A7BC8] text-white"
                  >
                    Search
                  </Button>
                </div>
              </form>
              
              <div className="flex flex-col md:flex-row gap-3 mt-4 justify-center items-center">
                <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2 border-[#4A90E2]/30 text-[#4A90E2] hover:bg-[#4A90E2]/5 hover:text-[#3A7BC8] hover:border-[#4A90E2]"
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {isFilterOpen ? (
                        <ChevronUp className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4 bg-white shadow-lg rounded-md border-[#4A90E2]/20" sideOffset={8}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-3 text-sm">Categories</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                          <div 
                            className={`cursor-pointer px-3 py-1.5 rounded-md hover:bg-secondary ${
                              selectedCategory === "all" ? "bg-secondary" : ""
                            }`}
                            onClick={() => handleCategorySelect("all")}
                          >
                            All Categories
                          </div>
                          {categories.map((category) => (
                            <div
                              key={category.value}
                              className={`cursor-pointer px-3 py-1.5 rounded-md hover:bg-secondary ${
                                selectedCategory === category.value ? "bg-secondary" : ""
                              }`}
                              onClick={() => handleCategorySelect(category.value)}
                            >
                              {category.label}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3 text-sm">Attendee Type</h3>
                        <AttendeeTypeFilter
                          selectedType={selectedAttendeeType as any}
                          onChange={(type) => setSelectedAttendeeType(type || "all")}
                          className="w-full"
                        />
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-3 text-sm">Location</h3>
                        <Select 
                          value={selectedLocation} 
                          onValueChange={setSelectedLocation}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="London">London</SelectItem>
                            <SelectItem value="Birmingham">Birmingham</SelectItem>
                            <SelectItem value="Manchester">Manchester</SelectItem>
                            <SelectItem value="Leeds">Leeds</SelectItem>
                            <SelectItem value="Bradford">Bradford</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <h3 className="font-medium mb-3 text-sm">Sort By</h3>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="date-asc">Date (Soonest first)</SelectItem>
                            <SelectItem value="date-desc">Date (Latest first)</SelectItem>
                            <SelectItem value="price-asc">Price (Low to High)</SelectItem>
                            <SelectItem value="price-desc">Price (High to Low)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2 pt-4 border-t">
                        <Button variant="outline" onClick={clearFilters} className="flex-1">
                          Clear All
                        </Button>
                        <Button 
                          onClick={() => setIsFilterOpen(false)} 
                          className="flex-1"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <div className="flex items-center space-x-2 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-md ${viewMode === 'grid' ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid2X2 className="h-4 w-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`rounded-md ${viewMode === 'list' ? 'bg-[#4A90E2]/10 text-[#4A90E2]' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <LayoutList className="h-4 w-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#4A90E2]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#7C3AED]/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs for quick filters */}
        <div className="mb-8">
          <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Browse Events</h2>
              <div className="hidden md:block">
                <TabsList className="bg-gray-100 dark:bg-gray-800 p-1">
                  <TabsTrigger value="all" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                    All Events
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="weekend" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                    This Weekend
                  </TabsTrigger>
                  <TabsTrigger value="free" className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm">
                    Free Events
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="md:hidden w-full mt-4">
                <Select value={activeTab} onValueChange={handleTabChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="weekend">This Weekend</SelectItem>
                    <SelectItem value="free">Free Events</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Category chips */}
            <div className="mb-6">
              <ScrollArea className="w-full pb-4">
                <div className="flex space-x-2">
                  <Badge 
                    className={`cursor-pointer px-3 py-2 ${selectedCategory === 'all' ? 'bg-[#4A90E2] hover:bg-[#3A7BC8]' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                    onClick={() => handleCategorySelect('all')}
                  >
                    All
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category.value}
                      className={`cursor-pointer px-3 py-2 ${selectedCategory === category.value ? 'bg-[#4A90E2] hover:bg-[#3A7BC8]' : 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                      onClick={() => handleCategorySelect(category.value)}
                    >
                      {category.label}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <TabsContent value="all" className="mt-0">
              {filteredEvents.length > 0 ? (
                <div>
                  <div className="text-sm text-gray-500 mb-4">
                    Found {filteredEvents.length} events {selectedCategory !== 'all' && `in ${selectedCategory}`}
                  </div>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredEvents.map((event) => (
                        <div key={event.id} className="h-full">
                          <EventCard event={event} className="h-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.map((event) => (
                        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-all border-gray-200 dark:border-gray-700">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/4 aspect-video sm:aspect-square">
                              <img
                                src="/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png"
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-4 sm:p-6">
                              <div className="flex flex-col h-full">
                                <div className="mb-2 flex items-center gap-2">
                                  <Badge variant="outline" className="bg-primary/10 border-0 text-xs">
                                    {event.categories[0]}
                                  </Badge>
                                  {event.isFree ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-0 text-xs">
                                      Free
                                    </Badge>
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {event.price ? `From £${event.price}` : ''}
                                    </span>
                                  )}
                                </div>
                                
                                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                                
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                  {event.shortDescription}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-auto">
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-[#4A90E2]" />
                                    {formatDate(event.date.start)}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="mr-2 h-4 w-4 text-[#4A90E2]" />
                                    {event.location.city}, {event.location.country}
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={event.organizer.avatar}
                                      alt={event.organizer.name}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-sm font-medium">{event.organizer.name}</span>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    className="text-[#4A90E2] border-[#4A90E2]/30 hover:bg-[#4A90E2]/5 hover:text-[#3A7BC8] hover:border-[#4A90E2]"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No events found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button 
                    className="mt-6" 
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="mt-0">
              {filteredEvents.filter(
                (event) => new Date(event.date.start) > new Date()
              ).length > 0 ? (
                <div>
                  <div className="text-sm text-gray-500 mb-4">
                    Found {filteredEvents.filter(
                      (event) => new Date(event.date.start) > new Date()
                    ).length} events {selectedCategory !== 'all' && `in ${selectedCategory}`}
                  </div>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredEvents.filter(
                        (event) => new Date(event.date.start) > new Date()
                      ).map((event) => (
                        <div key={event.id} className="h-full">
                          <EventCard event={event} className="h-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.filter(
                        (event) => new Date(event.date.start) > new Date()
                      ).map((event) => (
                        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-all border-gray-200 dark:border-gray-700">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/4 aspect-video sm:aspect-square">
                              <img
                                src="/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png"
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-4 sm:p-6">
                              <div className="flex flex-col h-full">
                                <div className="mb-2 flex items-center gap-2">
                                  <Badge variant="outline" className="bg-primary/10 border-0 text-xs">
                                    {event.categories[0]}
                                  </Badge>
                                  {event.isFree ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-0 text-xs">
                                      Free
                                    </Badge>
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {event.price ? `From £${event.price}` : ''}
                                    </span>
                                  )}
                                </div>
                                
                                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                                
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                  {event.shortDescription}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-auto">
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-[#4A90E2]" />
                                    {formatDate(event.date.start)}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="mr-2 h-4 w-4 text-[#4A90E2]" />
                                    {event.location.city}, {event.location.country}
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={event.organizer.avatar}
                                      alt={event.organizer.name}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-sm font-medium">{event.organizer.name}</span>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    className="text-[#4A90E2] border-[#4A90E2]/30 hover:bg-[#4A90E2]/5 hover:text-[#3A7BC8] hover:border-[#4A90E2]"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No events found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button 
                    className="mt-6" 
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="weekend" className="mt-0">
              {filteredEvents.filter(
                (event) => {
                  const today = new Date();
                  const eventDate = new Date(event.date.start);
                  const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
                  return isWeekend && eventDate >= today;
                }
              ).length > 0 ? (
                <div>
                  <div className="text-sm text-gray-500 mb-4">
                    Found {filteredEvents.filter(
                      (event) => {
                        const today = new Date();
                        const eventDate = new Date(event.date.start);
                        const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
                        return isWeekend && eventDate >= today;
                      }
                    ).length} events {selectedCategory !== 'all' && `in ${selectedCategory}`}
                  </div>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {filteredEvents.filter(
                        (event) => {
                          const today = new Date();
                          const eventDate = new Date(event.date.start);
                          const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
                          return isWeekend && eventDate >= today;
                        }
                      ).map((event) => (
                        <div key={event.id} className="h-full">
                          <EventCard event={event} className="h-full" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredEvents.filter(
                        (event) => {
                          const today = new Date();
                          const eventDate = new Date(event.date.start);
                          const isWeekend = eventDate.getDay() === 0 || eventDate.getDay() === 6;
                          return isWeekend && eventDate >= today;
                        }
                      ).map((event) => (
                        <Card key={event.id} className="overflow-hidden hover:shadow-md transition-all border-gray-200 dark:border-gray-700">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/4 aspect-video sm:aspect-square">
                              <img
                                src="/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png"
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="flex-1 p-4 sm:p-6">
                              <div className="flex flex-col h-full">
                                <div className="mb-2 flex items-center gap-2">
                                  <Badge variant="outline" className="bg-primary/10 border-0 text-xs">
                                    {event.categories[0]}
                                  </Badge>
                                  {event.isFree ? (
                                    <Badge variant="outline" className="bg-green-50 text-green-600 border-0 text-xs">
                                      Free
                                    </Badge>
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {event.price ? `From £${event.price}` : ''}
                                    </span>
                                  )}
                                </div>
                                
                                <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                                
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                                  {event.shortDescription}
                                </p>
                                
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-auto">
                                  <div className="flex items-center">
                                    <Calendar className="mr-2 h-4 w-4 text-[#4A90E2]" />
                                    {formatDate(event.date.start)}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="mr-2 h-4 w-4 text-[#4A90E2]" />
                                    {event.location.city}, {event.location.country}
                                  </div>
                                </div>
                                
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                  <div className="flex items-center space-x-2">
                                    <img
                                      src={event.organizer.avatar}
                                      alt={event.organizer.name}
                                      className="w-8 h-8 rounded-full"
                                    />
                                    <span className="text-sm font-medium">{event.organizer.name}</span>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    className="text-[#4A90E2] border-[#4A90E2]/30 hover:bg-[#4A90E2]/5 hover:text-[#3A7BC8] hover:border-[#4A90E2]"
                                  >
                                    View Details
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <Calendar className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No events found</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md">
                    We couldn't find any events matching your search criteria. Try adjusting your filters or search terms.
                  </p>
                  <Button 
                    className="mt-6" 
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;


import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, ChevronUp, ChevronDown, Grid2X2, LayoutList } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { mockEvents } from "@/lib/data/events";
import { Event, EventCategory, AttendeeType } from "@/types";
import CategoryChips from "@/components/CategoryChips";
import EventCard from "@/components/EventCard";
import CategoryRow from "@/components/CategoryRow";
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
import AttendeeTypeFilter from "@/components/AttendeeTypeFilter";
import { ScrollArea } from "@/components/ui/scroll-area";

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAttendeeType, setSelectedAttendeeType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-asc");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);
  const [compactFilters, setCompactFilters] = useState<boolean>(false);
  const [categoryGroups, setCategoryGroups] = useState<Record<string, Event[]>>({});
  const [viewMode, setViewMode] = useState<"grid" | "carousel">("carousel");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
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

    filtered = sortEvents(filtered, sortBy);
    setFilteredEvents(filtered);

    const groups: Record<string, Event[]> = {};
    
    if (selectedCategory === "all") {
      filtered.forEach(event => {
        const primaryCategory = event.categories[0];
        if (!groups[primaryCategory]) {
          groups[primaryCategory] = [];
        }
        groups[primaryCategory].push(event);
      });
    } else {
      groups[selectedCategory] = filtered;
    }
    
    setCategoryGroups(groups);
  }, [searchQuery, selectedCategory, selectedAttendeeType, sortBy]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAttendeeType("all");
    setSortBy("date-asc");
    setSearchParams(new URLSearchParams());
  };

  const toggleCompactFilters = () => {
    setCompactFilters(!compactFilters);
  };

  const renderEvents = () => {
    const categories = Object.keys(categoryGroups);
    
    if (categories.length === 0) {
      return (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          No events found matching your filters. Try adjusting your search criteria.
        </div>
      );
    }

    if (viewMode === "carousel") {
      return categories.map((category) => (
        <CategoryRow 
          key={category}
          title={`${category} Events`}
          description={`Browse ${category} events in your area`}
          itemWidth="lg:w-[280px]"
          categorySlug={category}
        >
          {categoryGroups[category].map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </CategoryRow>
      ));
    } else {
      // Grid mode - show all events in a unified grid
      return categories.map((category) => (
        <div key={category} className="mb-12">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight capitalize">{category} Events</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Browse {category} events in your area
            </p>
          </div>
          
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categoryGroups[category].map((event) => (
              <EventCard key={event.id} event={event} className="h-full" />
            ))}
          </div>
        </div>
      ));
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Events</h1>
        <p className="text-muted-foreground">
          Discover Islamic events in your community
        </p>
      </div>

      <div className="w-full mb-8 relative">
        <form onSubmit={handleSearch} className="bg-gradient-to-r from-[#F2FBFE] to-[#E6E9FF] dark:from-[#21214B] dark:to-[#171733] p-1.5 rounded-xl shadow-soft">
          <div className="relative flex items-center overflow-hidden rounded-lg bg-white dark:bg-[#171727] transition-all duration-300 focus-within:ring-2 focus-within:ring-[#4A90E2]">
            <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-10 py-6 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base transition-all duration-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button 
              type="submit" 
              className="absolute right-0 h-full px-4 rounded-l-none bg-[#4A90E2] hover:bg-[#3A7BC8] text-white"
            >
              Search
            </Button>
          </div>
        </form>
      </div>

      <div className={`flex flex-col ${!compactFilters ? 'lg:flex-row' : ''} gap-6`}>
        {!compactFilters && (
          <div className="hidden lg:block w-64 space-y-6 transition-all duration-300">
            <>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium mb-3">Categories</h3>
                </div>
                <div className="space-y-2">
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
                <h3 className="font-medium mb-3">Attendee Type</h3>
                <AttendeeTypeFilter
                  selectedType={selectedAttendeeType as any}
                  onChange={(type) => setSelectedAttendeeType(type || "all")}
                  className="w-full"
                />
              </div>

              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
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

              <Button variant="outline" onClick={clearFilters} className="w-full">
                Clear Filters
              </Button>
            </>
          </div>
        )}
        
        <div className="lg:hidden flex justify-between items-center gap-3 mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>
                  Refine your event search with filters
                </SheetDescription>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-180px)] py-4">
                <div className="space-y-6 pr-6">
                  <div>
                    <h3 className="font-medium mb-3">Categories</h3>
                    <div className="space-y-2">
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
                    <h3 className="font-medium mb-3">Attendee Type</h3>
                    <AttendeeTypeFilter
                      selectedType={selectedAttendeeType as any}
                      onChange={(type) => setSelectedAttendeeType(type || "all")}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Sort By</h3>
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
                </div>
              </ScrollArea>
              <SheetFooter className="pt-4">
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear Filters
                </Button>
                <SheetClose asChild>
                  <Button className="w-full">Apply Filters</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          
          <Button 
            variant="ghost" 
            onClick={toggleCompactFilters}
            className="ml-auto text-[#4A90E2] hover:text-[#3A7BC8] hover:bg-[#4A90E2]/10"
          >
            {compactFilters ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronUp className="h-4 w-4 mr-1" />}
            {compactFilters ? "Show filters" : "Hide filters"}
          </Button>
        </div>

        <div className={`${compactFilters ? 'w-full' : 'flex-1'}`}>
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-4">
                {selectedCategory !== "all" 
                  ? `${selectedCategory} Events (${filteredEvents.length})` 
                  : `All Events (${filteredEvents.length})`}
              </h2>
              {selectedCategory === "all" && (
                <ScrollArea className="w-full whitespace-nowrap mb-6">
                  <CategoryChips
                    selectedCategories={[selectedCategory !== "all" ? selectedCategory as EventCategory : null].filter(Boolean) as EventCategory[]}
                    onChange={(categories) => {
                      if (categories.length > 0) {
                        handleCategorySelect(categories[0]);
                      } else {
                        handleCategorySelect("all");
                      }
                    }}
                    singleSelect={true}
                  />
                </ScrollArea>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {/* View mode toggle - only visible on desktop */}
              <div className="hidden md:flex items-center p-1 bg-secondary/50 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-md ${viewMode === 'carousel' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setViewMode('carousel')}
                >
                  <LayoutList className="h-4 w-4 mr-1" />
                  Rows
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-md ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid2X2 className="h-4 w-4 mr-1" />
                  Grid
                </Button>
              </div>
            
              {!compactFilters && (
                <div className="hidden lg:block">
                  <Button 
                    variant="ghost" 
                    onClick={toggleCompactFilters}
                    className="text-[#4A90E2] hover:text-[#3A7BC8] hover:bg-[#4A90E2]/10"
                  >
                    <ChevronUp className="h-4 w-4 mr-1" />
                    Hide filters
                  </Button>
                </div>
              )}
              
              {compactFilters && (
                <Button 
                  variant="ghost" 
                  onClick={toggleCompactFilters}
                  className="text-[#4A90E2] hover:text-[#3A7BC8] hover:bg-[#4A90E2]/10"
                >
                  <ChevronDown className="h-4 w-4 mr-1" />
                  Show filters
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-12 w-full">
            {renderEvents()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

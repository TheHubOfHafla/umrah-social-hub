
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { categories, mockEvents } from "@/lib/data";
import { Event, EventCategory } from "@/types";
import CategoryChips from "@/components/CategoryChips";
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
import AttendeeTypeFilter from "@/components/AttendeeTypeFilter";
import { ScrollArea } from "@/components/ui/scroll-area";

const EventsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedAttendeeType, setSelectedAttendeeType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("date-asc");
  const [filteredEvents, setFilteredEvents] = useState<Event[]>(mockEvents);

  // Get category from URL params on initial load
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Filter events based on search query, category, and attendee type
  useEffect(() => {
    let filtered = [...mockEvents];

    // Filter by search query
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

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((event) =>
        event.categories.includes(selectedCategory as EventCategory)
      );
    }

    // Filter by attendee type
    if (selectedAttendeeType !== "all") {
      filtered = filtered.filter(
        (event) => event.attendeeType === selectedAttendeeType
      );
    }

    // Sort events
    filtered = sortEvents(filtered, sortBy);

    setFilteredEvents(filtered);
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
    // Just update the state, the useEffect will handle filtering
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedAttendeeType("all");
    setSortBy("date-asc");
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Events</h1>
        <p className="text-muted-foreground">
          Discover Islamic events in your community
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar for larger screens */}
        <div className="hidden lg:block w-64 space-y-6">
          <div>
            <h3 className="font-medium mb-3">Search</h3>
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

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

          <Button variant="outline" onClick={clearFilters} className="w-full">
            Clear Filters
          </Button>
        </div>

        {/* Filter bar for mobile */}
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
        </div>

        {/* Main content area */}
        <div className="flex-1">
          <div className="mb-6">
            {selectedCategory !== "all" ? (
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {selectedCategory} Events ({filteredEvents.length})
              </h2>
            ) : (
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  All Events ({filteredEvents.length})
                </h2>
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
              </div>
            )}
          </div>

          <EventGrid 
            events={filteredEvents} 
            columns={3}
            showEmpty={true}
            emptyMessage="No events found matching your filters. Try adjusting your search criteria." 
          />
        </div>
      </div>
    </div>
  );
};

export default EventsPage;

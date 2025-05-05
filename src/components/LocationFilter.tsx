
import { useState, useEffect } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Common cities for Islamic events
const popularCities = [
  "London",
  "Birmingham",
  "Manchester",
  "Leicester",
  "Bradford",
  "Leeds",
  "Glasgow",
  "Cardiff",
  "Sheffield",
  "Bolton",
  "Blackburn",
  "Dewsbury",
];

const eventFilters = [
  { id: "all", label: "All" },
  { id: "for-you", label: "For you" },
  { id: "today", label: "Today" },
  { id: "this-weekend", label: "This weekend" },
  { id: "free", label: "Free" },
  { id: "charity", label: "Charity" },
  { id: "education", label: "Education" },
  { id: "mosque", label: "Mosque" },
  { id: "family", label: "Family" },
];

interface LocationFilterProps {
  onLocationChange?: (location: string) => void;
  onFilterChange?: (filter: string) => void;
  className?: string;
}

const LocationFilter = ({
  onLocationChange,
  onFilterChange,
  className,
}: LocationFilterProps) => {
  const [selectedLocation, setSelectedLocation] = useState("London");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [showShadow, setShowShadow] = useState(false);

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setIsOpen(false);
    if (onLocationChange) {
      onLocationChange(location);
    }
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
    if (onFilterChange) {
      onFilterChange(filterId);
    }
  };

  // Monitor scroll of the filters row to show shadow when needed
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.getElementById('filters-scroll-area');
      if (scrollArea) {
        setShowShadow(scrollArea.scrollLeft > 0);
      }
    };

    const scrollArea = document.getElementById('filters-scroll-area');
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
      return () => scrollArea.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className={cn("w-full bg-white dark:bg-background shadow-sm", className)}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col space-y-4">
          {/* Location selector */}
          <div className="flex items-center">
            <h2 className="text-base font-medium mr-2">Browsing events in</h2>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 px-1.5 py-1 h-8 rounded-md hover:bg-primary/5 font-medium text-primary hover:text-primary/90"
                >
                  <MapPin className="h-4 w-4 mr-1" />
                  {selectedLocation}
                  <ChevronDown className="h-3.5 w-3.5 text-primary/70 ml-0.5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-60" align="start">
                <ScrollArea className="h-[min(350px,70vh)]">
                  <div className="p-2">
                    {popularCities.map((city) => (
                      <button
                        key={city}
                        className={cn(
                          "w-full text-left flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-secondary",
                          selectedLocation === city && "bg-primary/10 text-primary font-medium"
                        )}
                        onClick={() => handleLocationSelect(city)}
                      >
                        {city}
                        {selectedLocation === city && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          {/* Filters row */}
          <div className="relative">
            <ScrollArea id="filters-scroll-area" className="pb-2 max-w-full">
              <div className="flex space-x-1.5 min-w-max pb-1">
                {eventFilters.map((filter) => (
                  <Button
                    key={filter.id}
                    variant={selectedFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    className={cn(
                      "text-sm px-3.5 py-1 h-8 whitespace-nowrap transition-all duration-200",
                      selectedFilter === filter.id
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "text-foreground/80 hover:text-foreground hover:bg-secondary/80"
                    )}
                    onClick={() => handleFilterSelect(filter.id)}
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </ScrollArea>

            {/* Show gradient shadow when scrolling */}
            <div className={cn(
              "absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent pointer-events-none transition-opacity duration-300",
              showShadow ? "opacity-100" : "opacity-0"
            )} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationFilter;

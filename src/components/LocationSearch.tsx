
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Mock locations for demo
const popularLocations = [
  "London, UK",
  "Manchester, UK",
  "Birmingham, UK",
  "Leeds, UK",
  "Glasgow, UK",
  "Edinburgh, UK",
  "Liverpool, UK",
];

interface LocationSearchProps {
  onLocationSelect: (location: string) => void;
  className?: string;
  initialLocation?: string;
}

const LocationSearch = ({
  onLocationSelect,
  className,
  initialLocation = "",
}: LocationSearchProps) => {
  const [location, setLocation] = useState(initialLocation);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLocations = popularLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    onLocationSelect(selectedLocation);
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal bg-background border-input"
          >
            <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
            {location || "Select location"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <div className="flex items-center border-b p-2">
            <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
            <Input
              placeholder="Search location..."
              className="border-0 p-2 shadow-none focus-visible:ring-0"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredLocations.length > 0 ? (
              <div className="grid gap-1 p-2">
                {filteredLocations.map((loc) => (
                  <Button
                    key={loc}
                    variant="ghost"
                    className="justify-start font-normal"
                    onClick={() => handleLocationSelect(loc)}
                  >
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    {loc}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No locations found
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSearch;

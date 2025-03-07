
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { MapPin, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredLocations = popularLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    onLocationSelect(selectedLocation);
    setIsOpen(false);
    setSearchTerm("");
  };

  const clearSearch = () => {
    setSearchTerm("");
    inputRef.current?.focus();
  };

  // Effect to focus input when popover opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  return (
    <div className={cn("relative", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className="relative group">
            <div className={cn(
              "absolute inset-0 rounded-md opacity-70 group-hover:opacity-100 transition-all duration-500 -z-10",
              "bg-gradient-to-r from-purple-500/20 via-purple-300/20 to-purple-500/20",
              "blur-md group-hover:blur-lg"
            )} />
            <Input
              type="text"
              value={location || "Search location..."}
              readOnly
              onClick={() => setIsOpen(true)}
              className={cn(
                "w-full pl-10 pr-4 cursor-pointer transition-all duration-300",
                "border-purple-200 hover:border-purple-400",
                "bg-background/80 backdrop-blur-sm",
                "hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              )}
            />
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500 transition-all duration-300 group-hover:text-purple-600" />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Search className="h-4 w-4 text-purple-400 transition-all duration-300 group-hover:text-purple-600 group-hover:rotate-15 group-hover:scale-110" />
            </div>
            
            <div className={cn(
              "absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-purple-600 to-purple-400",
              "transform transition-all duration-500 rounded-full",
              "w-0 group-hover:w-full"
            )} />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 border-purple-200 shadow-[0_5px_20px_rgba(139,92,246,0.2)]" align="start">
          <div className="flex items-center border-b border-purple-100 p-2 bg-gradient-to-r from-purple-50 to-white">
            <Search className="ml-2 h-4 w-4 shrink-0 text-purple-500" />
            <Input
              ref={inputRef}
              placeholder="Search location..."
              className="border-0 p-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={clearSearch}
                  className="mr-2 p-1 rounded-full hover:bg-purple-100 transition-colors"
                >
                  <X className="h-4 w-4 text-purple-500" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          <div className="max-h-60 overflow-auto backdrop-blur-sm">
            <AnimatePresence>
              {filteredLocations.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-1 p-2"
                >
                  {filteredLocations.map((loc, index) => (
                    <motion.div
                      key={loc}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-normal text-left hover:bg-purple-50 hover:text-purple-700 group"
                        onClick={() => handleLocationSelect(loc)}
                      >
                        <MapPin className="mr-2 h-4 w-4 text-purple-400 group-hover:text-purple-500" />
                        <span className="truncate">{loc}</span>
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-sm text-muted-foreground"
                >
                  <p className="text-purple-400">No locations found</p>
                  <p className="text-xs mt-1 text-muted-foreground">Try a different search term</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default LocationSearch;

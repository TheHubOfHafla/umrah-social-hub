
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { getFeaturedEvents } from "@/lib/data";

// Mock events for search results
const sampleEvents = getFeaturedEvents();

interface EventSearchProps {
  onSearch: (query: string) => void;
  className?: string;
}

const EventSearch = ({
  onSearch,
  className,
}: EventSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredEvents = sampleEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  ).slice(0, 5); // Limit to 5 results

  const handleSearch = (query: string) => {
    onSearch(query);
    setIsOpen(false);
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
              value={searchTerm || "Search events..."}
              readOnly={!isOpen}
              onClick={() => setIsOpen(true)}
              className={cn(a
                "w-full pl-10 pr-4 cursor-pointer transition-all duration-300",
                "border-purple-200 hover:border-purple-400",
                "bg-background/80 backdrop-blur-sm",
                "hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              )}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-500 transition-all duration-300 group-hover:text-purple-600" />
            
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
              placeholder="Search events..."
              className="border-0 p-2 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchTerm) {
                  handleSearch(searchTerm);
                }
              }}
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
              {filteredEvents.length > 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-1 p-2"
                >
                  {filteredEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.2 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start font-normal text-left hover:bg-purple-50 hover:text-purple-700 group"
                        onClick={() => handleSearch(event.title)}
                      >
                        <div className="flex items-center w-full">
                          <div className="rounded-md bg-purple-100 p-1 mr-2">
                            {event.categories[0] === 'education' && <Tag className="h-4 w-4 text-purple-600" />}
                            {event.categories[0] === 'charity' && <Tag className="h-4 w-4 text-purple-600" />}
                            {event.categories[0] === 'community' && <Calendar className="h-4 w-4 text-purple-600" />}
                          </div>
                          <div className="flex flex-col overflow-hidden">
                            <span className="truncate font-medium">{event.title}</span>
                            <span className="text-xs text-muted-foreground truncate">{event.location.city}, {event.location.country}</span>
                          </div>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: filteredEvents.length * 0.05, duration: 0.2 }}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-center text-purple-600 hover:bg-purple-50 hover:text-purple-700 text-sm mt-2 border-t border-purple-100/50 pt-2"
                      onClick={() => handleSearch(searchTerm)}
                    >
                      Search for "{searchTerm}"
                    </Button>
                  </motion.div>
                </motion.div>
              ) : searchTerm ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 text-center text-sm text-muted-foreground"
                >
                  <p className="text-purple-400">No events found</p>
                  <Button
                    variant="ghost"
                    className="w-full justify-center text-purple-600 hover:bg-purple-50 hover:text-purple-700 text-sm mt-2"
                    onClick={() => handleSearch(searchTerm)}
                  >
                    Search for "{searchTerm}"
                  </Button>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4"
                >
                  <p className="text-sm text-center text-muted-foreground mb-2">Try searching for:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {['Quran', 'Charity', 'Community'].map((term, i) => (
                      <motion.button
                        key={term}
                        className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
                        onClick={() => setSearchTerm(term)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EventSearch;

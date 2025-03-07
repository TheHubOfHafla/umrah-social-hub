
import { Search, ChevronUp, ChevronDown, BarChart3, PieChart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

interface EventsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: EventCategory | "all";
  setCategoryFilter: (category: EventCategory | "all") => void;
  compact?: boolean;
  onToggleCompact?: () => void;
  viewMode?: 'list' | 'chart';
  onViewModeChange?: (mode: 'list' | 'chart') => void;
}

const EventsFilter = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  compact = false,
  onToggleCompact,
  viewMode = 'list',
  onViewModeChange
}: EventsFilterProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative max-w-sm group">
        <div className={`absolute inset-0 bg-background rounded-md transition-all duration-300 ${isFocused ? 'shadow-md ring-1 ring-primary/20' : 'shadow-sm'}`}></div>
        <Search className={`absolute left-2.5 top-2.5 h-4 w-4 transition-colors duration-300 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`} />
        <Input
          type="text"
          placeholder="Search events..."
          className="pl-8 bg-transparent relative z-10 border-input transition-all duration-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-primary z-10"
            onClick={() => setSearchQuery("")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </motion.button>
        )}
      </div>
      
      <motion.div 
        className="flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {!compact && (
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as EventCategory | "all")}
          >
            <SelectTrigger className="w-[180px] transition-all duration-300 hover:border-primary/50 focus:ring-primary/20">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {onViewModeChange && (
          <div className="flex rounded-md border overflow-hidden">
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1.5 rounded-none transition-all ${viewMode === 'list' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'text-muted-foreground'}`}
              onClick={() => onViewModeChange('list')}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                <span className="text-xs">List</span>
              </motion.div>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`px-3 py-1.5 rounded-none transition-all ${viewMode === 'chart' ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]' : 'text-muted-foreground'}`}
              onClick={() => onViewModeChange('chart')}
            >
              <motion.div
                whileTap={{ scale: 0.95 }}
                className="flex items-center"
              >
                <PieChart className="h-4 w-4 mr-1" />
                <span className="text-xs">Charts</span>
              </motion.div>
            </Button>
          </div>
        )}
        
        {onToggleCompact && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleCompact}
            className="text-[#8B5CF6] hover:text-[#7C5AE2] hover:bg-[#8B5CF6]/10 transition-all duration-300"
          >
            <motion.div 
              initial={{ rotate: 0 }}
              animate={{ rotate: compact ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {compact ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </motion.div>
            <span className="ml-1 text-xs">{compact ? "Show filters" : "Hide filters"}</span>
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default EventsFilter;

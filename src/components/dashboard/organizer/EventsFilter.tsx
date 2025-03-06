
import { Search, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface EventsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: EventCategory | "all";
  setCategoryFilter: (category: EventCategory | "all") => void;
  compact?: boolean;
  onToggleCompact?: () => void;
}

const EventsFilter = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  compact = false,
  onToggleCompact,
}: EventsFilterProps) => {
  return (
    <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search events..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        {!compact && (
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value as EventCategory | "all")}
          >
            <SelectTrigger className="w-[180px]">
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
        
        {onToggleCompact && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleCompact}
            className="text-[#8B5CF6] hover:text-[#7C5AE2] hover:bg-[#8B5CF6]/10"
          >
            {compact ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            <span className="ml-1 text-xs">{compact ? "Show filters" : "Hide filters"}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventsFilter;

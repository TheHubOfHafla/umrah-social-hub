
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";

interface EventsFilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: EventCategory | "all";
  setCategoryFilter: (category: EventCategory | "all") => void;
}

const EventsFilter = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
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
    </div>
  );
};

export default EventsFilter;

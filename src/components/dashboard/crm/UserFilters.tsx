
import React from "react";
import { Filter, MapPin, Tag, Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { EventCategory } from "@/types";

interface UserFiltersProps {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cities: string[];
  categories: { value: EventCategory; label: string }[];
}

const UserFilters = ({
  selectedCity,
  setSelectedCity,
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  cities,
  categories
}: UserFiltersProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="city-filter">Location</Label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger id="city-filter" className="w-full">
            <SelectValue placeholder="Select city" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                  {city}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category-filter">Event Interest</Label>
        <Select 
          value={selectedCategory || ""}
          onValueChange={(value) => setSelectedCategory(value || null)}
        >
          <SelectTrigger id="category-filter" className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center">
                  <Tag className="mr-2 h-4 w-4 text-muted-foreground" />
                  {category.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name, email, or phone"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default UserFilters;

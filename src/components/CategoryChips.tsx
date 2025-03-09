
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data/categories";

interface CategoryChipsProps {
  selectedCategories: EventCategory[];
  onChange: (categories: EventCategory[]) => void;
  className?: string;
  singleSelect?: boolean;
}

const CategoryChips = ({
  selectedCategories,
  onChange,
  className,
  singleSelect = false,
}: CategoryChipsProps) => {
  const [hoveredCategory, setHoveredCategory] = useState<EventCategory | null>(null);

  const handleCategoryClick = (category: EventCategory) => {
    if (singleSelect) {
      onChange([category]);
      return;
    }

    const isSelected = selectedCategories.includes(category);
    if (isSelected) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="hidden md:flex space-x-2 py-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.value);
            const isHovered = hoveredCategory === category.value;
            
            return (
              <button
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                onMouseEnter={() => setHoveredCategory(category.value)}
                onMouseLeave={() => setHoveredCategory(null)}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-300",
                  "transform hover:scale-105 hover:shadow-md active:scale-95",
                  "border border-transparent",
                  isSelected
                    ? "bg-[#8B5CF6] text-white shadow-sm" // Changed from primary to purple
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  isHovered && !isSelected && "bg-secondary/90 border-[#8B5CF6]/30", // Added purple border on hover
                  "relative overflow-hidden",
                )}
              >
                {/* Animated background effect on hover */}
                <span 
                  className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300",
                    "bg-gradient-to-r from-[#8B5CF6]/10 via-secondary/5 to-transparent", // Changed from primary to purple
                    isHovered && !isSelected && "opacity-100"
                  )}
                />
                <span className="relative z-10">{category.label}</span>
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" className="h-2" />
      </ScrollArea>
    </div>
  );
};

export default CategoryChips;


import { useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";

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
        <div className="flex space-x-2 py-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.value);
            return (
              <button
                key={category.value}
                onClick={() => handleCategoryClick(category.value)}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  "hover:bg-secondary/80",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {category.label}
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

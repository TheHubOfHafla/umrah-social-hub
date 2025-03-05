
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryCarouselProps {
  selectedCategories: EventCategory[];
  onChange: (categories: EventCategory[]) => void;
  className?: string;
  singleSelect?: boolean;
}

const CategoryCarousel = ({
  selectedCategories,
  onChange,
  className,
  singleSelect = false,
}: CategoryCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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

  const checkScrollability = () => {
    if (!carouselRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    
    const scrollAmount = 200; // Adjust scroll amount as needed
    const currentScroll = carouselRef.current.scrollLeft;
    
    carouselRef.current.scrollTo({
      left: direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  // Check scrollability initially and on window resize
  useEffect(() => {
    checkScrollability();
    window.addEventListener('resize', checkScrollability);
    return () => window.removeEventListener('resize', checkScrollability);
  }, []);

  // Check scrollability when carousel content changes
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    checkScrollability();
    carousel.addEventListener('scroll', checkScrollability);
    
    return () => carousel.removeEventListener('scroll', checkScrollability);
  }, [carouselRef.current]);

  return (
    <div className={cn("w-full relative", className)}>
      {canScrollLeft && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-primary/20"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto scrollbar-hide py-2 px-4 snap-x scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category.value);
          return (
            <button
              key={category.value}
              onClick={() => handleCategoryClick(category.value)}
              className={cn(
                "inline-flex items-center rounded-full px-5 py-2 text-sm font-medium transition-colors whitespace-nowrap mx-1 snap-start",
                "hover:bg-secondary/80 flex-shrink-0",
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
      
      {canScrollRight && (
        <Button 
          variant="outline" 
          size="icon" 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 backdrop-blur-sm border-primary/20"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default CategoryCarousel;

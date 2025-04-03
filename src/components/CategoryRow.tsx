
import { ReactNode } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

interface CategoryRowProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  itemWidth?: string;
  showControls?: boolean;
  categorySlug?: string;
}

const CategoryRow = ({
  title,
  description,
  children,
  className,
  itemWidth = "w-full md:w-[300px]", // Fixed width for consistency
  showControls = true,
  categorySlug,
}: CategoryRowProps) => {
  const isArray = Array.isArray(children);
  const itemCount = isArray ? children.length : 1;
  
  // Use a custom grid for desktop instead of carousel when there are 4 or fewer items
  const useDesktopGrid = itemCount <= 4;
  
  return (
    <div className={cn("mb-12", className)}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight capitalize">{title}</h2>
          {description && (
            <p className="text-muted-foreground text-sm mt-1">{description}</p>
          )}
        </div>
        
        {categorySlug && (
          <Link 
            to={`/events?category=${categorySlug}`} 
            className="hidden md:flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* Desktop Grid Layout (hidden on mobile) */}
      {useDesktopGrid && (
        <div className="hidden md:grid gap-6 grid-cols-2 lg:grid-cols-4">
          {isArray && children.map((child, index) => (
            <div key={index} className="h-full">
              {child}
            </div>
          ))}
        </div>
      )}

      {/* Carousel for Mobile (always) and Desktop (only when more than 4 items) */}
      <div className={cn(useDesktopGrid ? "md:hidden" : "")}>
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <div className="flex items-center w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {isArray
                ? children.map((child, index) => (
                    <CarouselItem
                      key={index}
                      className={cn(
                        "pl-2 md:pl-4",
                        // Consistent sizing with fixed widths at each breakpoint
                        "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5",
                        itemWidth
                      )}
                    >
                      <div className="h-full w-full">
                        {child}
                      </div>
                    </CarouselItem>
                  ))
                : children}
            </CarouselContent>
          </div>

          {showControls && itemCount > 1 && (
            <div className="flex justify-end gap-2 mt-4">
              <CarouselPrevious className="static transform-none shadow-md h-9 w-9 rounded-full" />
              <CarouselNext className="static transform-none shadow-md h-9 w-9 rounded-full" />
            </div>
          )}
        </Carousel>
      </div>
      
      {/* Mobile-only view all link */}
      {categorySlug && (
        <div className="mt-4 md:hidden text-center">
          <Link 
            to={`/events?category=${categorySlug}`} 
            className="inline-flex items-center text-primary hover:text-primary/80 text-sm font-medium transition-colors"
          >
            View all {title} <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryRow;


import { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CategoryRowProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  itemWidth?: string;
  showControls?: boolean;
}

const CategoryRow = ({
  title,
  description,
  children,
  className,
  itemWidth = "w-full md:w-[280px] lg:w-[320px]", // Updated default width for consistency
  showControls = true,
}: CategoryRowProps) => {
  return (
    <div className={cn("mb-12", className)}>
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight capitalize">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm mt-1">{description}</p>
        )}
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <div className="flex items-center w-full">
          <CarouselContent className="-ml-2 md:-ml-4">
            {Array.isArray(children)
              ? children.map((child, index) => (
                  <CarouselItem
                    key={index}
                    className={cn(
                      "pl-2 md:pl-4", 
                      // Simplified breakpoints for more consistent sizing
                      "basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4",
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

        {showControls && (
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static transform-none shadow-md" />
            <CarouselNext className="static transform-none shadow-md" />
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default CategoryRow;

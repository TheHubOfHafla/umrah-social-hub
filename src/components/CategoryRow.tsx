
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
  itemWidth = "w-[450px]", // Increased width for more substantial desktop display
  showControls = true,
}: CategoryRowProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="mb-4">
        <h2 className="text-xl font-bold tracking-tight capitalize">{title}</h2>
        {description && (
          <p className="text-muted-foreground text-sm">{description}</p>
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
                      // Fixed sizing with fewer breakpoints for consistency
                      "basis-full sm:basis-3/4 md:basis-1/2 lg:basis-2/5 xl:basis-1/3",
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
          <>
            <CarouselPrevious className="hidden md:flex absolute left-2 shadow-md" />
            <CarouselNext className="hidden md:flex absolute right-2 shadow-md" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default CategoryRow;

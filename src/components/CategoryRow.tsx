
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
  itemWidth = "w-full md:w-[300px]", // Fixed width for consistency
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

        {showControls && (
          <div className="flex justify-end gap-2 mt-4">
            <CarouselPrevious className="static transform-none shadow-md h-9 w-9 rounded-full" />
            <CarouselNext className="static transform-none shadow-md h-9 w-9 rounded-full" />
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default CategoryRow;

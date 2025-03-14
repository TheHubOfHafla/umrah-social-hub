
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
  itemWidth = "lg:w-[280px]",
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
                    className={cn("pl-2 md:pl-4 basis-full md:basis-1/2", itemWidth)}
                  >
                    {child}
                  </CarouselItem>
                ))
              : children}
          </CarouselContent>
        </div>

        {showControls && (
          <>
            <CarouselPrevious className="left-2 shadow-md" />
            <CarouselNext className="right-2 shadow-md" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default CategoryRow;


import { Event } from "@/types";
import EventCard from "./EventCard";
import { cn } from "@/lib/utils";
import CategoryRow from "./CategoryRow";

interface EventGridProps {
  events: Event[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  showEmpty?: boolean;
  emptyMessage?: string;
  useCarousel?: boolean;
  groupByCategory?: boolean;
}

const EventGrid = ({
  events,
  className,
  columns = 3,
  showEmpty = true,
  emptyMessage = "No events found",
  useCarousel = false,
  groupByCategory = false,
}: EventGridProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    3: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
  };

  if (events.length === 0 && showEmpty) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  if (useCarousel && groupByCategory) {
    // Group events by category
    const categoryGroups: Record<string, Event[]> = {};
    
    events.forEach(event => {
      event.categories.forEach(category => {
        if (!categoryGroups[category]) {
          categoryGroups[category] = [];
        }
        if (!categoryGroups[category].includes(event)) {
          categoryGroups[category].push(event);
        }
      });
    });
    
    return (
      <div className={cn("space-y-12", className)}>
        {Object.keys(categoryGroups).map(category => (
          <CategoryRow
            key={category}
            title={`${category} Events`}
            description={`Browse ${category} events in your area`}
            itemWidth="lg:w-[280px]"
          >
            {categoryGroups[category].map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </CategoryRow>
        ))}
      </div>
    );
  }
  
  if (useCarousel) {
    return (
      <CategoryRow
        title="Events"
        itemWidth="lg:w-[280px]"
        className={className}
      >
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </CategoryRow>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-3",
        gridCols[columns],
        className
      )}
    >
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default EventGrid;

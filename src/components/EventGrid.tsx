
import { Event } from "@/types";
import EventCard from "./EventCard";
import { cn } from "@/lib/utils";

interface EventGridProps {
  events: Event[];
  className?: string;
  columns?: 1 | 2 | 3 | 4;
  showEmpty?: boolean;
  emptyMessage?: string;
}

const EventGrid = ({
  events,
  className,
  columns = 3,
  showEmpty = true,
  emptyMessage = "No events found",
}: EventGridProps) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (events.length === 0 && showEmpty) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-6",
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

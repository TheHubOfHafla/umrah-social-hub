
import { Calendar } from "lucide-react";

interface UpcomingEventsListProps {
  events: any[];
  isLoading: boolean;
}

export const UpcomingEventsList = ({ events, isLoading }: UpcomingEventsListProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-16 bg-secondary/50 animate-pulse rounded"></div>
        <div className="h-16 bg-secondary/50 animate-pulse rounded"></div>
        <div className="h-16 bg-secondary/50 animate-pulse rounded"></div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return <p className="text-muted-foreground text-center py-4">No upcoming events</p>;
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id || index} className="flex items-center gap-3 border-b pb-3">
          <div className="w-12 h-12 bg-primary/10 rounded-md flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{event.title}</h4>
            <p className="text-xs text-muted-foreground">
              {new Date(event.date || event.date?.start).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

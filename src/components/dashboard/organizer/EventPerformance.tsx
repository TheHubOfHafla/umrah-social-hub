
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface EventPerformanceProps {
  events: any[];
  isLoading: boolean;
}

const EventPerformance = ({ events, isLoading }: EventPerformanceProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Event Performance</CardTitle>
        <CardDescription>
          Detailed analytics for your events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="h-16 bg-secondary/50 animate-pulse rounded"></div>
            <div className="h-16 bg-secondary/50 animate-pulse rounded"></div>
            <div className="h-16 bg-secondary/50 animate-pulse rounded"></div>
          </div>
        ) : events.length > 0 ? (
          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.id} className="border-b pb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Ticket Sales Progress</span>
                    <span>{100 - (event.tickets_remaining || 0)}%</span>
                  </div>
                  <Progress value={100 - (event.tickets_remaining || 0)} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    Estimated sell-out: {event.estimated_sellout_days || "N/A"} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No event data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventPerformance;

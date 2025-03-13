
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart, PieChart, TrendingUp, TrendingDown, Calendar, Users } from "lucide-react";
import { useState } from "react";

interface EventPerformanceProps {
  events: any[];
  metrics: any[];
  isLoading: boolean;
}

const EventPerformance = ({ events, metrics, isLoading }: EventPerformanceProps) => {
  const [selectedMetric, setSelectedMetric] = useState<string>("tickets");
  
  // Combine events with their metrics
  const eventsWithMetrics = events.map(event => {
    const eventMetrics = metrics.find(m => m.event_id === event.id) || {};
    return {
      ...event,
      metrics: eventMetrics
    };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Views
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                metrics.reduce((sum, m) => sum + (m.views_count || 0), 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Total views across all events
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Conversion Rate
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                metrics.length ? 
                  `${(metrics.reduce((sum, m) => sum + (m.conversion_rate || 0), 0) / metrics.length).toFixed(2)}%` : 
                  '0%'
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Average percentage of views that convert to sales
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                events.length
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Events currently active or upcoming
            </p>
          </CardContent>
        </Card>
      </div>

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
          ) : eventsWithMetrics.length > 0 ? (
            <div className="space-y-6">
              {eventsWithMetrics.map((event) => (
                <div key={event.id} className="border-b pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{event.metrics.views_count || 0} views</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Ticket Sales Progress</span>
                      <span>{100 - (event.tickets_remaining || 0)}%</span>
                    </div>
                    <Progress value={100 - (event.tickets_remaining || 0)} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>
                        Conversion: {event.metrics.conversion_rate || 0}%
                      </span>
                      <span>
                        {event.estimated_sellout_days ? 
                          `Estimated sell-out: ${event.estimated_sellout_days} days` : 
                          'No sell-out estimate available'}
                      </span>
                    </div>
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
    </div>
  );
};

export default EventPerformance;

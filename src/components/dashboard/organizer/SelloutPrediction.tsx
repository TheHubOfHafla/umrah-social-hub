
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Clock, Calendar, Ticket } from "lucide-react";

interface SelloutEvent {
  id: string;
  title: string;
  start_date: string;
  capacity: number;
  tickets_remaining: number;
  estimated_sellout_days?: number;
}

interface SelloutPredictionProps {
  events: SelloutEvent[];
}

const SelloutPrediction = ({ events = [] }: SelloutPredictionProps) => {
  // Filter events with valid data
  const validEvents = events.filter(event => 
    event.capacity && 
    event.tickets_remaining !== undefined && 
    new Date(event.start_date) > new Date()
  );

  // Sort by closest to selling out
  const sortedEvents = [...validEvents].sort((a, b) => {
    const aPercentage = (a.capacity - a.tickets_remaining) / a.capacity;
    const bPercentage = (b.capacity - b.tickets_remaining) / b.capacity;
    return bPercentage - aPercentage;
  }).slice(0, 4); // Show top 4 events
  
  // Function to format the date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Function to format the sellout prediction
  const formatSelloutPrediction = (event: SelloutEvent) => {
    if (!event.estimated_sellout_days) {
      return "No prediction available";
    }
    
    if (event.estimated_sellout_days <= 0) {
      return "Not likely to sell out";
    }
    
    if (event.tickets_remaining === 0) {
      return "Sold out!";
    }
    
    if (event.estimated_sellout_days < 7) {
      return `Will sell out in ~${event.estimated_sellout_days} days`;
    }
    
    if (event.estimated_sellout_days < 30) {
      return `Will sell out in ~${Math.round(event.estimated_sellout_days / 7)} weeks`;
    }
    
    return `Will sell out in ~${Math.round(event.estimated_sellout_days / 30)} months`;
  };
  
  // Function to calculate progress value
  const getProgressValue = (event: SelloutEvent) => {
    if (!event.capacity) return 0;
    return Math.round(((event.capacity - event.tickets_remaining) / event.capacity) * 100);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 mr-2 text-[#8B5CF6]" />
          Sellout Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEvents.length > 0 ? (
          <div className="space-y-4">
            {sortedEvents.map((event) => {
              const progressValue = getProgressValue(event);
              
              return (
                <div key={event.id} className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-medium">{event.title}</h3>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(event.start_date)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-medium">
                        {event.tickets_remaining} remaining
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatSelloutPrediction(event)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center">
                        <Ticket className="h-3 w-3 mr-1" />
                        Sold: {event.capacity - event.tickets_remaining}
                      </span>
                      <span>Capacity: {event.capacity}</span>
                    </div>
                    <Progress value={progressValue} className="h-2" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <Clock className="h-10 w-10 mx-auto opacity-30 mb-3" />
            <p>No upcoming events with ticket data</p>
            <p className="text-xs mt-1">Create events with capacity information to see predictions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelloutPrediction;

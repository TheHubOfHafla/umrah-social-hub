
import { CalendarClock, ChevronRight, Users, DollarSign, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

// Mock data for demonstration
const upcomingEvents = [
  {
    id: "1",
    title: "Community Iftar Dinner",
    date: "Jun 12, 2023",
    status: "upcoming",
    ticketsSold: 85,
    totalTickets: 100,
    revenue: 1275,
    attendees: 0
  },
  {
    id: "2",
    title: "Islamic Finance Workshop",
    date: "Jun 24, 2023",
    status: "upcoming",
    ticketsSold: 32,
    totalTickets: 50,
    revenue: 960,
    attendees: 0
  },
  {
    id: "3",
    title: "Eid Festival Celebration",
    date: "Jun 29, 2023",
    status: "active",
    ticketsSold: 120,
    totalTickets: 200,
    revenue: 2400,
    attendees: 0
  },
];

const EventsOverviewTable = () => {
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-xs font-medium text-left p-3">Event</th>
                <th className="text-xs font-medium text-center p-3">Status</th>
                <th className="text-xs font-medium text-center p-3">Sales</th>
                <th className="text-xs font-medium text-center p-3">Revenue</th>
                <th className="text-xs font-medium text-center p-3"></th>
              </tr>
            </thead>
            <tbody>
              {upcomingEvents.map((event, index) => (
                <tr key={event.id} className={`${index !== upcomingEvents.length - 1 ? 'border-b' : ''}`}>
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{event.title}</span>
                      <div className="flex items-center text-xs text-muted-foreground mt-1">
                        <CalendarClock className="h-3 w-3 mr-1" />
                        {event.date}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <Badge variant={event.status === "active" ? "default" : "outline"} className="mx-auto">
                      {event.status === "active" ? "Active" : "Upcoming"}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <div className="space-y-1 w-[120px] mx-auto">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{Math.round((event.ticketsSold / event.totalTickets) * 100)}%</span>
                      </div>
                      <Progress value={(event.ticketsSold / event.totalTickets) * 100} className="h-1.5" />
                      <div className="text-xs text-muted-foreground text-center">
                        {event.ticketsSold}/{event.totalTickets}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="text-sm font-medium">${event.revenue}</div>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" size="sm">View All Events</Button>
      </div>
    </div>
  );
};

export default EventsOverviewTable;

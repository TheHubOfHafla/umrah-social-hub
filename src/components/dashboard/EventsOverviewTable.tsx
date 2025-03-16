
import { CalendarClock, ChevronRight, Users, DollarSign } from "lucide-react";
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
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-xs font-medium text-left p-3">Event</th>
              <th className="text-xs font-medium text-left p-3">Date</th>
              <th className="text-xs font-medium text-left p-3">Status</th>
              <th className="text-xs font-medium text-left p-3">Tickets</th>
              <th className="text-xs font-medium text-left p-3">Revenue</th>
              <th className="text-xs font-medium text-left p-3"></th>
            </tr>
          </thead>
          <tbody>
            {upcomingEvents.map((event, index) => (
              <tr key={event.id} className={`${index !== upcomingEvents.length - 1 ? 'border-b' : ''}`}>
                <td className="p-3">
                  <div className="font-medium text-sm">{event.title}</div>
                </td>
                <td className="p-3">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarClock className="h-3 w-3 mr-1" />
                    {event.date}
                  </div>
                </td>
                <td className="p-3">
                  <Badge variant={event.status === "active" ? "default" : "outline"}>
                    {event.status === "active" ? "Active" : "Upcoming"}
                  </Badge>
                </td>
                <td className="p-3">
                  <div className="space-y-1 w-[140px]">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{event.ticketsSold}/{event.totalTickets}</span>
                      <span className="font-medium">{Math.round((event.ticketsSold / event.totalTickets) * 100)}%</span>
                    </div>
                    <Progress value={(event.ticketsSold / event.totalTickets) * 100} className="h-1" />
                  </div>
                </td>
                <td className="p-3">
                  <div className="text-sm font-medium">${event.revenue}</div>
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" size="sm">View All Events</Button>
      </div>
    </div>
  );
};

export default EventsOverviewTable;

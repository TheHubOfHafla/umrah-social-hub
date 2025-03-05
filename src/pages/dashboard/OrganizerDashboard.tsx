
import { useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart2, Users, Ticket, PlusCircle } from "lucide-react";
import Button from "@/components/Button";
import { currentUser, getOrganizerEvents } from "@/lib/data";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Sample data for the chart
const attendanceData = [
  { name: "Jan", value: 12 },
  { name: "Feb", value: 19 },
  { name: "Mar", value: 15 },
  { name: "Apr", value: 25 },
  { name: "May", value: 32 },
  { name: "Jun", value: 45 },
  { name: "Jul", value: 51 },
  { name: "Aug", value: 49 },
  { name: "Sep", value: 62 },
  { name: "Oct", value: 70 },
  { name: "Nov", value: 75 },
  { name: "Dec", value: 80 },
];

const OrganizerDashboard = () => {
  useEffect(() => {
    document.title = "Organizer Dashboard | Islamic Social";
  }, []);

  const organizerEvents = getOrganizerEvents(currentUser.id);
  
  // Calculate metrics
  const totalAttendees = organizerEvents.reduce(
    (total, event) => total + (event.attendees?.length || 0),
    0
  );
  
  const totalRevenue = organizerEvents.reduce((total, event) => {
    if (event.isFree) return total;
    if (event.ticketTypes) {
      return total + event.ticketTypes.reduce(
        (eventTotal, ticket) => eventTotal + (ticket.price * ticket.sold),
        0
      );
    }
    return total + ((event.price || 0) * (event.attendees?.length || 0));
  }, 0);

  const stats = [
    {
      title: "Total Events",
      value: organizerEvents.length,
      icon: Calendar,
      change: {
        value: 20,
        type: "increase" as const,
      },
    },
    {
      title: "Total Attendees",
      value: totalAttendees,
      icon: Users,
      change: {
        value: 15,
        type: "increase" as const,
      },
    },
    {
      title: "Total Revenue",
      value: `£${totalRevenue.toLocaleString()}`,
      icon: Ticket,
      change: {
        value: 10,
        type: "increase" as const,
      },
    },
    {
      title: "Avg. Attendance",
      value: organizerEvents.length ? Math.round(totalAttendees / organizerEvents.length) : 0,
      icon: BarChart2,
      description: "Per event",
    },
  ];

  return (
    <DashboardLayout user={currentUser} type="organizer">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your events and view analytics
            </p>
          </div>
          <Link to="/events/create">
            <Button icon={<PlusCircle className="h-4 w-4" />}>
              Create Event
            </Button>
          </Link>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
              <CardDescription>
                Your most recent events
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-4">
                {organizerEvents.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        You don't have any events yet
                      </p>
                      <Link to="/events/create">
                        <Button className="mt-4" size="sm">
                          Create Event
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {organizerEvents.slice(0, 5).map((event) => (
                      <Link to={`/events/${event.id}`} key={event.id}>
                        <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-secondary/50 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className="h-12 w-12 overflow-hidden rounded">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium">{event.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(event.date.start).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  hour: "numeric",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {event.attendees?.length || 0}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/organizer/events">
                <Button variant="outline" size="sm">
                  View All Events
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attendance Growth</CardTitle>
              <CardDescription>
                Monthly attendance across your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={attendanceData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary) / 0.2)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;

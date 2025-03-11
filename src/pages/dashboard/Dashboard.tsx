
import { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart2, Users, Bookmark } from "lucide-react";
import EventCard from "@/components/EventCard";
import Button from "@/components/Button";
import { currentUser } from "@/lib/data/users";
import { getRecommendedEvents, getUserEvents, getSavedEvents } from "@/lib/data/queries";
import { AuthContext } from "@/App";

const Dashboard = () => {
  useEffect(() => {
    document.title = "User Dashboard | Islamic Social";
  }, []);

  const { currentUser: authUser } = useContext(AuthContext);
  const user = authUser || currentUser;
  
  const userEvents = getUserEvents(user.id);
  const savedEvents = getSavedEvents(user.id);
  const recommendedEvents = getRecommendedEvents(user.id).slice(0, 3);

  const stats = [
    {
      title: "Events Attending",
      value: userEvents.length,
      icon: Calendar,
      description: "Upcoming events you're attending",
    },
    {
      title: "Saved Events",
      value: savedEvents.length,
      icon: Bookmark,
      description: "Events you've saved for later",
    },
    {
      title: "Communities",
      value: 5,
      icon: Users,
      description: "Islamic groups you follow",
    },
    {
      title: "This Month",
      value: userEvents.filter(e => new Date(e.date.start).getMonth() === new Date().getMonth()).length,
      icon: BarChart2,
      description: "Events this month",
    },
  ];

  return (
    <DashboardLayout user={user} type="user">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.name}! Here's what's happening.
          </p>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Upcoming Events</CardTitle>
                <CardDescription>
                  Events you're registered to attend
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                {userEvents.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        You're not attending any events yet
                      </p>
                      <Link to="/events">
                        <Button className="mt-4" size="sm">
                          Browse Events
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userEvents.slice(0, 3).map((event) => (
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
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Link to="/dashboard/events">
                  <Button variant="outline" size="sm">
                    View All Events
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Saved Events</CardTitle>
                <CardDescription>
                  Events you've saved for later
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {savedEvents.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                      <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                          You haven't saved any events yet
                        </p>
                      </div>
                    </div>
                  ) : (
                    savedEvents.slice(0, 3).map((event) => (
                      <Link to={`/events/${event.id}`} key={event.id}>
                        <div className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-secondary/50 transition-colors">
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
                              {new Date(event.date.start).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/dashboard/events?tab=saved">
                  <Button variant="outline" size="sm">
                    View All Saved
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

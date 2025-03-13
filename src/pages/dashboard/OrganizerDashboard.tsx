
import { useState } from "react";
import { 
  PieChart, 
  BarChart, 
  Activity, 
  Users, 
  Calendar,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/ui/container";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useOrganizerAnalytics } from "@/hooks/useOrganizerAnalytics";
import { User, UserRole } from "@/types"; // Import the User and UserRole types

const UpcomingEventsList = ({ events, isLoading }: { events: any[], isLoading: boolean }) => {
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

const OrganizerDashboard = () => {
  const { events, recommendations, isLoading, error, refetch } = useOrganizerAnalytics();
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Fix: Use the correct UserRole type for the role property
  const mockUser: User = {
    id: "1",
    name: "Organizer",
    role: "organizer" as UserRole // Cast to UserRole type
  };

  return (
    <DashboardLayout user={mockUser} type="organizer">
      <Container>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Overview of your events and analytics
            </p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="flex items-center gap-1"
            onClick={refetch}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error.message || "Failed to load analytics data. Please try again."}
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Events
                  </CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : events.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "Loading..." : `${events.length} events currently active`}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Ticket Sales
                  </CardTitle>
                  <PieChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : "1,245"}</div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "Loading..." : "+20% from last month"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Revenue
                  </CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoading ? "..." : "$12,234"}</div>
                  <p className="text-xs text-muted-foreground">
                    {isLoading ? "Loading..." : "+15% from last month"}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Your next scheduled events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <UpcomingEventsList events={events} isLoading={isLoading} />
                </CardContent>
              </Card>

              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                  <CardDescription>
                    Insights to improve your events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      <div className="h-12 bg-secondary/50 animate-pulse rounded"></div>
                      <div className="h-12 bg-secondary/50 animate-pulse rounded"></div>
                      <div className="h-12 bg-secondary/50 animate-pulse rounded"></div>
                    </div>
                  ) : recommendations && recommendations.length > 0 ? (
                    <ul className="space-y-3">
                      {recommendations.map((rec, i) => (
                        <li key={i} className="flex gap-2 items-start border-l-4 border-primary pl-3 py-1">
                          <TrendingUp className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <p className="text-sm">{rec.message}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-muted-foreground">No recommendations available</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>
                  Monthly revenue from event ticket sales
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {isLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="h-60 w-full bg-secondary/50 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Chart will be displayed here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
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
          </TabsContent>

          <TabsContent value="audience">
            <Card>
              <CardHeader>
                <CardTitle>Audience Overview</CardTitle>
                <CardDescription>
                  Insights about your attendees
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center">
                  <p className="text-muted-foreground">Audience data will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
                <CardDescription>
                  Summary of your revenue and expenses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 flex items-center justify-center">
                  <p className="text-muted-foreground">Financial data will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;

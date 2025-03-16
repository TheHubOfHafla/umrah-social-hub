
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Progress } from "@/components/ui/progress";
import { getOrganizerByUserId, getOrganizerStats } from "@/lib/api/organizer";
import { EventOrganizer } from "@/types";
import SalesOverviewChart from "@/components/dashboard/SalesOverviewChart";
import TicketAnalyticsCard from "@/components/dashboard/TicketAnalyticsCard";
import UserAnalyticsCard from "@/components/dashboard/UserAnalyticsCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import AISuggestionCard from "@/components/dashboard/AISuggestionCard";
import EventsOverviewTable from "@/components/dashboard/EventsOverviewTable";
import { ChevronRight, Calendar, Users, DollarSign, Activity } from "lucide-react";

const OrganizerDashboard = () => {
  const { id } = useParams();
  const [organizer, setOrganizer] = useState<EventOrganizer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalAttendees: 0,
    totalRevenue: 0,
    avgAttendance: 0,
  });

  // Simulating data for demonstration purposes
  const mockDemographics = {
    gender: { male: 65, female: 35 },
    ageGroups: [
      { name: "18-24", value: 35 },
      { name: "25-34", value: 40 },
      { name: "35-44", value: 15 },
      { name: "45+", value: 10 },
    ],
  };

  useEffect(() => {
    const loadOrganizerData = async () => {
      setIsLoading(true);
      // Temporary mock ID for demo purposes
      const mockUserId = "mock-user-id";
      
      try {
        const organizerData = await getOrganizerByUserId(mockUserId);
        setOrganizer(organizerData);
        
        if (organizerData) {
          const statsData = await getOrganizerStats(organizerData.id);
          setStats(statsData);
        }
      } catch (error) {
        console.error("Error loading organizer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganizerData();
  }, [id]);

  if (isLoading) {
    return (
      <PageWrapper>
        <Container>
          <div className="py-10">Loading dashboard...</div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <div className="py-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {organizer?.name || "Organizer"}
              </p>
            </div>
            <Button>
              Create New Event <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="analytics">Detailed Analytics</TabsTrigger>
              <TabsTrigger value="financials">Financials</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <DashboardStats
                stats={[
                  {
                    title: "Total Events",
                    value: stats.totalEvents,
                    icon: Calendar,
                    description: "Active and past events",
                    change: {
                      value: 12,
                      type: "increase",
                    },
                  },
                  {
                    title: "Total Attendees",
                    value: stats.totalAttendees,
                    icon: Users,
                    description: "Across all events",
                    change: {
                      value: 18,
                      type: "increase",
                    },
                  },
                  {
                    title: "Total Revenue",
                    value: `$${stats.totalRevenue.toLocaleString()}`,
                    icon: DollarSign,
                    description: "From all ticket sales",
                    change: {
                      value: 7,
                      type: "increase",
                    },
                  },
                  {
                    title: "Avg. Attendance",
                    value: stats.avgAttendance,
                    icon: Activity,
                    description: "Per event",
                    change: {
                      value: 3,
                      type: "decrease",
                    },
                  },
                ]}
              />

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Sales Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <SalesOverviewChart />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Ticket Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TicketAnalyticsCard totalTickets={500} soldTickets={328} timeUntilSellOut={14} sellRate={11} />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <UserAnalyticsCard
                  totalUsers={3780}
                  newUsersThisMonth={153}
                  topCity="London"
                  topInterest="Social Events"
                />
                
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle className="text-base font-medium">Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RevenueChart />
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">AI Suggestions</CardTitle>
                </CardHeader>
                <CardContent>
                  <AISuggestionCard 
                    suggestions={[
                      "Run a 24-hour flash sale during Friday prayer times for a 15% boost in ticket sales.",
                      "Lower VIP ticket prices by 10% to match competitor Event Y happening next week.",
                      "Add a 'Family Pack' bundle - 63% of your audience books in groups of 4+."
                    ]}
                    isPremium={false}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <EventsOverviewTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <h2 className="text-xl font-semibold">Event Management</h2>
              <p className="text-muted-foreground">Manage all your events in one place</p>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm">Event management content will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="analytics" className="space-y-4">
              <h2 className="text-xl font-semibold">Detailed Analytics</h2>
              <p className="text-muted-foreground">Deep insights into your events and audience</p>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm">Detailed analytics content will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="financials" className="space-y-4">
              <h2 className="text-xl font-semibold">Financial Dashboard</h2>
              <p className="text-muted-foreground">Track your earnings and payouts</p>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm">Financial dashboard content will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-4">
              <h2 className="text-xl font-semibold">Profile Management</h2>
              <p className="text-muted-foreground">Update your profile information</p>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-sm">Profile management content will appear here</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Container>
    </PageWrapper>
  );
};

export default OrganizerDashboard;

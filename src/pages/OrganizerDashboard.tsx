
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { getOrganizerByUserId, getOrganizerStats } from "@/lib/api/organizer";
import { EventOrganizer } from "@/types";
import SalesOverviewChart from "@/components/dashboard/SalesOverviewChart";
import TicketAnalyticsCard from "@/components/dashboard/TicketAnalyticsCard";
import UserAnalyticsCard from "@/components/dashboard/UserAnalyticsCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import AISuggestionCard from "@/components/dashboard/AISuggestionCard";
import EventsOverviewTable from "@/components/dashboard/EventsOverviewTable";
import OrganizerSidebar from "@/components/dashboard/OrganizerSidebar";
import { 
  ChevronRight, 
  Calendar, 
  Users, 
  DollarSign, 
  Activity, 
  Plus,
  Bell,
} from "lucide-react";

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
        <div className="flex min-h-screen bg-background">
          <div className="flex-1">
            <div className="py-10 px-6">Loading dashboard...</div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper withFooter={false}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          <OrganizerSidebar />
          
          <SidebarInset>
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b shadow-sm">
              <div className="px-6 py-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back, {organizer?.name || "Organizer"}
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Bell className="h-4 w-4" />
                    <span className="hidden md:inline">Notifications</span>
                  </Button>
                  
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    <span className="hidden md:inline">Create Event</span>
                  </Button>
                </div>
              </div>
            </header>
            
            <main className="p-6">
              <div className="mb-8">
                <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-none shadow-md overflow-hidden">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold mb-2">Boost Your Event Reach</h2>
                      <p className="text-sm text-muted-foreground mb-4">
                        Use our AI-powered tools to maximize ticket sales and attendee engagement.
                      </p>
                      <Button size="sm">
                        Explore Premium Features
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                    <div className="hidden md:block w-1/3 max-w-[300px]">
                      <img 
                        src="/placeholder.svg" 
                        alt="Dashboard illustration" 
                        className="rounded-md shadow-sm"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
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
              </div>

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-7 mb-8">
                <Card className="lg:col-span-4 bg-card shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Ticket Sales Trend</CardTitle>
                    <CardDescription>Weekly ticket sales over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SalesOverviewChart />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-3 bg-card shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Current Ticket Status</CardTitle>
                    <CardDescription>Overview of ticket sales and projections</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TicketAnalyticsCard totalTickets={500} soldTickets={328} timeUntilSellOut={14} sellRate={11} />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-7 mb-8">
                <Card className="lg:col-span-3 bg-card shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Audience Analytics</CardTitle>
                    <CardDescription>Insights about your event attendees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UserAnalyticsCard
                      totalUsers={3780}
                      newUsersThisMonth={153}
                      topCity="London"
                      topInterest="Social Events"
                    />
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-4 bg-card shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Revenue Forecast</CardTitle>
                    <CardDescription>Actual vs. projected revenue</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RevenueChart />
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="bg-card shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                      <span className="relative">
                        AI Recommendations
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                      </span>
                    </CardTitle>
                    <CardDescription>AI-powered insights to grow your events</CardDescription>
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
                
                <Card className="bg-card shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">Upcoming Events</CardTitle>
                    <CardDescription>Your next scheduled events</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EventsOverviewTable />
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PageWrapper>
  );
};

export default OrganizerDashboard;

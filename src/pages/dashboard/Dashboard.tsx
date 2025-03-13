
import { useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardStats from "@/components/dashboard/DashboardStats";
import UserTickets from "@/components/dashboard/UserTickets";
import UserAnalyticsCard from "@/components/dashboard/UserAnalyticsCard";
import OrganizerPromotionCard from "@/components/dashboard/OrganizerPromotionCard";
import { Ticket, Calendar, Clock, Bell } from "lucide-react";
import { currentUser } from "@/lib/data/users";
import { useAuth } from "@/hooks/use-auth";

const stats = [
  {
    title: "Upcoming Events",
    value: 3,
    icon: Calendar,
    change: {
      value: 2,
      type: "increase" as const,
    },
  },
  {
    title: "Past Events",
    value: 12,
    icon: Clock,
    change: {
      value: 5,
      type: "increase" as const,
    },
  },
  {
    title: "Available Tickets",
    value: 3,
    icon: Ticket,
    description: "Purchased tickets",
  },
  {
    title: "Notifications",
    value: 2,
    icon: Bell,
    description: "Unread notifications",
  },
];

const Dashboard = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    document.title = "Dashboard | Islamic Social";
  }, []);

  return (
    <DashboardLayout user={user || currentUser} type="user">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name || currentUser.name}
          </p>
        </div>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Your Tickets</CardTitle>
                <CardDescription>
                  Manage your upcoming event tickets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTickets />
              </CardContent>
            </Card>
          </div>
          
          <div>
            <OrganizerPromotionCard />
          </div>
        </div>

        <UserAnalyticsCard 
          totalUsers={125} 
          newUsersThisMonth={18} 
          topCity="London" 
          topInterest="Education" 
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart2, Users, Ticket, PlusCircle, Target, TrendingUp, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/data/users";
import { getOrganizerEvents } from "@/lib/data/queries";
import { EventCategory } from "@/types";
import { Container } from "@/components/ui/container";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Import our components
import GoalTracker from "@/components/dashboard/organizer/GoalTracker";
import GrowthMetrics from "@/components/dashboard/organizer/GrowthMetrics";
import UpcomingEventsList from "@/components/dashboard/organizer/UpcomingEventsList";
import EventsFilter from "@/components/dashboard/organizer/EventsFilter";
import SalesPerformanceChart from "@/components/dashboard/organizer/SalesPerformanceChart";
import UserEngagementMetrics from "@/components/dashboard/organizer/UserEngagementMetrics";
import AISalesAssistant from "@/components/dashboard/organizer/AISalesAssistant";
import SelloutPrediction from "@/components/dashboard/organizer/SelloutPrediction";

const OrganizerDashboard = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = "Organizer Dashboard | Islamic Social";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">("all");
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  const organizerEvents = getOrganizerEvents(currentUser.id);
  
  // Function to fetch dashboard data from our edge function
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // First, try to get the organizer profile for this user
      const { data: organizerData, error: organizerError } = await supabase
        .from('organizers')
        .select('id')
        .eq('user_id', currentUser.id)
        .single();
      
      if (organizerError) {
        console.error("Error fetching organizer ID:", organizerError);
        setIsLoading(false);
        return;
      }
      
      // Call our edge function with the organizer ID
      const { data, error } = await supabase.functions.invoke('get-organizer-analytics', {
        query: { organizerId: organizerData.id }
      });
      
      if (error) {
        console.error("Error fetching analytics:", error);
        toast({
          title: "Failed to load dashboard data",
          description: "Please try again later",
          variant: "destructive"
        });
      } else {
        setDashboardData(data);
        console.log("Loaded dashboard data:", data);
      }
    } catch (error) {
      console.error("Error in dashboard data fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDashboardData();
  }, []);
  
  // Transform mock data for our components
  // In a real implementation, this would use the data from our API
  // For now, we'll use a mix of real and mock data
  
  // For the stats cards
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

  // Sample engagement data - would come from our backend in real implementation
  const mockEngagementData = {
    total: {
      view_event: 1872,
      click_event: 573,
      view_profile: 432
    },
    byEvent: {
      'event1': {
        title: "Islamic Art Workshop",
        view_event: 350,
        click_event: 120,
        conversion_rate: 0.34
      },
      'event2': {
        title: "Ramadan Charity Drive",
        view_event: 520,
        click_event: 280,
        conversion_rate: 0.54
      },
      'event3': {
        title: "Islamic History Lecture",
        view_event: 480,
        click_event: 95,
        conversion_rate: 0.20
      }
    }
  };

  // Recommendation data - would come from our AI model in backend
  const mockRecommendations = [
    {
      eventId: "event1",
      eventTitle: "Islamic Art Workshop",
      type: "conversion",
      message: "Your event is getting views but has a low conversion rate. Consider offering an early bird discount to boost sales."
    },
    {
      eventId: "event2",
      eventTitle: "Ramadan Charity Drive",
      type: "engagement",
      message: "This event has high user interest. Try sending a targeted marketing campaign to users who viewed but didn't purchase."
    },
    {
      eventId: "event3",
      eventTitle: "Islamic History Lecture",
      type: "sales_speed",
      message: "At the current rate, tickets might not sell out before the event. Consider boosting visibility through social media."
    },
    {
      type: "general",
      message: "Posting photos from previous events can increase user trust and boost ticket sales by up to 30%."
    }
  ];

  // Sample ticket sales data
  const mockTicketSales = Array.from({ length: 60 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 60 + i);
    
    return {
      event_id: i % 3 === 0 ? "event1" : i % 3 === 1 ? "event2" : "event3",
      sale_date: date.toISOString().split('T')[0],
      tickets_sold: Math.floor(Math.random() * 10) + 1,
      revenue: (Math.floor(Math.random() * 10) + 1) * 25
    };
  });

  // Mock events with sellout predictions
  const mockSelloutEvents = [
    {
      id: "event1",
      title: "Ramadan Charity Gala",
      start_date: "2023-12-15T19:00:00",
      capacity: 200,
      tickets_remaining: 45,
      estimated_sellout_days: 12
    },
    {
      id: "event2",
      title: "Islamic Calligraphy Workshop",
      start_date: "2023-12-10T10:00:00",
      capacity: 30,
      tickets_remaining: 5,
      estimated_sellout_days: 3
    },
    {
      id: "event3",
      title: "Monthly Community Iftar",
      start_date: "2024-01-20T18:00:00",
      capacity: 100,
      tickets_remaining: 68,
      estimated_sellout_days: 35
    }
  ];

  return (
    <DashboardLayout user={currentUser} type="organizer">
      <motion.div 
        className="space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
            <p className="text-muted-foreground">
              Track your events, goals, and performance
            </p>
          </div>
          <Link to="/events/create">
            <Button 
              className="bg-[#8B5CF6] hover:bg-[#7C5AE2] transition-all duration-300"
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </motion.div>

        <DashboardStats stats={stats} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SalesPerformanceChart 
              salesData={mockTicketSales}
              events={[
                { id: "event1", title: "Islamic Art Workshop" },
                { id: "event2", title: "Ramadan Charity Drive" },
                { id: "event3", title: "Islamic History Lecture" }
              ]}
            />
          </div>
          
          <div>
            <AISalesAssistant 
              recommendations={mockRecommendations}
              isLoading={isLoading}
              onRefresh={fetchDashboardData}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <UserEngagementMetrics engagementData={mockEngagementData} />
          </div>
          
          <div className="md:col-span-2">
            <SelloutPrediction events={mockSelloutEvents} />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <UpcomingEventsList events={organizerEvents.slice(0, 3)} />
          </div>
          
          <div>
            <GoalTracker />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;

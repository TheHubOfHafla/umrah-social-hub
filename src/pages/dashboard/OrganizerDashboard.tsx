
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
import { supabase } from "@/integrations/supabase/client";

// Import our new components
import GoalTracker from "@/components/dashboard/organizer/GoalTracker";
import GrowthMetrics from "@/components/dashboard/organizer/GrowthMetrics";
import UpcomingEventsList from "@/components/dashboard/organizer/UpcomingEventsList";
import EventsFilter from "@/components/dashboard/organizer/EventsFilter";

// Sample data for metrics
const growthMetricsData = {
  attendance: {
    data: [
      { month: "Jan", value: 120, previousYear: 100 },
      { month: "Feb", value: 150, previousYear: 120 },
      { month: "Mar", value: 180, previousYear: 130 },
      { month: "Apr", value: 220, previousYear: 170 },
      { month: "May", value: 280, previousYear: 190 },
      { month: "Jun", value: 310, previousYear: 210 },
      { month: "Jul", value: 350, previousYear: 230 },
      { month: "Aug", value: 370, previousYear: 250 },
      { month: "Sep", value: 400, previousYear: 270 },
      { month: "Oct", value: 430, previousYear: 290 },
      { month: "Nov", value: 450, previousYear: 300 },
      { month: "Dec", value: 480, previousYear: 320 },
    ],
    growth: 32
  },
  donations: {
    data: [
      { month: "Jan", value: 1200, previousYear: 1000 },
      { month: "Feb", value: 1500, previousYear: 1200 },
      { month: "Mar", value: 2000, previousYear: 1300 },
      { month: "Apr", value: 2300, previousYear: 1700 },
      { month: "May", value: 2800, previousYear: 1900 },
      { month: "Jun", value: 3100, previousYear: 2100 },
      { month: "Jul", value: 3500, previousYear: 2300 },
      { month: "Aug", value: 3700, previousYear: 2500 },
      { month: "Sep", value: 4000, previousYear: 2700 },
      { month: "Oct", value: 4300, previousYear: 2900 },
      { month: "Nov", value: 4600, previousYear: 3000 },
      { month: "Dec", value: 5000, previousYear: 3200 },
    ],
    growth: 45
  },
  events: {
    total: 32,
    growth: 28
  },
  averageAttendance: {
    value: 85,
    growth: 15
  }
};

const OrganizerDashboard = () => {
  useEffect(() => {
    document.title = "Organizer Dashboard | Islamic Social";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">("all");
  const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

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

  // Helper function to filter tips based on goals
  const getTips = () => {
    const tips = [
      {
        title: "Boost your attendance",
        description: "Share your events on social media at least 3 times before the event date for maximum visibility.",
        icon: Users,
      },
      {
        title: "Increase donations",
        description: "Adding a compelling story with specific goals can increase donation amounts by up to 45%.",
        icon: Ticket,
      },
      {
        title: "Optimize event timing",
        description: "Events scheduled on weekends tend to have 30% higher attendance than weekday events.",
        icon: Calendar,
      },
    ];
    
    return tips;
  };

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
            <Card className="h-full">
              <CardHeader className="pb-0">
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-[#8B5CF6]" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  Track improvements and growth over time
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <EventsFilter 
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  categoryFilter={categoryFilter}
                  setCategoryFilter={setCategoryFilter}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
                
                <div className="mt-6">
                  <GrowthMetrics data={growthMetricsData} />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-[#8B5CF6]" />
                  Tips & Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-0">
                <div className="space-y-4">
                  {getTips().map((tip, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors duration-300"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-[#8B5CF6]/10 p-2">
                          <tip.icon className="h-4 w-4 text-[#8B5CF6]" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{tip.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            {tip.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-4">
                <Button variant="outline" size="sm" className="text-xs w-full">View All Tips</Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <UpcomingEventsList events={organizerEvents.slice(0, 3)} />
          </div>
          
          <div className="md:col-span-2">
            <GoalTracker />
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;

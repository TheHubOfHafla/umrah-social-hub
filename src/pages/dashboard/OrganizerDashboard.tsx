
import { useState } from "react";
import { Container } from "@/components/ui/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useOrganizerAnalytics } from "@/hooks/useOrganizerAnalytics";
import { User, UserRole } from "@/types";
import DashboardOverview from "@/components/dashboard/organizer/DashboardOverview";
import EventPerformance from "@/components/dashboard/organizer/EventPerformance";
import AudienceOverview from "@/components/dashboard/organizer/AudienceOverview";
import FinancialOverview from "@/components/dashboard/organizer/FinancialOverview";
import DashboardHeader from "@/components/dashboard/organizer/DashboardHeader";

const OrganizerDashboard = () => {
  const { events, metrics, ticketSales, engagement, recommendations, isLoading, error, refetch } = useOrganizerAnalytics();
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Define mockUser with the correct typing
  const mockUser: User = {
    id: "1",
    name: "Organizer",
    role: "organizer" as UserRole // Explicitly cast to UserRole type
  };

  return (
    <DashboardLayout user={mockUser} type="organizer">
      <Container>
        <DashboardHeader 
          refetch={refetch} 
          isLoading={isLoading} 
          error={error} 
        />

        <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="financials">Financials</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview 
              events={events} 
              recommendations={recommendations} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="events">
            <EventPerformance 
              events={events} 
              metrics={metrics} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="audience">
            <AudienceOverview 
              engagement={engagement}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="financials">
            <FinancialOverview 
              ticketSales={ticketSales}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </Container>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;

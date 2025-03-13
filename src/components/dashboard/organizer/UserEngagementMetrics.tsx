
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MousePointer, Eye } from "lucide-react";

interface Engagement {
  engagement_type: string;
  count: number;
}

interface UserEngagementProps {
  engagementData: {
    total: {
      view_event: number;
      click_event: number;
      view_profile: number;
    };
    byEvent: {
      [eventId: string]: {
        title: string;
        view_event: number;
        click_event: number;
        conversion_rate: number;
      }
    };
  };
}

const UserEngagementMetrics = ({ engagementData }: UserEngagementProps) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  if (!engagementData) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Users className="h-5 w-5 mr-2 text-[#8B5CF6]" />
            User Engagement
          </CardTitle>
          <CardDescription>
            Track how users interact with your events
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center text-muted-foreground">
            <p>No engagement data available yet</p>
            <p className="text-sm mt-1">Data will appear as users interact with your events</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // For overview tab
  const overviewData = [
    { name: 'Event Views', value: engagementData.total.view_event, color: '#8B5CF6', icon: Eye },
    { name: 'Event Clicks', value: engagementData.total.click_event, color: '#10B981', icon: MousePointer },
    { name: 'Profile Views', value: engagementData.total.view_profile, color: '#F59E0B', icon: Users },
  ];
  
  // For event comparison tab
  const eventComparisonData = Object.values(engagementData.byEvent).map(event => ({
    name: event.title,
    views: event.view_event,
    clicks: event.click_event,
    conversion: Math.round(event.conversion_rate * 100),
  }));

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Users className="h-5 w-5 mr-2 text-[#8B5CF6]" />
          User Engagement
        </CardTitle>
        <CardDescription>
          Track how users interact with your events
        </CardDescription>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events Comparison</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <TabsContent value="overview" className="mt-3">
          <div className="grid grid-cols-3 gap-3 mb-6">
            {overviewData.map((item, index) => (
              <div key={index} className="bg-background/60 p-3 rounded-lg">
                <div className="flex flex-col items-center text-center gap-1">
                  <div className={`bg-[${item.color}]/10 p-2 rounded-full mb-1`}>
                    <item.icon className={`h-4 w-4 text-[${item.color}]`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                  <p className="text-lg font-semibold">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overviewData}
                margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid #f0f0f0",
                    borderRadius: "0.5rem",
                  }}
                />
                <Bar dataKey="value" name="Count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="events" className="mt-3">
          {eventComparisonData.length > 0 ? (
            <div className="h-[300px] mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventComparisonData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.8)",
                      border: "1px solid #f0f0f0",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="views" name="Views" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="clicks" name="Clicks" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-center text-muted-foreground">
                <p>No event comparison data available</p>
                <p className="text-sm mt-1">Create more events to see comparisons</p>
              </div>
            </div>
          )}
        </TabsContent>
      </CardContent>
    </Card>
  );
};

export default UserEngagementMetrics;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Users, UserPlus, BarChart, TrendingUp } from "lucide-react";

interface AudienceOverviewProps {
  engagement?: any[];
  isLoading: boolean;
}

const AudienceOverview = ({ engagement = [], isLoading = false }: AudienceOverviewProps) => {
  // Process engagement data
  const profileViews = engagement.filter(e => e?.engagement_type === 'view_profile').length;
  const eventClicks = engagement.filter(e => e?.engagement_type === 'click_event').length;
  const ticketPurchases = engagement.filter(e => e?.engagement_type === 'purchase_ticket').length;
  
  // Calculate conversion rates
  const clickToViewRate = profileViews ? Math.round((eventClicks / profileViews) * 100) : 0;
  const purchaseToClickRate = eventClicks ? Math.round((ticketPurchases / eventClicks) * 100) : 0;

  // Audience stats with real data
  const audienceStats = [
    { 
      label: "Profile Views", 
      value: isLoading ? "..." : profileViews, 
      percentage: profileViews ? (profileViews / (profileViews + eventClicks + ticketPurchases)) * 100 : 0, 
      trend: "+12%", 
      icon: UserPlus
    },
    { 
      label: "Event Clicks", 
      value: isLoading ? "..." : eventClicks, 
      percentage: eventClicks ? (eventClicks / (profileViews + eventClicks + ticketPurchases)) * 100 : 0, 
      trend: "+5%", 
      icon: Users
    },
    { 
      label: "Conversion Rate", 
      value: isLoading ? "..." : `${clickToViewRate}%`, 
      percentage: clickToViewRate, 
      trend: clickToViewRate > 20 ? "+2%" : "-1%", 
      icon: PieChart 
    },
  ];

  // Mockup age group data - would be replaced with real data in production
  const ageGroups = [
    { name: "18-24", percentage: 28 },
    { name: "25-34", percentage: 42 },
    { name: "35-44", percentage: 18 },
    { name: "45+", percentage: 12 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audience Overview</CardTitle>
          <CardDescription>
            Insights about your attendees
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {audienceStats.map((stat, index) => (
                <div key={index} className="bg-secondary/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">{stat.label}</span>
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold mb-2">
                    {isLoading ? <span className="animate-pulse">...</span> : stat.value}
                  </div>
                  <div className="text-xs text-muted-foreground">{stat.trend} from last month</div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Engagement Flow</CardTitle>
                  <CardDescription>
                    How users move through your events
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 text-center p-2 border-r">
                      <div className="text-2xl font-bold">{profileViews}</div>
                      <div className="text-xs text-muted-foreground">Profile Views</div>
                    </div>
                    <div className="p-2 text-primary">
                      <TrendingUp className="h-4 w-4 mx-auto" />
                      <div className="text-xs">{clickToViewRate}%</div>
                    </div>
                    <div className="flex-1 text-center p-2 border-r border-l">
                      <div className="text-2xl font-bold">{eventClicks}</div>
                      <div className="text-xs text-muted-foreground">Event Clicks</div>
                    </div>
                    <div className="p-2 text-primary">
                      <TrendingUp className="h-4 w-4 mx-auto" />
                      <div className="text-xs">{purchaseToClickRate}%</div>
                    </div>
                    <div className="flex-1 text-center p-2 border-l">
                      <div className="text-2xl font-bold">{ticketPurchases}</div>
                      <div className="text-xs text-muted-foreground">Purchases</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6 mt-6">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Age Groups</span>
                  <span className="text-sm text-muted-foreground">Distribution</span>
                </div>
                <div className="space-y-2">
                  {ageGroups.map((group, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-xs w-14">{group.name}</span>
                      <Progress value={group.percentage} className="h-2" />
                      <span className="text-xs text-muted-foreground">{group.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AudienceOverview;

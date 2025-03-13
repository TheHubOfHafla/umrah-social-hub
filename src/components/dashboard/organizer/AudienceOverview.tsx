
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Users, UserPlus } from "lucide-react";

const AudienceOverview = () => {
  // Mockup data - would be replaced with real data in production
  const audienceStats = [
    { label: "New Attendees", value: 43, percentage: 18, trend: "+12%" },
    { label: "Returning Attendees", value: 197, percentage: 82, trend: "+5%" },
    { label: "Conversion Rate", value: "24%", percentage: 24, trend: "+2%" },
  ];

  return (
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
                  {index === 0 ? 
                    <UserPlus className="h-4 w-4 text-primary" /> : 
                    index === 1 ? 
                    <Users className="h-4 w-4 text-primary" /> : 
                    <PieChart className="h-4 w-4 text-primary" />
                  }
                </div>
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.trend} from last month</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-6 mt-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Age Groups</span>
                <span className="text-sm text-muted-foreground">Distribution</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs w-14">18-24</span>
                  <Progress value={28} className="h-2" />
                  <span className="text-xs text-muted-foreground">28%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs w-14">25-34</span>
                  <Progress value={42} className="h-2" />
                  <span className="text-xs text-muted-foreground">42%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs w-14">35-44</span>
                  <Progress value={18} className="h-2" />
                  <span className="text-xs text-muted-foreground">18%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs w-14">45+</span>
                  <Progress value={12} className="h-2" />
                  <span className="text-xs text-muted-foreground">12%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceOverview;

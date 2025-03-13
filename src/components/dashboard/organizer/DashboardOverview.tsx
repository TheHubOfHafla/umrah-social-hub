
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, PieChart, BarChart, TrendingUp } from "lucide-react";
import { UpcomingEventsList } from "./UpcomingEventsList";

interface DashboardOverviewProps {
  events: any[];
  recommendations: any[];
  isLoading: boolean;
}

const DashboardOverview = ({ events, recommendations, isLoading }: DashboardOverviewProps) => {
  return (
    <>
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
    </>
  );
};

export default DashboardOverview;


import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart2, Users, Bookmark } from "lucide-react";

interface Stat {
  title: string;
  value: string | number;
  icon: React.FC<{ className?: string }>;
  description?: string;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
}

interface DashboardStatsProps {
  stats: Stat[];
}

const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && (
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            )}
            {stat.change && (
              <div className="mt-1 flex items-center text-xs">
                <span
                  className={
                    stat.change.type === "increase"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {stat.change.type === "increase" ? "+" : "-"}
                  {stat.change.value}%
                </span>
                <span className="ml-1 text-muted-foreground">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

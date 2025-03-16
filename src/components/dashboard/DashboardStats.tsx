
import { Card, CardContent } from "@/components/ui/card";
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
        <Card key={index} className="overflow-hidden border bg-card shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                {stat.description && (
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                )}
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
            {stat.change && (
              <div className="mt-4 flex items-center text-xs">
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    stat.change.type === "increase"
                      ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                  }`}
                >
                  {stat.change.type === "increase" ? "+" : "-"}
                  {stat.change.value}%
                </span>
                <span className="ml-2 text-muted-foreground">from last month</span>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DashboardStats;

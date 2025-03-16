
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, ResponsiveContainer } from "recharts";

const salesData = [
  { name: "Mon", tickets: 20, lastWeek: 15 },
  { name: "Tue", tickets: 15, lastWeek: 12 },
  { name: "Wed", tickets: 30, lastWeek: 22 },
  { name: "Thu", tickets: 45, lastWeek: 25 },
  { name: "Fri", tickets: 65, lastWeek: 40 },
  { name: "Sat", tickets: 45, lastWeek: 38 },
  { name: "Sun", tickets: 25, lastWeek: 20 },
];

const SalesOverviewChart = () => {
  const chartConfig = {
    tickets: {
      label: "This Week",
      color: "hsl(var(--primary))",
    },
    lastWeek: {
      label: "Last Week",
      color: "hsl(var(--muted-foreground))",
    }
  };

  return (
    <div className="w-full h-[300px]">
      <ChartContainer 
        config={chartConfig} 
        className="h-full"
      >
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={false}
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            fontSize={12}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar 
            dataKey="tickets" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]} 
            className="fill-primary" 
            name="This Week"
            barSize={20}
          />
          <Bar 
            dataKey="lastWeek" 
            fill="hsl(var(--muted-foreground)/30)" 
            radius={[4, 4, 0, 0]} 
            name="Last Week"
            barSize={20}
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default SalesOverviewChart;


import { Card, CardContent } from "@/components/ui/card";
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, ResponsiveContainer } from "recharts";

const salesData = [
  { name: "Mon", tickets: 20 },
  { name: "Tue", tickets: 15 },
  { name: "Wed", tickets: 30 },
  { name: "Thu", tickets: 45 },
  { name: "Fri", tickets: 65 },
  { name: "Sat", tickets: 45 },
  { name: "Sun", tickets: 25 },
];

const SalesOverviewChart = () => {
  const chartConfig = {
    tickets: {
      label: "Tickets Sold",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="w-full h-[300px]">
      <ChartContainer 
        config={chartConfig} 
        className="h-full"
      >
        <BarChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            axisLine={false}
            fontSize={12}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            fontSize={12}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Bar 
            dataKey="tickets" 
            fill="hsl(var(--primary))" 
            radius={[4, 4, 0, 0]} 
            className="fill-primary" 
            name="Tickets"
          />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default SalesOverviewChart;

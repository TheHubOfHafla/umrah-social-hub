
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 2400, projected: 3200 },
  { month: "Feb", revenue: 3600, projected: 3600 },
  { month: "Mar", revenue: 5200, projected: 4000 },
  { month: "Apr", revenue: 4200, projected: 4400 },
  { month: "May", revenue: 6200, projected: 4800 },
  { month: "Jun", revenue: 7800, projected: 5200 },
  { month: "Jul", revenue: 8200, projected: 5600 },
];

const RevenueChart = () => {
  const chartConfig = {
    revenue: {
      label: "Actual Revenue",
      color: "hsl(var(--primary))",
    },
    projected: {
      label: "Projected Revenue",
      color: "hsl(var(--muted-foreground))",
    },
  };

  return (
    <div className="w-full h-[300px]">
      <ChartContainer 
        config={chartConfig}
        className="h-full"
      >
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            tickLine={false} 
            axisLine={false}
            fontSize={12}
          />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            fontSize={12}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="hsl(var(--primary))" 
            activeDot={{ r: 6 }} 
            strokeWidth={2} 
            name="Actual"
          />
          <Line 
            type="monotone" 
            dataKey="projected" 
            stroke="hsl(var(--muted-foreground))" 
            strokeDasharray="5 5" 
            strokeWidth={2} 
            name="Projected"
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};

export default RevenueChart;

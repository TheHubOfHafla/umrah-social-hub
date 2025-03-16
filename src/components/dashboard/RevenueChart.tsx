
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
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  ReferenceLine
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

  const currentMonth = new Date().toLocaleString('default', { month: 'short' });

  return (
    <div className="w-full h-[300px]">
      <ChartContainer 
        config={chartConfig}
        className="h-full"
      >
        <ComposedChart data={revenueData}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="month" 
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
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<ChartTooltipContent />} />
          <Legend 
            wrapperStyle={{ paddingTop: '10px' }}
            iconType="circle"
          />
          <ReferenceLine 
            x="May" 
            stroke="hsl(var(--primary)/50)" 
            strokeDasharray="3 3" 
            label={{ 
              value: "Current", 
              position: "insideTopRight", 
              fill: "hsl(var(--primary))",
              fontSize: 12 
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#revenueGradient)"
            name="Actual"
          />
          <Line 
            type="monotone" 
            dataKey="projected" 
            stroke="hsl(var(--muted-foreground))" 
            strokeDasharray="5 5" 
            strokeWidth={2} 
            name="Projected"
            dot={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 2, r: 4 }}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
};

export default RevenueChart;

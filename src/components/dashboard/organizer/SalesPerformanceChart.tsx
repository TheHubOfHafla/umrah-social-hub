
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { TicketIcon, TrendingUp } from "lucide-react";

interface TicketSale {
  event_id: string;
  sale_date: string;
  tickets_sold: number;
  revenue: number;
}

interface Event {
  id: string;
  title: string;
}

interface SalesPerformanceChartProps {
  salesData: TicketSale[];
  events: Event[];
}

const SalesPerformanceChart = ({ salesData = [], events = [] }: SalesPerformanceChartProps) => {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "90days" | "all">("30days");
  const [selectedEventId, setSelectedEventId] = useState<string>("all");
  
  // Calculate date range
  const getDateRangeFilter = () => {
    if (timeRange === "all") return null;
    
    const today = new Date();
    const pastDate = new Date();
    
    switch (timeRange) {
      case "7days":
        pastDate.setDate(today.getDate() - 7);
        break;
      case "30days":
        pastDate.setDate(today.getDate() - 30);
        break;
      case "90days":
        pastDate.setDate(today.getDate() - 90);
        break;
    }
    
    return pastDate.toISOString().split('T')[0];
  };
  
  // Filter data based on selections
  const dateFilter = getDateRangeFilter();
  
  const filteredData = salesData.filter(sale => {
    const eventMatch = selectedEventId === "all" || sale.event_id === selectedEventId;
    const dateMatch = !dateFilter || sale.sale_date >= dateFilter;
    return eventMatch && dateMatch;
  });
  
  // Group by date for the chart
  const chartData = filteredData.reduce((acc, curr) => {
    const existingEntry = acc.find(item => item.date === curr.sale_date);
    
    if (existingEntry) {
      existingEntry.tickets += curr.tickets_sold;
      existingEntry.revenue += curr.revenue;
    } else {
      acc.push({
        date: curr.sale_date,
        tickets: curr.tickets_sold,
        revenue: curr.revenue
      });
    }
    
    return acc;
  }, [] as { date: string; tickets: number; revenue: number }[]);
  
  // Sort by date
  chartData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Calculate totals
  const totalTickets = filteredData.reduce((sum, sale) => sum + sale.tickets_sold, 0);
  const totalRevenue = filteredData.reduce((sum, sale) => sum + sale.revenue, 0);
  
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-[#8B5CF6]" />
              Sales Performance
            </CardTitle>
            <CardDescription>
              Track your ticket sales over time
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={selectedEventId} onValueChange={setSelectedEventId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select event" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map(event => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-1 sm:px-6">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background/60 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-[#8B5CF6]/10 p-2 rounded-full">
                <TicketIcon className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tickets Sold</p>
                <p className="text-2xl font-bold">{totalTickets}</p>
              </div>
            </div>
          </div>
          <div className="bg-background/60 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="bg-[#10B981]/10 p-2 rounded-full">
                <TrendingUp className="h-5 w-5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">£{totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-[300px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [value, 'Tickets']}
                  labelFormatter={(label) => formatDate(label)}
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "1px solid #f0f0f0",
                    borderRadius: "0.5rem",
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  name="Tickets Sold"
                  stroke="#8B5CF6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTickets)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="mb-1">No sales data available for the selected filters</p>
                <p className="text-sm">Try a different time range or event</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesPerformanceChart;

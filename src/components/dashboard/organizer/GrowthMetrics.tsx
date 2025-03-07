
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, CreditCard, Calendar, Users, Clock } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer, Legend } from "recharts";

interface MetricsData {
  attendance: {
    data: Array<{ month: string; value: number; previousYear?: number }>;
    growth: number;
  };
  donations: {
    data: Array<{ month: string; value: number; previousYear?: number }>;
    growth: number;
  };
  events: {
    total: number;
    growth: number;
  };
  averageAttendance: {
    value: number;
    growth: number;
  };
}

interface GrowthMetricsProps {
  data: MetricsData;
}

const GrowthMetrics = ({ data }: GrowthMetricsProps) => {
  const growthIndicator = (value: number) => {
    if (value > 0) {
      return (
        <span className="flex items-center text-green-500 text-xs">
          <TrendingUp className="h-3.5 w-3.5 mr-1" />
          {value}%
        </span>
      );
    } else if (value < 0) {
      return (
        <span className="flex items-center text-red-500 text-xs">
          <TrendingDown className="h-3.5 w-3.5 mr-1" />
          {Math.abs(value)}%
        </span>
      );
    } else {
      return <span className="text-muted-foreground text-xs">No change</span>;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-lg font-semibold text-foreground flex items-center mb-4">
          <TrendingUp className="mr-2 h-5 w-5 text-[#8B5CF6]" /> Growth & Improvements
        </h3>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  Attendance Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.attendance.growth}%</div>
                <p className="text-xs text-muted-foreground">from last year</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-green-500" />
                  Donation Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.donations.growth}%</div>
                <p className="text-xs text-muted-foreground">from last year</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-red-500" />
                  Total Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.events.total}</div>
                <div className="flex items-center">
                  {growthIndicator(data.events.growth)}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-amber-500" />
                  Avg. Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.averageAttendance.value}</div>
                <div className="flex items-center">
                  {growthIndicator(data.averageAttendance.growth)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Attendance History</CardTitle>
              <CardDescription>Monthly attendance at events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.attendance.data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        border: "1px solid #f0f0f0",
                        borderRadius: "0.5rem",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#8B5CF6"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorAttendance)"
                    />
                    {data.attendance.data[0].previousYear !== undefined && (
                      <Area
                        type="monotone"
                        dataKey="previousYear"
                        stroke="#94a3b8"
                        strokeWidth={1.5}
                        strokeDasharray="5 5"
                        fillOpacity={0}
                      />
                    )}
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Donation Trends</CardTitle>
              <CardDescription>Monthly donation amounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.donations.data}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        border: "1px solid #f0f0f0",
                        borderRadius: "0.5rem",
                      }}
                      formatter={(value) => [`£${value}`, 'Amount']}
                    />
                    <Legend />
                    <Bar
                      dataKey="value"
                      name="This Year"
                      fill="#8B5CF6"
                      radius={[4, 4, 0, 0]}
                    />
                    {data.donations.data[0].previousYear !== undefined && (
                      <Bar
                        dataKey="previousYear"
                        name="Last Year"
                        fill="#CBD5E1"
                        radius={[4, 4, 0, 0]}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default GrowthMetrics;

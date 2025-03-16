import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import OrganizerSidebar from "@/components/dashboard/OrganizerSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, BarChart2, TrendingUp, Users, Clock, Eye, MousePointerClick, ArrowRight } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const attendanceData = [
  { date: "Jan", attendees: 120, target: 150 },
  { date: "Feb", attendees: 180, target: 170 },
  { date: "Mar", attendees: 250, target: 190 },
  { date: "Apr", attendees: 310, target: 210 },
  { date: "May", attendees: 440, target: 230 },
  { date: "Jun", attendees: 350, target: 250 },
  { date: "Jul", attendees: 290, target: 270 },
];

const engagementData = [
  { date: "Mon", views: 45, clicks: 15 },
  { date: "Tue", views: 52, clicks: 18 },
  { date: "Wed", views: 78, clicks: 23 },
  { date: "Thu", views: 103, clicks: 38 },
  { date: "Fri", views: 142, clicks: 65 },
  { date: "Sat", views: 98, clicks: 42 },
  { date: "Sun", views: 56, clicks: 19 },
];

const genderData = [
  { name: "Male", value: 65 },
  { name: "Female", value: 35 },
];

const ageData = [
  { name: "18-24", value: 35 },
  { name: "25-34", value: 40 },
  { name: "35-44", value: 15 },
  { name: "45+", value: 10 },
];

const locationData = [
  { city: "London", percentage: 45 },
  { city: "Birmingham", percentage: 22 },
  { city: "Manchester", percentage: 18 },
  { city: "Leeds", percentage: 9 },
  { city: "Other", percentage: 6 },
];

const GENDER_COLORS = ["#8884d8", "#82ca9d"];
const AGE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const OrganizerAnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState("30days");
  const [selectedEvent, setSelectedEvent] = useState("all");
  
  return (
    <PageWrapper withFooter={false}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          <OrganizerSidebar />
          
          <SidebarInset>
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b shadow-sm">
              <div className="px-6 py-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                  <p className="text-sm text-muted-foreground">
                    Insights and data about your events
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[160px]">
                      <Calendar className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7days">Last 7 days</SelectItem>
                      <SelectItem value="30days">Last 30 days</SelectItem>
                      <SelectItem value="90days">Last 90 days</SelectItem>
                      <SelectItem value="year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="px-6 pb-4">
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="event1">Community Iftar Dinner</SelectItem>
                    <SelectItem value="event2">Islamic Finance Workshop</SelectItem>
                    <SelectItem value="event3">Eid Festival Celebration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </header>
            
            <div className="p-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="audience">Audience</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                      title="Total Attendees"
                      value="3,247"
                      change="+18%"
                      changeType="positive"
                      icon={<Users className="h-5 w-5" />}
                    />
                    <MetricCard
                      title="Page Views"
                      value="12,589"
                      change="+24%"
                      changeType="positive"
                      icon={<Eye className="h-5 w-5" />}
                    />
                    <MetricCard
                      title="Click-Through Rate"
                      value="8.3%"
                      change="-2.1%"
                      changeType="negative"
                      icon={<MousePointerClick className="h-5 w-5" />}
                    />
                    <MetricCard
                      title="Event Conversion"
                      value="4.6%"
                      change="+0.8%"
                      changeType="positive"
                      icon={<TrendingUp className="h-5 w-5" />}
                    />
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Attendance Growth</CardTitle>
                      <CardDescription>Monthly attendance for all events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={attendanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorAttendees" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fill: 'hsl(var(--muted-foreground))' }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <Tooltip />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="attendees" 
                              stroke="hsl(var(--primary))" 
                              fillOpacity={1} 
                              fill="url(#colorAttendees)" 
                              name="Attendees"
                            />
                            <Line 
                              type="monotone" 
                              dataKey="target" 
                              stroke="hsl(var(--muted-foreground))" 
                              strokeDasharray="5 5" 
                              name="Target"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <PremiumAnalyticsTeaser
                      title="Attendance Forecast"
                      description="Predict future attendance based on current trends and historical data."
                      icon={<BarChart2 className="h-6 w-6 text-primary" />}
                    />
                    <PremiumAnalyticsTeaser
                      title="Event Optimization"
                      description="Get AI-powered recommendations to optimize your event performance."
                      icon={<TrendingUp className="h-6 w-6 text-primary" />}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="engagement" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Page Engagement</CardTitle>
                      <CardDescription>Views and clicks over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={engagementData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="date" 
                              tick={{ fill: 'hsl(var(--muted-foreground))' }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: 'hsl(var(--muted-foreground))' }}
                            />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="views" fill="hsl(var(--primary)/70)" name="Page Views" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="clicks" fill="hsl(var(--primary))" name="Clicks" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-6 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Conversion Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center">
                          <div className="text-4xl font-bold text-primary mb-2">8.3%</div>
                          <p className="text-sm text-muted-foreground">Views to Ticket Sales</p>
                          <div className="flex items-center text-sm mt-3 text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+1.2% from last month</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Average Session</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center">
                          <div className="text-4xl font-bold text-primary mb-2">3:24</div>
                          <p className="text-sm text-muted-foreground">Minutes on Event Page</p>
                          <div className="flex items-center text-sm mt-3 text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>+0:42 from last month</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Bounce Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col items-center">
                          <div className="text-4xl font-bold text-primary mb-2">32%</div>
                          <p className="text-sm text-muted-foreground">Single Page Sessions</p>
                          <div className="flex items-center text-sm mt-3 text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" />
                            <span>-5% from last month</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="audience" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Gender Distribution</CardTitle>
                        <CardDescription>Breakdown of attendees by gender</CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <div className="h-[250px] w-full max-w-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={genderData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {genderData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Age Distribution</CardTitle>
                        <CardDescription>Breakdown of attendees by age</CardDescription>
                      </CardHeader>
                      <CardContent className="flex justify-center">
                        <div className="h-[250px] w-full max-w-[300px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={ageData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {ageData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Locations</CardTitle>
                      <CardDescription>Where your attendees are coming from</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {locationData.map((location, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                                <span className="font-semibold text-primary text-sm">{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium">{location.city}</p>
                                <p className="text-sm text-muted-foreground">{location.percentage}% of attendees</p>
                              </div>
                            </div>
                            <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full" 
                                style={{ width: `${location.percentage}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PageWrapper>
  );
};

const MetricCard = ({ title, value, change, changeType, icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            {icon}
          </div>
        </div>
        {change && (
          <div className="mt-4 flex items-center text-xs">
            <span
              className={`rounded-full px-2 py-0.5 ${
                changeType === "positive"
                  ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                  : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {change}
            </span>
            <span className="ml-2 text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const PremiumAnalyticsTeaser = ({ title, description, icon }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Dialog>
          <DialogTrigger asChild>
            <div className="p-6 cursor-pointer hover:bg-muted/20 transition-colors">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  {icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold flex items-center gap-2 mb-1">
                    {title}
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      PRO
                    </Badge>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{description}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    <span>Unlock Feature</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upgrade to Pro</DialogTitle>
              <DialogDescription>
                Get access to premium analytics features to grow your events and maximize attendance.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">AI-Powered Insights</h4>
                  <p className="text-sm text-muted-foreground">Smart recommendations to boost engagement</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart2 className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Advanced Analytics</h4>
                  <p className="text-sm text-muted-foreground">Deep audience insights and forecasting</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Real-time Data</h4>
                  <p className="text-sm text-muted-foreground">See performance as it happens</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Upgrade for $9.99/month</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default OrganizerAnalyticsPage;

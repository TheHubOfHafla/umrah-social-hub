
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import OrganizerSidebar from "@/components/dashboard/OrganizerSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Download, DollarSign, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, FileText, Clock, Filter, ChevronDown } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock data for charts
const revenueData = [
  { month: "Jan", revenue: 1200, expenses: 300 },
  { month: "Feb", revenue: 1800, expenses: 450 },
  { month: "Mar", revenue: 2500, expenses: 580 },
  { month: "Apr", revenue: 3100, expenses: 620 },
  { month: "May", revenue: 4400, expenses: 850 },
  { month: "Jun", revenue: 3500, expenses: 750 },
  { month: "Jul", revenue: 2900, expenses: 600 },
];

const ticketRevenueData = [
  { name: "Standard", value: 4200, color: "#8884d8" },
  { name: "VIP", value: 3000, color: "#82ca9d" },
  { name: "Early Bird", value: 2800, color: "#ffc658" },
  { name: "Family Pack", value: 1800, color: "#ff8042" },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const transactions = [
  { id: "TR-7829", date: "Jul 15, 2023", event: "Community Iftar Dinner", amount: 1275, status: "completed", paymentMethod: "Stripe" },
  { id: "TR-7830", date: "Jul 05, 2023", event: "Islamic Finance Workshop", amount: 960, status: "completed", paymentMethod: "PayPal" },
  { id: "TR-7831", date: "Jun 29, 2023", event: "Eid Festival Celebration", amount: 2400, status: "pending", paymentMethod: "Stripe" },
  { id: "TR-7832", date: "Jun 22, 2023", event: "Family Day Out", amount: 850, status: "completed", paymentMethod: "Bank Transfer" },
  { id: "TR-7833", date: "Jun 18, 2023", event: "Youth Summer Camp", amount: 3500, status: "completed", paymentMethod: "Stripe" },
];

const invoices = [
  { id: "INV-001", date: "Jul 15, 2023", amount: 1275, status: "paid" },
  { id: "INV-002", date: "Jul 05, 2023", amount: 960, status: "paid" },
  { id: "INV-003", date: "Jun 29, 2023", amount: 2400, status: "pending" },
  { id: "INV-004", date: "Jun 22, 2023", amount: 850, status: "paid" },
  { id: "INV-005", date: "Jun 18, 2023", amount: 3500, status: "paid" },
];

const OrganizerFinancialsPage = () => {
  const [timeRange, setTimeRange] = useState("30days");
  
  return (
    <PageWrapper withFooter={false}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          <OrganizerSidebar />
          
          <SidebarInset>
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b shadow-sm">
              <div className="px-6 py-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Financials</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your revenue, expenses and payouts
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
            </header>
            
            <div className="p-6">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                  <TabsTrigger value="payouts">Payouts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <FinancialCard
                      title="Total Revenue"
                      value="$14,985"
                      change="+24%"
                      changeType="positive"
                      icon={<DollarSign className="h-5 w-5" />}
                    />
                    <FinancialCard
                      title="Net Profit"
                      value="$10,843"
                      change="+18%"
                      changeType="positive"
                      icon={<ArrowUpRight className="h-5 w-5" />}
                    />
                    <FinancialCard
                      title="Expenses"
                      value="$4,142"
                      change="+8%"
                      changeType="negative"
                      icon={<ArrowDownRight className="h-5 w-5" />}
                    />
                    <FinancialCard
                      title="Available Balance"
                      value="$8,750"
                      description="Ready to withdraw"
                      icon={<Wallet className="h-5 w-5" />}
                    />
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                      <CardDescription>Monthly revenue and expenses</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                            <XAxis 
                              dataKey="month" 
                              tick={{ fill: 'hsl(var(--muted-foreground))' }}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              tickLine={false}
                              axisLine={false}
                              tick={{ fill: 'hsl(var(--muted-foreground))' }}
                              tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                            <Legend />
                            <Area 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke="hsl(var(--primary))" 
                              fillOpacity={1} 
                              fill="url(#colorRevenue)" 
                              name="Revenue"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="expenses" 
                              stroke="hsl(var(--destructive))" 
                              fillOpacity={1} 
                              fill="url(#colorExpenses)" 
                              name="Expenses"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue by Ticket Type</CardTitle>
                        <CardDescription>Breakdown of revenue sources</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col md:flex-row items-center justify-between">
                        <div className="w-full max-w-[220px] h-[220px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={ticketRevenueData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {ticketRevenueData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value) => [`$${value}`, undefined]} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="flex-1 space-y-3 mt-5 md:mt-0">
                          {ticketRevenueData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div 
                                  className="h-3 w-3 rounded-full" 
                                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                />
                                <span className="text-sm">{item.name}</span>
                              </div>
                              <span className="font-medium">${item.value}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Upcoming Payouts</CardTitle>
                        <CardDescription>Scheduled transfers to your bank account</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between border-b pb-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <CreditCard className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">July 2023 Payout</p>
                                <p className="text-sm text-muted-foreground">Via Bank Transfer</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">$3,845</p>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>In 3 days</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 p-2 rounded-full">
                                <CreditCard className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">August 2023 Payout</p>
                                <p className="text-sm text-muted-foreground">Via Bank Transfer</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">$4,905</p>
                              <div className="flex items-center text-xs text-muted-foreground mt-1">
                                <Clock className="h-3 w-3 mr-1" />
                                <span>In 33 days</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="border-t pt-4 flex justify-between">
                        <Button variant="outline" size="sm">View All Payouts</Button>
                        <Button size="sm">Request Early Payout</Button>
                      </CardFooter>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="transactions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Transactions</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Download className="h-4 w-4" />
                            <span>Export</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Transaction ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Event</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Method</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">{transaction.id}</TableCell>
                              <TableCell>{transaction.date}</TableCell>
                              <TableCell>{transaction.event}</TableCell>
                              <TableCell>${transaction.amount}</TableCell>
                              <TableCell>{transaction.paymentMethod}</TableCell>
                              <TableCell>
                                <Badge variant={transaction.status === "completed" ? "outline" : "secondary"} className={
                                  transaction.status === "completed" ? "bg-green-50 text-green-600 border-green-200" : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                }>
                                  {transaction.status === "completed" ? "Completed" : "Pending"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing 5 of 24 transactions
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="invoices" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Invoices</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Filter className="h-4 w-4" />
                            <span>Filter</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="gap-1.5">
                            <FileText className="h-4 w-4" />
                            <span>New Invoice</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                              <TableCell className="font-medium">{invoice.id}</TableCell>
                              <TableCell>{invoice.date}</TableCell>
                              <TableCell>${invoice.amount}</TableCell>
                              <TableCell>
                                <Badge variant={invoice.status === "paid" ? "outline" : "secondary"} className={
                                  invoice.status === "paid" ? "bg-green-50 text-green-600 border-green-200" : "bg-yellow-50 text-yellow-600 border-yellow-200"
                                }>
                                  {invoice.status === "paid" ? "Paid" : "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    View
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    Download
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing 5 of 12 invoices
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="payouts" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Payout Settings</CardTitle>
                        <Button size="sm">Update Bank Details</Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-muted/40 border rounded-lg p-4">
                          <h3 className="font-medium mb-2">Payout Method</h3>
                          <div className="flex items-center gap-3">
                            <div className="bg-card p-2 rounded-md">
                              <CreditCard className="h-6 w-6" />
                            </div>
                            <div>
                              <p className="font-medium">Bank Transfer</p>
                              <p className="text-sm text-muted-foreground">HSBC ***** 4832</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/40 border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Payout Schedule</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Monthly</p>
                                <p className="text-sm text-muted-foreground">Payouts processed on the 1st of each month</p>
                              </div>
                              <Button variant="outline" size="sm">Change</Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Minimum Payout Amount</p>
                                <p className="text-sm text-muted-foreground">Payouts only processed when balance exceeds this amount</p>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">$100</p>
                                <Button variant="link" size="sm" className="h-auto p-0">Edit</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-muted/40 border rounded-lg p-4">
                          <h3 className="font-medium mb-3">Upcoming Payouts</h3>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">July 2023</p>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>Processing on August 1, 2023</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">$3,845</p>
                                <Button variant="link" size="sm" className="h-auto p-0">View Details</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Payout History</CardTitle>
                      <CardDescription>Record of all past payouts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Reference</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Jun 1, 2023</TableCell>
                            <TableCell className="font-medium">PO-2023-06</TableCell>
                            <TableCell>$2,853</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Completed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                Receipt
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>May 1, 2023</TableCell>
                            <TableCell className="font-medium">PO-2023-05</TableCell>
                            <TableCell>$3,124</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Completed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                Receipt
                              </Button>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Apr 1, 2023</TableCell>
                            <TableCell className="font-medium">PO-2023-04</TableCell>
                            <TableCell>$2,574</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                                Completed
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                Receipt
                              </Button>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <div className="text-sm text-muted-foreground">
                        Showing 3 of 12 payouts
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" disabled>Previous</Button>
                        <Button variant="outline" size="sm">Next</Button>
                      </div>
                    </CardFooter>
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

// Financial Card Component
const FinancialCard = ({ title, value, change, changeType, description, icon }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
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

export default OrganizerFinancialsPage;

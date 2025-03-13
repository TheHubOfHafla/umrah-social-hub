
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard, Wallet } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FinancialOverviewProps {
  ticketSales: any[];
  isLoading: boolean;
}

const FinancialOverview = ({ ticketSales, isLoading }: FinancialOverviewProps) => {
  // Mockup data - would be replaced with real data in production
  const financialStats = [
    { label: "Total Revenue", value: "$12,845", percentage: 75, trend: "+15%" },
    { label: "Average Ticket", value: "$42.50", percentage: 65, trend: "+3%" },
    { label: "Expenses", value: "$2,450", percentage: 20, trend: "-5%" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          Summary of your revenue and expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {financialStats.map((stat, index) => (
              <div key={index} className="bg-secondary/20 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{stat.label}</span>
                  {index === 0 ? 
                    <DollarSign className="h-4 w-4 text-primary" /> : 
                    index === 1 ? 
                    <CreditCard className="h-4 w-4 text-primary" /> : 
                    <Wallet className="h-4 w-4 text-primary" />
                  }
                </div>
                <div className="text-2xl font-bold mb-2">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.trend} from last month</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h4 className="text-sm font-medium mb-4">Revenue Breakdown</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Ticket Sales</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Merchandise</span>
                  <span>14%</span>
                </div>
                <Progress value={14} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Sponsorships</span>
                  <span>8%</span>
                </div>
                <Progress value={8} className="h-2" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-medium">Quarterly Forecast</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Projected Q4 revenue: <span className="font-medium text-foreground">$42,500</span> (+18% YoY)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;

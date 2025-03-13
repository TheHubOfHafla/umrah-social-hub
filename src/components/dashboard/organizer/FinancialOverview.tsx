
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FinancialOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Overview</CardTitle>
        <CardDescription>
          Summary of your revenue and expenses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 flex items-center justify-center">
          <p className="text-muted-foreground">Financial data will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialOverview;

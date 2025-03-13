
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AudienceOverview = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Overview</CardTitle>
        <CardDescription>
          Insights about your attendees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 flex items-center justify-center">
          <p className="text-muted-foreground">Audience data will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceOverview;

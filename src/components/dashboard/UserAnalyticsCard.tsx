
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Calendar, Users } from "lucide-react";

interface UserAnalyticsCardProps {
  totalUsers: number;
  newUsersThisMonth: number;
  topCity: string;
  topInterest: string;
}

const UserAnalyticsCard = ({
  totalUsers,
  newUsersThisMonth,
  topCity,
  topInterest
}: UserAnalyticsCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">User Analytics</CardTitle>
        <CardDescription>Overview of your user base</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Total Users</p>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-primary" />
              <p className="text-2xl font-bold">{totalUsers}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">New This Month</p>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary" />
              <p className="text-2xl font-bold">{newUsersThisMonth}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Top City</p>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">{topCity}</p>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Top Interest</p>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">{topInterest}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserAnalyticsCard;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, MapPin, Calendar, Users, ChevronUp } from "lucide-react";

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
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4 bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Total Users</span>
          </div>
          <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
          <div className="flex items-center mt-2 text-xs text-green-600">
            <ChevronUp className="h-3 w-3 mr-1" />
            <span>12% from last month</span>
          </div>
        </div>
        
        <div className="rounded-xl p-4 bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">New This Month</span>
          </div>
          <div className="text-2xl font-bold">{newUsersThisMonth}</div>
          <div className="flex items-center mt-2 text-xs text-green-600">
            <ChevronUp className="h-3 w-3 mr-1" />
            <span>3% from last week</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Top User Location</p>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <p className="text-base font-medium">{topCity}</p>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            65% of your users
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1">Top User Interest</p>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <p className="text-base font-medium">{topInterest}</p>
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            48% of your users
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-xs text-center">
        <a href="#" className="text-primary hover:underline">View detailed audience insights →</a>
      </div>
    </div>
  );
};

export default UserAnalyticsCard;

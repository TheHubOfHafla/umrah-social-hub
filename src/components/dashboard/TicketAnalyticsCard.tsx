
import { CalendarClock, TrendingUp, Ticket } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface TicketAnalyticsCardProps {
  totalTickets: number;
  soldTickets: number;
  timeUntilSellOut?: number; // in days
  sellRate: number; // tickets per day
}

const TicketAnalyticsCard = ({
  totalTickets,
  soldTickets,
  timeUntilSellOut,
  sellRate
}: TicketAnalyticsCardProps) => {
  const percentageSold = Math.round((soldTickets / totalTickets) * 100);
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tickets Sold</span>
          <span className="font-medium">{soldTickets} / {totalTickets}</span>
        </div>
        <Progress value={percentageSold} className="h-2" />
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{percentageSold}% Sold</span>
          <span className="text-muted-foreground">{totalTickets - soldTickets} Remaining</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <CalendarClock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Est. Sell Out</span>
          </div>
          <div className="text-2xl font-bold">
            {timeUntilSellOut ? `${timeUntilSellOut} days` : "N/A"}
          </div>
        </div>
        
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Daily Sales</span>
          </div>
          <div className="text-2xl font-bold">
            {sellRate} <span className="text-xs font-normal text-muted-foreground">tix/day</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAnalyticsCard;

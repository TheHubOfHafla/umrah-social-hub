
import { CalendarClock, TrendingUp, Ticket, Circle } from "lucide-react";
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
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tickets Sold</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold">{soldTickets} / {totalTickets}</span>
            <span className="text-xs rounded-full px-2 py-0.5 bg-primary/10 text-primary font-medium">
              {percentageSold}%
            </span>
          </div>
        </div>
        
        <div className="relative pt-1">
          <Progress value={percentageSold} className="h-2.5 rounded-full" />
          <div className="absolute top-1 left-0 h-2.5 w-full flex justify-between px-1">
            <div className="relative" style={{ left: `${percentageSold}%`, marginLeft: '-8px' }}>
              <div className="absolute top-0 -mt-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-primary"></div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Circle className="h-3 w-3 fill-primary text-primary" />
            <span>{soldTickets} Sold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Circle className="h-3 w-3 fill-muted text-muted-foreground" />
            <span>{totalTickets - soldTickets} Remaining</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-xl p-4 bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <CalendarClock className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Est. Sell Out</span>
          </div>
          <div className="text-2xl font-bold">
            {timeUntilSellOut ? `${timeUntilSellOut} days` : "N/A"}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Based on current sell rate
          </div>
        </div>
        
        <div className="rounded-xl p-4 bg-primary/5 border border-primary/10">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-medium">Daily Sales</span>
          </div>
          <div className="text-2xl font-bold">
            {sellRate} <span className="text-xs font-normal text-muted-foreground">tix/day</span>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            Average over last 7 days
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketAnalyticsCard;

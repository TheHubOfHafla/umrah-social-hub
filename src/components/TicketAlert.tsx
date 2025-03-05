
import { Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type TicketAlertType = "selling-fast" | "recent-purchase";

interface TicketAlertProps {
  type: TicketAlertType;
  timeAgo?: string;
  className?: string;
}

const TicketAlert = ({ type, timeAgo, className }: TicketAlertProps) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md",
        "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
        className
      )}
    >
      {type === "selling-fast" ? (
        <>
          <Flame className="h-3 w-3" />
          <span>Tickets selling fast</span>
        </>
      ) : (
        <>
          <Clock className="h-3 w-3" />
          <span>Ticket bought {timeAgo}</span>
        </>
      )}
    </div>
  );
};

export default TicketAlert;

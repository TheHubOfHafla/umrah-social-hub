import { useState } from "react";
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Event } from "@/types";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import Button from "./Button";
import AttendeesList from "./AttendeesList";
import TicketAlert from "./TicketAlert";

interface EventCardProps {
  event: Event;
  className?: string;
  variant?: "default" | "featured";
}

const EventCard = ({ event, className, variant = "default" }: EventCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFeatured = variant === "featured";
  const displayDate = format(new Date(event.date.start), "EEE, MMM d • h:mm a");
  const displayLocation = `${event.location.city}, ${event.location.country}`;

  // Calculate time since last purchase if available
  const getTimeAgo = () => {
    if (event.ticketActivity?.lastPurchaseTime) {
      return formatDistanceToNow(new Date(event.ticketActivity.lastPurchaseTime), { 
        addSuffix: false 
      });
    }
    return "";
  };

  return (
    <Link to={`/events/${event.id}`}>
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 group relative h-full",
          "hover:shadow-lg hover:border-primary hover:translate-y-[-3px]",
          isFeatured ? "border-0 shadow-none" : "shadow-sm",
          className
        )}
      >
        <div className="relative">
          <AspectRatio ratio={isFeatured ? 16/9 : 4/3}>
            <img
              src={event.image}
              alt={event.title}
              className="object-cover w-full h-full z-10"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
          </AspectRatio>
          
          {isFeatured && (
            <Badge 
              className="absolute top-3 left-3 z-20 bg-primary/90 hover:bg-primary/90 backdrop-blur-sm"
            >
              Featured
            </Badge>
          )}

          {/* Ticket Activity Alerts */}
          {event.ticketActivity && (
            <div className="absolute bottom-3 left-3 right-3 z-20">
              {event.ticketActivity.isSellingFast && (
                <TicketAlert 
                  type="selling-fast" 
                  className="mb-1 backdrop-blur-sm"
                />
              )}
              {event.ticketActivity.lastPurchaseTime && (
                <TicketAlert 
                  type="recent-purchase" 
                  timeAgo={getTimeAgo()} 
                  className="backdrop-blur-sm"
                />
              )}
            </div>
          )}
        </div>

        <CardContent className={cn(
          "p-4 transition-colors duration-300 group-hover:bg-primary/5",
          isFeatured && "px-0 pt-3"
        )}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 border-0 text-xs group-hover:bg-primary/20">
                {event.categories[0]}
              </Badge>
              {event.isFree ? (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-0 text-xs">
                  Free
                </Badge>
              ) : (
                <span className="text-sm font-medium">
                  {event.price ? `From £${event.price}` : ''}
                </span>
              )}
            </div>

            <h3 className={cn(
              "font-semibold leading-tight transition-colors duration-300 group-hover:text-primary",
              isFeatured ? "text-2xl" : "text-lg"
            )}>
              {event.title}
            </h3>

            <p className="text-muted-foreground text-sm line-clamp-2 group-hover:text-foreground/90">
              {event.shortDescription}
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/70">
                <CalendarIcon className="mr-1 h-4 w-4" />
                {displayDate}
              </div>
              <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/70">
                <MapPin className="mr-1 h-4 w-4" />
                {displayLocation}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className={cn(
          "p-4 pt-0 flex items-center justify-between transition-colors duration-300 group-hover:bg-primary/5",
          isFeatured && "px-0"
        )}>
          <UserAvatar 
            user={event.organizer} 
            size="sm" 
            showName 
            namePosition="right" 
          />
          
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex -space-x-2">
              {event.attendees.slice(0, 3).map((attendee) => (
                <UserAvatar
                  key={attendee.userId}
                  user={attendee}
                  size="sm"
                  className="ring-2 ring-background"
                />
              ))}
              {event.attendees.length > 3 && (
                <div className="flex items-center justify-center rounded-full bg-secondary h-8 w-8 ring-2 ring-background text-xs font-medium">
                  +{event.attendees.length - 3}
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;

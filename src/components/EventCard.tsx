
import { useState, useContext } from "react";
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
import SaveEventButton from "./SaveEventButton";
import { AuthContext } from "@/App";

interface EventCardProps {
  event: Event;
  className?: string;
  variant?: "default" | "featured";
}

const EventCard = ({ event, className, variant = "default" }: EventCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const { isAuthenticated, currentUser } = useContext(AuthContext);

  const isFeatured = variant === "featured";
  const displayDate = format(new Date(event.date.start), "EEE, MMM d • h:mm a");
  const displayLocation = `${event.location.city}, ${event.location.country}`;

  // Use the uploaded image instead of the dynamic event.image
  const imageSrc = "/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png";

  // Calculate time since last purchase if available
  const getTimeAgo = () => {
    if (event.ticketActivity?.lastPurchaseTime) {
      return formatDistanceToNow(new Date(event.ticketActivity.lastPurchaseTime), { 
        addSuffix: false 
      });
    }
    return "";
  };

  // Check if the event is saved by the current user
  const isEventSaved = isAuthenticated && currentUser?.savedEvents?.includes(event.id);

  return (
    <Link to={`/events/${event.id}`} className="block w-full h-full">
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 group relative h-full w-full flex flex-col",
          "hover:shadow-md hover:border-primary/30 hover:translate-y-[-3px]",
          isFeatured ? "border-0 shadow-none" : "shadow-sm",
          className
        )}
      >
        <div className="relative">
          <AspectRatio ratio={16/9}>
            <img
              src={imageSrc}
              alt={event.title}
              className="object-cover w-full h-full z-10 transition-transform duration-500 group-hover:scale-102"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
          </AspectRatio>
          
          {isFeatured && (
            <Badge 
              className="absolute top-2 left-2 z-20 bg-primary/90 hover:bg-primary/90 backdrop-blur-sm text-xs"
            >
              Featured
            </Badge>
          )}

          <div className="absolute top-2 right-2 z-20">
            <SaveEventButton 
              eventId={event.id} 
              isSaved={isEventSaved} 
              variant="icon" 
              className="bg-white/80 hover:bg-white/90 backdrop-blur-sm scale-75"
            />
          </div>

          {/* Ticket Activity Alerts */}
          {event.ticketActivity && (
            <div className="absolute bottom-2 left-2 right-2 z-20">
              {event.ticketActivity.isSellingFast && (
                <TicketAlert 
                  type="selling-fast" 
                  className="mb-1 backdrop-blur-sm text-xs"
                />
              )}
              {event.ticketActivity.lastPurchaseTime && (
                <TicketAlert 
                  type="recent-purchase" 
                  timeAgo={getTimeAgo()} 
                  className="backdrop-blur-sm text-xs"
                />
              )}
            </div>
          )}
        </div>

        <CardContent className={cn(
          "p-3 transition-all duration-300 group-hover:bg-primary/5 flex-grow",
          isFeatured && "px-0 pt-2"
        )}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 border-0 text-xs group-hover:bg-primary/20 transition-colors duration-300">
                {event.categories[0]}
              </Badge>
              {event.isFree ? (
                <Badge variant="outline" className="bg-green-50 text-green-600 border-0 text-xs group-hover:bg-green-100 transition-colors duration-300">
                  Free
                </Badge>
              ) : (
                <span className="text-xs font-medium">
                  {event.price ? `From £${event.price}` : ''}
                </span>
              )}
            </div>

            <h3 className={cn(
              "font-semibold leading-tight transition-colors duration-300 group-hover:text-primary line-clamp-1",
              isFeatured ? "text-xl" : "text-base"
            )}>
              {event.title}
            </h3>

            <p className="text-muted-foreground text-xs line-clamp-2 transition-colors duration-300 group-hover:text-foreground/90 h-10">
              {event.shortDescription}
            </p>

            <div className="flex flex-col gap-1 pt-1">
              <div className="flex items-center text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70">
                <CalendarIcon className="mr-1 h-3 w-3 transition-colors duration-300 group-hover:text-primary/70" />
                {displayDate}
              </div>
              <div className="flex items-center text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground/70">
                <MapPin className="mr-1 h-3 w-3 transition-colors duration-300 group-hover:text-primary/70" />
                {displayLocation}
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className={cn(
          "p-3 pt-0 flex items-center justify-between transition-colors duration-300 group-hover:bg-primary/5 mt-auto",
          isFeatured && "px-0"
        )}>
          <UserAvatar 
            user={event.organizer} 
            size="xs" 
            showName 
            namePosition="right" 
          />
          
          {event.attendees && event.attendees.length > 0 && (
            <div className="flex -space-x-1">
              {event.attendees.slice(0, 3).map((attendee) => (
                <UserAvatar
                  key={attendee.userId}
                  user={attendee}
                  size="xs"
                  className="ring-1 ring-background transition-transform duration-300 group-hover:translate-y-[-1px]"
                />
              ))}
              {event.attendees.length > 3 && (
                <div className="flex items-center justify-center rounded-full bg-secondary h-6 w-6 ring-1 ring-background text-xs font-medium transition-transform duration-300 group-hover:translate-y-[-1px] group-hover:bg-primary/20">
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


import { Event } from "@/types";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface FeaturedEventProps {
  event: Event;
  className?: string;
}

const FeaturedEvent = ({ event, className }: FeaturedEventProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const displayDate = format(new Date(event.date.start), "EEEE, MMMM d • h:mm a");
  const displayLocation = `${event.location.name}, ${event.location.city}`;
  
  // Calculate sold percentage if ticket types exist
  const soldPercentage = event.ticketTypes 
    ? Math.min(
        100,
        Math.floor(
          (event.ticketTypes.reduce((acc, ticket) => acc + ticket.sold, 0) / 
          event.ticketTypes.reduce((acc, ticket) => acc + ticket.quantity, 0)) * 100
        )
      )
    : event.attendees && event.capacity
    ? Math.min(100, Math.floor((event.attendees.length / event.capacity) * 100))
    : null;

  return (
    <div 
      className={cn(
        "relative overflow-hidden rounded-2xl transition-all duration-300 group",
        "bg-gradient-to-b from-primary/5 to-background",
        "border border-border/50 shadow-sm hover:shadow-xl hover:border-primary",
        "hover:translate-y-[-5px]",
        className
      )}
    >
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-8 py-8 relative z-10">
        <div className="flex flex-col justify-center">
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="bg-primary/10 border-0 text-xs px-3 py-1 group-hover:bg-primary/20">
              {event.categories[0]}
            </Badge>
            <Badge variant="secondary" className="text-xs px-3 py-1 group-hover:bg-primary/10 group-hover:text-primary">
              Featured Event
            </Badge>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 transition-colors duration-300 group-hover:text-primary">
            {event.title}
          </h1>
          
          <p className="text-muted-foreground mb-6 text-lg group-hover:text-foreground/90">
            {event.shortDescription}
          </p>
          
          <div className="flex flex-col gap-3 mb-6">
            <div className="flex items-center text-sm group-hover:text-foreground/90">
              <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
              <span>{displayDate}</span>
            </div>
            <div className="flex items-center text-sm group-hover:text-foreground/90">
              <MapPin className="mr-2 h-5 w-5 text-primary" />
              <span>{displayLocation}</span>
            </div>
            {event.organizer && (
              <div className="flex items-center">
                <UserAvatar 
                  user={event.organizer} 
                  size="md" 
                  showName 
                  namePosition="right" 
                />
              </div>
            )}
          </div>
          
          {soldPercentage !== null && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {soldPercentage === 100 ? 'Sold out' : `${soldPercentage}% booked`}
                  </span>
                </div>
                {event.capacity && (
                  <span className="text-sm text-muted-foreground">
                    Capacity: {event.capacity}
                  </span>
                )}
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden group-hover:bg-primary/10">
                <div 
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${soldPercentage}%` }}
                />
              </div>
            </div>
          )}
          
          <div className="flex space-x-4">
            <Link to={`/events/${event.id}`}>
              <Button size="lg" className="transition-all duration-300 hover:scale-105 group-hover:shadow-md">
                {event.isFree ? 'Register Now' : 'Book Tickets'}
              </Button>
            </Link>
            <Link to={`/events/${event.id}`}>
              <Button variant="outline" size="lg" className="transition-all duration-300 hover:scale-105 group-hover:border-primary">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="relative flex items-center justify-center">
          <div className={cn(
            "w-full aspect-[4/3] rounded-lg overflow-hidden shadow-lg group-hover:shadow-xl",
            !imageLoaded && "animate-pulse bg-muted"
          )}>
            <img
              src={event.image}
              alt={event.title}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedEvent;

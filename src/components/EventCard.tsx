
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import { CalendarIcon, Clock, MapPin, Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Event } from "@/types";
import UserAvatar from "./UserAvatar";
import { cn } from "@/lib/utils";
import Button from "./Button";
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

  // Get formatted date
  const getFormattedDate = () => {
    const date = new Date(event.date.start);
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  // Check if the event is saved by the current user
  const isEventSaved = isAuthenticated && currentUser?.savedEvents?.includes(event.id);

  return (
    <Link to={`/events/${event.id}`} className="block h-full">
      <Card 
        className={cn(
          "overflow-hidden transition-all duration-300 group relative h-full w-full flex flex-col",
          "border-gray-200 hover:border-[#4A90E2]/30 hover:shadow-md hover:translate-y-[-3px]",
          isFeatured ? "shadow-md" : "shadow-sm",
          className
        )}
      >
        <div className="relative">
          <AspectRatio ratio={16/9}>
            <img
              src={imageSrc}
              alt={event.title}
              className="object-cover w-full h-full z-10 transition-transform duration-500 group-hover:scale-[1.03]"
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
          </AspectRatio>
          
          {/* Date overlay */}
          <div className="absolute top-3 left-3 bg-white dark:bg-gray-800 rounded-lg shadow-md px-2 py-1 text-center z-20">
            <div className="text-xs font-bold text-[#4A90E2]">{getFormattedDate()}</div>
          </div>
          
          {/* Save button */}
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
            >
              <Heart className={cn(
                "h-4 w-4 transition-colors", 
                isEventSaved ? "fill-red-500 text-red-500" : "text-gray-500"
              )} />
            </Button>
          </div>

          {/* Price or Free badge */}
          <div className="absolute bottom-3 left-3 z-20">
            {event.isFree ? (
              <Badge className="bg-green-500 hover:bg-green-600">Free</Badge>
            ) : (
              event.price && <Badge className="bg-[#4A90E2] hover:bg-[#3A7BC8]">£{event.price}</Badge>
            )}
          </div>

          {/* Ticket Activity Alert */}
          {event.ticketActivity?.isSellingFast && (
            <div className="absolute bottom-3 right-3 z-20">
              <TicketAlert 
                type="selling-fast" 
                className="bg-red-500/90 text-white text-xs font-medium px-2 py-1 rounded-md"
              />
            </div>
          )}
        </div>

        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="mb-2 flex flex-wrap gap-2">
            {event.categories.slice(0, 1).map(category => (
              <Badge 
                key={category} 
                variant="secondary" 
                className="bg-[#4A90E2]/10 hover:bg-[#4A90E2]/20 text-[#4A90E2] border-0"
              >
                {category}
              </Badge>
            ))}
          </div>
          
          <h3 className="font-semibold text-base md:text-lg mb-1.5 line-clamp-2 group-hover:text-[#4A90E2] transition-colors">
            {event.title}
          </h3>
          
          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
            {event.shortDescription}
          </p>
          
          <div className="flex flex-col gap-1.5 mt-auto text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <Clock className="mr-2 h-3.5 w-3.5 text-[#4A90E2]" />
              {new Date(event.date.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-3.5 w-3.5 text-[#4A90E2]" />
              {displayLocation}
            </div>
          </div>
        </CardContent>

        <CardFooter className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            <UserAvatar 
              user={event.organizer} 
              size="xs" 
              showName={false}
            />
            <div>
              <p className="text-xs font-medium">{event.organizer.name}</p>
              <p className="text-xs text-muted-foreground">Organizer</p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default EventCard;

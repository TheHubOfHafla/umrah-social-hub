
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import { cn } from "@/lib/utils";
import Button from "./Button";
import TicketAlert from "./TicketAlert";

interface FeaturedEventProps {
  event: Event;
}

const FeaturedEvent = ({ event }: FeaturedEventProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const imageSrc = "/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png";

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link to={`/events/${event.id}`}>
      <Card className={cn(
        "overflow-hidden transition-all duration-150 cursor-pointer group relative shadow-md h-full",
        "hover:shadow-lg border-gray-100",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="relative aspect-[21/9]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={imageSrc}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-20 text-white">
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <Badge className="bg-[#4A90E2] hover:bg-[#3A7BC8] transition-all duration-150 text-xs md:text-sm">Featured Event</Badge>
              {event.ticketActivity?.isSellingFast && (
                <TicketAlert type="selling-fast" className="bg-opacity-80 backdrop-blur-sm" />
              )}
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 group-hover:text-white transition-colors duration-150 line-clamp-2">
              {event.title}
            </h2>
            <p className="text-sm md:text-base text-white/90 mb-2 md:mb-4 max-w-2xl transition-opacity duration-150 group-hover:text-white line-clamp-2">
              {event.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-white/80 transition-all duration-150 group-hover:text-white/95">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 transition-colors duration-150 group-hover:text-[#4A90E2]" />
                {new Date(event.date.start).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 transition-colors duration-150 group-hover:text-[#4A90E2]" />
                {new Date(event.date.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 transition-colors duration-150 group-hover:text-[#4A90E2]" />
                {event.location.city}, {event.location.country}
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-4 transition-all duration-150 bg-white group-hover:bg-gray-50">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-6 h-6 md:w-8 md:h-8 rounded-full"
              />
              <div>
                <p className="font-medium text-xs md:text-sm">{event.organizer.name}</p>
                <p className="text-xs text-muted-foreground">Event Organizer</p>
              </div>
            </div>
            <Button variant="secondary" className="text-xs px-2 py-1 transition-all duration-150">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturedEvent;

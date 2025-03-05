
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CalendarIcon, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@/types";
import { cn } from "@/lib/utils";
import Button from "./Button";

interface FeaturedEventProps {
  event: Event;
}

const FeaturedEvent = ({ event }: FeaturedEventProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Link to={`/events/${event.id}`}>
      <Card className={cn(
        "overflow-hidden transition-all duration-700 transform cursor-pointer group relative",
        "hover:shadow-xl hover:scale-[1.02] hover:border-primary/40",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="relative aspect-[16/9] md:aspect-[21/9]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 z-20 text-white">
            <Badge className="bg-primary/90 hover:bg-primary mb-2 md:mb-3 transition-all duration-300 group-hover:scale-105 text-xs md:text-sm">Featured Event</Badge>
            <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 group-hover:text-primary-foreground transition-colors duration-300 group-hover:text-shadow-sm line-clamp-2 md:line-clamp-none">
              {event.title}
            </h2>
            <p className="text-sm md:text-lg text-white/90 mb-2 md:mb-4 max-w-2xl transition-opacity duration-300 group-hover:text-white line-clamp-2 md:line-clamp-3">
              {event.shortDescription}
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-white/80 transition-all duration-300 group-hover:text-white/95">
              <div className="flex items-center">
                <CalendarIcon className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 transition-colors duration-300 group-hover:text-primary/90" />
                {new Date(event.date.start).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 transition-colors duration-300 group-hover:text-primary/90" />
                {new Date(event.date.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4 transition-colors duration-300 group-hover:text-primary/90" />
                {event.location.city}, {event.location.country}
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-3 md:p-6 bg-gradient-to-r from-primary/5 to-accent/5 transition-all duration-300 group-hover:from-primary/10 group-hover:to-accent/10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full transition-transform duration-300 group-hover:scale-105"
              />
              <div>
                <p className="font-medium transition-colors duration-300 group-hover:text-primary text-sm md:text-base">{event.organizer.name}</p>
                <p className="text-xs md:text-sm text-muted-foreground transition-colors duration-300 group-hover:text-foreground/80">Event Organizer</p>
              </div>
            </div>
            <Button variant="secondary" className="text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 group-hover:bg-primary group-hover:text-white transition-all duration-300 hover:scale-105">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturedEvent;

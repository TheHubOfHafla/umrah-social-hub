
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
        "hover:shadow-lg hover:scale-[1.01]",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}>
        <div className="relative aspect-[21/9]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
            <Badge className="bg-primary/90 hover:bg-primary mb-3">Featured Event</Badge>
            <h2 className="text-3xl font-bold mb-2 group-hover:text-primary-foreground transition-colors">
              {event.title}
            </h2>
            <p className="text-lg text-white/90 mb-4 max-w-2xl">
              {event.shortDescription}
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-white/80">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {new Date(event.date.start).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="mr-2 h-4 w-4" />
                {new Date(event.date.start).toLocaleTimeString()}
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" />
                {event.location.city}, {event.location.country}
              </div>
            </div>
          </div>
        </div>
        <CardContent className="p-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <img
                src={event.organizer.avatar}
                alt={event.organizer.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-medium">{event.organizer.name}</p>
                <p className="text-sm text-muted-foreground">Event Organizer</p>
              </div>
            </div>
            <Button variant="secondary" className="group-hover:bg-primary group-hover:text-white transition-colors">
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default FeaturedEvent;

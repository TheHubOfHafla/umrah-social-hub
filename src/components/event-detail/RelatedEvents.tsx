
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Event } from "@/types";
import EventGrid from "@/components/EventGrid";
import Button from "@/components/Button";

interface RelatedEventsProps {
  events: Event[];
}

const RelatedEvents = ({ events }: RelatedEventsProps) => {
  if (events.length === 0) return null;
  
  return (
    <div className="border-t border-border/50 pt-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Similar Events</h2>
        <Link to="/events" className="hidden sm:flex">
          <Button 
            variant="ghost" 
            icon={<ArrowRight className="ml-2 h-4 w-4" />} 
            iconPosition="right"
          >
            View all events
          </Button>
        </Link>
      </div>
      
      <EventGrid events={events} columns={3} />
    </div>
  );
};

export default RelatedEvents;

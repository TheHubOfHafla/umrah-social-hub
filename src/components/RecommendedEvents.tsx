
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Event } from "@/types";
import EventGrid from "@/components/EventGrid";
import Button from "@/components/Button";

interface RecommendedEventsProps {
  events: Event[];
}

const RecommendedEvents = ({ events }: RecommendedEventsProps) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Recommended For You</h2>
          <p className="text-muted-foreground">Based on your interests and location</p>
        </div>
        <Link to="/events" className="hidden sm:block">
          <Button variant="ghost" icon={<ArrowRight className="ml-1 h-4 w-4" />} iconPosition="right">
            View all
          </Button>
        </Link>
      </div>
      
      <EventGrid events={events} columns={4} />
      
      <div className="text-center mt-8 sm:hidden">
        <Link to="/events">
          <Button variant="outline">View All Events</Button>
        </Link>
      </div>
    </section>
  );
};

export default RecommendedEvents;

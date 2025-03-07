
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Event, EventCategory } from "@/types";
import EventGrid from "@/components/EventGrid";
import Button from "@/components/Button";

interface CategoryEventsProps {
  category: EventCategory;
  events: Event[];
}

const CategoryEvents = ({ category, events }: CategoryEventsProps) => {
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate(`/events?category=${category}`);
    window.scrollTo(0, 0);
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight capitalize">
            {category} Events
          </h2>
          <p className="text-muted-foreground">
            Browse {category} events in your area
          </p>
        </div>
        <button onClick={handleViewAll} className="hidden sm:block">
          <Button variant="ghost" icon={<ArrowRight className="ml-1 h-4 w-4" />} iconPosition="right">
            View all
          </Button>
        </button>
      </div>
      
      <EventGrid events={events} columns={3} />
      
      <div className="text-center mt-8 sm:hidden">
        <button onClick={handleViewAll}>
          <Button variant="outline">
            View All {category} Events
          </Button>
        </button>
      </div>
    </section>
  );
};

export default CategoryEvents;

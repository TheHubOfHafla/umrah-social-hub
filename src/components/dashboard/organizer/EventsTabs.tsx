
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Event } from "@/types";
import EventsList from "./EventsList";

interface EventsTabsProps {
  upcomingEvents: Event[];
  pastEvents: Event[];
  onDeleteClick: (eventId: string) => void;
}

const EventsTabs = ({ upcomingEvents, pastEvents, onDeleteClick }: EventsTabsProps) => {
  return (
    <Tabs defaultValue="upcoming" className="w-full">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming" className="mt-6">
        <EventsList 
          events={upcomingEvents} 
          onDeleteClick={onDeleteClick} 
          emptyMessage="No upcoming events found" 
        />
      </TabsContent>
      <TabsContent value="past" className="mt-6">
        <EventsList 
          events={pastEvents} 
          onDeleteClick={onDeleteClick} 
          emptyMessage="No past events found" 
        />
      </TabsContent>
    </Tabs>
  );
};

export default EventsTabs;

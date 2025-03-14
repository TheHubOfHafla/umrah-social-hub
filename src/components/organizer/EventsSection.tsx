
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventGrid from "@/components/EventGrid";
import { Calendar } from "lucide-react";
import { Event } from "@/types";

interface EventsSectionProps {
  pastEvents: Event[];
  upcomingEvents: Event[];
}

const EventsSection = ({ pastEvents, upcomingEvents }: EventsSectionProps) => {
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold tracking-tight">Events</h3>
        
        <Tabs 
          defaultValue="upcoming" 
          className="w-[300px]"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {activeTab === "upcoming" && (
        <>
          {upcomingEvents.length > 0 ? (
            <EventGrid events={upcomingEvents} />
          ) : (
            <Card className="p-12 text-center bg-muted/30">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This organizer doesn't have any upcoming events scheduled. Check back later or follow them to get notified about new events.
              </p>
            </Card>
          )}
        </>
      )}
      
      {activeTab === "past" && (
        <>
          {pastEvents.length > 0 ? (
            <EventGrid events={pastEvents} />
          ) : (
            <Card className="p-12 text-center bg-muted/30">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No past events</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                This organizer hasn't hosted any events yet. Follow them to get notified when they schedule their first event.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default EventsSection;

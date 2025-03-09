
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { currentUser } from "@/lib/data/users";
import { getUserEvents, getEventsHistory } from "@/lib/data/queries";
import EventCard from "@/components/EventCard";
import { Search } from "lucide-react";
import EventGrid from "@/components/EventGrid";

const UserEvents = () => {
  useEffect(() => {
    document.title = "My Events | Islamic Social";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const userEvents = getUserEvents(currentUser.id);
  const pastEvents = getEventsHistory(currentUser.id);

  const filteredUpcoming = userEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredPast = pastEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout user={currentUser} type="user">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
          <p className="text-muted-foreground">
            View and manage your upcoming and past events
          </p>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="relative max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="mt-6">
            {filteredUpcoming.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-muted-foreground">No upcoming events found</p>
                </div>
              </div>
            ) : (
              <EventGrid events={filteredUpcoming} columns={3} />
            )}
          </TabsContent>
          <TabsContent value="past" className="mt-6">
            {filteredPast.length === 0 ? (
              <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
                <div className="text-center">
                  <p className="text-muted-foreground">No past events found</p>
                </div>
              </div>
            ) : (
              <EventGrid events={filteredPast} columns={3} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default UserEvents;


import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { currentUser } from "@/lib/data/users";
import { EventCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { deleteEvent, getAllOrganizerEvents, getOrganizerByUserId } from "@/lib/api/organizer";

// Import our components
import EventsHeader from "@/components/dashboard/organizer/EventsHeader";
import EventsFilter from "@/components/dashboard/organizer/EventsFilter";
import EventsTabs from "@/components/dashboard/organizer/EventsTabs";
import DeleteEventDialog from "@/components/dashboard/organizer/DeleteEventDialog";

const OrganizerEvents = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for UI
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // State for data
  const [loading, setLoading] = useState(true);
  const [organizer, setOrganizer] = useState<any>(null);
  const [allEvents, setAllEvents] = useState<any[]>([]);

  useEffect(() => {
    document.title = "My Events | Islamic Social";
    
    if (!user) return;
    
    async function loadData() {
      setLoading(true);
      try {
        // Get organizer profile
        const organizerData = await getOrganizerByUserId(user.id);
        
        if (!organizerData) {
          toast({
            title: "Not an organizer",
            description: "Your account is not set up as an organizer yet.",
            variant: "destructive"
          });
          return;
        }
        
        setOrganizer(organizerData);
        
        // Get all organizer events
        const eventsData = await getAllOrganizerEvents(organizerData.id);
        setAllEvents(eventsData);
      } catch (error) {
        console.error("Error loading events data:", error);
        toast({
          title: "Error loading events",
          description: "There was a problem loading your events. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [user, toast]);

  // Filter events based on search and category
  const filterEvents = (events) => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || event.categories.includes(categoryFilter as EventCategory);
      return matchesSearch && matchesCategory;
    });
  };
  
  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = filterEvents(
    allEvents.filter(event => new Date(event.date.start) >= now)
  );
  
  const pastEvents = filterEvents(
    allEvents.filter(event => new Date(event.date.start) < now)
  );

  // Event handlers
  const handleDeleteButtonClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEventId) return;
    
    try {
      const success = await deleteEvent(selectedEventId);
      
      if (success) {
        // Remove the deleted event from the state
        setAllEvents(allEvents.filter(event => event.id !== selectedEventId));
        
        toast({
          title: "Event deleted",
          description: "The event has been successfully deleted.",
        });
      } else {
        toast({
          title: "Error deleting event",
          description: "There was a problem deleting the event. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error deleting event",
        description: "There was a problem deleting the event. Please try again.",
        variant: "destructive"
      });
    }
    
    setDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  return (
    <DashboardLayout user={user || currentUser} type="organizer">
      <div className="space-y-8">
        {/* Page header */}
        <EventsHeader />

        {/* Events card */}
        <Card>
          <CardHeader className="pb-3">
            <EventsFilter 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
          </CardHeader>
          <CardContent>
            <EventsTabs 
              upcomingEvents={upcomingEvents}
              pastEvents={pastEvents}
              onDeleteClick={handleDeleteButtonClick}
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete confirmation dialog */}
      <DeleteEventDialog 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
      />
    </DashboardLayout>
  );
};

export default OrganizerEvents;

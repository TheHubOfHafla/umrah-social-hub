
import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { currentUser } from "@/lib/data/users";
import { getOrganizerEvents, getOrganizerPastEvents } from "@/lib/data/queries";
import { EventCategory } from "@/types";

// Import our new components
import EventsHeader from "@/components/dashboard/organizer/EventsHeader";
import EventsFilter from "@/components/dashboard/organizer/EventsFilter";
import EventsTabs from "@/components/dashboard/organizer/EventsTabs";
import DeleteEventDialog from "@/components/dashboard/organizer/DeleteEventDialog";

const OrganizerEvents = () => {
  useEffect(() => {
    document.title = "My Events | Islamic Social";
  }, []);

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  // Get event data
  const organizerEvents = getOrganizerEvents(currentUser.id);
  const pastEvents = getOrganizerPastEvents(currentUser.id);

  // Filter events based on search and category
  const filteredUpcoming = organizerEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.categories.includes(categoryFilter as EventCategory);
    return matchesSearch && matchesCategory;
  });
  
  const filteredPast = pastEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || event.categories.includes(categoryFilter as EventCategory);
    return matchesSearch && matchesCategory;
  });

  // Event handlers
  const handleDeleteButtonClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, we would delete the event here
    console.log("Deleting event", selectedEventId);
    setDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  return (
    <DashboardLayout user={currentUser} type="organizer">
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
              upcomingEvents={filteredUpcoming}
              pastEvents={filteredPast}
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

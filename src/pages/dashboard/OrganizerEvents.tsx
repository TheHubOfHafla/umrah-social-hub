
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Button from "@/components/Button";
import { currentUser, getOrganizerEvents, getOrganizerPastEvents } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { EditIcon, Calendar, Trash2, Search, Users, PlusCircle, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";

const OrganizerEvents = () => {
  useEffect(() => {
    document.title = "My Events | Islamic Social";
  }, []);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<EventCategory | "all">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  
  const organizerEvents = getOrganizerEvents(currentUser.id);
  const pastEvents = getOrganizerPastEvents(currentUser.id);

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

  const handleDelete = () => {
    // In a real app, we would delete the event here
    console.log("Deleting event", selectedEventId);
    setDeleteDialogOpen(false);
    setSelectedEventId(null);
  };

  return (
    <DashboardLayout user={currentUser} type="organizer">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
            <p className="text-muted-foreground">
              Create, edit and manage your events
            </p>
          </div>
          <Link to="/events/create">
            <Button icon={<PlusCircle className="h-4 w-4" />}>
              Create Event
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
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
              <Select
                value={categoryFilter}
                onValueChange={(value) => setCategoryFilter(value as EventCategory | "all")}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
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
                      <Link to="/events/create">
                        <Button className="mt-4" size="sm">
                          Create Event
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <div className="grid divide-y">
                      {filteredUpcoming.map((event) => (
                        <div
                          key={event.id}
                          className="grid grid-cols-1 items-center gap-4 p-4 sm:grid-cols-6"
                        >
                          <div className="col-span-1 sm:col-span-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 overflow-hidden rounded">
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {new Date(event.date.start).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1 hidden sm:block">
                            {event.categories.slice(0, 1).map((category) => (
                              <Badge key={category} variant="secondary" className="mr-1">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <div className="col-span-1 hidden items-center sm:flex">
                            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{event.attendees?.length || 0}</span>
                          </div>
                          <div className="col-span-1 flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link to={`/events/${event.id}`}>
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                </Link>
                                <Link to={`/events/${event.id}/edit`}>
                                  <DropdownMenuItem>
                                    <EditIcon className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                </Link>
                                <Link to={`/events/${event.id}/attendees`}>
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    Attendees
                                  </DropdownMenuItem>
                                </Link>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedEventId(event.id);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                  <div className="rounded-md border">
                    <div className="grid divide-y">
                      {filteredPast.map((event) => (
                        <div
                          key={event.id}
                          className="grid grid-cols-1 items-center gap-4 p-4 sm:grid-cols-6"
                        >
                          <div className="col-span-1 sm:col-span-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-12 w-12 overflow-hidden rounded">
                                <img
                                  src={event.image}
                                  alt={event.title}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{event.title}</p>
                                <div className="flex items-center text-xs text-muted-foreground">
                                  <Calendar className="mr-1 h-3 w-3" />
                                  {new Date(event.date.start).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-span-1 hidden sm:block">
                            {event.categories.slice(0, 1).map((category) => (
                              <Badge key={category} variant="secondary" className="mr-1">
                                {category}
                              </Badge>
                            ))}
                          </div>
                          <div className="col-span-1 hidden items-center sm:flex">
                            <Users className="mr-1 h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{event.attendees?.length || 0}</span>
                          </div>
                          <div className="col-span-1 flex items-center justify-end">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <Link to={`/events/${event.id}`}>
                                  <DropdownMenuItem>View</DropdownMenuItem>
                                </Link>
                                <Link to={`/events/${event.id}/attendees`}>
                                  <DropdownMenuItem>
                                    <Users className="mr-2 h-4 w-4" />
                                    Attendees
                                  </DropdownMenuItem>
                                </Link>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this event? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="default" className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default OrganizerEvents;

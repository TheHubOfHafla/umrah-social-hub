
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import OrganizerSidebar from "@/components/dashboard/OrganizerSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, ChevronRight, FileText, Globe, MoreHorizontal, Pencil, Plus, Search, Trash2, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for demonstration
const upcomingEvents = [
  {
    id: "1",
    title: "Community Iftar Dinner",
    date: "Jun 12, 2023",
    status: "upcoming",
    ticketsSold: 85,
    totalTickets: 100,
    revenue: 1275,
    attendees: 0,
    image: "/placeholder.svg",
    location: "London Islamic Center",
    category: "community"
  },
  {
    id: "2",
    title: "Islamic Finance Workshop",
    date: "Jun 24, 2023",
    status: "upcoming",
    ticketsSold: 32,
    totalTickets: 50,
    revenue: 960,
    attendees: 0,
    image: "/placeholder.svg",
    location: "Business Center",
    category: "education"
  },
  {
    id: "3",
    title: "Eid Festival Celebration",
    date: "Jun 29, 2023",
    status: "active",
    ticketsSold: 120,
    totalTickets: 200,
    revenue: 2400,
    attendees: 0,
    image: "/placeholder.svg",
    location: "City Park",
    category: "festival"
  },
];

const pastEvents = [
  {
    id: "4",
    title: "Ramadan Preparation Course",
    date: "May 5, 2023",
    status: "completed",
    ticketsSold: 75,
    totalTickets: 100,
    revenue: 1125,
    attendees: 68,
    image: "/placeholder.svg",
    location: "Online",
    category: "education"
  },
  {
    id: "5",
    title: "Quran Study Circle",
    date: "Apr 15, 2023",
    status: "completed",
    ticketsSold: 45,
    totalTickets: 50,
    revenue: 0, // Free event
    attendees: 42,
    image: "/placeholder.svg",
    location: "Local Masjid",
    category: "education"
  },
];

const draftEvents = [
  {
    id: "6",
    title: "Youth Summer Camp",
    date: "Jul 15, 2023",
    status: "draft",
    ticketsSold: 0,
    totalTickets: 150,
    revenue: 0,
    attendees: 0,
    image: "/placeholder.svg",
    location: "Mountain Retreat Center",
    category: "youth"
  },
];

const OrganizerEventsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const filteredUpcomingEvents = upcomingEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (categoryFilter === "all" || event.category === categoryFilter)
  );
  
  const filteredPastEvents = pastEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (categoryFilter === "all" || event.category === categoryFilter)
  );
  
  const filteredDraftEvents = draftEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (categoryFilter === "all" || event.category === categoryFilter)
  );
  
  return (
    <PageWrapper withFooter={false}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex min-h-screen w-full bg-background">
          <OrganizerSidebar />
          
          <SidebarInset>
            <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b shadow-sm">
              <div className="px-6 py-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">Events</h1>
                  <p className="text-sm text-muted-foreground">
                    Manage your events and ticket sales
                  </p>
                </div>
                
                <div>
                  <Button className="gap-1">
                    <Plus className="h-4 w-4" />
                    <span>Create Event</span>
                  </Button>
                </div>
              </div>
            </header>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-end mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search events..."
                      className="pl-9"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-[180px]">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="youth">Youth</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="upcoming" className="relative">
                    Upcoming
                    <Badge variant="secondary" className="ml-2">{filteredUpcomingEvents.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="past">
                    Past
                    <Badge variant="secondary" className="ml-2">{filteredPastEvents.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="drafts">
                    Drafts
                    <Badge variant="secondary" className="ml-2">{filteredDraftEvents.length}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {filteredUpcomingEvents.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredUpcomingEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title="No upcoming events found" 
                      description="Create a new event or change your search criteria."
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="past" className="space-y-4">
                  {filteredPastEvents.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredPastEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title="No past events found" 
                      description="Change your search criteria to find past events."
                    />
                  )}
                </TabsContent>
                
                <TabsContent value="drafts" className="space-y-4">
                  {filteredDraftEvents.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {filteredDraftEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                      ))}
                    </div>
                  ) : (
                    <EmptyState 
                      title="No draft events found" 
                      description="Start creating a new event to save as draft."
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </PageWrapper>
  );
};

// Event Card Component
const EventCard = ({ event }) => {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md group">
      <div className="relative h-48">
        <img src={event.image} alt={event.title} className="object-cover w-full h-full" />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-white/80 backdrop-blur-sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Pencil className="h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 text-destructive focus:text-destructive">
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent text-white p-3">
          <h3 className="font-semibold text-lg">{event.title}</h3>
          <div className="flex items-center gap-1 text-sm mt-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{event.date}</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <Badge variant={
            event.status === "active" ? "default" : 
            event.status === "upcoming" ? "outline" : 
            event.status === "completed" ? "secondary" : "secondary"
          }>
            {event.status === "active" ? "Active" : 
             event.status === "upcoming" ? "Upcoming" :
             event.status === "completed" ? "Completed" : "Draft"}
          </Badge>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5 mr-1.5" />
            <span>{event.ticketsSold}/{event.totalTickets}</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground mb-3">
          <div>{event.location}</div>
        </div>
        
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span>Tickets sold</span>
            <span className="font-medium">{Math.round((event.ticketsSold / event.totalTickets) * 100)}%</span>
          </div>
          <Progress value={(event.ticketsSold / event.totalTickets) * 100} className="h-1.5" />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-sm font-medium">${event.revenue}</div>
        <Button variant="outline" size="sm" className="gap-1.5">
          <FileText className="h-3.5 w-3.5" />
          <span>Details</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Empty State Component
const EmptyState = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
        <Calendar className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground mt-1 mb-4">{description}</p>
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create New Event
      </Button>
    </div>
  );
};

export default OrganizerEventsPage;

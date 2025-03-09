import { useParams } from "react-router-dom";
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import EventGrid from "@/components/EventGrid";
import { Separator } from "@/components/ui/separator";
import { Check, ExternalLink, MapPin, Share2 } from "lucide-react";
import { organizers } from "@/lib/data/organizers";
import { mockEvents } from "@/lib/data/events";
import { Event } from "@/types";

const OrganizerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const organizer = organizers.find((org) => org.id === id);
  const [events, setEvents] = useState<Event[]>(mockEvents);

  if (!organizer) {
    return (
      <PageWrapper>
        <div className="container py-12">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold">Organizer not found</h2>
            <p className="text-muted-foreground">The organizer you're looking for doesn't exist or has been removed.</p>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  const initials = organizer.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

  const pastEvents = events.filter(
    (event) => event.organizer.id === id && new Date(event.date.start) < new Date()
  );
  const upcomingEvents = events.filter(
    (event) => event.organizer.id === id && new Date(event.date.start) >= new Date()
  );

  return (
    <PageWrapper>
      <div className="container py-12">
        <Card className="p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary/10">
                <AvatarImage src={organizer.avatar} alt={organizer.name} />
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{organizer.name}</h2>
                <p className="text-muted-foreground">{organizer.bio || "No bio available"}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary">{organizer.organizationType}</Badge>
                </div>
              </div>
            </div>
            <Button className="self-start sm:self-auto">
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-muted-foreground">
                {organizer.bio || "No information available."}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              {organizer.website && (
                <p className="flex items-center gap-2 mb-2">
                  <strong>Website:</strong>{" "}
                  <a
                    href={organizer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    Visit website <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </p>
              )}
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-4 w-4 inline-block mr-1" />
                The organizer has not provided a location.
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming">
            {upcomingEvents.length > 0 ? (
              <EventGrid events={upcomingEvents} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No upcoming events found.</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="past">
            {pastEvents.length > 0 ? (
              <EventGrid events={pastEvents} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No past events found.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageWrapper>
  );
};

export default OrganizerProfilePage;

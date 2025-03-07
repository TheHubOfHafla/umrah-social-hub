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
import { Check, Clock, MapPin, Share2, Users } from "lucide-react";
import { organizers } from "@/lib/data";
import { events as allEvents } from "@/lib/data/events";

const OrganizerProfilePage = () => {
  const { organizerId } = useParams<{ organizerId: string }>();
  const organizer = organizers.find((org) => org.id === organizerId);
  const [events, setEvents] = useState(allEvents);

  if (!organizer) {
    return (
      <PageWrapper>
        <div>Organizer not found</div>
      </PageWrapper>
    );
  }

  const pastEvents = events.filter(
    (event) => event.organizerId === organizerId && new Date(event.date) < new Date()
  );
  const upcomingEvents = events.filter(
    (event) => event.organizerId === organizerId && new Date(event.date) >= new Date()
  );

  return (
    <PageWrapper>
      <div className="container py-12">
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={organizer.imageUrl} alt={organizer.name} />
                <AvatarFallback>{organizer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold">{organizer.name}</h2>
                <p className="text-muted-foreground">{organizer.description}</p>
                <div className="flex space-x-2 mt-2">
                  <Badge variant="secondary">{organizer.category}</Badge>
                  {organizer.isVerified && (
                    <Badge variant="outline">
                      <Check className="h-4 w-4 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <Button>
              <Share2 className="h-4 w-4 mr-2" /> Share
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
              <p>
                <strong>Email:</strong> {organizer.email}
              </p>
              <p>
                <strong>Phone:</strong> {organizer.phone}
              </p>
              <p>
                <strong>Website:</strong>{" "}
                <a
                  href={organizer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {organizer.website}
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p>
                <MapPin className="h-4 w-4 inline-block mr-1" />
                {organizer.address}
              </p>
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

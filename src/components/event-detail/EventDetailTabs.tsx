
import { ReactNode } from "react";
import { Event } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";

interface EventDetailTabsProps {
  event: Event;
}

const EventDetailTabs = ({ event }: EventDetailTabsProps) => {
  return (
    <Tabs defaultValue="about" className="w-full">
      <TabsList className="mb-8 w-full justify-start">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
        <TabsTrigger value="organizer">Organizer</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="space-y-6 animate-in fade-in-50">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold mb-6">About this event</h2>
          <p className="text-lg leading-relaxed whitespace-pre-line">
            {event.description}
          </p>
        </div>
        
        {event.categories.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {event.categories.map(category => (
                <Badge key={category} variant="outline" className="text-sm py-1 px-3">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="location" className="animate-in fade-in-50">
        <LocationTab location={event.location} />
      </TabsContent>
      
      <TabsContent value="organizer" className="animate-in fade-in-50">
        <OrganizerTab organizer={event.organizer} />
      </TabsContent>
    </Tabs>
  );
};

interface TabWrapperProps {
  title: string;
  children: ReactNode;
}

const TabWrapper = ({ title, children }: TabWrapperProps) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <Card className="overflow-hidden shadow-sm border-muted/40">
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  </div>
);

const LocationTab = ({ location }: { location: Event['location'] }) => (
  <TabWrapper title="Event Location">
    <h3 className="text-xl font-medium mb-2">{location.name}</h3>
    <p className="text-muted-foreground mb-4">
      {location.address && `${location.address}, `}{location.city}, {location.country}
    </p>
    <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="text-muted-foreground">Map view would appear here</p>
      </div>
    </div>
  </TabWrapper>
);

const OrganizerTab = ({ organizer }: { organizer: Event['organizer'] }) => (
  <TabWrapper title="Event Organizer">
    <div className="flex items-center gap-4 mb-4">
      <UserAvatar user={organizer} size="lg" />
      <div>
        <h3 className="text-xl font-medium">{organizer.name}</h3>
        <p className="text-sm text-muted-foreground">
          {organizer.organizationType.charAt(0).toUpperCase() + 
            organizer.organizationType.slice(1)}
        </p>
      </div>
    </div>
    
    {organizer.bio && (
      <p className="text-muted-foreground mb-4">
        {organizer.bio}
      </p>
    )}
    
    {organizer.website && (
      <a 
        href={organizer.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary hover:underline"
      >
        Visit website
      </a>
    )}
  </TabWrapper>
);

export default EventDetailTabs;

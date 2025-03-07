
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import OrganizerProfileHeader from "@/components/profile/OrganizerProfileHeader";
import { EventGrid } from "@/components/EventGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PageWrapper } from "@/components/PageWrapper";
import { Container } from "@/components/ui/container";
import { organizers } from "@/lib/data/organizers";
import { events } from "@/lib/data/events";

const OrganizerProfilePage = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch organizer data
  const { data: organizer, isLoading: isLoadingOrganizer } = useQuery({
    queryKey: ["organizer", id],
    queryFn: () => {
      // Find the organizer by ID
      const foundOrganizer = organizers.find(org => org.id === id);
      if (!foundOrganizer) {
        throw new Error("Organizer not found");
      }
      return foundOrganizer;
    },
    enabled: !!id,
    // For demo purposes, use the mock data
    initialData: id ? organizers.find(org => org.id === id) : undefined
  });

  // Fetch events by this organizer
  const { data: organizerEvents, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["organizer-events", id],
    queryFn: () => {
      // Filter events by organizer ID
      return events.filter(event => event.organizer.id === id);
    },
    enabled: !!id,
    // For demo purposes, use the mock data
    initialData: id ? events.filter(event => event.organizer.id === id) : []
  });

  // Update page title when organizer data is loaded
  useEffect(() => {
    if (organizer) {
      document.title = `${organizer.name} | EventHub`;
    } else {
      document.title = "Organizer Profile | EventHub";
    }
  }, [organizer]);

  // If the organizer is not found, show a placeholder
  if (!isLoadingOrganizer && !organizer) {
    return (
      <PageWrapper>
        <Container>
          <div className="flex flex-col items-center justify-center py-20">
            <h1 className="text-2xl font-bold">Organizer not found</h1>
            <p className="text-muted-foreground mt-2">The organizer you're looking for doesn't exist or has been removed.</p>
          </div>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      {isLoadingOrganizer ? (
        <div className="pt-8 pb-6">
          <Container>
            <div className="flex flex-col items-center text-center">
              <Skeleton className="h-10 w-64 mb-4" />
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="h-10 w-28" />
                <Skeleton className="h-10 w-28" />
              </div>
              <div className="flex items-center gap-8 mb-6">
                <Skeleton className="h-16 w-20" />
                <Skeleton className="h-16 w-20" />
              </div>
              <Skeleton className="h-24 w-full max-w-2xl mb-6" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </div>
          </Container>
        </div>
      ) : (
        organizer && <OrganizerProfileHeader 
          organizer={organizer} 
          totalEvents={organizerEvents?.length || 0} 
        />
      )}

      <Container className="py-8">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="mb-8 w-full sm:w-auto bg-background border rounded-lg p-1">
            <TabsTrigger value="events" className="text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              Events
            </TabsTrigger>
            <TabsTrigger value="about" className="text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              About
            </TabsTrigger>
            <TabsTrigger value="followers" className="text-sm rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              Followers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="mt-0">
            {isLoadingEvents ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-[350px] w-full" />
                ))}
              </div>
            ) : organizerEvents && organizerEvents.length > 0 ? (
              <EventGrid events={organizerEvents} />
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No events found</h3>
                <p className="text-muted-foreground mt-2">This organizer hasn't published any events yet.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="about" className="mt-0">
            <div className="bg-white rounded-lg p-6 shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">About {organizer?.name}</h3>
              <p className="text-foreground/80 leading-relaxed mb-4">{organizer?.bio}</p>
              
              {organizer?.website && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Website</h4>
                  <a 
                    href={organizer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-2"
                  >
                    {organizer.website}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="followers" className="mt-0">
            <div className="bg-white rounded-lg p-6 shadow-sm border text-center">
              <h3 className="text-xl font-semibold mb-4">Followers</h3>
              <p className="text-muted-foreground">Followers feature coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </PageWrapper>
  );
};

const ExternalLink = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

export default OrganizerProfilePage;

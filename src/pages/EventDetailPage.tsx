
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getEventById, getRelatedEvents } from "@/lib/data/queries";
import { currentUser } from "@/lib/data/users";
import { Event } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container } from "@/components/ui/container";

// Event detail components
import EventHeader from "@/components/event-detail/EventHeader";
import EventImage from "@/components/event-detail/EventImage";
import EventTicketCard from "@/components/event-detail/EventTicketCard";
import EventDetailTabs from "@/components/event-detail/EventDetailTabs";
import RelatedEvents from "@/components/event-detail/RelatedEvents";
import ChatNotifications from "@/components/chat/ChatNotifications";
import EventDetailSkeleton from "@/components/event-detail/EventDetailSkeleton";
import EventErrorState from "@/components/event-detail/EventErrorState";
import EventChatTab from "@/components/event-detail/EventChatTab";

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check for tab query parameter
  const queryParams = new URLSearchParams(location.search);
  const tabFromQuery = queryParams.get('tab');
  
  const [activeTab, setActiveTab] = useState<string>(tabFromQuery === 'chat' ? 'chat' : 'details');
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

  // Update active tab when query param changes
  useEffect(() => {
    if (tabFromQuery === 'chat') {
      setActiveTab('chat');
    }
  }, [tabFromQuery]);

  const { data: event, isLoading: isEventLoading, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId || ''),
    enabled: !!eventId,
  });

  const { data: relatedEvents = [] } = useQuery({
    queryKey: ['relatedEvents', event?.id],
    queryFn: () => getRelatedEvents(event as Event),
    enabled: !!event,
  });

  // Check if current user is an organizer
  const isOrganizer = event?.organizer?.id === currentUser.id;
  
  // Check if current user is attending
  const isAttending = currentUser.eventsAttending?.includes(event?.id || '');

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/events/${eventId}${value === 'chat' ? '?tab=chat' : ''}`);
  };

  if (error) {
    return <EventErrorState />;
  }

  if (isEventLoading || !event) {
    return <EventDetailSkeleton />;
  }

  return (
    <>
      {/* Show notifications for event chat */}
      {(isAttending || isOrganizer) && <ChatNotifications event={event} />}
      
      <div className="relative w-full bg-muted/30 pt-6 md:pt-12 pb-8">
        <div className="absolute inset-0 overflow-hidden bg-muted">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-10 blur-sm"
            style={{ backgroundImage: `url(${event.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background z-1" />
        </div>

        <Container className="py-4">
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            <div className="flex flex-col w-full lg:w-2/3">
              <EventHeader event={event} />
              <EventImage src={event.image} alt={event.title} />
            </div>
            
            <div className="w-full lg:w-1/3 mt-0 lg:mt-14">
              <EventTicketCard event={event} />
            </div>
          </div>
        </Container>
      </div>
      
      <Container className="py-8">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-8">
          <Tabs defaultValue="details" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full mb-8 justify-start gap-2">
              <TabsTrigger 
                value="details" 
                className="text-base md:text-lg font-semibold"
              >
                Event Details
              </TabsTrigger>
              <TabsTrigger 
                value="chat" 
                disabled={!isAttending && !isOrganizer}
                className="text-base md:text-lg font-semibold relative"
              >
                <span className="relative">
                  Event Chat
                  {!isAttending && !isOrganizer ? (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="text-xs ml-1 opacity-70">(Register to access)</span>
                    </span>
                  ) : (
                    <span className="absolute -top-1 -right-2 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-30"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  )}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="py-4">
              <EventDetailTabs event={event} />
            </TabsContent>
            
            <TabsContent value="chat" className="py-4">
              <EventChatTab 
                event={event} 
                isAttending={isAttending} 
                isOrganizer={isOrganizer} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </Container>
      
      <Container className="pb-12">
        <RelatedEvents events={relatedEvents} />
      </Container>
    </>
  );
};

export default EventDetailPage;

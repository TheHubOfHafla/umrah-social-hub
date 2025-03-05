
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { getEventById, getRelatedEvents } from "@/lib/data/queries";
import { Event } from "@/types";
import Button from "@/components/Button";
import { Skeleton } from "@/components/ui/skeleton";

// Event detail components
import EventHeader from "@/components/event-detail/EventHeader";
import EventImage from "@/components/event-detail/EventImage";
import EventTicketCard from "@/components/event-detail/EventTicketCard";
import EventDetailTabs from "@/components/event-detail/EventDetailTabs";
import RelatedEvents from "@/components/event-detail/RelatedEvents";

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [eventId]);

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Event not found</h1>
        <p className="text-muted-foreground mb-8">
          The event you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/events")}>
          Browse all events
        </Button>
      </div>
    );
  }

  if (isEventLoading || !event) {
    return <EventDetailSkeleton />;
  }

  return (
    <>
      <div className="relative w-full bg-muted/30 pt-6 md:pt-12 pb-8">
        <div className="absolute inset-0 overflow-hidden bg-muted">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-10 blur-sm"
            style={{ backgroundImage: `url(${event.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background z-1" />
        </div>

        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            <div className="flex flex-col w-full lg:w-2/3">
              <EventHeader event={event} />
              <EventImage src={event.image} alt={event.title} />
            </div>
            
            <div className="w-full lg:w-1/3 mt-0 lg:mt-14">
              <EventTicketCard event={event} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <EventDetailTabs event={event} />
      </div>
      
      <div className="container mx-auto px-4 pb-12">
        <RelatedEvents events={relatedEvents} />
      </div>
    </>
  );
};

const EventDetailSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-6 w-56 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="w-full aspect-video rounded-lg mb-8" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
        </div>
        <div className="w-full lg:w-1/3">
          <div className="rounded-xl overflow-hidden">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Share, 
  ChevronLeft, 
  ArrowRight,
  Tag
} from "lucide-react";
import { getEventById, getRelatedEvents } from "@/lib/data/queries";
import { Event } from "@/types";
import Button from "@/components/Button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import UserAvatar from "@/components/UserAvatar";
import EventGrid from "@/components/EventGrid";
import AttendeesList from "@/components/AttendeesList";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const EventDetailPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [imageLoaded, setImageLoaded] = useState(false);
  
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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.shortDescription,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard",
      });
    }
  };

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

  const eventDate = new Date(event.date.start);
  const eventEndDate = event.date.end ? new Date(event.date.end) : null;
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  const formattedEndTime = eventEndDate ? format(eventEndDate, "h:mm a") : null;
  
  const isMultiDay = eventEndDate && 
    eventEndDate.toDateString() !== eventDate.toDateString();
  
  const soldPercentage = event.ticketTypes 
    ? Math.min(
        100,
        Math.floor(
          (event.ticketTypes.reduce((acc, ticket) => acc + ticket.sold, 0) / 
          event.ticketTypes.reduce((acc, ticket) => acc + ticket.quantity, 0)) * 100
        )
      )
    : event.attendees && event.capacity
    ? Math.min(100, Math.floor((event.attendees.length / event.capacity) * 100))
    : null;

  return (
    <>
      <div className="relative w-full bg-muted/30 pt-10 md:pt-24">
        <div className="absolute inset-0 overflow-hidden bg-muted">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center opacity-10 blur-sm"
            style={{ backgroundImage: `url(${event.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 to-background z-1" />
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8 relative z-10">
            <Link to="/events" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ChevronLeft size={16} className="mr-1" />
              Back to events
            </Link>
            
            <div className="flex flex-col w-full lg:w-2/3">
              <div className="flex flex-wrap gap-2 mb-4">
                {event.categories.map(category => (
                  <Badge key={category} variant="outline" className="bg-primary/10 border-0">
                    {category}
                  </Badge>
                ))}
                
                {event.attendeeType && (
                  <Badge variant="secondary">
                    {event.attendeeType.replace('-', ' ')}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                {event.title}
              </h1>
              
              <div className="flex items-center mb-6">
                <div className="flex items-center mr-8">
                  <CalendarIcon className="mr-2 h-5 w-5 text-primary" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-primary" />
                  <span>
                    {formattedTime} 
                    {formattedEndTime && ` - ${formattedEndTime}`}
                    {isMultiDay && ' (Multiple days)'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                <span>
                  {event.location.name}, {event.location.address}, {event.location.city}, {event.location.country}
                </span>
              </div>
              
              <div className="flex items-center mb-8">
                <UserAvatar 
                  user={event.organizer} 
                  size="md" 
                  showName 
                  namePosition="right" 
                />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto" 
                  icon={<Share size={16} />}
                  onClick={handleShare}
                >
                  Share
                </Button>
              </div>
              
              <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
              </div>
            </div>
            
            <div className="w-full lg:w-1/3 mt-8 lg:mt-16">
              <Card className="sticky top-8 border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {event.isFree ? 'Free Event' : 'Tickets'}
                    </h3>
                    {event.isFree ? (
                      <p className="text-green-600 font-medium">
                        Free registration
                      </p>
                    ) : (
                      <p className="text-xl font-medium">
                        {event.ticketTypes 
                          ? `From £${Math.min(...event.ticketTypes.map(t => t.price))}`
                          : event.price
                          ? `£${event.price}`
                          : 'Price on request'}
                      </p>
                    )}
                  </div>
                  
                  {soldPercentage !== null && (
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {soldPercentage === 100 ? 'Sold out' : `${soldPercentage}% booked`}
                          </span>
                        </div>
                        {event.capacity && (
                          <span className="text-sm text-muted-foreground">
                            Capacity: {event.capacity}
                          </span>
                        )}
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${soldPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {event.ticketTypes && event.ticketTypes.length > 0 ? (
                    <div className="space-y-4 mb-6">
                      {event.ticketTypes.map(ticket => (
                        <div key={ticket.id} className="flex justify-between items-start p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
                          <div>
                            <h4 className="font-medium">{ticket.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {ticket.description || 'Standard admission'}
                            </p>
                            <div className="mt-1 text-xs flex items-center">
                              <Tag className="mr-1 h-3 w-3 text-primary" />
                              <span>
                                {ticket.available 
                                  ? ticket.quantity - ticket.sold > 5 
                                    ? 'Available' 
                                    : `Only ${ticket.quantity - ticket.sold} left` 
                                  : 'Sold out'}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-medium">£{ticket.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Separator className="my-6" />
                  )}
                  
                  <Button 
                    fullWidth 
                    size="lg" 
                    className="mb-4 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    onClick={handleRegisterClick}
                  >
                    {event.isFree ? 'Register Now' : 'Book Tickets'}
                  </Button>
                  
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="mt-6">
                      <AttendeesList attendees={event.attendees} maxDisplay={5} />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="about">
          <TabsList className="mb-6">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="organizer">Organizer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="about" className="space-y-6">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-2xl font-bold mb-4">About this event</h2>
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
            
            {event.categories.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.categories.map(category => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="location">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Event Location</h2>
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium mb-2">{event.location.name}</h3>
                  <p className="text-muted-foreground mb-4">
                    {event.location.address}, {event.location.city}, {event.location.country}
                  </p>
                  <div className="aspect-video bg-muted rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-muted-foreground">Map view would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="organizer">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Event Organizer</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <UserAvatar user={event.organizer} size="lg" />
                    <div>
                      <h3 className="text-xl font-medium">{event.organizer.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {event.organizer.organizationType.charAt(0).toUpperCase() + 
                          event.organizer.organizationType.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  {event.organizer.bio && (
                    <p className="text-muted-foreground mb-4">
                      {event.organizer.bio}
                    </p>
                  )}
                  
                  {event.organizer.website && (
                    <a 
                      href={event.organizer.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Visit website
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {relatedEvents.length > 0 && (
        <div className="container mx-auto px-4 py-12 border-t border-border/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Similar Events</h2>
            <Link to="/events" className="hidden sm:flex">
              <Button 
                variant="ghost" 
                icon={<ArrowRight className="ml-2 h-4 w-4" />} 
                iconPosition="right"
              >
                View all events
              </Button>
            </Link>
          </div>
          
          <EventGrid events={relatedEvents} columns={3} />
        </div>
      )}
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

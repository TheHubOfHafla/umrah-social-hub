
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { Ticket, Calendar, Clock, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getEventById } from "@/lib/data/queries";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Button from "@/components/Button";

interface UserTicket {
  id: string;
  event_id: string;
  confirmation_code: string;
  qr_code_url: string;
  created_at: string;
  status: string;
  ticket_type: string;
  event?: any;
}

const UserTickets = () => {
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("Please log in to view your tickets");
          setIsLoading(false);
          return;
        }
        
        // Get user's tickets
        const { data, error } = await supabase
          .from('event_confirmations')
          .select('*')
          .eq('user_id', session.user.id);
        
        if (error) {
          throw error;
        }
        
        // Fetch event details for each ticket
        const ticketsWithEvents = await Promise.all(
          data.map(async (ticket) => {
            try {
              const event = await getEventById(ticket.event_id);
              return { ...ticket, event };
            } catch (err) {
              console.error(`Error fetching event ${ticket.event_id}:`, err);
              return ticket;
            }
          })
        );
        
        setTickets(ticketsWithEvents);
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTickets();
  }, []);

  const upcomingTickets = tickets.filter(ticket => 
    ticket.event && new Date(ticket.event.date.start) >= new Date()
  );
  
  const pastTickets = tickets.filter(ticket => 
    ticket.event && new Date(ticket.event.date.start) < new Date()
  );

  if (isLoading) {
    return <TicketsLoadingSkeleton />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (tickets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Ticket className="mr-2 h-5 w-5" />
            My Tickets
          </CardTitle>
          <CardDescription>You don't have any tickets yet.</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-muted-foreground mb-4">
            Register for an event to get your tickets here.
          </p>
          <Link to="/events">
            <Button>Browse Events</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Ticket className="mr-2 h-5 w-5" />
          My Tickets
        </CardTitle>
        <CardDescription>View and manage your event tickets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-4">
            <TabsTrigger value="upcoming">
              Upcoming ({upcomingTickets.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past ({pastTickets.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming">
            {upcomingTickets.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                You have no upcoming event tickets.
              </p>
            ) : (
              <div className="space-y-4">
                {upcomingTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            {pastTickets.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                You have no past event tickets.
              </p>
            ) : (
              <div className="space-y-4">
                {pastTickets.map(ticket => (
                  <TicketCard key={ticket.id} ticket={ticket} isPast />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const TicketCard = ({ ticket, isPast = false }: { ticket: UserTicket, isPast?: boolean }) => {
  const [expanded, setExpanded] = useState(false);
  
  if (!ticket.event) {
    return null;
  }
  
  const eventDate = new Date(ticket.event.date.start);
  const formattedDate = format(eventDate, "EEE, MMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  
  return (
    <Card className={`overflow-hidden border ${isPast ? 'bg-muted/30' : 'shadow-sm hover:shadow transition-shadow'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-md overflow-hidden w-16 h-16 bg-muted flex-shrink-0">
              <img 
                src={ticket.event.image || "/placeholder.svg"} 
                alt={ticket.event.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-lg truncate">{ticket.event.title}</h3>
              <div className="flex flex-col sm:flex-row sm:gap-3 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3.5 w-3.5" />
                  {formattedDate}
                </div>
                <div className="flex items-center">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  {formattedTime}
                </div>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {ticket.ticket_type || "Standard"}
                </span>
              </div>
            </div>
          </div>
          
          <div className={`mt-3 overflow-hidden transition-all duration-300 ${expanded ? 'max-h-96' : 'max-h-0'}`}>
            <div className="mt-2 space-y-2">
              <p className="text-sm font-medium">Confirmation Code:</p>
              <div className="bg-muted/50 p-2 rounded text-sm font-mono">
                {ticket.confirmation_code}
              </div>
              
              {!isPast && (
                <>
                  <p className="text-sm font-medium mt-3">QR Code:</p>
                  <div className="flex justify-center bg-white p-3 rounded border">
                    <img 
                      src={ticket.qr_code_url} 
                      alt="Ticket QR Code" 
                      className="w-32 h-32"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className={`flex flex-col justify-center items-center gap-2 p-4 ${isPast ? 'bg-muted/10' : 'bg-primary/5'}`}>
          <Button
            onClick={() => setExpanded(!expanded)}
            variant="outline"
            size="sm"
            className="w-full"
          >
            {expanded ? "Hide Details" : "View Ticket"}
          </Button>
          
          <Link to={`/events/${ticket.event_id}`} className="w-full">
            <Button
              variant={isPast ? "outline" : "default"}
              size="sm"
              className="w-full"
            >
              <ExternalLink className="mr-1 h-3.5 w-3.5" />
              View Event
            </Button>
          </Link>
          
          {!isPast && (
            <Link to={`/events/${ticket.event_id}/verify/${ticket.confirmation_code}`} className="w-full">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
              >
                <Ticket className="mr-1 h-3.5 w-3.5" />
                Verify Ticket
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
};

const TicketsLoadingSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-36 mb-2" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-40 mb-6" />
        {[1, 2].map(i => (
          <div key={i} className="mb-4">
            <div className="flex items-start gap-3 mb-3">
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="flex-1">
                <Skeleton className="h-5 w-full max-w-[250px] mb-2" />
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
            <Skeleton className="h-px w-full mb-3" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserTickets;

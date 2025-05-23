
import { Users, Tag } from "lucide-react";
import { Event, EventTicketType } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Button from "@/components/Button";
import AttendeesList from "@/components/AttendeesList";
import { useNavigate } from "react-router-dom";

interface EventTicketCardProps {
  event: Event;
}

const EventTicketCard = ({ event }: EventTicketCardProps) => {
  const navigate = useNavigate();
  
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
    
  const handleRegisterClick = () => {
    navigate(`/events/${event.id}/register`);
  };

  return (
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
              <TicketTypeItem key={ticket.id} ticket={ticket} />
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
  );
};

interface TicketTypeItemProps {
  ticket: EventTicketType;
}

const TicketTypeItem = ({ ticket }: TicketTypeItemProps) => (
  <div className="flex justify-between items-start p-3 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
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
);

export default EventTicketCard;

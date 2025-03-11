
import { format } from "date-fns";
import { Calendar, MapPin, Info, CreditCard } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EventSummaryCardProps {
  event: {
    id: string;
    title: string;
    date: {
      start: string;
    };
    location: {
      name: string;
      address: string;
      city: string;
    };
    organizer?: {
      name: string;
    };
    price?: number;
    isFree?: boolean;
    image: string;
  };
}

const EventSummaryCard = ({ event }: EventSummaryCardProps) => {
  const eventDate = new Date(event.date.start);
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");

  return (
    <Card className="shadow-sm overflow-hidden sticky top-24">
      <div className="aspect-video w-full relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="object-cover w-full h-full"
        />
        {event.isFree && (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
            Free Event
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <h2 className="text-xl font-bold line-clamp-2">{event.title}</h2>
      </CardHeader>
      <CardContent className="pb-2 space-y-4">
        <div className="flex items-start space-x-3">
          <Calendar className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">{formattedDate}</p>
            <p className="text-sm text-muted-foreground">{formattedTime}</p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <MapPin className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium">{event.location.name}</p>
            <p className="text-sm text-muted-foreground">
              {event.location.address}, {event.location.city}
            </p>
          </div>
        </div>

        {event.organizer && (
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-medium">Organized by</p>
              <p className="text-sm text-muted-foreground">{event.organizer.name}</p>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="bg-primary/5 border-t flex flex-col items-start p-4">
        <div className="flex justify-between w-full mb-2">
          <span className="text-sm font-medium">Registration</span>
          <span className="text-sm font-bold text-green-600">
            {event.isFree ? 'Free' : `£${event.price || '0'}`}
          </span>
        </div>
        <Separator className="my-2 w-full" />
        <div className="flex justify-between w-full">
          <span className="font-medium">Total</span>
          <span className="font-bold text-green-600">
            {event.isFree ? 'Free' : `£${event.price || '0'}`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default EventSummaryCard;


import { Link } from "react-router-dom";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft,
  Share
} from "lucide-react";
import { Event } from "@/types";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";
import { useToast } from "@/hooks/use-toast";

interface EventHeaderProps {
  event: Event;
}

const EventHeader = ({ event }: EventHeaderProps) => {
  const { toast } = useToast();
  const eventDate = new Date(event.date.start);
  const eventEndDate = event.date.end ? new Date(event.date.end) : null;
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");
  const formattedEndTime = eventEndDate ? format(eventEndDate, "h:mm a") : null;
  
  const isMultiDay = eventEndDate && 
    eventEndDate.toDateString() !== eventDate.toDateString();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
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

  return (
    <div className="mb-8">
      <Link to="/events" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4 transition-colors">
        <ChevronLeft size={16} className="mr-1" />
        Back to events
      </Link>
      
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
      
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
        {event.title}
      </h1>
      
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8 mb-6">
        <div className="flex items-center">
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
          {event.location.name}, {event.location.city}, {event.location.country}
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
    </div>
  );
};

export default EventHeader;

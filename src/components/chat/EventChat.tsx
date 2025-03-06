
import { useState } from 'react';
import { MessageCircle, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Event } from '@/types';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '@/lib/data';

interface EventChatProps {
  event: Event;
  className?: string;
}

const EventChat = ({ event, className }: EventChatProps) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isAttending = currentUser.eventsAttending?.includes(event.id);
  const isOrganizer = event.organizer.id === currentUser.id;
  const canAccessChat = isAttending || isOrganizer;
  
  const handleViewChat = () => {
    navigate(`/events/${event.id}?tab=chat`);
  };
  
  const handleRegister = () => {
    navigate(`/events/${event.id}/register`);
  };
  
  // Count of participants in the chat
  const participantCount = event.attendees?.length || 0;
  
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <MessageCircle className="h-5 w-5 mr-2 text-primary" />
            Event Chat
          </div>
          <Badge variant="outline" className="ml-2">
            <Users className="h-3 w-3 mr-1" />
            {participantCount} {participantCount === 1 ? 'participant' : 'participants'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {canAccessChat 
              ? "Connect with organizers and other attendees in the event chat. Ask questions, share thoughts, and get the latest updates."
              : "Register for this event to join the conversation with organizers and other attendees."}
          </p>
          
          {canAccessChat ? (
            <Button 
              className="w-full"
              onClick={handleViewChat}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Access Event Chat
            </Button>
          ) : (
            <Button 
              className="w-full"
              onClick={handleRegister}
              variant="outline"
            >
              Register to Join Chat
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventChat;

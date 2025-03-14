
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ChatInterface from "@/components/chat/ChatInterface";
import { Event } from "@/types";

interface EventChatTabProps {
  event: Event;
  isAttending: boolean;
  isOrganizer: boolean;
}

const EventChatTab = ({ event, isAttending, isOrganizer }: EventChatTabProps) => {
  const navigate = useNavigate();

  return (
    <>
      {isAttending || isOrganizer ? (
        <div className="rounded-xl overflow-hidden border-2 border-primary/20 shadow-md">
          <div className="border-b border-primary/10 bg-primary/5 px-4 py-3">
            <h2 className="text-xl font-bold text-primary">Live Event Chat</h2>
            <p className="text-sm text-muted-foreground">
              Connect with attendees and organizers in real-time
            </p>
          </div>
          <ChatInterface event={event} isOrganizer={isOrganizer} />
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/10">
          <h3 className="text-xl font-semibold mb-3">Join the conversation</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Register for this event to access the chat and connect with other attendees.
            Stay updated with announcements and ask questions directly to the organizers.
          </p>
          <Button onClick={() => navigate(`/events/${event.id}/register`)} size="lg">
            Register Now
          </Button>
        </div>
      )}
    </>
  );
};

export default EventChatTab;

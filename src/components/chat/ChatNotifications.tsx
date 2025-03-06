
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Event, ChatMessage } from '@/types';
import { getEventChatMessages } from '@/lib/data';

interface ChatNotificationsProps {
  event: Event;
}

const ChatNotifications = ({ event }: ChatNotificationsProps) => {
  const { toast } = useToast();
  const [lastCheckedTimestamp, setLastCheckedTimestamp] = useState<string | null>(null);
  
  // Fetch chat messages
  const { data: messages = [] } = useQuery({
    queryKey: ['eventChat', event.id],
    queryFn: () => getEventChatMessages(event.id),
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Check for new messages
  useEffect(() => {
    if (!lastCheckedTimestamp) {
      setLastCheckedTimestamp(new Date().toISOString());
      return;
    }
    
    const lastChecked = new Date(lastCheckedTimestamp).getTime();
    const newMessages = messages.filter(msg => {
      const msgTime = new Date(msg.timestamp).getTime();
      return msgTime > lastChecked;
    });
    
    // Show notifications for new announcements
    const newAnnouncements = newMessages.filter(msg => msg.type === 'announcement');
    
    if (newAnnouncements.length > 0) {
      toast({
        title: `${newAnnouncements.length === 1 ? 'New announcement' : `${newAnnouncements.length} new announcements`}`,
        description: newAnnouncements[0].content.substring(0, 100) + (newAnnouncements[0].content.length > 100 ? '...' : ''),
        action: (
          <div className="flex items-center" onClick={() => window.location.href = `/events/${event.id}?tab=chat`}>
            <Bell className="h-4 w-4 mr-1" />
            <span>View</span>
          </div>
        ),
      });
    }
    
    // Update the last checked timestamp
    setLastCheckedTimestamp(new Date().toISOString());
  }, [messages, event.id, lastCheckedTimestamp, toast]);
  
  return null; // This is a background component, no UI needed
};

export default ChatNotifications;


import { ChatMessage } from '@/types';
import { format } from 'date-fns';
import { Pin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface PinnedMessagesProps {
  messages: ChatMessage[];
  onUnpin: (messageId: string) => void;
}

const PinnedMessages = ({ messages, onUnpin }: PinnedMessagesProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <Pin className="h-8 w-8 mb-2 text-muted-foreground" />
        <h3 className="text-lg font-medium mb-1">No pinned messages</h3>
        <p className="text-sm text-muted-foreground">
          Important messages and announcements will appear here when you pin them.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Pinned Messages ({messages.length})
      </h3>
      
      {messages.map(message => (
        <div key={message.id} className="border rounded-lg p-4 bg-primary/5">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={message.userAvatar} alt={message.userName} />
                <AvatarFallback>{message.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{message.userName}</span>
              
              {message.isOrganizer && (
                <Badge variant="outline" className="ml-1 text-xs px-1">
                  Organizer
                </Badge>
              )}
              
              {message.type === 'announcement' && (
                <Badge variant="outline" className="ml-1 text-xs px-1 bg-blue-100">
                  Announcement
                </Badge>
              )}
              
              {message.type === 'question' && (
                <Badge variant="outline" className="ml-1 text-xs px-1 bg-green-100">
                  Question
                </Badge>
              )}
            </div>
            
            <span className="text-xs text-muted-foreground">
              {format(new Date(message.timestamp), 'MMM d, h:mm a')}
            </span>
          </div>
          
          <p className="text-sm mb-3">{message.content}</p>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={() => onUnpin(message.id)}
          >
            <Pin className="h-3 w-3 mr-1" /> Unpin
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PinnedMessages;

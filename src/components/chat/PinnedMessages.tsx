
import { format } from 'date-fns';
import { Pin } from 'lucide-react';
import { ChatMessage } from '@/types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PinnedMessagesProps {
  messages: ChatMessage[];
  onUnpin: (messageId: string) => void;
}

const PinnedMessages = ({ messages, onUnpin }: PinnedMessagesProps) => {
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground flex-col">
        <Pin className="h-10 w-10 mb-2 text-muted-foreground/50" />
        <p>No pinned messages yet</p>
        <p className="text-sm">Pin important messages to easily find them later</p>
      </div>
    );
  }
  
  return (
    <ScrollArea className="h-full">
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border rounded-lg p-4 bg-primary/5">
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.userAvatar} alt={message.userName} />
                <AvatarFallback>{message.userName.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-baseline justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {message.userName}
                      {message.isOrganizer && (
                        <Badge variant="outline" className="ml-1 text-xs px-1">
                          Organizer
                        </Badge>
                      )}
                    </span>
                    
                    {message.type === 'announcement' && (
                      <Badge variant="outline" className="text-xs px-1 bg-blue-100">
                        Announcement
                      </Badge>
                    )}
                    
                    {message.type === 'question' && (
                      <Badge variant="outline" className="text-xs px-1 bg-green-100">
                        Question
                      </Badge>
                    )}
                  </div>
                  
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm mb-3">{message.content}</p>
            
            <Button
              variant="outline"
              size="sm"
              className="w-full text-primary"
              onClick={() => onUnpin(message.id)}
            >
              <Pin className="h-3.5 w-3.5 mr-1" />
              Unpin
            </Button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default PinnedMessages;

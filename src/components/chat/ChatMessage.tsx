
import { useState } from 'react';
import { format } from 'date-fns';
import { Reply, ThumbsUp, Pin, Trash2, MoreHorizontal, User } from 'lucide-react';
import { ChatMessage as ChatMessageType } from '@/types';
import { mockChatRooms } from '@/lib/data/chat';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ChatMessageProps {
  message: ChatMessageType;
  currentUserId: string;
  isOrganizer: boolean;
  onReply: () => void;
  onUpvote: () => void;
  onPin: () => void;
  onDelete: () => void;
  onPrivateReply: () => void;
}

const ChatMessage = ({
  message,
  currentUserId,
  isOrganizer,
  onReply,
  onUpvote,
  onPin,
  onDelete,
  onPrivateReply,
}: ChatMessageProps) => {
  const [showActions, setShowActions] = useState(false);
  
  const isCurrentUser = message.userId === currentUserId;
  const canModerate = isOrganizer || isCurrentUser;
  
  // Check if the message is pinned
  const isPinned = (() => {
    const chatRoom = mockChatRooms.find(room => room.eventId === message.eventId);
    return chatRoom?.pinnedMessageIds.includes(message.id) || false;
  })();
  
  // Format the timestamp
  const formattedTime = format(new Date(message.timestamp), 'h:mm a');
  const formattedDate = format(new Date(message.timestamp), 'MMM d');
  
  // Get background color based on message type
  const getBgColor = () => {
    if (message.isPrivate) return 'bg-yellow-50';
    switch (message.type) {
      case 'announcement': return 'bg-blue-50';
      case 'question': return 'bg-green-50';
      case 'system': return 'bg-gray-50';
      default: return 'bg-white';
    }
  };
  
  return (
    <div 
      className={`relative rounded-lg p-3 ${getBgColor()} ${isPinned ? 'border-2 border-primary/30' : 'border'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.userAvatar} alt={message.userName} />
          <AvatarFallback>{message.userName.charAt(0)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
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
              
              {message.isPrivate && (
                <Badge variant="outline" className="text-xs px-1 bg-yellow-100">
                  Private
                </Badge>
              )}
              
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
            
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formattedTime} · {formattedDate}
            </span>
          </div>
          
          {message.parentId && (
            <div className="text-xs text-muted-foreground mb-1 border-l-2 border-muted pl-2">
              Replying to a message
            </div>
          )}
          
          <p className="text-sm mb-2 break-words">{message.content}</p>
          
          {message.type === 'question' && (
            <Button
              variant="ghost"
              size="sm"
              className={`text-xs h-6 px-2 ${message.userUpvoted ? 'bg-primary/10 text-primary' : ''}`}
              onClick={onUpvote}
            >
              <ThumbsUp className="h-3 w-3 mr-1" />
              {message.upvotes || 0} Upvotes
            </Button>
          )}
        </div>
      </div>
      
      {showActions && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={onReply}
                >
                  <Reply className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reply</TooltipContent>
            </Tooltip>
            
            {canModerate && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={onPin}
                    >
                      <Pin className={`h-3.5 w-3.5 ${isPinned ? 'text-primary' : ''}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isPinned ? 'Unpin' : 'Pin'}</TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete</TooltipContent>
                </Tooltip>
              </>
            )}
            
            {!isCurrentUser && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={onPrivateReply}
                  >
                    <User className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Private Message</TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

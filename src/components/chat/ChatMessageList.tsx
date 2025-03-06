
import { useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatMessageComponent from './ChatMessage';

interface ChatMessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
  isOrganizer: boolean;
  onReply: (message: ChatMessage) => void;
  onUpvote: (messageId: string) => void;
  onPin: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onPrivateReply: (message: ChatMessage) => void;
}

const ChatMessageList = ({
  messages,
  currentUserId,
  isOrganizer,
  onReply,
  onUpvote,
  onPin,
  onDelete,
  onPrivateReply
}: ChatMessageListProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-muted-foreground">
          No messages yet. Start the conversation!
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <ChatMessageComponent 
              key={msg.id}
              message={msg}
              currentUserId={currentUserId}
              isOrganizer={isOrganizer}
              onReply={() => onReply(msg)}
              onUpvote={() => onUpvote(msg.id)}
              onPin={() => onPin(msg.id)}
              onDelete={() => onDelete(msg.id)}
              onPrivateReply={() => onPrivateReply(msg)}
            />
          ))}
        </div>
      )}
    </ScrollArea>
  );
};

export default ChatMessageList;

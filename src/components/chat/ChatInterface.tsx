
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageCircle, X } from 'lucide-react';
import { Event, ChatMessage as ChatMessageType, MessageType } from '@/types';
import { 
  getEventChatMessages, 
  addChatMessage, 
  toggleUpvote, 
  togglePinMessage, 
  deleteMessage, 
  mockChatRooms 
} from '@/lib/data/chat';
import { currentUser } from '@/lib/data/users';
import { useToast } from '@/hooks/use-toast';
import ChatFilterControls from './ChatFilterControls';
import ChatMessageList from './ChatMessageList';
import ChatMessageInput from './ChatMessageInput';
import ChatTabs from './ChatTabs';
import NewAnnouncementForm from './NewAnnouncementForm';

interface ChatInterfaceProps {
  event: Event;
  isOrganizer: boolean;
}

const ChatInterface = ({ event, isOrganizer }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [messageType, setMessageType] = useState<MessageType>('text');
  const [replyTo, setReplyTo] = useState<ChatMessageType | null>(null);
  const [filter, setFilter] = useState<'all' | 'questions' | 'announcements' | 'private'>('all');
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);

  // Fetch chat messages
  const { data: messages = [] } = useQuery({
    queryKey: ['eventChat', event.id],
    queryFn: () => getEventChatMessages(event.id),
  });

  // Add message mutation
  const addMessageMutation = useMutation({
    mutationFn: (data: { 
      content: string, 
      type: MessageType,
      parentId?: string,
      isPrivate?: boolean,
      recipientId?: string,
      recipientName?: string
    }) => addChatMessage(
      event.id, 
      data.content, 
      data.type, 
      data.parentId,
      data.isPrivate,
      data.recipientId,
      data.recipientName
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventChat', event.id] });
      setReplyTo(null);
      setMessageType('text');
    }
  });

  // Toggle upvote mutation
  const toggleUpvoteMutation = useMutation({
    mutationFn: (messageId: string) => toggleUpvote(messageId, event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventChat', event.id] });
    }
  });

  // Toggle pin mutation
  const togglePinMutation = useMutation({
    mutationFn: (messageId: string) => togglePinMessage(messageId, event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventChat', event.id] });
    }
  });

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: (messageId: string) => deleteMessage(messageId, event.id),
    onSuccess: (success) => {
      if (success) {
        queryClient.invalidateQueries({ queryKey: ['eventChat', event.id] });
        toast({
          title: "Message deleted",
          description: "The message has been removed from the chat.",
        });
      }
    }
  });

  // Filter messages based on the current filter
  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'questions') return msg.type === 'question';
    if (filter === 'announcements') return msg.type === 'announcement';
    if (filter === 'private') return msg.isPrivate && (msg.userId === currentUser.id || msg.recipientId === currentUser.id);
    return true;
  });

  // Handle sending a message
  const handleSendMessage = (content: string, type: MessageType) => {
    if (!content.trim()) return;
    
    addMessageMutation.mutate({ 
      content, 
      type,
      parentId: replyTo?.id,
      isPrivate: false
    });
  };

  // Handle sending an announcement
  const handleSendAnnouncement = (content: string) => {
    addMessageMutation.mutate({ 
      content, 
      type: 'announcement'
    });
    setShowAnnouncementForm(false);
  };

  // Handle sending a private message
  const handleSendPrivateMessage = (recipientId: string, recipientName: string) => {
    // This would be implemented when selecting a recipient for private messages
  };

  // Handle initiating private reply
  const handlePrivateReply = (message: ChatMessageType) => {
    setReplyTo(message);
    setMessageType('text');
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white">
      <ChatFilterControls 
        onFilterChange={setFilter}
        onAnnouncementClick={() => setShowAnnouncementForm(true)}
        isOrganizer={isOrganizer}
        messageCount={messages.length}
      />
      
      <ChatTabs 
        eventId={event.id}
        messages={messages}
        onUnpin={(messageId) => togglePinMutation.mutate(messageId)}
      >
        <ChatMessageList 
          messages={filteredMessages}
          currentUserId={currentUser.id}
          isOrganizer={isOrganizer}
          onReply={setReplyTo}
          onUpvote={(messageId) => toggleUpvoteMutation.mutate(messageId)}
          onPin={(messageId) => togglePinMutation.mutate(messageId)}
          onDelete={(messageId) => deleteMessageMutation.mutate(messageId)}
          onPrivateReply={handlePrivateReply}
        />
        
        <ChatMessageInput 
          onSendMessage={handleSendMessage}
          replyingTo={replyTo ? {
            id: replyTo.id,
            userName: replyTo.userName,
            content: replyTo.content
          } : null}
          onCancelReply={() => setReplyTo(null)}
        />
      </ChatTabs>

      {showAnnouncementForm && (
        <NewAnnouncementForm 
          onSubmit={handleSendAnnouncement} 
          onCancel={() => setShowAnnouncementForm(false)} 
        />
      )}
    </div>
  );
};

export default ChatInterface;


import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { MessageCircle, Send, ThumbsUp, Pin, Trash2, Bell, Filter, X } from 'lucide-react';
import { ChatMessage, Event, MessageType } from '@/types';
import { getEventChatMessages, addChatMessage, toggleUpvote, togglePinMessage, deleteMessage } from '@/lib/data';
import { currentUser } from '@/lib/data/users';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from './ChatMessage';
import PinnedMessages from './PinnedMessages';
import NewAnnouncementForm from './NewAnnouncementForm';

interface ChatInterfaceProps {
  event: Event;
  isOrganizer: boolean;
}

const ChatInterface = ({ event, isOrganizer }: ChatInterfaceProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('text');
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
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
      setMessage('');
      setReplyTo(null);
      setMessageType('text');

      if (scrollAreaRef.current) {
        setTimeout(() => {
          scrollAreaRef.current?.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
        }, 100);
      }
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

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Filter messages based on the current filter
  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'questions') return msg.type === 'question';
    if (filter === 'announcements') return msg.type === 'announcement';
    if (filter === 'private') return msg.isPrivate && (msg.userId === currentUser.id || msg.recipientId === currentUser.id);
    return true;
  });

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    addMessageMutation.mutate({ 
      content: message, 
      type: messageType,
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
    if (!message.trim()) return;
    
    addMessageMutation.mutate({ 
      content: message, 
      type: 'text',
      isPrivate: true,
      recipientId,
      recipientName
    });
  };

  // Handle upvoting a question
  const handleToggleUpvote = (messageId: string) => {
    toggleUpvoteMutation.mutate(messageId);
  };

  // Handle pinning a message
  const handleTogglePin = (messageId: string) => {
    togglePinMutation.mutate(messageId);
  };

  // Handle deleting a message
  const handleDeleteMessage = (messageId: string) => {
    deleteMessageMutation.mutate(messageId);
  };

  // Cancel reply
  const cancelReply = () => {
    setReplyTo(null);
  };

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden bg-white">
      <div className="p-4 border-b flex items-center justify-between bg-primary/5">
        <div className="flex items-center">
          <MessageCircle className="h-5 w-5 mr-2 text-primary" />
          <h3 className="font-semibold">Event Chat</h3>
          <Badge variant="outline" className="ml-2">
            {messages.length} messages
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {isOrganizer && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowAnnouncementForm(true)}
            >
              <Bell className="h-4 w-4 mr-1" />
              Announcement
            </Button>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>
                All Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('questions')}>
                Questions Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('announcements')}>
                Announcements
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilter('private')}>
                Private Messages
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="px-4 py-2 border-b justify-start">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="pinned">
            Pinned
            <Badge variant="outline" className="ml-1">
              {messages.filter(m => m.pinnedMessageIds?.includes(m.id)).length || 0}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col p-0">
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
            {filteredMessages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMessages.map((msg) => (
                  <ChatMessage 
                    key={msg.id}
                    message={msg}
                    currentUserId={currentUser.id}
                    isOrganizer={isOrganizer}
                    onReply={() => setReplyTo(msg)}
                    onUpvote={() => handleToggleUpvote(msg.id)}
                    onPin={() => handleTogglePin(msg.id)}
                    onDelete={() => handleDeleteMessage(msg.id)}
                    onPrivateReply={() => {
                      setMessageType('text');
                      setMessage(`@${msg.userName} `);
                    }}
                  />
                ))}
              </div>
            )}
          </ScrollArea>
          
          {replyTo && (
            <div className="px-4 pt-2 flex items-center text-sm bg-muted/50">
              <div className="flex-1">
                Replying to <span className="font-medium">{replyTo.userName}</span>: {replyTo.content.substring(0, 50)}{replyTo.content.length > 50 ? '...' : ''}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0" 
                onClick={cancelReply}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <form 
            onSubmit={handleSendMessage} 
            className="p-4 border-t flex items-center gap-2"
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="shrink-0"
                >
                  {messageType === 'text' && <MessageCircle className="h-4 w-4" />}
                  {messageType === 'question' && <ThumbsUp className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setMessageType('text')}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Regular Message
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setMessageType('question')}>
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Ask a Question
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                messageType === 'question' 
                  ? "Ask a question..." 
                  : "Type your message..."
              }
              className="flex-1"
            />
            
            <Button 
              type="submit" 
              size="icon" 
              disabled={!message.trim()} 
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </TabsContent>
        
        <TabsContent value="pinned" className="flex-1 p-4">
          <PinnedMessages 
            messages={messages.filter(m => m.pinnedMessageIds?.includes(m.id))}
            onUnpin={handleTogglePin}
          />
        </TabsContent>
      </Tabs>

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

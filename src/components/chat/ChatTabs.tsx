
import { ChatMessage } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import PinnedMessages from './PinnedMessages';
import { mockChatRooms } from '@/lib/data/chat';

interface ChatTabsProps {
  eventId: string;
  messages: ChatMessage[];
  children: React.ReactNode;
  onUnpin: (messageId: string) => void;
}

const ChatTabs = ({ eventId, messages, children, onUnpin }: ChatTabsProps) => {
  const chatRoom = mockChatRooms.find(r => r.eventId === eventId);
  const pinnedCount = chatRoom?.pinnedMessageIds.length || 0;
  const pinnedMessages = messages.filter(m => chatRoom?.pinnedMessageIds.includes(m.id));

  return (
    <Tabs defaultValue="chat" className="flex-1 flex flex-col">
      <TabsList className="px-4 py-2 border-b justify-start">
        <TabsTrigger value="chat">Chat</TabsTrigger>
        <TabsTrigger value="pinned">
          Pinned
          <Badge variant="outline" className="ml-1">
            {pinnedCount}
          </Badge>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="chat" className="flex-1 flex flex-col p-0">
        {children}
      </TabsContent>
      
      <TabsContent value="pinned" className="flex-1 p-4">
        <PinnedMessages 
          messages={pinnedMessages}
          onUnpin={onUnpin}
        />
      </TabsContent>
    </Tabs>
  );
};

export default ChatTabs;

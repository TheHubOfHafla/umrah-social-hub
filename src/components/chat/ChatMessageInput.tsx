
import { useState } from 'react';
import { MessageCircle, Send, ThumbsUp, X } from 'lucide-react';
import { MessageType } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatMessageInputProps {
  onSendMessage: (content: string, type: MessageType) => void;
  replyingTo: {
    id: string;
    userName: string;
    content: string;
  } | null;
  onCancelReply: () => void;
}

const ChatMessageInput = ({ onSendMessage, replyingTo, onCancelReply }: ChatMessageInputProps) => {
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<MessageType>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    onSendMessage(message, messageType);
    setMessage('');
  };

  return (
    <>
      {replyingTo && (
        <div className="px-4 pt-2 flex items-center text-sm bg-muted/50">
          <div className="flex-1">
            Replying to <span className="font-medium">{replyingTo.userName}</span>: {replyingTo.content.substring(0, 50)}{replyingTo.content.length > 50 ? '...' : ''}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={onCancelReply}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <form 
        onSubmit={handleSubmit} 
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
    </>
  );
};

export default ChatMessageInput;

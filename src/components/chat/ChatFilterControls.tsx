
import { MessageCircle, Bell, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChatFilterControlsProps {
  onFilterChange: (filter: 'all' | 'questions' | 'announcements' | 'private') => void;
  onAnnouncementClick: () => void;
  isOrganizer: boolean;
  messageCount: number;
}

const ChatFilterControls = ({ 
  onFilterChange, 
  onAnnouncementClick, 
  isOrganizer,
  messageCount
}: ChatFilterControlsProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-primary/5">
      <div className="flex items-center">
        <MessageCircle className="h-5 w-5 mr-2 text-primary" />
        <h3 className="font-semibold">Event Chat</h3>
        <Badge variant="outline" className="ml-2">
          {messageCount} messages
        </Badge>
      </div>
      
      <div className="flex items-center gap-2">
        {isOrganizer && (
          <Button 
            size="sm" 
            variant="outline"
            onClick={onAnnouncementClick}
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
            <DropdownMenuItem onClick={() => onFilterChange('all')}>
              All Messages
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('questions')}>
              Questions Only
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('announcements')}>
              Announcements
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterChange('private')}>
              Private Messages
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatFilterControls;

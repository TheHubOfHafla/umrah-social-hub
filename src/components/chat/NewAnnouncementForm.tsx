
import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface NewAnnouncementFormProps {
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

const NewAnnouncementForm = ({ onSubmit, onCancel }: NewAnnouncementFormProps) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
    }
  };

  const isDisabled = !content.trim() || content.length < 5;

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            New Announcement
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              This announcement will be visible to all attendees and will be highlighted in the chat.
            </p>
            
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your announcement message..."
              className="min-h-[120px]"
            />
            
            <p className="text-xs text-muted-foreground mt-2 text-right">
              {content.length} characters
            </p>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isDisabled}>
              Send Announcement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAnnouncementForm;

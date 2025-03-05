
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "./UserAvatar";
import Button from "./Button";
import { EventAttendee } from "@/types";
import { Users } from "lucide-react";

interface AttendeesListProps {
  attendees: EventAttendee[];
  maxDisplay?: number;
}

const AttendeesList = ({ attendees, maxDisplay = 5 }: AttendeesListProps) => {
  const [open, setOpen] = useState(false);
  
  if (!attendees || attendees.length === 0) {
    return null;
  }

  const displayAttendees = attendees.slice(0, maxDisplay);
  const remainingCount = attendees.length - maxDisplay;

  return (
    <div>
      <div className="flex items-center mb-1">
        <h4 className="text-sm font-medium">Attendees</h4>
        <span className="ml-2 text-xs text-muted-foreground">
          {attendees.length} {attendees.length === 1 ? 'person' : 'people'}
        </span>
      </div>
      
      <div className="flex items-center">
        <div className="flex -space-x-2">
          {displayAttendees.map((attendee) => (
            <UserAvatar
              key={attendee.userId}
              user={attendee}
              size="sm"
              className="ring-2 ring-background transition-transform hover:z-10 hover:scale-110"
            />
          ))}
        </div>
        
        {remainingCount > 0 && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="subtle" 
                size="sm" 
                className="ml-2 h-8 text-xs"
                icon={<Users size={14} />}
              >
                +{remainingCount} more
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Event Attendees</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] mt-4">
                <div className="grid grid-cols-1 gap-4 py-2">
                  {attendees.map((attendee) => (
                    <div key={attendee.userId} className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-md">
                      <UserAvatar 
                        user={attendee} 
                        showName={true} 
                        namePosition="right"
                      />
                      {attendee.ticketType && (
                        <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
                          {attendee.ticketType}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default AttendeesList;

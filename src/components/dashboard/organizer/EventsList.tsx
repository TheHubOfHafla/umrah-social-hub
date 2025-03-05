
import { Link } from "react-router-dom";
import { Calendar, EditIcon, MoreVertical, Trash2, Users } from "lucide-react";
import { Event, EventCategory } from "@/types";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/Button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface EventsListProps {
  events: Event[];
  onDeleteClick: (eventId: string) => void;
  emptyMessage?: string;
}

const EventsList = ({ events, onDeleteClick, emptyMessage = "No events found" }: EventsListProps) => {
  if (events.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
          {emptyMessage.includes("upcoming") && (
            <Link to="/events/create">
              <Button className="mt-4" size="sm">
                Create Event
              </Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="grid divide-y">
        {events.map((event) => (
          <div
            key={event.id}
            className="grid grid-cols-1 items-center gap-4 p-4 sm:grid-cols-6"
          >
            <div className="col-span-1 sm:col-span-3">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 overflow-hidden rounded">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{event.title}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="mr-1 h-3 w-3" />
                    {new Date(event.date.start).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-span-1 hidden sm:block">
              {event.categories.slice(0, 1).map((category) => (
                <Badge key={category} variant="secondary" className="mr-1">
                  {category}
                </Badge>
              ))}
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <Users className="mr-1 h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{event.attendees?.length || 0}</span>
            </div>
            <div className="col-span-1 flex items-center justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link to={`/events/${event.id}`}>
                    <DropdownMenuItem>View</DropdownMenuItem>
                  </Link>
                  <Link to={`/events/${event.id}/edit`}>
                    <DropdownMenuItem>
                      <EditIcon className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </Link>
                  <Link to={`/events/${event.id}/attendees`}>
                    <DropdownMenuItem>
                      <Users className="mr-2 h-4 w-4" />
                      Attendees
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => onDeleteClick(event.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList;

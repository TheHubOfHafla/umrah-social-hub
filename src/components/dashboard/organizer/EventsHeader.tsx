
import { Link } from "react-router-dom";
import Button from "@/components/Button";
import { PlusCircle } from "lucide-react";

const EventsHeader = () => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
        <p className="text-muted-foreground">
          Create, edit and manage your events
        </p>
      </div>
      <Link to="/events/create">
        <Button icon={<PlusCircle className="h-4 w-4" />}>
          Create Event
        </Button>
      </Link>
    </div>
  );
};

export default EventsHeader;

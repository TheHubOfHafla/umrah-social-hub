
import { Link } from "react-router-dom";
import { CalendarCheck } from "lucide-react";
import Button from "@/components/Button";

const MyEventsPromo = () => {
  return (
    <section className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-secondary/50 rounded-2xl">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">Track Your Events</h2>
          <p className="text-muted-foreground max-w-lg">
            Keep track of events you're attending and get reminders before they start
          </p>
        </div>
        <Link to="/my-events">
          <Button className="min-w-[200px]" icon={<CalendarCheck className="mr-2 h-4 w-4" />}>
            My Events
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default MyEventsPromo;


import { Link } from "react-router-dom";
import { Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const BecomeOrganizerPrompt = () => {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Building className="mr-2 h-5 w-5 text-primary" />
          Become an Organizer
        </CardTitle>
        <CardDescription>
          Create and manage your own Islamic events
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          As an organizer, you can create and manage events, track attendance, collect donations,
          and connect with your community.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Create Events</h4>
              <p className="text-xs text-muted-foreground">Host events of any size</p>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-medium">Manage Attendees</h4>
              <p className="text-xs text-muted-foreground">Track registrations and check-ins</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/organizer/signup" className="w-full">
          <Button className="w-full">Apply to Become an Organizer</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default BecomeOrganizerPrompt;

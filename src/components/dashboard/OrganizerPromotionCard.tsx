
import { Link } from "react-router-dom";
import { Building, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const OrganizerPromotionCard = () => {
  return (
    <Card className="border border-primary/20 bg-primary/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          Become an Event Organizer
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">
          Create and manage your own Islamic events, track attendance, and grow your community.
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Host spiritual gatherings</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Create educational workshops</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm">Organize community fundraisers</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/organizer/signup" className="w-full">
          <Button variant="default" className="w-full">Apply Now</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default OrganizerPromotionCard;


import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface EventSuccessMessageProps {
  eventId?: string;
}

export default function EventSuccessMessage({ eventId }: EventSuccessMessageProps) {
  return (
    <Card className="border-purple-200 shadow-lg transition-all animate-fade-in">
      <CardHeader className="bg-purple-50 border-b border-purple-100">
        <CardTitle className="text-center text-xl text-purple-900">Event Created Successfully!</CardTitle>
        <CardDescription className="text-center">
          Your event has been published and is now live
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8 pb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="text-lg font-medium mb-2">Congratulations!</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Your event has been successfully created and published. You can now manage it from your dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/organizer/events">
            <Button className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
          
          {eventId && (
            <Link to={`/events/${eventId}`}>
              <Button variant="outline" className="w-full sm:w-auto">
                View Event Page
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronLeft, Calendar, MapPin, Clock, Info, CreditCard, Check } from "lucide-react";

import { getEventById, registerForEvent } from "@/lib/data/queries";
import Button from "@/components/Button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const RegisterPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId || ''),
    enabled: !!eventId,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission with a timeout
    setTimeout(() => {
      // Register the user for the event
      if (event) {
        registerForEvent(event.id);
      }
      
      setIsSubmitting(false);
      setConfirmationOpen(true);
    }, 1500);
  };

  const handleConfirm = () => {
    setConfirmationOpen(false);
    toast({
      title: "Registration successful!",
      description: `You're now registered for ${event?.title}. Check your email for details.`,
    });
    navigate(`/events/${eventId}`);
  };

  if (isLoading || !event) {
    return <RegisterPageSkeleton />;
  }

  const eventDate = new Date(event.date.start);
  const formattedDate = format(eventDate, "EEEE, MMMM d, yyyy");
  const formattedTime = format(eventDate, "h:mm a");

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Link to={`/events/${eventId}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Back to event
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Register for Event</h1>
              <p className="text-muted-foreground">
                Please fill out the form below to register for the event.
              </p>
            </div>

            <Card className="shadow-sm">
              <CardHeader className="bg-primary/5 border-b">
                <h2 className="text-xl font-semibold">Your Information</h2>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                        required 
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                        required 
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                      placeholder="Enter your email address"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Your confirmation and event details will be sent to this email.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="font-medium">Terms & Conditions</h3>
                    <div className="text-sm text-muted-foreground">
                      <p>By registering for this event, you agree to the following:</p>
                      <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Event details may be subject to change</li>
                        <li>Your information will be shared with the event organizer</li>
                        <li>You may receive updates about this and similar events</li>
                      </ul>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full md:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    size="lg"
                    loading={isSubmitting}
                  >
                    Complete Registration
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-sm overflow-hidden sticky top-24">
              <div className="aspect-video w-full relative">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="object-cover w-full h-full"
                />
                {event.isFree && (
                  <Badge className="absolute top-3 right-3 bg-green-500 text-white border-0">
                    Free Event
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-2">
                <h2 className="text-xl font-bold line-clamp-2">{event.title}</h2>
              </CardHeader>
              <CardContent className="pb-2 space-y-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{formattedDate}</p>
                    <p className="text-sm text-muted-foreground">{formattedTime}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">{event.location.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {event.location.address}, {event.location.city}
                    </p>
                  </div>
                </div>

                {event.organizer && (
                  <div className="flex items-start space-x-3">
                    <Info className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium">Organized by</p>
                      <p className="text-sm text-muted-foreground">{event.organizer.name}</p>
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="bg-primary/5 border-t flex flex-col items-start p-4">
                <div className="flex justify-between w-full mb-2">
                  <span className="text-sm font-medium">Registration</span>
                  <span className="text-sm font-bold text-green-600">
                    {event.isFree ? 'Free' : `£${event.price || '0'}`}
                  </span>
                </div>
                <Separator className="my-2 w-full" />
                <div className="flex justify-between w-full">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-green-600">
                    {event.isFree ? 'Free' : `£${event.price || '0'}`}
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">Registration Confirmed</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8" />
            </div>
            <p className="text-center">
              Thank you for registering for <span className="font-semibold">{event.title}</span>!
            </p>
            <p className="text-center text-sm text-muted-foreground">
              We've sent a confirmation email to <span className="font-medium">{email}</span> with all the details.
            </p>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button onClick={handleConfirm} className="w-full sm:w-auto">
              Back to Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const RegisterPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Skeleton className="h-6 w-24 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>
            <Card className="shadow-sm">
              <CardHeader className="border-b">
                <Skeleton className="h-8 w-48" />
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-px w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-10 w-48" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="shadow-sm overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
              <CardFooter className="border-t p-4">
                <Skeleton className="h-16 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

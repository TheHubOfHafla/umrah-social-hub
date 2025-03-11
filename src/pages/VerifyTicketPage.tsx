
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, XCircle, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getEventById } from "@/lib/data/queries";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Button from "@/components/Button";

const VerifyTicketPage = () => {
  const { eventId, confirmationCode } = useParams<{ eventId: string; confirmationCode: string }>();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'valid' | 'invalid'>('loading');
  const [attendeeName, setAttendeeName] = useState<string>("");

  const { data: event, isLoading: isEventLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId || ''),
    enabled: !!eventId,
  });

  useEffect(() => {
    const verifyTicket = async () => {
      if (!eventId || !confirmationCode) {
        setVerificationStatus('invalid');
        return;
      }

      try {
        // Query the confirmations table to check if the code is valid
        const { data, error } = await supabase
          .from('event_confirmations')
          .select('id, user_id, status')
          .eq('event_id', eventId)
          .eq('confirmation_code', confirmationCode)
          .single();

        if (error || !data) {
          console.error('Verification error:', error);
          setVerificationStatus('invalid');
          return;
        }

        // Get user profile to display name
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.user_id)
          .single();

        if (!userError && userData) {
          setAttendeeName(userData.name || 'Attendee');
        }

        // Check if the status is confirmed
        if (data.status === 'confirmed') {
          setVerificationStatus('valid');
        } else {
          setVerificationStatus('invalid');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setVerificationStatus('invalid');
      }
    };

    verifyTicket();
  }, [eventId, confirmationCode]);

  if (isEventLoading || !event) {
    return (
      <Container className="py-16">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-48 mx-auto" />
          </CardHeader>
          <CardContent className="text-center">
            <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
            <Skeleton className="h-6 w-36 mx-auto mb-2" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <Link to={`/events/${eventId}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
        <ChevronLeft size={16} className="mr-1" />
        Back to event
      </Link>
      
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center border-b">
          <h1 className="text-2xl font-bold">Ticket Verification</h1>
        </CardHeader>
        <CardContent className="p-8 text-center">
          {verificationStatus === 'loading' ? (
            <div className="flex flex-col items-center">
              <div className="h-16 w-16 rounded-full border-4 border-t-primary border-r-primary border-b-primary/30 border-l-primary/30 animate-spin mb-4"></div>
              <p className="text-lg font-medium">Verifying ticket...</p>
            </div>
          ) : verificationStatus === 'valid' ? (
            <div className="flex flex-col items-center">
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-xl font-bold text-green-600 mb-2">Valid Ticket</h2>
              <p className="text-lg mb-1">
                {attendeeName}
              </p>
              <p className="text-muted-foreground mb-4">
                Confirmation code: {confirmationCode}
              </p>
              <div className="bg-green-50 border border-green-200 rounded-md p-4 max-w-sm">
                <h3 className="font-medium text-green-800 mb-1">{event.title}</h3>
                <p className="text-sm text-green-700">
                  This ticket has been verified and is valid for entry.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <XCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Ticket</h2>
              <p className="text-muted-foreground mb-4">
                The ticket confirmation code is invalid or has already been used.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-sm">
                <p className="text-sm text-red-700">
                  This ticket cannot be verified. Please check the confirmation code or contact the event organizer for assistance.
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center border-t bg-muted/20 p-4">
          <Link to={`/events/${eventId}`}>
            <Button variant="outline">Return to Event</Button>
          </Link>
        </CardFooter>
      </Card>
    </Container>
  );
};

export default VerifyTicketPage;

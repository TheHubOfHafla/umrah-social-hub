
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const VerifyTicketPage = () => {
  const { eventId, confirmationCode } = useParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyTicket = async () => {
      if (!eventId || !confirmationCode) {
        setError("Missing event ID or confirmation code");
        setIsVerifying(false);
        return;
      }

      try {
        // Check if the confirmation code is valid
        const { data, error: queryError } = await supabase
          .from("event_confirmations")
          .select("*, events(*)")
          .eq("event_id", eventId)
          .eq("confirmation_code", confirmationCode)
          .single();

        if (queryError || !data) {
          console.error("Error verifying ticket:", queryError);
          setError("Invalid ticket or ticket not found");
          setIsVerifying(false);
          return;
        }

        setTicketDetails(data);
        setIsValid(true);
        setIsVerifying(false);
      } catch (err) {
        console.error("Error in ticket verification:", err);
        setError("An error occurred while verifying the ticket");
        setIsVerifying(false);
      }
    };

    verifyTicket();
  }, [eventId, confirmationCode]);

  return (
    <div className="container py-12">
      <Card className="max-w-md mx-auto">
        <CardHeader className={`${isValid ? "bg-green-50" : error ? "bg-red-50" : "bg-blue-50"}`}>
          <CardTitle className="flex items-center justify-center text-xl">
            {isVerifying ? (
              <>
                <Loader2 className="h-6 w-6 mr-2 animate-spin text-blue-600" />
                Verifying Ticket
              </>
            ) : isValid ? (
              <>
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Valid Ticket
              </>
            ) : (
              <>
                <XCircle className="h-6 w-6 mr-2 text-red-600" />
                Invalid Ticket
              </>
            )}
          </CardTitle>
          <CardDescription className="text-center">
            {isVerifying
              ? "Please wait while we verify your ticket..."
              : isValid
              ? "This ticket is valid and can be accepted"
              : "This ticket cannot be verified"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isVerifying ? (
            <div className="flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : isValid && ticketDetails ? (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{ticketDetails.events.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(ticketDetails.events.start_date).toLocaleDateString()}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">Confirmation Code</p>
                  <p className="font-mono text-sm">{ticketDetails.confirmation_code}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Ticket Type</p>
                  <p className="text-sm">{ticketDetails.ticket_type || "Standard"}</p>
                </div>
              </div>
              <Button className="w-full">Mark as Used</Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button variant="outline">Try Another Ticket</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyTicketPage;

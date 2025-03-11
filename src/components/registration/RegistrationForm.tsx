
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Button from "@/components/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface RegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onRegistrationSuccess: (data: {
    email: string;
    confirmationCode: string;
    qrCodeUrl: string;
  }) => void;
}

const SUPABASE_URL = "https://annunwfjlsgrrcqfkykd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubnVud2ZqbHNncnJjcWZreWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjM2NTIsImV4cCI6MjA1Njc5OTY1Mn0._Is_Kgi8wTHsQ3Z1h87JkrliCtj8lWijCJaRBJBPBCU";

const RegistrationForm = ({ eventId, eventTitle, onRegistrationSuccess }: RegistrationFormProps) => {
  const { toast } = useToast();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let userId = session?.user?.id;
      
      if (!session) {
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();
        
        if (checkError) {
          throw new Error('Error checking user account');
        }
        
        if (existingUser) {
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              emailRedirectTo: window.location.href,
            }
          });
          
          if (signInError) throw new Error(signInError.message);
          
          toast({
            title: "Login link sent!",
            description: "Please check your email to complete your registration.",
          });
          
          setIsSubmitting(false);
          return;
        } else {
          const { data: newUser, error: signUpError } = await supabase.auth.signUp({
            email,
            password: Math.random().toString(36).slice(2, 10),
            options: {
              data: {
                name: `${firstName} ${lastName}`,
              },
            }
          });
          
          if (signUpError) throw new Error(signUpError.message);
          userId = newUser?.user?.id;
        }
      }
      
      if (!userId) {
        throw new Error('Could not authenticate user');
      }
      
      try {
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
          await fetch(`${SUPABASE_URL}/rest/v1/registrations`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token || ''}`,
              'apikey': SUPABASE_ANON_KEY,
            },
            body: JSON.stringify({
              event_id: eventId,
              user_id: userId,
              registration_date: new Date().toISOString(),
            })
          });
        } else {
          console.log('Skipping database registration for non-UUID event ID:', eventId);
        }
      } catch (regError) {
        console.error('Event registration error:', regError);
      }

      try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/send-booking-confirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token || ''}`,
            'apikey': SUPABASE_ANON_KEY
          },
          body: JSON.stringify({
            eventId: eventId,
            userId,
            userName: `${firstName} ${lastName}`,
            userEmail: email,
            eventTitle: eventTitle,
            eventDate: new Date().toISOString(), // This would ideally come from props
            eventLocation: "Event Location", // This would ideally come from props
            ticketType: "Standard" // This would ideally come from props
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Booking confirmation API error:', errorText);
          throw new Error(`Failed to send booking confirmation: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        onRegistrationSuccess({
          email,
          confirmationCode: data.confirmationCode,
          qrCodeUrl: data.qrCodeUrl
        });
      } catch (confirmError) {
        console.error('Confirmation error:', confirmError);
        throw new Error('Failed to generate booking confirmation');
      }
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
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
  );
};

export default RegistrationForm;

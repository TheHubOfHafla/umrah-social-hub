
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Button from "@/components/Button";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

// Create a schema for form validation
const registrationFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

const RegistrationForm = ({ eventId, eventTitle, onRegistrationSuccess }: RegistrationFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      termsAccepted: false
    }
  });

  const handleSubmit = async (values: RegistrationFormValues) => {
    setApiError(null);
    setIsSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let userId = session?.user?.id;
      
      if (!session) {
        const { data: existingUser, error: checkError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', values.email)
          .maybeSingle();
        
        if (checkError) {
          throw new Error('Error checking user account: ' + checkError.message);
        }
        
        if (existingUser) {
          const { error: signInError } = await supabase.auth.signInWithOtp({
            email: values.email,
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
            email: values.email,
            password: Math.random().toString(36).slice(2, 10),
            options: {
              data: {
                name: `${values.firstName} ${values.lastName}`,
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
        // We continue despite this error to try the booking confirmation
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
            userName: `${values.firstName} ${values.lastName}`,
            userEmail: values.email,
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
          email: values.email,
          confirmationCode: data.confirmationCode,
          qrCodeUrl: data.qrCodeUrl
        });
      } catch (confirmError) {
        console.error('Confirmation error:', confirmError);
        throw new Error('Failed to generate booking confirmation. Please try again later.');
      }
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error instanceof Error ? error.message : "An unexpected error occurred. Please try again later.");
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="shadow-sm rounded-lg overflow-hidden">
          <div className="bg-primary/5 border-b px-6 py-4">
            <h2 className="text-xl font-semibold">Your Information</h2>
          </div>
          <div className="p-6 space-y-6">
            {apiError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{apiError}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your first name" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your last name" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      {...field} 
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Your confirmation and event details will be sent to this email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I accept the terms and conditions</FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full md:w-auto transition-transform hover:scale-[1.02] active:scale-[0.98]"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              Complete Registration
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RegistrationForm;

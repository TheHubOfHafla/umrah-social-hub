
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [message, setMessage] = useState("Completing authentication...");

  useEffect(() => {
    // Parse the URL to get any redirect path and role preference
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo') || '/';
    const preferredRole = params.get('role') || 'attendee';
    
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error in auth callback:", error);
        setMessage("Authentication failed. Please try again.");
        toast({
          title: "Authentication failed",
          description: error.message || "Please try again.",
          variant: "destructive"
        });
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        
        return;
      }
      
      if (data?.session) {
        // User is authenticated
        setMessage("Authentication successful! Redirecting...");
        
        // Get the user's metadata to determine if they're new and need role setup
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData?.user?.id;
        const userMetadata = userData?.user?.user_metadata;
        const isNewUser = userData?.user?.app_metadata?.provider === 'google' && 
                         !userMetadata?.role;
        
        // For new Google users, we need to update their profile with a role
        if (isNewUser && userId) {
          try {
            // Update user metadata with the preferred role
            await supabase.auth.updateUser({
              data: {
                role: preferredRole,
                name: userMetadata?.full_name || userMetadata?.name || 'User'
              }
            });
            
            // If they chose to be an organizer, create an organizer profile
            if (preferredRole === 'organizer') {
              const { error: organizerError } = await supabase
                .from('organizers')
                .insert({
                  user_id: userId,
                  name: userMetadata?.full_name || userMetadata?.name || 'Organizer'
                });
                
              if (organizerError) {
                console.error("Error creating organizer profile:", organizerError);
              }
            }
            
            // Ensure a profile exists for the user
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();
              
            if (profileError && profileError.code === 'PGRST116') {
              // Profile doesn't exist, create one
              const { error: insertError } = await supabase
                .from('profiles')
                .insert({
                  id: userId,
                  name: userMetadata?.full_name || userMetadata?.name || 'User',
                  email: userData.user.email,
                  events_attending: []
                });
                
              if (insertError) {
                console.error("Error creating user profile:", insertError);
              }
            }
          } catch (updateError) {
            console.error("Error updating user:", updateError);
          }
        }
        
        toast({
          title: "Welcome to HaflaHub!",
          description: "You've successfully signed in.",
        });
        
        // Determine where to redirect the user based on role and context
        if (redirectTo.includes('/events/') && redirectTo.includes('/register')) {
          // Continue with event registration
          navigate(redirectTo);
        } else if (userMetadata?.role === 'organizer' || preferredRole === 'organizer') {
          // Redirect organizers to their dashboard
          navigate("/organizer");
        } else {
          // Regular attendees go to dashboard
          navigate("/dashboard");
        }
      } else {
        // No session found
        setMessage("Authentication incomplete. Please try again.");
        
        toast({
          description: "Authentication incomplete. Please try again.",
          variant: "destructive"
        });
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    };
    
    handleAuthCallback();
  }, [navigate, toast, location.search]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold">{message}</h2>
        <p className="text-muted-foreground mt-2">You'll be redirected shortly.</p>
      </div>
    </div>
  );
};

export default AuthCallback;

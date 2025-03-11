
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
    // Parse the URL to get any redirect path
    const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirectTo') || '/';
    
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
        
        toast({
          title: "Welcome to HaflaHub!",
          description: "You've successfully signed in.",
        });
        
        // If we were in the middle of a event registration, continue with that
        if (redirectTo.includes('/events/') && redirectTo.includes('/register')) {
          navigate(redirectTo);
        } else {
          navigate("/");
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


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error in auth callback:", error);
        toast({
          title: "Authentication failed",
          description: error.message || "Please try again.",
          variant: "destructive"
        });
        navigate("/login");
        return;
      }
      
      if (data?.session) {
        // User is authenticated, redirect to dashboard/home
        toast({
          title: "Welcome to EventHub!",
          description: "You've successfully signed in.",
        });
        navigate("/");
      } else {
        // No session found, redirect to login
        toast({
          description: "Authentication incomplete. Please try again.",
          variant: "destructive"
        });
        navigate("/login");
      }
    };
    
    handleAuthCallback();
  }, [navigate, toast]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold">Completing authentication...</h2>
        <p className="text-muted-foreground mt-2">You'll be redirected shortly.</p>
      </div>
    </div>
  );
};

export default AuthCallback;

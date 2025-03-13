
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useEventCreationAuth = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: sessionData, error } = await supabase.auth.getSession();
        
        if (error) {
          throw new Error("Failed to check authentication status");
        }
        
        if (!sessionData.session) {
          toast({
            title: "Authentication Required",
            description: "You need to be logged in to create an event",
            variant: "destructive"
          });
          navigate("/login?redirect=/events/create");
          return;
        }
        
        // Check if user has an organizer profile
        const { data: organizerData, error: organizerError } = await supabase
          .from('organizers')
          .select('id')
          .eq('user_id', sessionData.session.user.id)
          .single();
        
        if (organizerError && organizerError.code !== 'PGRST116') {
          console.error("Error checking organizer profile:", organizerError);
        }
        
        // No need to redirect if they don't have an organizer profile
        // The form will create one for them when they submit
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Error",
          description: "Failed to verify authentication status",
          variant: "destructive"
        });
        navigate("/login");
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  return { isCheckingAuth };
};

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";
import { organizers } from "@/lib/data/organizers";

// Define the auth context type
type AuthContextType = {
  user: any | null;
  profile: any | null;
  organizer: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signUp: (email: string, password: string, userData: any) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [organizer, setOrganizer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Function to fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };

  // Function to fetch organizer profile
  const fetchOrganizer = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("organizers")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        // Not necessarily an error if the user is not an organizer
        if (error.code !== "PGRST116") {
          console.error("Error fetching organizer:", error);
        }
        
        // If in development environment or for demo purposes, return a dummy organizer
        if (import.meta.env.DEV || userId === 'mock-user-id') {
          const dummyOrganizer = organizers.find(org => org.id === 'mock-user-id') || organizers[0];
          return {
            id: dummyOrganizer.id,
            name: dummyOrganizer.name,
            avatar: dummyOrganizer.avatar,
            bio: dummyOrganizer.bio,
            website: dummyOrganizer.website,
            organization_type: dummyOrganizer.organizationType,
            user_id: userId
          };
        }
        
        return null;
      }

      return data;
    } catch (error) {
      console.error("Error in fetchOrganizer:", error);
      
      // Fallback to dummy organizer
      if (import.meta.env.DEV || userId === 'mock-user-id') {
        const dummyOrganizer = organizers.find(org => org.id === 'mock-user-id') || organizers[0];
        return {
          id: dummyOrganizer.id,
          name: dummyOrganizer.name,
          avatar: dummyOrganizer.avatar,
          bio: dummyOrganizer.bio,
          website: dummyOrganizer.website,
          organization_type: dummyOrganizer.organizationType,
          user_id: userId
        };
      }
      
      return null;
    }
  };

  // Function to refresh the user profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
      
      const organizerData = await fetchOrganizer(user.id);
      setOrganizer(organizerData);
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Error signing in:", error);
        return { success: false, error };
      }

      // Successfully signed in
      return { success: true };
    } catch (error) {
      console.error("Error in signIn:", error);
      return { success: false, error };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        console.error("Error signing up:", error);
        return { success: false, error };
      }

      // Successfully signed up
      return { success: true };
    } catch (error) {
      console.error("Error in signUp:", error);
      return { success: false, error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setOrganizer(null);
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Listen for auth state changes when the component mounts
  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch the user's profile and organizer data
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          
          const organizerData = await fetchOrganizer(session.user.id);
          setOrganizer(organizerData);
        } else {
          // For development/demo purposes, set a mock user
          if (import.meta.env.DEV) {
            const mockUser = {
              id: 'mock-user-id',
              email: 'demo@example.com',
              role: 'organizer'
            };
            setUser(mockUser);
            
            // Use dummy profile and organizer
            setProfile({
              id: 'mock-user-id',
              name: 'Demo User',
              email: 'demo@example.com'
            });
            
            const dummyOrganizer = organizers.find(org => org.id === 'mock-user-id') || organizers[0];
            setOrganizer({
              id: dummyOrganizer.id,
              name: dummyOrganizer.name,
              avatar: dummyOrganizer.avatar,
              bio: dummyOrganizer.bio,
              website: dummyOrganizer.website,
              organization_type: dummyOrganizer.organizationType,
              user_id: 'mock-user-id'
            });
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the function to fetch the initial session
    fetchInitialSession();
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          // Fetch the user's profile and organizer data
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
          
          const organizerData = await fetchOrganizer(session.user.id);
          setOrganizer(organizerData);
        } else {
          // For development/demo purposes, maintain a mock user
          if (import.meta.env.DEV) {
            // Keep the mock user and data
          } else {
            setUser(null);
            setProfile(null);
            setOrganizer(null);
          }
        }
        
        setLoading(false);
      }
    );

    // Clean up the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Provide the auth context
  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        organizer,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};


import { User, UserRole, EventCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';

// Fetch the currently authenticated user profile
export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log("No authenticated user found");
      return null;
    }
    
    console.log("Authenticated user:", user.id);
    
    // Get the user profile from our profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error("Error fetching profile:", error);
      
      // If the profile doesn't exist, we'll create one
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id,
              name: user.user_metadata?.name || '',
              email: user.email,
              events_attending: [],
              saved_events: [],
              interests: [],
              following: []
            }
          ])
          .select()
          .single();
          
        if (createError) {
          console.error("Error creating profile:", createError);
          return null;
        }
        
        return newProfile ? {
          id: newProfile.id,
          name: newProfile.name || '',
          avatar: newProfile.avatar || '/placeholder.svg',
          interests: (newProfile.interests || []) as EventCategory[],
          location: {
            city: newProfile.city || '',
            country: newProfile.country || '',
          },
          following: newProfile.following || [],
          eventsAttending: newProfile.events_attending || [],
          savedEvents: newProfile.saved_events || [],
          email: newProfile.email,
          phone: newProfile.phone,
          signupDate: newProfile.signup_date,
          role: user.user_metadata?.role as UserRole || 'attendee',
        } : null;
      }
      
      return null;
    }
    
    if (!profile) {
      console.log("No profile found for user:", user.id);
      return null;
    }
    
    // Check if user is an organizer
    const { data: organizer } = await supabase
      .from('organizers')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    // Get role from user metadata or determine based on organizer record
    let role: UserRole;
    if (user.user_metadata?.role === 'organizer' || organizer) {
      role = 'organizer';
    } else {
      role = 'attendee';
    }
    
    console.log("User profile loaded:", profile);
    
    return {
      id: profile.id,
      name: profile.name || '',
      avatar: profile.avatar || '/placeholder.svg',
      interests: (profile.interests || []) as EventCategory[],
      location: {
        city: profile.city || '',
        country: profile.country || '',
      },
      following: profile.following || [],
      eventsAttending: profile.events_attending || [],
      savedEvents: profile.saved_events || [],
      email: profile.email,
      phone: profile.phone,
      signupDate: profile.signup_date,
      role: role,
    };
  } catch (error) {
    console.error("Error in fetchCurrentUser:", error);
    return null;
  }
};

// Update a user's profile
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Omit<User, 'id'>>
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        name: updates.name,
        avatar: updates.avatar,
        interests: updates.interests as string[],
        city: updates.location?.city,
        country: updates.location?.country,
        following: updates.following,
        events_attending: updates.eventsAttending,
        saved_events: updates.savedEvents,
        phone: updates.phone,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (error) {
      console.error("Error updating profile:", error);
      return false;
    }
    
    console.log("Profile updated successfully for user:", userId);
    return true;
  } catch (error) {
    console.error("Failed to update profile:", error);
    return false;
  }
};

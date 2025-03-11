
import { User, EventCategory, UserRole } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const currentUser: User = {
  id: 'user1',
  name: 'Ahmed Mohamed',
  avatar: '/placeholder.svg',
  interests: ['charity', 'education', 'travel', 'umrah'],
  location: {
    city: 'London',
    country: 'United Kingdom',
  },
  following: ['org1', 'org2'],
  eventsAttending: ['event1', 'event2'],
};

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
    
    const role: UserRole = organizer ? 'organizer' : 'attendee';
    
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
        interests: updates.interests as string[], // Cast to string[] when sending to Supabase
        city: updates.location?.city,
        country: updates.location?.country,
        following: updates.following,
        events_attending: updates.eventsAttending,
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

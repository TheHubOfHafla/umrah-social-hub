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
  savedEvents: ['event3', 'event4'],
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

// Add an event to a user's saved events list
export const saveEventForUser = async (userId: string, eventId: string): Promise<boolean> => {
  try {
    // First, get the current user profile to get the current saved events list
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('saved_events')
      .eq('id', userId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching profile for saved events:", fetchError);
      return false;
    }
    
    // Create a new array with the existing saved events and the new one
    const currentSavedEvents = profile?.saved_events || [];
    
    // Check if event is already in the list
    if (currentSavedEvents.includes(eventId)) {
      console.log("Event already in user's saved list:", eventId);
      return true; // Already saved, so consider this a success
    }
    
    const updatedSavedEvents = [...currentSavedEvents, eventId];
    
    // Update the profile with the new saved events list
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        saved_events: updatedSavedEvents,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating profile with new saved event:", updateError);
      return false;
    }
    
    console.log("Successfully added event to user's saved list:", eventId);
    return true;
  } catch (error) {
    console.error("Failed to add event to user saved events:", error);
    return false;
  }
};

// Remove an event from a user's saved events list
export const unsaveEventForUser = async (userId: string, eventId: string): Promise<boolean> => {
  try {
    // First, get the current user profile to get the current saved events list
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('saved_events')
      .eq('id', userId)
      .single();
    
    if (fetchError) {
      console.error("Error fetching profile for saved events:", fetchError);
      return false;
    }
    
    // Create a new array without the removed event
    const currentSavedEvents = profile?.saved_events || [];
    const updatedSavedEvents = currentSavedEvents.filter(id => id !== eventId);
    
    // Update the profile with the new saved events list
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        saved_events: updatedSavedEvents,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating profile when removing saved event:", updateError);
      return false;
    }
    
    console.log("Successfully removed event from user's saved list:", eventId);
    return true;
  } catch (error) {
    console.error("Failed to remove event from user saved events:", error);
    return false;
  }
};

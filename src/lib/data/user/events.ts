
import { supabase } from '@/integrations/supabase/client';

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

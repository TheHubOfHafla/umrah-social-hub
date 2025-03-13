
import { supabase } from "@/integrations/supabase/client";
import { FormData } from "@/hooks/useEventForm";

export const saveEventToDatabase = async (formData: FormData) => {
  // Get the current user session
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  
  if (sessionError || !sessionData.session) {
    throw new Error("You must be logged in to create an event");
  }
  
  const userId = sessionData.session.user.id;
  
  // Get organizer profile or create if not exists
  const { data: organizerData, error: organizerError } = await supabase
    .from('organizers')
    .select('id')
    .eq('user_id', userId)
    .single();
  
  let organizerId;
  
  if (organizerError || !organizerData) {
    // Create a new organizer profile if one doesn't exist
    const { data: newOrganizer, error: createError } = await supabase
      .from('organizers')
      .insert([
        { 
          user_id: userId,
          name: sessionData.session.user.email?.split('@')[0] || 'New Organizer',
        }
      ])
      .select('id')
      .single();
    
    if (createError || !newOrganizer) {
      throw new Error("Failed to create organizer profile");
    }
    
    organizerId = newOrganizer.id;
  } else {
    organizerId = organizerData.id;
  }
  
  // Format date and time for API
  const dateObj = new Date(`${formData.date}T${formData.time}`);
  const endDateObj = new Date(dateObj.getTime() + 2 * 60 * 60 * 1000); // Default 2 hours duration
  
  // Insert the event into the database
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .insert([
      {
        title: formData.title,
        description: formData.description,
        short_description: formData.description.substring(0, 120) + '...',
        organizer_id: organizerId,
        location_name: formData.location,
        location_city: formData.city, 
        location_country: formData.country,
        start_date: dateObj.toISOString(),
        end_date: endDateObj.toISOString(),
        capacity: formData.capacity,
        is_free: formData.isFree,
        base_price: formData.price,
        categories: [formData.category],
        tickets_remaining: formData.capacity
      }
    ])
    .select('id')
    .single();
  
  if (eventError || !eventData) {
    throw new Error("Failed to create event: " + eventError?.message);
  }
  
  return eventData.id;
};

import { supabase } from "@/integrations/supabase/client";
import { Event, EventOrganizer, AttendeeType, EventCategory } from "@/types";

/**
 * Get organizer profile by user ID
 */
export async function getOrganizerByUserId(userId: string): Promise<EventOrganizer | null> {
  const { data, error } = await supabase
    .from("organizers")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching organizer profile:", error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    avatar: data.avatar,
    bio: data.bio,
    website: data.website,
    organizationType: data.organization_type as EventOrganizer['organizationType'],
  };
}

/**
 * Get upcoming events for an organizer
 */
export async function getOrganizerUpcomingEvents(organizerId: string): Promise<Event[]> {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizer:organizers(*),
      ticket_types(*),
      attendees:attendees(*)
    `)
    .eq("organizer_id", organizerId)
    .gte("start_date", now)
    .order("start_date", { ascending: true })
    .limit(5);

  if (error) {
    console.error("Error fetching organizer events:", error);
    return [];
  }

  return data.map(event => formatEventFromSupabase(event));
}

/**
 * Get past events for an organizer
 */
export async function getOrganizerPastEvents(organizerId: string): Promise<Event[]> {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizer:organizers(*),
      ticket_types(*),
      attendees:attendees(*)
    `)
    .eq("organizer_id", organizerId)
    .lt("start_date", now)
    .order("start_date", { ascending: false })
    .limit(5);

  if (error) {
    console.error("Error fetching organizer past events:", error);
    return [];
  }

  return data.map(event => formatEventFromSupabase(event));
}

/**
 * Get all events for an organizer
 */
export async function getAllOrganizerEvents(organizerId: string): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select(`
      *,
      organizer:organizers(*),
      ticket_types(*),
      attendees:attendees(*)
    `)
    .eq("organizer_id", organizerId)
    .order("start_date", { ascending: false });

  if (error) {
    console.error("Error fetching all organizer events:", error);
    return [];
  }

  return data.map(event => formatEventFromSupabase(event));
}

/**
 * Get organizer statistics
 */
export async function getOrganizerStats(organizerId: string) {
  const { data: events, error: eventsError } = await supabase
    .from("events")
    .select("id")
    .eq("organizer_id", organizerId);

  if (eventsError) {
    console.error("Error fetching organizer events for stats:", eventsError);
    return {
      totalEvents: 0,
      totalAttendees: 0,
      totalRevenue: 0,
      avgAttendance: 0,
    };
  }

  const eventIds = events.map(e => e.id);
  
  // If no events, return zeros
  if (eventIds.length === 0) {
    return {
      totalEvents: 0,
      totalAttendees: 0,
      totalRevenue: 0,
      avgAttendance: 0,
    };
  }

  // Get attendee count
  const { count: attendeesCount, error: attendeesError } = await supabase
    .from("attendees")
    .select("*", { count: "exact" })
    .in("event_id", eventIds);

  if (attendeesError) {
    console.error("Error counting attendees:", attendeesError);
  }

  // Get ticket sales data
  const { data: ticketSales, error: salesError } = await supabase
    .from("ticket_types")
    .select("price, sold")
    .in("event_id", eventIds);

  if (salesError) {
    console.error("Error fetching ticket sales:", salesError);
  }

  // Calculate revenue
  const totalRevenue = ticketSales?.reduce((sum, ticket) => {
    return sum + (ticket.price * (ticket.sold || 0));
  }, 0) || 0;

  return {
    totalEvents: events.length,
    totalAttendees: attendeesCount || 0,
    totalRevenue,
    avgAttendance: attendeesCount ? Math.round(attendeesCount / events.length) : 0,
  };
}

/**
 * Update organizer profile
 */
export async function updateOrganizerProfile(
  organizerId: string, 
  data: Partial<EventOrganizer>
): Promise<boolean> {
  const { error } = await supabase
    .from("organizers")
    .update({
      name: data.name,
      bio: data.bio,
      website: data.website,
      organization_type: data.organizationType,
      avatar: data.avatar,
      updated_at: new Date().toISOString(),
    })
    .eq("id", organizerId);

  if (error) {
    console.error("Error updating organizer profile:", error);
    return false;
  }

  return true;
}

/**
 * Delete an event
 */
export async function deleteEvent(eventId: string): Promise<boolean> {
  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    console.error("Error deleting event:", error);
    return false;
  }

  return true;
}

/**
 * Helper function to format event data from Supabase
 */
function formatEventFromSupabase(event: any): Event {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    shortDescription: event.short_description || "",
    image: event.image || "/placeholder.svg",
    date: {
      start: event.start_date,
      end: event.end_date,
    },
    location: {
      name: event.location_name || "",
      address: event.location_address || "",
      city: event.location_city || "",
      country: event.location_country || "",
      coordinates: event.location_lat && event.location_lng 
        ? { lat: event.location_lat, lng: event.location_lng } 
        : undefined,
    },
    organizer: {
      id: event.organizer.id,
      name: event.organizer.name,
      avatar: event.organizer.avatar || "/placeholder.svg",
      bio: event.organizer.bio,
      website: event.organizer.website,
      organizationType: event.organizer.organization_type as EventOrganizer['organizationType'],
    },
    categories: event.categories || [],
    attendeeType: event.attendee_type as AttendeeType | undefined,
    featured: event.featured || false,
    ticketTypes: event.ticket_types?.map(ticket => ({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      description: ticket.description,
      quantity: ticket.quantity,
      sold: ticket.sold || 0,
      available: ticket.available,
    })),
    attendees: event.attendees?.map(attendee => ({
      userId: attendee.user_id,
      name: attendee.name,
      avatar: "/placeholder.svg", // Default avatar
      purchaseDate: attendee.purchase_date,
    })),
    capacity: event.capacity,
    isFree: event.is_free || false,
    price: event.base_price,
  };
}

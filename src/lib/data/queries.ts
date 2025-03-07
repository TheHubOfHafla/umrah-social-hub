import { Event, EventCategory, AttendeeType } from '@/types';
import { mockEvents } from './events';
import { currentUser } from './users';

export const getFeaturedEvents = (): Event[] => {
  return mockEvents.filter(event => event.featured);
};

export const getPopularEvents = (): Event[] => {
  // Sort events by the number of attendees, with most attended first
  return [...mockEvents]
    .sort((a, b) => (b.attendees?.length || 0) - (a.attendees?.length || 0))
    .slice(0, 6);
};

export const getEventsByCategory = (category: EventCategory): Event[] => {
  return mockEvents.filter(event => event.categories.includes(category));
};

export const getEventById = (id: string): Event | undefined => {
  return mockEvents.find(event => event.id === id);
};

export const getRelatedEvents = (event: Event): Event[] => {
  return mockEvents
    .filter(e => 
      e.id !== event.id && 
      e.categories.some(cat => event.categories.includes(cat))
    )
    .slice(0, 3);
};

export const getAttendingEvents = (userId: string): Event[] => {
  const user = currentUser;
  if (!user || !user.eventsAttending) return [];
  
  return mockEvents.filter(event => 
    user.eventsAttending?.includes(event.id)
  );
};

export const getRecommendedEvents = (userId: string): Event[] => {
  const user = currentUser;
  if (!user || !user.interests) {
    // For users without interests, return featured events or popular events
    const featuredOrPopular = [...getFeaturedEvents(), ...getPopularEvents()];
    return [...new Set(featuredOrPopular)].slice(0, 12); // Ensure 12 unique events
  }
  
  // First try to get events matching user interests
  let recommended = mockEvents
    .filter(event => 
      event.categories.some(cat => user.interests?.includes(cat)) &&
      !user.eventsAttending?.includes(event.id)
    );
    
  // If we don't have enough events from interests, add some featured or popular events
  if (recommended.length < 12) {
    const featuredOrPopular = [...getFeaturedEvents(), ...getPopularEvents()]
      .filter(event => !user.eventsAttending?.includes(event.id) && 
                       !recommended.some(r => r.id === event.id));
    
    recommended = [...recommended, ...featuredOrPopular];
  }
  
  // Return exactly 12 events, or pad with more events if needed
  return recommended.slice(0, 12);
};

export const getEventsByAttendeeType = (type: AttendeeType): Event[] => {
  return mockEvents.filter(event => event.attendeeType === type);
};

/**
 * Get events that a user is attending
 */
export const getUserEvents = (userId: string): Event[] => {
  const user = currentUser;
  if (!user || !user.eventsAttending) return [];
  
  const now = new Date();
  return mockEvents.filter(event => {
    const eventEndDate = event.date.end ? new Date(event.date.end) : new Date(event.date.start);
    return eventEndDate >= now && user.eventsAttending?.includes(event.id);
  });
};

/**
 * Get past events that a user has attended
 */
export const getEventsHistory = (userId: string): Event[] => {
  const now = new Date();
  return mockEvents.filter(event => {
    const eventEndDate = event.date.end ? new Date(event.date.end) : new Date(event.date.start);
    return eventEndDate < now && currentUser.eventsAttending?.includes(event.id);
  });
};

/**
 * Get upcoming events for an organizer
 */
export const getOrganizerEvents = (organizerId: string): Event[] => {
  const now = new Date();
  return mockEvents.filter(event => {
    const eventStartDate = new Date(event.date.start);
    return eventStartDate >= now && event.organizer.id === organizerId;
  }).slice(0, 5);
};

/**
 * Get past events for an organizer
 */
export const getOrganizerPastEvents = (organizerId: string): Event[] => {
  const now = new Date();
  return mockEvents.filter(event => {
    const eventEndDate = event.date.end ? new Date(event.date.end) : new Date(event.date.start);
    return eventEndDate < now && event.organizer.id === organizerId;
  }).slice(0, 5);
};

/**
 * Register a user for an event
 */
export const registerForEvent = (eventId: string): boolean => {
  // In a real app, this would make an API call
  if (!currentUser.eventsAttending) {
    currentUser.eventsAttending = [];
  }
  
  if (!currentUser.eventsAttending.includes(eventId)) {
    currentUser.eventsAttending.push(eventId);
    
    // Add the user to the event's attendees list
    const event = mockEvents.find(e => e.id === eventId);
    if (event) {
      if (!event.attendees) {
        event.attendees = [];
      }
      
      event.attendees.push({
        userId: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        purchaseDate: new Date().toISOString()
      });
    }
    
    return true;
  }
  
  return false;
};

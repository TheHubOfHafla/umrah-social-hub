export type EventCategory = 
  | 'charity'
  | 'community'
  | 'education'
  | 'mosque'
  | 'travel'
  | 'umrah'
  | 'lecture'
  | 'workshop'
  | 'social'
  | 'other';

export type EventLocation = {
  name: string;
  address: string;
  city: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

export type EventOrganizer = {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  website?: string;
  organizationType: 'individual' | 'mosque' | 'charity' | 'company' | 'influencer' | 'scholar';
};

export type AttendeeType = 'ladies-only' | 'couples' | 'mixed' | 'men-only';

export type User = {
  id: string;
  name: string;
  avatar: string;
  interests?: EventCategory[];
  location?: {
    city: string;
    country: string;
  };
  following?: string[]; // organizer IDs
  eventsAttending?: string[]; // event IDs
};

export type EventAttendee = {
  userId: string;
  name: string;
  avatar: string;
  ticketType?: string;
  purchaseDate?: string;
};

export type EventTicketType = {
  id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  sold: number;
  available: boolean;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  date: {
    start: string; // ISO format
    end?: string; // ISO format
  };
  location: EventLocation;
  organizer: EventOrganizer;
  categories: EventCategory[];
  attendeeType?: AttendeeType;
  featured?: boolean;
  ticketTypes?: EventTicketType[];
  attendees?: EventAttendee[];
  capacity?: number;
  isFree: boolean;
  price?: number; // Starting price if multiple ticket types
};

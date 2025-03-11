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

export type UserRole = 'attendee' | 'organizer';

export interface User {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
  interests?: EventCategory[];
  signupDate?: string;
  location?: {
    city: string;
    country: string;
  };
  following?: string[];
  eventsAttending?: string[];
  savedEvents?: string[];
  role?: UserRole;
}

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

export type TicketActivity = {
  isSellingFast?: boolean;
  lastPurchaseTime?: string; // ISO date string
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
  ticketActivity?: TicketActivity;
};

// Chat related types
export type MessageType = 'text' | 'announcement' | 'question' | 'system';

export type ChatMessage = {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  type: MessageType;
  timestamp: string; // ISO format
  isOrganizer: boolean;
  parentId?: string; // For replies
  upvotes?: number; // For questions
  userUpvoted?: boolean; // If the current user has upvoted
  isPrivate?: boolean; // For private messages
  recipientId?: string; // For private messages
  recipientName?: string; // For private messages
};

export type EventChatRoom = {
  eventId: string;
  messages: ChatMessage[];
  participants: string[]; // User IDs
  pinnedMessageIds: string[]; // IDs of pinned messages
};

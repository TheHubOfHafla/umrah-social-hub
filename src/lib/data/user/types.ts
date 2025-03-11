
import { User, EventCategory, UserRole } from '@/types';

// Mock user data for development/testing
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

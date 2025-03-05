
import { Event, EventCategory, User, EventOrganizer, AttendeeType } from '@/types';

export const categories: { value: EventCategory; label: string; }[] = [
  { value: 'charity', label: 'Charity' },
  { value: 'community', label: 'Community' },
  { value: 'education', label: 'Education' },
  { value: 'mosque', label: 'Mosque' },
  { value: 'travel', label: 'Travel' },
  { value: 'umrah', label: 'Umrah' },
  { value: 'lecture', label: 'Lecture' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

export const organizers: EventOrganizer[] = [
  {
    id: 'org1',
    name: 'Masjid Al-Noor',
    avatar: '/placeholder.svg',
    bio: 'A community mosque serving the local community for over 20 years.',
    website: 'https://example.com/al-noor',
    organizationType: 'mosque',
  },
  {
    id: 'org2',
    name: 'Islamic Relief',
    avatar: '/placeholder.svg',
    bio: 'International humanitarian organization providing aid globally.',
    website: 'https://example.com/relief',
    organizationType: 'charity',
  },
  {
    id: 'org3',
    name: 'Al-Madina Travel',
    avatar: '/placeholder.svg',
    bio: 'Specializing in Umrah and Hajj packages for over 15 years.',
    website: 'https://example.com/madina-travel',
    organizationType: 'company',
  },
  {
    id: 'org4',
    name: 'Sheikh Ahmad Hassan',
    avatar: '/placeholder.svg',
    bio: 'International speaker and scholar with expertise in Islamic jurisprudence.',
    website: 'https://example.com/ahmad-hassan',
    organizationType: 'scholar',
  },
  {
    id: 'org5',
    name: 'Muslim Youth Foundation',
    avatar: '/placeholder.svg',
    bio: 'Empowering young Muslims through education and community service.',
    website: 'https://example.com/myf',
    organizationType: 'charity',
  },
];

export const mockEvents: Event[] = [
  {
    id: 'event1',
    title: 'Annual Community Iftar',
    shortDescription: 'Join us for our annual community iftar during Ramadan',
    description: 'We invite all community members to join us for our annual community iftar. This is a great opportunity to break fast together, meet new people, and strengthen our community bonds. The event will include a lecture by Sheikh Ahmad Hassan followed by dinner.',
    image: 'https://images.unsplash.com/photo-1492321936769-b49830bc1d1e',
    date: {
      start: '2024-07-15T18:30:00Z',
      end: '2024-07-15T21:30:00Z',
    },
    location: {
      name: 'Masjid Al-Noor',
      address: '123 Islamic Way',
      city: 'London',
      country: 'United Kingdom',
    },
    organizer: organizers[0],
    categories: ['community', 'mosque', 'social'],
    attendeeType: 'mixed',
    featured: true,
    isFree: true,
    capacity: 300,
    attendees: [
      {
        userId: 'user1',
        name: 'Ahmed Mohamed',
        avatar: '/placeholder.svg',
      },
      {
        userId: 'user2',
        name: 'Sarah Khan',
        avatar: '/placeholder.svg',
      },
      {
        userId: 'user3',
        name: 'Yusuf Ali',
        avatar: '/placeholder.svg',
      },
    ],
  },
  {
    id: 'event2',
    title: 'Charity Fundraising Dinner',
    shortDescription: 'Help raise funds for humanitarian aid in Gaza',
    description: 'Join us for an evening of solidarity and support as we raise funds for humanitarian aid in Gaza. The event will include a three-course dinner, inspiring speakers, and a charity auction. All proceeds will go directly to providing essential supplies and medical aid.',
    image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
    date: {
      start: '2024-08-22T19:00:00Z',
      end: '2024-08-22T22:00:00Z',
    },
    location: {
      name: 'Grand Ballroom, Hilton Hotel',
      address: '456 Charity Road',
      city: 'Birmingham',
      country: 'United Kingdom',
    },
    organizer: organizers[1],
    categories: ['charity', 'social'],
    attendeeType: 'mixed',
    price: 50,
    isFree: false,
    ticketTypes: [
      {
        id: 'ticket1',
        name: 'Standard',
        price: 50,
        description: 'Individual ticket including dinner and program',
        quantity: 200,
        sold: 120,
        available: true,
      },
      {
        id: 'ticket2',
        name: 'Family',
        price: 180,
        description: 'Ticket for a family of four',
        quantity: 50,
        sold: 30,
        available: true,
      },
      {
        id: 'ticket3',
        name: 'VIP',
        price: 150,
        description: 'VIP seating, special gifts, and meet with speakers',
        quantity: 20,
        sold: 15,
        available: true,
      },
    ],
    capacity: 270,
    featured: true,
    attendees: [
      {
        userId: 'user1',
        name: 'Ahmed Mohamed',
        avatar: '/placeholder.svg',
        ticketType: 'VIP',
      },
      {
        userId: 'user4',
        name: 'Fatima Hussein',
        avatar: '/placeholder.svg',
        ticketType: 'Family',
      },
    ],
  },
  {
    id: 'event3',
    title: 'Umrah Group Trip',
    shortDescription: 'Join our guided Umrah journey this winter',
    description: 'Experience the spiritual journey of Umrah with our guided group trip. Package includes flights, accommodation, visa processing, transportation, and a knowledgeable guide throughout the journey. Limited spots available, book early to secure your place.',
    image: 'https://images.unsplash.com/photo-1466442929976-97f336a657be',
    date: {
      start: '2024-12-15T00:00:00Z',
      end: '2024-12-25T00:00:00Z',
    },
    location: {
      name: 'Makkah and Madinah',
      address: '',
      city: 'Makkah',
      country: 'Saudi Arabia',
    },
    organizer: organizers[2],
    categories: ['travel', 'umrah'],
    attendeeType: 'mixed',
    price: 2000,
    isFree: false,
    ticketTypes: [
      {
        id: 'package1',
        name: 'Standard Package',
        price: 2000,
        description: 'Quad sharing accommodation',
        quantity: 40,
        sold: 25,
        available: true,
      },
      {
        id: 'package2',
        name: 'Premium Package',
        price: 2500,
        description: 'Double sharing accommodation',
        quantity: 20,
        sold: 15,
        available: true,
      },
      {
        id: 'package3',
        name: 'Luxury Package',
        price: 3500,
        description: 'Luxury hotels and exclusive services',
        quantity: 10,
        sold: 5,
        available: true,
      },
    ],
    featured: true,
  },
  {
    id: 'event4',
    title: 'Islamic Finance Workshop',
    shortDescription: 'Learn about halal investment and financial planning',
    description: 'This comprehensive workshop covers principles of Islamic finance, halal investment opportunities, and practical financial planning. Ideal for individuals looking to align their financial decisions with Islamic principles. Certificate provided upon completion.',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
    date: {
      start: '2024-09-05T09:00:00Z',
      end: '2024-09-05T17:00:00Z',
    },
    location: {
      name: 'Business Innovation Center',
      address: '789 Finance Street',
      city: 'Manchester',
      country: 'United Kingdom',
    },
    organizer: organizers[4],
    categories: ['education', 'workshop'],
    attendeeType: 'mixed',
    price: 75,
    isFree: false,
    capacity: 50,
  },
  {
    id: 'event5',
    title: 'Quran Competition for Children',
    shortDescription: 'Annual Quran recitation and memorization competition',
    description: 'Our annual Quran competition for children aged 7-15 encourages young Muslims to connect with the Quran through recitation and memorization. Various categories available based on age and experience. Prizes and certificates awarded to all participants.',
    image: '/placeholder.svg',
    date: {
      start: '2024-07-28T10:00:00Z',
      end: '2024-07-28T16:00:00Z',
    },
    location: {
      name: 'Islamic Education Center',
      address: '101 Knowledge Road',
      city: 'Leeds',
      country: 'United Kingdom',
    },
    organizer: organizers[0],
    categories: ['education', 'mosque', 'community'],
    attendeeType: 'mixed',
    isFree: true,
  },
  {
    id: 'event6',
    title: 'Islamic Art Exhibition',
    shortDescription: 'Showcasing traditional and contemporary Islamic art',
    description: 'This exhibition brings together a diverse collection of Islamic art, from traditional calligraphy and geometric patterns to contemporary interpretations. Featured artists from across the globe share their unique perspectives and techniques.',
    image: '/placeholder.svg',
    date: {
      start: '2024-08-10T10:00:00Z',
      end: '2024-08-30T18:00:00Z',
    },
    location: {
      name: 'City Art Gallery',
      address: '321 Culture Avenue',
      city: 'Bristol',
      country: 'United Kingdom',
    },
    organizer: organizers[4],
    categories: ['community', 'education', 'social'],
    attendeeType: 'mixed',
    isFree: true,
  },
  {
    id: 'event7',
    title: 'Sisters Wellness Retreat',
    shortDescription: 'A weekend of spiritual and physical wellness for Muslim women',
    description: 'Join us for a rejuvenating weekend retreat designed exclusively for Muslim women. Activities include yoga sessions, spiritual discussions, nature walks, and workshops on mindfulness and self-care from an Islamic perspective.',
    image: 'https://images.unsplash.com/photo-1580894897591-ff1e18c89183',
    date: {
      start: '2024-09-20T14:00:00Z',
      end: '2024-09-22T16:00:00Z',
    },
    location: {
      name: 'Tranquility Resort',
      address: '567 Serenity Lane',
      city: 'Lake District',
      country: 'United Kingdom',
    },
    organizer: organizers[4],
    categories: ['social', 'education', 'other'],
    attendeeType: 'ladies-only',
    price: 250,
    isFree: false,
    capacity: 40,
  },
  {
    id: 'event8',
    title: 'Muslim Couples Dinner & Workshop',
    shortDescription: 'Strengthen your marriage with this special couples event',
    description: 'A special evening designed for Muslim couples to strengthen their relationship through Islamic teachings. The event includes a gourmet dinner, interactive workshop on effective communication, and guidance from a respected marriage counselor.',
    image: 'https://images.unsplash.com/photo-1529636798458-92914e1115b7',
    date: {
      start: '2024-10-12T18:00:00Z',
      end: '2024-10-12T22:00:00Z',
    },
    location: {
      name: 'Garden Banquet Hall',
      address: '890 Harmony Road',
      city: 'Birmingham',
      country: 'United Kingdom',
    },
    organizer: organizers[3],
    categories: ['social', 'education'],
    attendeeType: 'couples',
    price: 120,
    isFree: false,
    capacity: 30,
  },
  {
    id: 'event9',
    title: 'Brothers Football Tournament',
    shortDescription: 'Annual football competition for Muslim men',
    description: 'Join our annual football tournament for Muslim men. Form your team or join as an individual player to be assigned to a team. The day includes competitive matches, refreshments, and prizes for the winning teams.',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20',
    date: {
      start: '2024-08-04T09:00:00Z',
      end: '2024-08-04T18:00:00Z',
    },
    location: {
      name: 'Community Sports Center',
      address: '432 Athletic Avenue',
      city: 'Manchester',
      country: 'United Kingdom',
    },
    organizer: organizers[0],
    categories: ['social', 'community'],
    attendeeType: 'men-only',
    isFree: true,
    capacity: 120,
  }
];

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

export const getFeaturedEvents = (): Event[] => {
  return mockEvents.filter(event => event.featured);
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
  if (!user || !user.interests) return getFeaturedEvents();
  
  return mockEvents
    .filter(event => 
      event.categories.some(cat => user.interests?.includes(cat)) &&
      !user.eventsAttending?.includes(event.id)
    )
    .slice(0, 4);
};

export const getEventsByAttendeeType = (type: AttendeeType): Event[] => {
  return mockEvents.filter(event => event.attendeeType === type);
};

// Add the missing exported functions
export const getUserEvents = (userId: string): Event[] => {
  // For now, let's return the same as getAttendingEvents
  return getAttendingEvents(userId);
};

export const getEventsHistory = (userId: string): Event[] => {
  // For demonstration purposes, return past events (those with end dates before now)
  const now = new Date();
  return mockEvents.filter(event => {
    const eventEndDate = event.date.end ? new Date(event.date.end) : new Date(event.date.start);
    return eventEndDate < now && currentUser.eventsAttending?.includes(event.id);
  });
};

export const getOrganizerEvents = (organizerId: string): Event[] => {
  // Return events where the organizer is the current user (for demo purposes)
  // In a real app, we would filter by organizer ID
  return mockEvents.filter(event => 
    event.date.start >= new Date().toISOString()
  ).slice(0, 5);
};

export const getOrganizerPastEvents = (organizerId: string): Event[] => {
  // Return events where the organizer is the current user but in the past
  const now = new Date();
  return mockEvents.filter(event => {
    const eventEndDate = event.date.end ? new Date(event.date.end) : new Date(event.date.start);
    return eventEndDate < now;
  }).slice(0, 5);
};

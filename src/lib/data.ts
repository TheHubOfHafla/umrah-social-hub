
import { Event, EventCategory, User, EventOrganizer } from '@/types';

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
    isFree: true,
  },
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

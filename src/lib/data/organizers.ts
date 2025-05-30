
import { EventOrganizer } from '@/types';

export const organizers: EventOrganizer[] = [
  {
    id: 'org1',
    name: 'Masjid Al-Noor',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    bio: 'A community mosque serving the local Muslim community for over 20 years. We offer daily prayers, weekly classes, and regular community events.',
    website: 'https://example.com/al-noor',
    organizationType: 'mosque',
  },
  {
    id: 'org2',
    name: 'Islamic Relief',
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    bio: 'International humanitarian organization providing aid globally. We focus on emergency response, sustainable development, and advocacy for those in need.',
    website: 'https://example.com/relief',
    organizationType: 'charity',
  },
  {
    id: 'org3',
    name: 'Al-Madina Travel',
    avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    bio: 'Specializing in Umrah and Hajj packages for over 15 years. Our experienced guides ensure a spiritual and comfortable journey to the holy sites.',
    website: 'https://example.com/madina-travel',
    organizationType: 'company',
  },
  {
    id: 'org4',
    name: 'Sheikh Ahmad Hassan',
    avatar: '/placeholder.svg',
    bio: 'International speaker and scholar with expertise in Islamic jurisprudence. With over 20 years of study, Sheikh Ahmad offers clear guidance on contemporary issues.',
    website: 'https://example.com/ahmad-hassan',
    organizationType: 'scholar',
  },
  {
    id: 'org5',
    name: 'Muslim Youth Foundation',
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    bio: 'Empowering young Muslims through education, leadership training, and community service. Our programs help youth develop confidence and strong Islamic identities.',
    website: 'https://example.com/myf',
    organizationType: 'charity',
  },
  {
    id: 'org6',
    name: 'Halal Dining Network',
    avatar: '/placeholder.svg',
    bio: 'Connecting Muslims with verified halal restaurants and food services. Our certification process ensures authentic halal options for the community.',
    website: 'https://example.com/halal-dining',
    organizationType: 'company',
  },
  {
    id: 'org7',
    name: 'Masjid Al-Rahman',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    bio: 'A vibrant mosque providing spiritual guidance and community support. We offer educational programs for all ages and regular community gatherings.',
    website: 'https://example.com/al-rahman',
    organizationType: 'mosque',
  },
  {
    id: 'org8',
    name: 'Dr. Aisha Khan',
    avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    bio: 'Islamic scholar specializing in women\'s issues and family development. Dr. Khan combines traditional knowledge with modern psychological insights.',
    website: 'https://example.com/aisha-khan',
    organizationType: 'scholar',
  },
  {
    id: 'org9',
    name: 'Global Muslim Aid',
    avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    bio: 'Dedicated to alleviating poverty and suffering worldwide. Our initiatives include emergency relief, education, healthcare, and sustainable development projects.',
    website: 'https://example.com/muslim-aid',
    organizationType: 'charity',
  },
  // Add a mock organizer with ID 'mock-user-id' for testing dashboard views
  {
    id: 'mock-user-id',
    name: 'Demo Organizer',
    avatar: '/placeholder.svg',
    bio: 'This is a demo organizer account for testing purposes. It showcases all the features available to event organizers on our platform.',
    website: 'https://example.com/demo',
    organizationType: 'company',
  }
];

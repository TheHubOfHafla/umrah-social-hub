
import { EventOrganizer } from '@/types';

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

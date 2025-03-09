
import { User, EventCategory } from '@/types';
import { supabase } from '@/integrations/supabase/client';

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

// Fetch the currently authenticated user profile
export const fetchCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  // Get the user profile from our profiles table
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  if (!profile) return null;
  
  return {
    id: profile.id,
    name: profile.name || '',
    avatar: profile.avatar || '/placeholder.svg',
    interests: (profile.interests || []) as EventCategory[], // Explicitly cast to EventCategory[]
    location: {
      city: profile.city || '',
      country: profile.country || '',
    },
    following: profile.following || [],
    eventsAttending: profile.events_attending || [],
    email: profile.email,
    phone: profile.phone,
    signupDate: profile.signup_date,
  };
};

// Update a user's profile
export const updateUserProfile = async (
  userId: string, 
  updates: Partial<Omit<User, 'id'>>
): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update({
      name: updates.name,
      avatar: updates.avatar,
      interests: updates.interests as string[], // Cast to string[] when sending to Supabase
      city: updates.location?.city,
      country: updates.location?.country,
      following: updates.following,
      events_attending: updates.eventsAttending,
      phone: updates.phone,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);
  
  return !error;
};

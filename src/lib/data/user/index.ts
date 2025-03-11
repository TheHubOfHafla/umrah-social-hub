
// Re-export all user-related functionality from one central file
import { EventCategory } from '@/types';

export { currentUser } from './types';
export { fetchCurrentUser, updateUserProfile } from './profile';
export { saveEventForUser, unsaveEventForUser } from './events';

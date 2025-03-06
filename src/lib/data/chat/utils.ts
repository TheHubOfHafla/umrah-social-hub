
import { ChatMessage, MessageType } from '@/types';
import { mockEvents } from '../events';

// Generate a random ID
export const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to create timestamp for mock data
export const getRandomPastTime = (maxDaysAgo: number = 7) => {
  const date = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  
  return date.toISOString();
};

// Sample chat phrases and questions
export const sampleQuestions = [
  'What time should we arrive?',
  'Is there parking available at the venue?',
  'Will there be food provided?',
  'Can I bring children to this event?',
  'Is there Wi-Fi available at the venue?'
];

export const samplePhrases = [
  'Looking forward to this event!',
  'Thanks for organizing this.',
  'Is anyone coming from central London?',
  'See you all there!',
  'This will be my first time attending.',
  'The topic sounds interesting.',
  "I've been to previous events by this organizer, they're great!"
];

export const sampleAnswers = [
  (positive: boolean) => `Great question! ${positive ? 'Yes, definitely.' : 'No, unfortunately not.'}`,
  "Thanks for asking. We'll address this during the event.",
  'Please check the event details for this information.',
  "We'll be sending out more information about this soon.",
  "Good point - we've updated the event description with this information."
];

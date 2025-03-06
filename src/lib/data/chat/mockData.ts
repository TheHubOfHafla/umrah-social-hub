
import { ChatMessage, EventChatRoom } from '@/types';
import { mockEvents } from '../events';
import { generateId, getRandomPastTime, sampleQuestions, samplePhrases, sampleAnswers } from './utils';

// Create mock chat messages for an event
export const createMockChatMessages = (eventId: string, count: number = 15): ChatMessage[] => {
  const messages: ChatMessage[] = [];
  const event = mockEvents.find(e => e.id === eventId);
  
  if (!event) return messages;
  
  // Add system welcome message
  messages.push({
    id: generateId(),
    eventId,
    userId: 'system',
    userName: 'System',
    userAvatar: '/placeholder.svg',
    content: `Welcome to the chat for ${event.title}! Please be respectful and follow our community guidelines.`,
    type: 'system',
    timestamp: getRandomPastTime(30),
    isOrganizer: false
  });
  
  // Add organizer announcement
  messages.push({
    id: generateId(),
    eventId,
    userId: event.organizer.id,
    userName: event.organizer.name,
    userAvatar: event.organizer.avatar,
    content: `Hello everyone! We're excited to have you join us for this event. Feel free to ask any questions here.`,
    type: 'announcement',
    timestamp: getRandomPastTime(20),
    isOrganizer: true
  });
  
  // Random participant messages
  const attendees = event.attendees || [];
  
  for (let i = 0; i < count; i++) {
    const isQuestion = Math.random() > 0.7;
    const isPrivate = Math.random() > 0.8;
    const attendee = attendees[Math.floor(Math.random() * attendees.length)];
    
    if (!attendee) continue;
    
    let content = '';
    
    if (isQuestion) {
      content = sampleQuestions[Math.floor(Math.random() * sampleQuestions.length)];
    } else {
      content = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
    }
    
    messages.push({
      id: generateId(),
      eventId,
      userId: attendee.userId,
      userName: attendee.name,
      userAvatar: attendee.avatar,
      content,
      type: isQuestion ? 'question' : 'text',
      timestamp: getRandomPastTime(15),
      isOrganizer: false,
      upvotes: isQuestion ? Math.floor(Math.random() * 10) : undefined,
      userUpvoted: isQuestion ? Math.random() > 0.5 : undefined,
      isPrivate: isPrivate,
      recipientId: isPrivate ? event.organizer.id : undefined,
      recipientName: isPrivate ? event.organizer.name : undefined
    });
  }
  
  // Add organizer responses to questions
  const questionsMessages = messages.filter(m => m.type === 'question');
  
  questionsMessages.forEach(question => {
    const shouldAnswer = Math.random() > 0.3;
    
    if (shouldAnswer) {
      const answerTemplate = sampleAnswers[Math.floor(Math.random() * sampleAnswers.length)];
      const content = typeof answerTemplate === 'function' 
        ? answerTemplate(Math.random() > 0.5) 
        : answerTemplate;
      
      messages.push({
        id: generateId(),
        eventId,
        userId: event.organizer.id,
        userName: event.organizer.name,
        userAvatar: event.organizer.avatar,
        content,
        type: 'text',
        timestamp: getRandomPastTime(10),
        isOrganizer: true,
        parentId: question.id
      });
    }
  });
  
  // Sort messages by timestamp
  return messages.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
};

// Create mock chat rooms for all events
export const mockChatRooms: EventChatRoom[] = mockEvents.map(event => ({
  eventId: event.id,
  messages: createMockChatMessages(event.id),
  participants: [
    ...(event.attendees?.map(a => a.userId) || []),
    event.organizer.id
  ],
  pinnedMessageIds: []
}));

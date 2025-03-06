
import { ChatMessage, EventChatRoom, MessageType } from '@/types';
import { mockEvents } from './events';
import { currentUser } from './users';

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Helper to create timestamp for mock data
const getRandomPastTime = (maxDaysAgo: number = 7) => {
  const date = new Date();
  const daysAgo = Math.floor(Math.random() * maxDaysAgo);
  const hoursAgo = Math.floor(Math.random() * 24);
  const minutesAgo = Math.floor(Math.random() * 60);
  
  date.setDate(date.getDate() - daysAgo);
  date.setHours(date.getHours() - hoursAgo);
  date.setMinutes(date.getMinutes() - minutesAgo);
  
  return date.toISOString();
};

// Create mock chat messages for an event
const createMockChatMessages = (eventId: string, count: number = 15): ChatMessage[] => {
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
  const questionsList = [
    'What time should we arrive?',
    'Is there parking available at the venue?',
    'Will there be food provided?',
    'Can I bring children to this event?',
    'Is there Wi-Fi available at the venue?'
  ];
  
  for (let i = 0; i < count; i++) {
    const isQuestion = Math.random() > 0.7;
    const isPrivate = Math.random() > 0.8;
    const attendee = attendees[Math.floor(Math.random() * attendees.length)];
    
    if (!attendee) continue;
    
    let content = '';
    
    if (isQuestion) {
      content = questionsList[Math.floor(Math.random() * questionsList.length)];
    } else {
      const phrases = [
        'Looking forward to this event!',
        'Thanks for organizing this.',
        'Is anyone coming from central London?',
        'See you all there!',
        'This will be my first time attending.',
        'The topic sounds interesting.',
        "I've been to previous events by this organizer, they're great!"
      ];
      content = phrases[Math.floor(Math.random() * phrases.length)];
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
      const answers = [
        `Great question! ${Math.random() > 0.5 ? 'Yes, definitely.' : 'No, unfortunately not.'}`,
        "Thanks for asking. We'll address this during the event.",
        'Please check the event details for this information.',
        "We'll be sending out more information about this soon.",
        "Good point - we've updated the event description with this information."
      ];
      
      messages.push({
        id: generateId(),
        eventId,
        userId: event.organizer.id,
        userName: event.organizer.name,
        userAvatar: event.organizer.avatar,
        content: answers[Math.floor(Math.random() * answers.length)],
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

// Function to get chat messages for an event - now returns a Promise
export const getEventChatMessages = async (eventId: string): Promise<ChatMessage[]> => {
  const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
  return chatRoom?.messages || [];
};

// Function to add a new message - now returns a Promise
export const addChatMessage = async (
  eventId: string, 
  content: string, 
  type: MessageType = 'text',
  parentId?: string,
  isPrivate?: boolean,
  recipientId?: string,
  recipientName?: string
): Promise<ChatMessage> => {
  const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
  
  if (!chatRoom) {
    throw new Error('Chat room not found');
  }
  
  const event = mockEvents.find(e => e.id === eventId);
  
  if (!event) {
    throw new Error('Event not found');
  }
  
  const newMessage: ChatMessage = {
    id: generateId(),
    eventId,
    userId: currentUser.id,
    userName: currentUser.name,
    userAvatar: currentUser.avatar,
    content,
    type,
    timestamp: new Date().toISOString(),
    isOrganizer: event.organizer.id === currentUser.id,
    parentId,
    upvotes: type === 'question' ? 0 : undefined,
    userUpvoted: false,
    isPrivate,
    recipientId,
    recipientName
  };
  
  chatRoom.messages.push(newMessage);
  return newMessage;
};

// Function to toggle upvote for a question - now returns a Promise
export const toggleUpvote = async (messageId: string, eventId: string): Promise<ChatMessage | undefined> => {
  const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
  
  if (!chatRoom) {
    return undefined;
  }
  
  const message = chatRoom.messages.find(m => m.id === messageId);
  
  if (!message || message.type !== 'question') {
    return undefined;
  }
  
  message.userUpvoted = !message.userUpvoted;
  
  if (message.userUpvoted) {
    message.upvotes = (message.upvotes || 0) + 1;
  } else {
    message.upvotes = (message.upvotes || 1) - 1;
  }
  
  return message;
};

// Function to pin/unpin a message - now returns a Promise
export const togglePinMessage = async (messageId: string, eventId: string): Promise<string[]> => {
  const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
  
  if (!chatRoom) {
    return [];
  }
  
  const isPinned = chatRoom.pinnedMessageIds.includes(messageId);
  
  if (isPinned) {
    chatRoom.pinnedMessageIds = chatRoom.pinnedMessageIds.filter(id => id !== messageId);
  } else {
    chatRoom.pinnedMessageIds.push(messageId);
  }
  
  return chatRoom.pinnedMessageIds;
};

// Function to delete a message - now returns a Promise
export const deleteMessage = async (messageId: string, eventId: string): Promise<boolean> => {
  const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
  
  if (!chatRoom) {
    return false;
  }
  
  const initialLength = chatRoom.messages.length;
  chatRoom.messages = chatRoom.messages.filter(m => m.id !== messageId);
  
  // Also delete replies to this message
  chatRoom.messages = chatRoom.messages.filter(m => m.parentId !== messageId);
  
  return chatRoom.messages.length < initialLength;
};

// Export queries for use with react-query
export const chatQueries = {
  getEventChatMessages,
  addChatMessage,
  toggleUpvote,
  togglePinMessage,
  deleteMessage
};

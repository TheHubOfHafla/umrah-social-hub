
import { ChatMessage, MessageType } from '@/types';
import { mockChatRooms } from './mockData';
import { mockEvents } from '../events';
import { currentUser } from '../users';
import { generateId } from './utils';

// Function to get chat messages for an event - returns a Promise
export const getEventChatMessages = async (eventId: string): Promise<ChatMessage[]> => {
  const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
  return chatRoom?.messages || [];
};

// Function to add a new message - returns a Promise
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

// Function to toggle upvote for a question - returns a Promise
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

// Function to pin/unpin a message - returns a Promise
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

// Function to delete a message - returns a Promise
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

import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, EventChatRoom, MessageType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { currentUser } from './user';

// Mock chat rooms data (replace with database later)
export const mockChatRooms: EventChatRoom[] = [
  {
    eventId: 'event1',
    messages: [
      {
        id: '1',
        eventId: 'event1',
        userId: 'user1',
        userName: 'Ahmed Mohamed',
        userAvatar: '/placeholder.svg',
        content: 'Is there parking available at the venue?',
        type: 'question',
        timestamp: new Date().toISOString(),
        isOrganizer: false,
        upvotes: 5,
        userUpvoted: true,
      },
      {
        id: '2',
        eventId: 'event1',
        userId: 'org1',
        userName: 'Islamic Relief',
        userAvatar: '/org-placeholder.svg',
        content: 'Yes, there is free parking available on site.',
        type: 'announcement',
        timestamp: new Date().toISOString(),
        isOrganizer: true,
      },
      {
        id: '3',
        eventId: 'event1',
        userId: 'user2',
        userName: 'Aisha Khan',
        userAvatar: '/placeholder.svg',
        content: 'JazakAllah Khair for the information!',
        type: 'text',
        timestamp: new Date().toISOString(),
        isOrganizer: false,
        parentId: '2',
      },
      {
        id: '4',
        eventId: 'event1',
        userId: 'user1',
        userName: 'Ahmed Mohamed',
        userAvatar: '/placeholder.svg',
        content: 'What is the schedule for the event?',
        type: 'question',
        timestamp: new Date().toISOString(),
        isOrganizer: false,
        upvotes: 2,
        userUpvoted: false,
      },
      {
        id: '5',
        eventId: 'event1',
        userId: 'org1',
        userName: 'Islamic Relief',
        userAvatar: '/org-placeholder.svg',
        content: 'The schedule will be posted shortly. Please check back later.',
        type: 'announcement',
        timestamp: new Date().toISOString(),
        isOrganizer: true,
      },
      {
        id: '6',
        eventId: 'event1',
        userId: 'user3',
        userName: 'Omar Hassan',
        userAvatar: '/placeholder.svg',
        content: 'Will there be childcare available?',
        type: 'question',
        timestamp: new Date().toISOString(),
        isOrganizer: false,
        upvotes: 7,
        userUpvoted: true,
      },
      {
        id: '7',
        eventId: 'event1',
        userId: 'org1',
        userName: 'Islamic Relief',
        userAvatar: '/org-placeholder.svg',
        content: 'Unfortunately, we will not be able to provide childcare at this event.',
        type: 'announcement',
        timestamp: new Date().toISOString(),
        isOrganizer: true,
      },
      {
        id: '8',
        eventId: 'event1',
        userId: 'user4',
        userName: 'Fatima Ali',
        userAvatar: '/placeholder.svg',
        content: 'Is there a separate area for sisters?',
        type: 'question',
        timestamp: new Date().toISOString(),
        isOrganizer: false,
        upvotes: 3,
        userUpvoted: false,
      },
      {
        id: '9',
        eventId: 'event1',
        userId: 'org1',
        userName: 'Islamic Relief',
        userAvatar: '/org-placeholder.svg',
        content: 'Yes, there will be a designated area for sisters.',
        type: 'announcement',
        timestamp: new Date().toISOString(),
        isOrganizer: true,
      },
      {
        id: '10',
        eventId: 'event1',
        userId: 'user5',
        userName: 'Ali Khan',
        userAvatar: '/placeholder.svg',
        content: 'What is the best way to get there by public transport?',
        type: 'question',
        timestamp: new Date().toISOString(),
        isOrganizer: false,
        upvotes: 1,
        userUpvoted: false,
      },
      {
        id: '11',
        eventId: 'event1',
        userId: 'org1',
        userName: 'Islamic Relief',
        userAvatar: '/org-placeholder.svg',
        content: 'The nearest station is X. There will be signs to guide you from there.',
        type: 'announcement',
        timestamp: new Date().toISOString(),
        isOrganizer: true,
      },
    ],
    participants: ['user1', 'user2', 'user3', 'user4', 'user5', 'org1'],
    pinnedMessageIds: ['2', '9'],
  },
];

// Function to get chat messages for a specific event
export const getEventChatMessages = async (eventId: string): Promise<ChatMessage[]> => {
  try {
    // Simulate fetching messages from a database or external source
    // Replace this with your actual data fetching logic
    const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
    return chatRoom?.messages || [];
  } catch (error) {
    console.error("Failed to fetch chat messages:", error);
    return [];
  }
};

// Function to add a new chat message to an event
export const addChatMessage = async (
  eventId: string,
  content: string,
  type: MessageType,
  parentId?: string,
  isPrivate?: boolean,
  recipientId?: string,
  recipientName?: string
): Promise<ChatMessage | null> => {
  try {
    // Create a new chat message object
    const newMessage: ChatMessage = {
      id: uuidv4(),
      eventId: eventId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || '/placeholder.svg',
      content: content,
      type: type,
      timestamp: new Date().toISOString(),
      isOrganizer: false, // Determine based on user role
      parentId: parentId,
      upvotes: 0,
      userUpvoted: false,
      isPrivate: isPrivate || false,
      recipientId: recipientId,
      recipientName: recipientName,
    };

    // Simulate saving the message to a database or external source
    // Replace this with your actual data saving logic
    const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
    if (chatRoom) {
      chatRoom.messages.push(newMessage);
    } else {
      mockChatRooms.push({
        eventId: eventId,
        messages: [newMessage],
        participants: [currentUser.id],
        pinnedMessageIds: [],
      });
    }

    return newMessage;
  } catch (error) {
    console.error("Failed to add chat message:", error);
    return null;
  }
};

// Function to toggle upvote for a question
export const toggleUpvote = async (messageId: string, eventId: string): Promise<boolean> => {
  try {
    // Simulate toggling upvote in a database or external source
    // Replace this with your actual data updating logic
    const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
    if (chatRoom) {
      const message = chatRoom.messages.find(msg => msg.id === messageId);
      if (message && message.type === 'question') {
        message.userUpvoted = !message.userUpvoted;
        message.upvotes = message.userUpvoted ? (message.upvotes || 0) + 1 : (message.upvotes || 1) - 1;
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error("Failed to toggle upvote:", error);
    return false;
  }
};

// Function to toggle pin a message
export const togglePinMessage = async (messageId: string, eventId: string): Promise<boolean> => {
  try {
    const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
    if (!chatRoom) {
      console.log("Chat room not found");
      return false;
    }

    const isPinned = chatRoom.pinnedMessageIds.includes(messageId);

    if (isPinned) {
      // Unpin the message
      chatRoom.pinnedMessageIds = chatRoom.pinnedMessageIds.filter(id => id !== messageId);
      console.log(`Message ${messageId} unpinned from event ${eventId}`);
    } else {
      // Pin the message
      chatRoom.pinnedMessageIds.push(messageId);
      console.log(`Message ${messageId} pinned to event ${eventId}`);
    }

    return true;
  } catch (error) {
    console.error("Failed to toggle pin message:", error);
    return false;
  }
};

// Function to delete a message
export const deleteMessage = async (messageId: string, eventId: string): Promise<boolean> => {
  try {
    const chatRoom = mockChatRooms.find(room => room.eventId === eventId);
    if (!chatRoom) {
      console.log("Chat room not found");
      return false;
    }

    // Remove the message from the messages array
    chatRoom.messages = chatRoom.messages.filter(msg => msg.id !== messageId);

    // Remove the message from the pinnedMessageIds array if it's pinned
    chatRoom.pinnedMessageIds = chatRoom.pinnedMessageIds.filter(id => id !== messageId);

    console.log(`Message ${messageId} deleted from event ${eventId}`);
    return true;
  } catch (error) {
    console.error("Failed to delete message:", error);
    return false;
  }
};

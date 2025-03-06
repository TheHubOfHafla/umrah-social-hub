
import { mockChatRooms } from './mockData';
import { 
  getEventChatMessages, 
  addChatMessage, 
  toggleUpvote, 
  togglePinMessage, 
  deleteMessage 
} from './operations';

// Export everything
export {
  mockChatRooms,
  getEventChatMessages,
  addChatMessage,
  toggleUpvote,
  togglePinMessage,
  deleteMessage
};

// Export queries for use with react-query
export const chatQueries = {
  getEventChatMessages,
  addChatMessage,
  toggleUpvote,
  togglePinMessage,
  deleteMessage
};

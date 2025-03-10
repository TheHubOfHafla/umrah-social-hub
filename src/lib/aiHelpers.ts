
import { categories } from "@/lib/data/categories";

export const extractAppContext = () => {
  const appRoutes = [
    { path: "/", name: "Home", description: "Browse featured and trending events" },
    { path: "/events", name: "Events", description: "Browse all events and filter by category" },
    { path: "/events/:id", name: "Event Details", description: "View detailed information about a specific event" },
    { path: "/events/create", name: "Create Event", description: "Create a new event (requires login)" },
    { path: "/dashboard", name: "User Dashboard", description: "View your upcoming events and stats" },
    { path: "/dashboard/events", name: "My Events", description: "Manage events you're attending" },
    { path: "/dashboard/profile", name: "Profile", description: "Edit your profile information" },
    { path: "/organizer", name: "Organizer Dashboard", description: "Manage your created events" },
    { path: "/about", name: "About Us", description: "Learn about HaflaHub" },
    { path: "/help", name: "Help Center", description: "Get help with using HaflaHub" },
    { path: "/login", name: "Login", description: "Sign in to your account" },
    { path: "/signup", name: "Sign Up", description: "Create a new account" },
  ];

  const eventCategories = categories.map(cat => ({
    value: cat.value,
    label: cat.label,
    description: `Events related to ${cat.label}`
  }));

  return {
    appName: "HaflaHub",
    appDescription: "A platform for finding and organizing Islamic community events",
    routes: appRoutes,
    categories: eventCategories
  };
};

export const callDeepseekChat = async (message: string, history: any[] = []) => {
  try {
    // Return a static response since we're removing AI assistance
    return {
      message: "I'm a basic event assistant. To create an event, please use the manual creation option.",
      source: 'static'
    };
  } catch (error) {
    console.error('Error in callDeepseekChat:', error);
    return {
      message: "I'm sorry, I'm having trouble processing your request. Please try again later.",
      source: 'error'
    };
  }
};

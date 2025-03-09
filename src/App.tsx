
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import ChatbotButton from "./components/ChatbotButton";
import PageWrapper from "./components/PageWrapper";
import Index from "./pages/Index";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import RegisterPage from "./pages/RegisterPage";
import OrganizersPage from "./pages/OrganizersPage";
import CreateEventPage from "./pages/CreateEventPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import OrganizerDashboard from "./pages/dashboard/OrganizerDashboard";
import UserEvents from "./pages/dashboard/UserEvents";
import OrganizerEvents from "./pages/dashboard/OrganizerEvents";
import UserProfile from "./pages/dashboard/UserProfile";
import OrganizerProfile from "./pages/dashboard/OrganizerProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import LegalPage from "./pages/LegalPage";
import { useState, useEffect, createContext } from "react";
import { supabase } from "./integrations/supabase/client";
import { User } from "@/types";
import { fetchCurrentUser } from "@/lib/data/users"; 

const queryClient = new QueryClient();

// Create a context for authentication
export const AuthContext = createContext({
  isAuthenticated: false,
  currentUser: null as User | null,
  userEventsAttending: [] as string[],
  onRegisterForEvent: (eventId: string) => {},
  onSignOut: () => {}
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userEventsAttending, setUserEventsAttending] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for authentication status when the app loads
    const checkAuth = async () => {
      setIsLoading(true);
      
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        
        // Fetch the user profile data
        try {
          const userData = await fetchCurrentUser();
          if (userData) {
            setCurrentUser(userData);
            setUserEventsAttending(userData.eventsAttending || []);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      
      setIsLoading(false);
    };
    
    // Check auth status immediately
    checkAuth();
    
    // Set up listener for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        const userData = await fetchCurrentUser();
        if (userData) {
          setCurrentUser(userData);
          setUserEventsAttending(userData.eventsAttending || []);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserEventsAttending([]);
      }
    });
    
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRegisterForEvent = async (eventId: string) => {
    if (!currentUser) return;
    
    const updatedEvents = [...userEventsAttending, eventId];
    setUserEventsAttending(updatedEvents);
    
    // Update the user's profile in Supabase
    await supabase
      .from('profiles')
      .update({ events_attending: updatedEvents })
      .eq('id', currentUser.id);
  };
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setUserEventsAttending([]);
  };

  // Create a context value with auth state and event registration
  const contextValue = {
    isAuthenticated,
    currentUser,
    userEventsAttending,
    onRegisterForEvent: handleRegisterForEvent,
    onSignOut: handleSignOut
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={contextValue}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar isAuthenticated={isAuthenticated} />
            <Routes>
              <Route path="/" element={<Index isAuthenticated={isAuthenticated} />} />
              <Route path="/events" element={
                <PageWrapper>
                  <EventsPage />
                </PageWrapper>
              } />
              <Route path="/events/:eventId" element={
                <PageWrapper>
                  <EventDetailPage />
                </PageWrapper>
              } />
              <Route path="/events/create" element={
                <PageWrapper>
                  <CreateEventPage />
                </PageWrapper>
              } />
              <Route path="/events/:eventId/register" element={
                <PageWrapper>
                  <RegisterPage />
                </PageWrapper>
              } />
              <Route path="/organizers" element={
                <PageWrapper>
                  <OrganizersPage />
                </PageWrapper>
              } />
              <Route path="/legal" element={
                <PageWrapper>
                  <LegalPage />
                </PageWrapper>
              } />
              <Route path="/login" element={
                <PageWrapper>
                  {isAuthenticated ? <Navigate to="/profile" /> : <Login />}
                </PageWrapper>
              } />
              <Route path="/signup" element={
                <PageWrapper>
                  {isAuthenticated ? <Navigate to="/profile" /> : <Signup />}
                </PageWrapper>
              } />
              <Route path="/profile" element={
                <PageWrapper>
                  {isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
                </PageWrapper>
              } />
              <Route path="/dashboard" element={
                <PageWrapper>
                  <Dashboard />
                </PageWrapper>
              } />
              <Route path="/dashboard/events" element={
                <PageWrapper>
                  <UserEvents />
                </PageWrapper>
              } />
              <Route path="/dashboard/profile" element={
                <PageWrapper>
                  <UserProfile />
                </PageWrapper>
              } />
              <Route path="/organizer" element={
                <PageWrapper>
                  <OrganizerDashboard />
                </PageWrapper>
              } />
              <Route path="/organizer/events" element={
                <PageWrapper>
                  <OrganizerEvents />
                </PageWrapper>
              } />
              <Route path="/organizer/profile" element={
                <PageWrapper>
                  <OrganizerProfile />
                </PageWrapper>
              } />
              <Route path="/about" element={
                <PageWrapper>
                  <AboutUs />
                </PageWrapper>
              } />
              <Route path="/help" element={
                <PageWrapper>
                  <HelpCenter />
                </PageWrapper>
              } />
              <Route path="/contact" element={
                <PageWrapper>
                  <ContactUs />
                </PageWrapper>
              } />
              <Route path="*" element={
                <PageWrapper>
                  <NotFound />
                </PageWrapper>
              } />
            </Routes>
            <ChatbotButton />
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;

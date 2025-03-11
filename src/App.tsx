
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
import AuthCallback from "./pages/AuthCallback";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import LegalPage from "./pages/LegalPage";
import VerifyTicketPage from "./pages/VerifyTicketPage";
import { useState, useEffect, createContext } from "react";
import { supabase } from "./integrations/supabase/client";
import { User } from "@/types";
import { fetchCurrentUser } from "@/lib/data/users"; 

const queryClient = new QueryClient();

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
    const checkAuth = async () => {
      setIsLoading(true);
      
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        
        try {
          const userData = await fetchCurrentUser();
          if (userData) {
            setCurrentUser(userData);
            setUserEventsAttending(userData.eventsAttending || []);
            console.log("User data loaded:", userData);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No active session found");
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        setIsAuthenticated(true);
        try {
          const userData = await fetchCurrentUser();
          if (userData) {
            setCurrentUser(userData);
            setUserEventsAttending(userData.eventsAttending || []);
            console.log("User data loaded after sign in:", userData);
          }
        } catch (error) {
          console.error("Error fetching user data after sign in:", error);
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserEventsAttending([]);
        console.log("User signed out");
      }
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleRegisterForEvent = async (eventId: string) => {
    if (!currentUser) {
      console.log("Cannot register: user not authenticated");
      return;
    }
    
    const updatedEvents = [...userEventsAttending, eventId];
    setUserEventsAttending(updatedEvents);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ events_attending: updatedEvents })
        .eq('id', currentUser.id);
        
      if (error) {
        console.error("Error updating user events:", error);
      } else {
        console.log("Successfully registered for event:", eventId);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setUserEventsAttending([]);
        console.log("User successfully signed out");
      }
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  };

  const contextValue = {
    isAuthenticated,
    currentUser,
    userEventsAttending,
    onRegisterForEvent: handleRegisterForEvent,
    onSignOut: handleSignOut
  };

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
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
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
                  {isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
                </PageWrapper>
              } />
              <Route path="/signup" element={
                <PageWrapper>
                  {isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />}
                </PageWrapper>
              } />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/profile" element={
                <PageWrapper>
                  {isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
                </PageWrapper>
              } />
              <Route path="/dashboard" element={
                <PageWrapper>
                  {isAuthenticated ? 
                    (currentUser?.role === 'organizer' ? <Navigate to="/organizer" /> : <Dashboard />) : 
                    <Navigate to="/login" />}
                </PageWrapper>
              } />
              <Route path="/dashboard/events" element={
                <PageWrapper>
                  {isAuthenticated ? 
                    (currentUser?.role === 'organizer' ? <Navigate to="/organizer/events" /> : <UserEvents />) : 
                    <Navigate to="/login" />}
                </PageWrapper>
              } />
              <Route path="/dashboard/profile" element={
                <PageWrapper>
                  {isAuthenticated ? 
                    (currentUser?.role === 'organizer' ? <Navigate to="/organizer/profile" /> : <UserProfile />) : 
                    <Navigate to="/login" />}
                </PageWrapper>
              } />
              <Route path="/organizer" element={
                <PageWrapper>
                  {isAuthenticated && currentUser?.role === 'organizer' ? <OrganizerDashboard /> : <Navigate to="/login" />}
                </PageWrapper>
              } />
              <Route path="/organizer/events" element={
                <PageWrapper>
                  {isAuthenticated && currentUser?.role === 'organizer' ? <OrganizerEvents /> : <Navigate to="/login" />}
                </PageWrapper>
              } />
              <Route path="/organizer/profile" element={
                <PageWrapper>
                  {isAuthenticated && currentUser?.role === 'organizer' ? <OrganizerProfile /> : <Navigate to="/login" />}
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
              <Route path="/events/:eventId/verify/:confirmationCode" element={<VerifyTicketPage />} />
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

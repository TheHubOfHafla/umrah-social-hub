
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

const queryClient = new QueryClient();

// Create a context for authentication
export const AuthContext = createContext({
  isAuthenticated: false,
  userEventsAttending: [] as string[],
  onRegisterForEvent: (eventId: string) => {},
  onSignOut: () => {}
});

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEventsAttending, setUserEventsAttending] = useState<string[]>([]);
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      
      // Load user's events (this is a mock, in a real app would be from API)
      const savedEvents = localStorage.getItem('user_events');
      if (savedEvents) {
        setUserEventsAttending(JSON.parse(savedEvents));
      }
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('auth_token', 'user-is-logged-in');
    setIsAuthenticated(true);
  };
  
  const handleRegisterForEvent = (eventId: string) => {
    const updatedEvents = [...userEventsAttending, eventId];
    setUserEventsAttending(updatedEvents);
    localStorage.setItem('user_events', JSON.stringify(updatedEvents));
  };
  
  const handleSignOut = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_events');
    setIsAuthenticated(false);
    setUserEventsAttending([]);
  };

  // Create a context value with auth state and event registration
  const contextValue = {
    isAuthenticated,
    userEventsAttending,
    onRegisterForEvent: handleRegisterForEvent,
    onSignOut: handleSignOut
  };

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
                  {isAuthenticated ? <Navigate to="/profile" /> : <Login onLoginSuccess={handleLogin} />}
                </PageWrapper>
              } />
              <Route path="/signup" element={
                <PageWrapper>
                  {isAuthenticated ? <Navigate to="/profile" /> : <Signup onSignupSuccess={handleLogin} />}
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

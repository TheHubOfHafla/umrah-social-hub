
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
import OrganizerSignup from "./pages/dashboard/OrganizerSignup";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AuthCallback from "./pages/AuthCallback";
import AboutUs from "./pages/AboutUs";
import HelpCenter from "./pages/HelpCenter";
import ContactUs from "./pages/ContactUs";
import LegalPage from "./pages/LegalPage";
import VerifyTicketPage from "./pages/VerifyTicketPage";
import { createContext } from "react";
import { User } from "@/types";

const queryClient = new QueryClient();

// Create a mock AuthContext with default values
export const AuthContext = createContext({
  isAuthenticated: true, // Always consider users as authenticated
  currentUser: {
    id: "mock-user-id",
    name: "Guest User",
    email: "guest@example.com",
    role: "attendee",
    eventsAttending: []
  } as User,
  userEventsAttending: [] as string[],
  onRegisterForEvent: (eventId: string) => {},
  onSignOut: () => {}
});

const App = () => {
  // Provide mock context values to enable features without actual authentication
  const contextValue = {
    isAuthenticated: true,
    currentUser: {
      id: "mock-user-id",
      name: "Guest User",
      email: "guest@example.com",
      role: "attendee",
      eventsAttending: []
    } as User,
    userEventsAttending: [],
    onRegisterForEvent: (eventId: string) => {
      console.log("Register for event:", eventId);
    },
    onSignOut: () => {
      console.log("Sign out clicked");
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={contextValue}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/dashboard/organizer/signup" element={
                <PageWrapper>
                  <OrganizerSignup />
                </PageWrapper>
              } />
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
              <Route path="/login" element={<Navigate to="/" />} />
              <Route path="/signup" element={<Navigate to="/" />} />
              <Route path="/auth/callback" element={<Navigate to="/" />} />
              <Route path="/profile" element={
                <PageWrapper>
                  <UserProfile />
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
              <Route path="/organizer" element={<Navigate to="/dashboard" replace />} />
              <Route path="/organizer/events" element={<Navigate to="/dashboard/events" replace />} />
              <Route path="/organizer/profile" element={<Navigate to="/dashboard/profile" replace />} />
              <Route path="/organizer/signup" element={<Navigate to="/dashboard/organizer/signup" replace />} />
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

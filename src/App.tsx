
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
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Set the document title
document.title = "LaunchGood - Event Platform";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('auth_token', 'user-is-logged-in');
    setIsAuthenticated(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Navbar isAuthenticated={isAuthenticated} />
          <Routes>
            <Route path="/" element={<Index isAuthenticated={isAuthenticated} />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:eventId" element={<EventDetailPage />} />
            <Route path="/events/create" element={<CreateEventPage />} />
            <Route path="/events/:eventId/register" element={<RegisterPage />} />
            <Route path="/organizers" element={<OrganizersPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/profile" /> : <Login onLoginSuccess={handleLogin} />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/profile" /> : <Signup onSignupSuccess={handleLogin} />} />
            <Route path="/profile" element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/events" element={<UserEvents />} />
            <Route path="/dashboard/profile" element={<UserProfile />} />
            <Route path="/organizer" element={<OrganizerDashboard />} />
            <Route path="/organizer/events" element={<OrganizerEvents />} />
            <Route path="/organizer/profile" element={<OrganizerProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ChatbotButton />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

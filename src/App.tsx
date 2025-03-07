import React, { useState, createContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from "./pages/Index";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import CreateEventPage from "./pages/CreateEventPage";
import OrganizersPage from "./pages/OrganizersPage";
import OrganizerProfilePage from "./pages/OrganizerProfilePage";
import Dashboard from "./pages/dashboard/Dashboard";
import UserProfile from "./pages/dashboard/UserProfile";
import MyEvents from "./pages/dashboard/MyEvents";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import { Toaster } from "@/components/ui/toaster"

interface AuthContextType {
  isAuthenticated: boolean;
  onSignIn: () => void;
  onSignOut: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  onSignIn: () => {},
  onSignOut: () => {},
});

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSignIn = () => {
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, onSignIn: handleSignIn, onSignOut: handleSignOut }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/create" element={<CreateEventPage />} />
          <Route path="/organizers" element={<OrganizersPage />} />
          <Route path="/organizers/:id" element={<OrganizerProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route path="/dashboard/events" element={<MyEvents />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthContext.Provider>
  );
}

export default App;

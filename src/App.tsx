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
import Index from "./pages/Index";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import RegisterPage from "./pages/RegisterPage";
import OrganizersPage from "./pages/OrganizersPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import OrganizerDashboard from "./pages/dashboard/OrganizerDashboard";
import UserEvents from "./pages/dashboard/UserEvents";
import OrganizerEvents from "./pages/dashboard/OrganizerEvents";
import UserProfile from "./pages/dashboard/UserProfile";
import OrganizerProfile from "./pages/dashboard/OrganizerProfile";

// Added isAuthenticated simulation
const isAuthenticated = false;

const queryClient = new QueryClient();

const App = () => (
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
          <Route path="/events/:eventId/register" element={<RegisterPage />} />
          <Route path="/organizers" element={<OrganizersPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/events" element={<UserEvents />} />
          <Route path="/dashboard/profile" element={<UserProfile />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/events" element={<OrganizerEvents />} />
          <Route path="/organizer/profile" element={<OrganizerProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

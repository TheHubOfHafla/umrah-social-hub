
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CategoryChips from "@/components/CategoryChips";
import EventGrid from "@/components/EventGrid";
import FeaturedEvent from "@/components/FeaturedEvent";
import Button from "@/components/Button";
import LocationSearch from "@/components/LocationSearch";
import { EventCategory } from "@/types";
import { 
  getFeaturedEvents, 
  getRecommendedEvents, 
  getEventsByCategory,
  categories,
  currentUser
} from "@/lib/data";
import { ArrowRight, CalendarCheck, Filter } from "lucide-react";

const Index = () => {
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState(getFeaturedEvents());
  const [recommendedEvents, setRecommendedEvents] = useState(getRecommendedEvents(currentUser.id));
  const [categoryEvents, setCategoryEvents] = useState(getEventsByCategory(categories[0].value));
  
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
  };

  const handleCategoryChange = (categories: EventCategory[]) => {
    setSelectedCategories(categories);
    if (categories.length === 1) {
      setCategoryEvents(getEventsByCategory(categories[0]));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 pt-8 pb-16">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              Discover Islamic Events Near You
            </h1>
            <p className="text-xl text-muted-foreground">
              Connect with community events, Umrah trips, lectures, and more
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
              <LocationSearch 
                onLocationSelect={handleLocationSelect}
                initialLocation={currentUser.location?.city + ", " + currentUser.location?.country}
                className="w-full sm:w-64"
              />
              <Link to="/events">
                <Button className="w-full sm:w-auto" icon={<Filter className="w-4 h-4" />}>
                  Browse All Events
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-12">
            <CategoryChips
              selectedCategories={selectedCategories}
              onChange={handleCategoryChange}
              singleSelect
            />
          </div>
          
          {/* Featured Events */}
          {featuredEvents.length > 0 && (
            <div className="mb-16 animate-slide-up">
              <FeaturedEvent event={featuredEvents[0]} />
            </div>
          )}
        </section>
        
        {/* Recommended Events */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Recommended For You</h2>
              <p className="text-muted-foreground">Based on your interests and location</p>
            </div>
            <Link to="/events" className="hidden sm:block">
              <Button variant="ghost" icon={<ArrowRight className="ml-1 h-4 w-4" />} iconPosition="right">
                View all
              </Button>
            </Link>
          </div>
          
          <EventGrid events={recommendedEvents} columns={4} />
          
          <div className="text-center mt-8 sm:hidden">
            <Link to="/events">
              <Button variant="outline">View All Events</Button>
            </Link>
          </div>
        </section>
        
        {/* Category Events */}
        {selectedCategories.length === 1 && (
          <section className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight capitalize">
                  {selectedCategories[0]} Events
                </h2>
                <p className="text-muted-foreground">
                  Browse {selectedCategories[0]} events in your area
                </p>
              </div>
              <Link to={`/events?category=${selectedCategories[0]}`} className="hidden sm:block">
                <Button variant="ghost" icon={<ArrowRight className="ml-1 h-4 w-4" />} iconPosition="right">
                  View all
                </Button>
              </Link>
            </div>
            
            <EventGrid events={categoryEvents} columns={3} />
            
            <div className="text-center mt-8 sm:hidden">
              <Link to={`/events?category=${selectedCategories[0]}`}>
                <Button variant="outline">
                  View All {selectedCategories[0]} Events
                </Button>
              </Link>
            </div>
          </section>
        )}
        
        {/* My Events Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-8 bg-secondary/50 rounded-2xl">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold mb-2">Track Your Events</h2>
              <p className="text-muted-foreground max-w-lg">
                Keep track of events you're attending and get reminders before they start
              </p>
            </div>
            <Link to="/my-events">
              <Button className="min-w-[200px]" icon={<CalendarCheck className="mr-2 h-4 w-4" />}>
                My Events
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Umrah Social</h3>
              <p className="text-muted-foreground">
                Connecting the community through events and shared experiences.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/events" className="text-muted-foreground hover:text-foreground">Browse Events</Link></li>
                <li><Link to="/organizers" className="text-muted-foreground hover:text-foreground">Organizers</Link></li>
                <li><Link to="/create-event" className="text-muted-foreground hover:text-foreground">Create Event</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Guidelines</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Umrah Social. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

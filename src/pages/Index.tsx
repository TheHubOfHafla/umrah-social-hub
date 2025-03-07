
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FeaturedEvent from "@/components/FeaturedEvent";
import HeroBanner from "@/components/HeroBanner";
import RecommendedEvents from "@/components/RecommendedEvents";
import CategoryEvents from "@/components/CategoryEvents";
import MyEventsPromo from "@/components/MyEventsPromo";
import TopicsAndPicks from "@/components/TopicsAndPicks";
import Footer from "@/components/Footer";
import EventCard from "@/components/EventCard";
import Button from "@/components/Button";
import { EventCategory } from "@/types";
import { 
  getFeaturedEvents,
  getRecommendedEvents, 
  getEventsByCategory, 
  categories, 
  currentUser 
} from "@/lib/data";

// Add prop to simulate guest view
const Index = ({ isAuthenticated = false }: { isAuthenticated?: boolean }) => {
  const [selectedCategories, setSelectedCategories] = useState<EventCategory[]>([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [featuredEvents, setFeaturedEvents] = useState(getFeaturedEvents());
  const [popularEvents, setPopularEvents] = useState(getFeaturedEvents());
  const [recommendedEvents, setRecommendedEvents] = useState(
    isAuthenticated 
      ? getRecommendedEvents(currentUser.id).slice(0, 12) // Get up to 12 events for the 4x3 grid
      : [] // No recommendations for guests
  );
  const [categoryEvents, setCategoryEvents] = useState(getEventsByCategory(categories[0].value));
  const [animateContent, setAnimateContent] = useState(false);

  // Animation delay
  useEffect(() => {
    // Trigger animations after component mount
    setTimeout(() => setAnimateContent(true), 300);
  }, []);

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
    <div className="min-h-screen overflow-hidden">
      <main className="pb-8 md:pb-16">
        <HeroBanner 
          user={isAuthenticated ? currentUser : undefined} 
          onLocationSelect={handleLocationSelect}
          isAuthenticated={isAuthenticated} 
        />
        
        {/* TopicsAndPicks container with full width for carousel */}
        <div className={`w-full transition-all duration-700 delay-100 ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <TopicsAndPicks />
        </div>
        
        {featuredEvents.length > 0 && (
          <section className={`container mx-auto px-3 md:px-4 mt-4 md:mt-8 mb-8 md:mb-16 transition-all duration-700 delay-200 ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <FeaturedEvent event={featuredEvents[0]} />
          </section>
        )}
        
        {isAuthenticated ? (
          <div className={`transition-all duration-700 delay-300 ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <RecommendedEvents events={recommendedEvents} />
          </div>
        ) : (
          <section className={`container mx-auto px-4 py-12 transition-all duration-700 delay-300 ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Popular Events</h2>
              <p className="text-muted-foreground">Discover what's trending in the community</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularEvents.slice(0, 6).map((event, index) => (
                <div key={event.id} className={`transition-all duration-500 ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`} style={{transitionDelay: `${300 + index * 100}ms`}}>
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </section>
        )}
        
        {selectedCategories.length === 1 && (
          <div className={`transition-all duration-700 delay-[600ms] ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <CategoryEvents 
              category={selectedCategories[0]} 
              events={categoryEvents} 
            />
          </div>
        )}
        
        {isAuthenticated ? (
          <div className={`transition-all duration-700 delay-[700ms] ${animateContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <MyEventsPromo />
          </div>
        ) : (
          <section className={`container mx-auto px-4 py-12 my-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg backdrop-blur-sm transition-all duration-700 delay-[700ms] transform ${animateContent ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
            <div className="max-w-4xl mx-auto text-center space-y-6 py-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse-soft">Join Our Community</h2>
              <p className="text-xl text-muted-foreground">
                Create an account to get personalized event recommendations, save favorite events, and connect with event organizers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="animate-slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '800ms'}}>Sign Up Now</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="animate-slide-up hover:scale-105 transition-transform duration-300" style={{animationDelay: '900ms'}}>Sign In</Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <div className={`transition-opacity duration-1000 delay-[800ms] ${animateContent ? 'opacity-100' : 'opacity-0'}`}>
        <Footer />
      </div>
    </div>
  );
};

export default Index;

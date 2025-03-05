
import { useState } from "react";
import { Link } from "react-router-dom";
import CategoryCarousel from "@/components/CategoryCarousel";
import FeaturedEvent from "@/components/FeaturedEvent";
import HeroBanner from "@/components/HeroBanner";
import RecommendedEvents from "@/components/RecommendedEvents";
import CategoryEvents from "@/components/CategoryEvents";
import MyEventsPromo from "@/components/MyEventsPromo";
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
  // Use getFeaturedEvents as a fallback since getPopularEvents doesn't exist yet
  const [popularEvents, setPopularEvents] = useState(getFeaturedEvents());
  const [recommendedEvents, setRecommendedEvents] = useState(
    isAuthenticated 
      ? getRecommendedEvents(currentUser.id)
      : [] // No recommendations for guests
  );
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
      <main className="pb-16">
        <HeroBanner 
          user={isAuthenticated ? currentUser : undefined} 
          onLocationSelect={handleLocationSelect}
          isAuthenticated={isAuthenticated} 
        />
        
        <section className="container mx-auto px-4 py-12">
          <CategoryCarousel 
            selectedCategories={selectedCategories} 
            onChange={handleCategoryChange} 
            singleSelect 
          />
        </section>
        
        {featuredEvents.length > 0 && (
          <section className="container mx-auto px-4 mb-16 animate-slide-up">
            <FeaturedEvent event={featuredEvents[0]} />
          </section>
        )}
        
        {isAuthenticated ? (
          <RecommendedEvents events={recommendedEvents} />
        ) : (
          <section className="container mx-auto px-4 py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">Popular Events</h2>
              <p className="text-muted-foreground">Discover what's trending in the community</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
        
        {selectedCategories.length === 1 && (
          <CategoryEvents 
            category={selectedCategories[0]} 
            events={categoryEvents} 
          />
        )}
        
        {isAuthenticated ? (
          <MyEventsPromo />
        ) : (
          <section className="container mx-auto px-4 py-12 my-12 bg-primary/5 rounded-lg">
            <div className="max-w-4xl mx-auto text-center space-y-6 py-8">
              <h2 className="text-3xl font-bold">Join Our Community</h2>
              <p className="text-xl text-muted-foreground">
                Create an account to get personalized event recommendations, save favorite events, and connect with event organizers.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg">Sign Up Now</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg">Sign In</Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;

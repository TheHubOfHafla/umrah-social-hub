
import { useState } from "react";
import Navbar from "@/components/Navbar";
import CategoryCarousel from "@/components/CategoryCarousel";
import FeaturedEvent from "@/components/FeaturedEvent";
import HeroBanner from "@/components/HeroBanner";
import RecommendedEvents from "@/components/RecommendedEvents";
import CategoryEvents from "@/components/CategoryEvents";
import MyEventsPromo from "@/components/MyEventsPromo";
import Footer from "@/components/Footer";
import { EventCategory } from "@/types";
import { getFeaturedEvents, getRecommendedEvents, getEventsByCategory, categories, currentUser } from "@/lib/data";

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
        <HeroBanner user={currentUser} onLocationSelect={handleLocationSelect} />
        
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
        
        <RecommendedEvents events={recommendedEvents} />
        
        {selectedCategories.length === 1 && (
          <CategoryEvents 
            category={selectedCategories[0]} 
            events={categoryEvents} 
          />
        )}
        
        <MyEventsPromo />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;


import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Filter, UserPlus } from "lucide-react";
import Button from "@/components/Button";
import EventSearch from "@/components/EventSearch";
import { User } from "@/types";
import { motion } from "framer-motion";

interface HeroBannerProps {
  user?: User;
  onLocationSelect: (location: string) => void;
  isAuthenticated?: boolean;
}

const HeroBanner = ({ user, onLocationSelect, isAuthenticated = true }: HeroBannerProps) => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const navigate = useNavigate();
  
  // Trigger content animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSearch = (query: string) => {
    // Navigate to events page with search query
    navigate(`/events?search=${encodeURIComponent(query)}`);
  };
  
  return (
    <section className="relative">
      {/* Banner Image */}
      <div className="w-full h-[100vh] relative overflow-hidden">
        <div className={cn(
          "absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background z-10",
          !bannerLoaded && "animate-pulse bg-muted"
        )}></div>
        <img 
          src="/lovable-uploads/3fa0e5f2-adb1-4481-b5cd-7871743c9ab3.png" 
          alt="Islamic community gathering" 
          className={cn(
            "w-full h-full object-cover transition-all duration-1000",
            bannerLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"
          )}
          onLoad={() => setBannerLoaded(true)}
        />
      </div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className={cn(
            "text-center max-w-3xl mx-auto space-y-6 p-8 rounded-md transition-all duration-500 ease-out",
            contentVisible ? "opacity-100 translate-y-0 bg-white/90 shadow-lg" : "opacity-0 translate-y-8 bg-white/0"
          )}>
            <h1 className={cn(
              "text-4xl sm:text-5xl font-bold tracking-tight font-heading leading-tight text-balance transition-all duration-500 delay-100",
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              Discover Islamic Events Near You
            </h1>
            
            <div className={cn(
              "flex flex-col sm:flex-row gap-3 mt-8 justify-center transition-all duration-500 delay-300",
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <motion.div 
                className="w-full sm:w-72"
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <EventSearch 
                  onSearch={handleSearch}
                  className="w-full" 
                />
              </motion.div>
              <Link to="/events">
                <Button 
                  className="w-full sm:w-auto transition-all duration-150" 
                  icon={<Filter className="w-4 h-4" />}
                >
                  Browse All Events
                </Button>
              </Link>
            </div>
            
            {!isAuthenticated && (
              <div className={cn(
                "mt-6 pt-4 border-t border-gray-200 transition-all duration-500 delay-400",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <Link to="/signup">
                  <Button 
                    variant="outline" 
                    className="border-gray-300 hover:bg-gray-100 transition-all duration-150" 
                    icon={<UserPlus className="w-4 h-4" />}
                  >
                    Sign up for free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

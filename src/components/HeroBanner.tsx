
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Filter, UserPlus } from "lucide-react";
import Button from "@/components/Button";
import LocationSearch from "@/components/LocationSearch";
import { User } from "@/types";

interface HeroBannerProps {
  user?: User;
  onLocationSelect: (location: string) => void;
  isAuthenticated?: boolean;
}

const HeroBanner = ({ user, onLocationSelect, isAuthenticated = true }: HeroBannerProps) => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  
  // Trigger content animation after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
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
            "text-center max-w-3xl mx-auto space-y-6 backdrop-blur-sm p-8 rounded-2xl transition-all duration-700 ease-out",
            contentVisible ? "opacity-100 translate-y-0 bg-background/10" : "opacity-0 translate-y-8 bg-background/0"
          )}>
            <h1 className={cn(
              "text-4xl sm:text-5xl font-bold tracking-tight font-heading leading-tight text-balance transition-all duration-700 delay-100",
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              Instant Islamic Events Near You
            </h1>
            
            <div className={cn(
              "flex flex-col sm:flex-row gap-3 mt-8 justify-center transition-all duration-700 delay-300",
              contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}>
              <LocationSearch 
                onLocationSelect={onLocationSelect} 
                initialLocation={user?.location ? `${user.location.city}, ${user.location.country}` : "London, United Kingdom"} 
                className="w-full sm:w-64" 
              />
              <Link to="/events">
                <Button 
                  className="w-full sm:w-auto hover:scale-105 transition-transform duration-300" 
                  icon={<Filter className="w-4 h-4" />}
                >
                  Browse All Events
                </Button>
              </Link>
            </div>
            
            {!isAuthenticated && (
              <div className={cn(
                "mt-6 pt-4 border-t border-primary/20 transition-all duration-700 delay-400",
                contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}>
                <Link to="/signup">
                  <Button 
                    variant="outline" 
                    className="border-primary/40 hover:bg-primary/10 hover:scale-105 transition-all duration-300" 
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

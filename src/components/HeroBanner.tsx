
import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import Button from "@/components/Button";
import LocationSearch from "@/components/LocationSearch";
import { User } from "@/types";

interface HeroBannerProps {
  user: User;
  onLocationSelect: (location: string) => void;
}

const HeroBanner = ({ user, onLocationSelect }: HeroBannerProps) => {
  const [bannerLoaded, setBannerLoaded] = useState(false);
  
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
            "w-full h-full object-cover transition-opacity duration-500",
            bannerLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setBannerLoaded(true)}
        />
      </div>
      
      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto space-y-6 bg-background/10 backdrop-blur-sm p-8 rounded-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight font-heading leading-tight text-balance">
              Instant Islamic Events Near You
            </h1>
            <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto text-pretty">
              Connect with community events, Umrah trips, lectures, and more
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
              <LocationSearch 
                onLocationSelect={onLocationSelect} 
                initialLocation={user.location ? `${user.location.city}, ${user.location.country}` : ""} 
                className="w-full sm:w-64" 
              />
              <Link to="/events">
                <Button className="w-full sm:w-auto" icon={<Filter className="w-4 h-4" />}>
                  Browse All Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

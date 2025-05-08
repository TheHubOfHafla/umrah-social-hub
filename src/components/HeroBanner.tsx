
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import EventCarousel from "./EventCarousel";
interface HeroBannerProps {
  user?: User;
  onLocationSelect: (location: string) => void;
  isAuthenticated?: boolean;
}

// Carousel images for the hero banner
const carouselImages = [{
  src: "/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png",
  alt: "Islamic event"
}, {
  src: "/lovable-uploads/be70ede0-8b18-49c9-bf81-6848e5a4c0d8.png",
  alt: "Islamic community gathering"
}, {
  src: "/lovable-uploads/3fa0e5f2-adb1-4481-b5cd-7871743c9ab3.png",
  alt: "Islamic community gathering"
}, {
  src: "/lovable-uploads/b58af5a3-4dc6-4800-b56b-d650348f2032.png",
  alt: "Community celebration"
}, {
  src: "/lovable-uploads/cef6e842-fcc3-4b46-8a93-7dbe053d8cd0.png",
  alt: "Islamic gathering"
}];

const HeroBanner = ({
  user,
  onLocationSelect,
  isAuthenticated = true
}: HeroBannerProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="relative w-full overflow-hidden pt-14 px-0 pb-10 mx-0 my-0 flex flex-col items-center min-h-[90vh] isolate">
      {/* Background image banner */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <img 
          src="/lovable-uploads/14ea8c39-648d-4b6f-a11e-1c47271eac8e.png" 
          alt="Islamic community gathering background" 
          className="w-full h-full object-cover" 
        />
        
        {/* Bottom blur gradient - lighter */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
      </div>

      <div className="text-center mb-8 z-10 pt-8 md:pt-16 my-0 py-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 bg-clip-text text-transparent bg-gradient-to-b from-purple-600 to-purple-800 shadow-text">
          Connect with Your Community
        </h1>
        <p className="text-base md:text-lg text-white max-w-2xl mx-auto font-normal">
          Discover Islamic events and gatherings happening in your area
        </p>
      </div>
      
      {/* Centered carousel with increased height */}
      <div className="w-full max-w-4xl mx-auto z-10 flex-grow flex items-center justify-center">
        <EventCarousel 
          images={carouselImages} 
          interval={5000} 
          className="rounded-lg overflow-hidden shadow-xl h-[80vh]" 
        />
      </div>
      
      {/* Optional decorative element - purple accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 z-20"></div>
    </section>
  );
};

export default HeroBanner;

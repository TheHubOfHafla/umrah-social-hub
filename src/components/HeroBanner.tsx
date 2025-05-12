import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import EventCarousel from "./EventCarousel";

interface HeroBannerProps {
  user?: User;
  onLocationSelect: (location: string) => void;
  isAuthenticated?: boolean;
}

// Keep only the second image for the hero banner
const carouselImages = [
  {
    src: "/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png",
    alt: "Islamic event" 
  }
];

const HeroBanner = ({ user, onLocationSelect, isAuthenticated = true }: HeroBannerProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="relative w-full overflow-hidden pt-14">
      {/* Hero Carousel */}
      <EventCarousel images={carouselImages} interval={5000} />
      
      {/* Optional decorative element - purple accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 z-20" />
    </section>
  );
};

export default HeroBanner;

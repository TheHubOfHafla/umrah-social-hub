
import { useNavigate } from "react-router-dom";
import { User } from "@/types";
import EventCarousel from "./EventCarousel";

interface HeroBannerProps {
  user?: User;
  onLocationSelect: (location: string) => void;
  isAuthenticated?: boolean;
}

// Carousel images for the hero banner
const carouselImages = [
  {
    src: "/lovable-uploads/be70ede0-8b18-49c9-bf81-6848e5a4c0d8.png", 
    alt: "Islamic community gathering"
  },
  {
    src: "/lovable-uploads/3fa0e5f2-adb1-4481-b5cd-7871743c9ab3.png",
    alt: "Islamic community gathering"
  }, 
  {
    src: "/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png",
    alt: "Islamic event"
  }, 
  {
    src: "/lovable-uploads/b58af5a3-4dc6-4800-b56b-d650348f2032.png",
    alt: "Community celebration"
  },
  {
    src: "/lovable-uploads/cef6e842-fcc3-4b46-8a93-7dbe053d8cd0.png",
    alt: "Islamic gathering"
  }
];

const HeroBanner = ({
  user,
  onLocationSelect,
  isAuthenticated = true
}: HeroBannerProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden pt-20 px-0 py-[42px] mx-0 my-0 flex flex-col items-center">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
          Connect with Your Community
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
          Discover Islamic events and gatherings happening in your area
        </p>
      </div>
      
      {/* Centered smaller carousel */}
      <div className="w-full max-w-4xl mx-auto">
        <EventCarousel images={carouselImages} interval={5000} className="rounded-lg overflow-hidden shadow-xl" />
      </div>
      
      {/* Optional decorative element - purple accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-purple-600 z-20" />
    </section>
  );
};

export default HeroBanner;

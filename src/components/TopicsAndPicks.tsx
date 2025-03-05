
import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { 
  Heart, 
  Users, 
  GraduationCap, 
  Building, 
  Plane, 
  Footprints, 
  Book, 
  Briefcase, 
  Users as UsersIcon,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import { Button } from "./ui/button";

interface TopicCardProps {
  title: string;
  category: EventCategory;
  icon: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  isActive?: boolean;
}

const TopicCard = ({ title, category, icon, className, style, isActive }: TopicCardProps) => {
  return (
    <Link to={`/events?category=${category}`} className="block text-center">
      <div className={cn(
        "group flex flex-col items-center transition-all duration-500",
        "hover:scale-125 hover:translate-y-[-8px]",
        isActive ? "scale-115 translate-y-[-5px]" : "",
        className
      )} style={style}>
        <div className={cn(
          "relative mb-3 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background p-4 shadow-sm transition-all duration-500",
          "group-hover:shadow-xl group-hover:border-primary/60 group-hover:bg-primary/15",
          isActive ? "shadow-lg border-primary/40 bg-primary/10" : ""
        )}>
          <div className={cn(
            "transition-all duration-500 group-hover:scale-110 group-hover:text-primary",
            isActive ? "scale-105 text-primary/90" : ""
          )}>
            {icon}
          </div>
          <div className={cn(
            "absolute -inset-1 rounded-full opacity-0 bg-gradient-to-r from-primary/10 to-transparent blur-xl transition-all duration-500 group-hover:opacity-100",
            isActive ? "opacity-80" : ""
          )}></div>
        </div>
        <span className={cn(
          "mt-2 block text-sm font-medium transition-colors duration-500 group-hover:text-primary",
          isActive ? "text-primary/90" : ""
        )}>{title}</span>
      </div>
    </Link>
  );
};

const TopicsAndPicks = () => {
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center', 
    dragFree: true,
    watchDrag: false // Disable drag handling when autoplay is active
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);
  const [autoplayActive, setAutoplayActive] = useState(true);

  // Map of category values to their respective icons
  const getCategoryIcon = (category: EventCategory) => {
    switch(category) {
      case "charity":
        return <Heart className="h-10 w-10 text-foreground/80" />;
      case "community":
        return <Users className="h-10 w-10 text-foreground/80" />;
      case "education":
        return <GraduationCap className="h-10 w-10 text-foreground/80" />;
      case "mosque":
        return <Building className="h-10 w-10 text-foreground/80" />; 
      case "travel":
        return <Plane className="h-10 w-10 text-foreground/80" />;
      case "umrah":
        return <Footprints className="h-10 w-10 text-foreground/80" />;
      case "lecture":
        return <Book className="h-10 w-10 text-foreground/80" />;
      case "workshop":
        return <Briefcase className="h-10 w-10 text-foreground/80" />;
      case "social":
        return <UsersIcon className="h-10 w-10 text-foreground/80" />;
      case "other":
      default:
        return <HelpCircle className="h-10 w-10 text-foreground/80" />;
    }
  };
  
  // Create topic cards from the available categories
  const topicCards = categories.map(category => ({
    title: category.label,
    category: category.value,
    icon: getCategoryIcon(category.value)
  }));

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      stopAutoplay();
      emblaApi.scrollPrev();
      restartAutoplayAfterDelay();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      stopAutoplay();
      emblaApi.scrollNext();
      restartAutoplayAfterDelay();
    }
  }, [emblaApi]);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
      setAutoplayActive(false);
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (emblaApi && !autoplayRef.current) {
      autoplayRef.current = setInterval(() => {
        if (!document.hidden) { // Only scroll if page is visible
          emblaApi.scrollNext({ animation: 'smooth' });
        }
      }, 3000); // Scroll every 3 seconds
      setAutoplayActive(true);
    }
  }, [emblaApi]);

  const restartAutoplayAfterDelay = useCallback(() => {
    // Restart autoplay after 7 seconds of user inactivity
    setTimeout(() => {
      if (!autoplayActive) {
        startAutoplay();
      }
    }, 7000);
  }, [autoplayActive, startAutoplay]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());

    const inViewSlides = [];
    emblaApi.slidesInView().forEach(index => {
      inViewSlides.push(index);
    });
    setSlidesInView(inViewSlides);
  }, [emblaApi]);

  // Handle visibility change to pause autoplay when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoplay();
      } else {
        startAutoplay();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [stopAutoplay, startAutoplay]);

  // Pause autoplay on hover
  const handleMouseEnter = useCallback(() => {
    stopAutoplay();
  }, [stopAutoplay]);

  const handleMouseLeave = useCallback(() => {
    startAutoplay();
  }, [startAutoplay]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    // Start autoplay after component is mounted
    startAutoplay();
    
    return () => {
      stopAutoplay();
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect, startAutoplay, stopAutoplay]);

  return (
    <div className="relative w-full px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Categories & Our Picks</h2>
      
      <div 
        className="relative" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex cursor-default">
            {topicCards.map((card, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex-grow-0 flex-shrink-0 basis-1/4 min-w-0 md:basis-1/6 lg:basis-1/8 px-2",
                  "transition-all duration-700",
                  slidesInView.includes(index) ? "opacity-100 scale-100" : "opacity-60 scale-90"
                )}
              >
                <TopicCard 
                  title={card.title}
                  category={card.category}
                  icon={card.icon}
                  isActive={activeIndex === index}
                  className={cn(
                    "animate-fade-in transition-all duration-700", 
                    activeIndex === index ? "scale-110" : ""
                  )}
                  style={{ animationDelay: `${(index % 10) * 50}ms` }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={scrollPrev} 
          disabled={prevBtnDisabled}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm border-primary/20 shadow-md hover:bg-primary/10 hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={scrollNext} 
          disabled={nextBtnDisabled}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm border-primary/20 shadow-md hover:bg-primary/10 hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex justify-center mt-6 space-x-1">
        {topicCards.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              stopAutoplay();
              emblaApi?.scrollTo(index, true);
              restartAutoplayAfterDelay();
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              activeIndex === index 
                ? "bg-primary w-4" 
                : "bg-primary/30 hover:bg-primary/50"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TopicsAndPicks;

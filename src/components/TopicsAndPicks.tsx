import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data/categories";
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
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const handleCategoryClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/events?category=${category}`);
    window.scrollTo(0, 0);
  };
  
  return (
    <div 
      className="block text-center cursor-pointer"
      onClick={handleCategoryClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "flex flex-col items-center transition-all duration-300",
        isHovered ? "scale-110 translate-y-[-8px]" : "",
        className
      )} style={style}>
        <div className={cn(
          "relative mb-2 md:mb-3 flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-full border border-border bg-background p-3 md:p-4 shadow-sm transition-all duration-300",
          isHovered ? "shadow-xl border-primary/70 bg-gradient-to-br from-primary/20 to-accent/10" : ""
        )}>
          <div className={cn(
            "transition-all duration-300 scale-75 md:scale-100",
            isHovered ? "scale-85 md:scale-115 text-primary" : ""
          )}>
            {icon}
          </div>
          <div className={cn(
            "absolute -inset-1 rounded-full opacity-0 bg-gradient-to-r from-primary/30 via-accent/20 to-transparent blur-xl transition-all duration-300",
            isHovered ? "opacity-100" : ""
          )}></div>
        </div>
        <span className={cn(
          "mt-1 md:mt-2 block text-xs md:text-sm font-medium transition-colors duration-300",
          isHovered ? "text-primary" : ""
        )}>{title}</span>
      </div>
    </div>
  );
};

const TopicsAndPicks = () => {
  const autoplayRef = useRef<NodeJS.Timeout | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'center', 
    dragFree: true,
    watchDrag: false, 
    duration: 30,
    startIndex: Math.floor(categories.length / 2)
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [activeIndex, setActiveIndex] = useState(Math.floor(categories.length / 2));
  const [slidesInView, setSlidesInView] = useState<number[]>([]);
  const [autoplayActive, setAutoplayActive] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

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
        if (!document.hidden) {
          emblaApi.scrollNext();
        }
      }, 3000);
      setAutoplayActive(true);
    }
  }, [emblaApi]);

  const restartAutoplayAfterDelay = useCallback(() => {
    setTimeout(() => {
      if (!autoplayActive) {
        startAutoplay();
      }
    }, 5000);
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

  const handleMouseEnter = useCallback(() => {
    stopAutoplay();
  }, [stopAutoplay]);

  const handleMouseLeave = useCallback(() => {
    startAutoplay();
  }, [startAutoplay]);
  
  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    stopAutoplay();
  }, [stopAutoplay]);
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    restartAutoplayAfterDelay();
  }, [restartAutoplayAfterDelay]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('pointerDown', handleDragStart);
    emblaApi.on('pointerUp', handleDragEnd);

    startAutoplay();
    
    return () => {
      stopAutoplay();
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('pointerDown', handleDragStart);
      emblaApi.off('pointerUp', handleDragEnd);
    };
  }, [emblaApi, onSelect, startAutoplay, stopAutoplay, handleDragStart, handleDragEnd]);

  return (
    <div className="relative w-full px-2 md:px-4 py-8 md:py-16 mb-6 md:mb-10 overflow-hidden" 
      style={{ 
        isolation: 'isolate',
        contain: 'paint layout style',
        position: 'relative',
        zIndex: 0
      }}>
      <div className="max-w-5xl mx-auto relative">
        <div 
          className="relative group" 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ 
            contain: 'content',
            isolation: 'isolate'
          }}
        >
          <div className="overflow-hidden" ref={emblaRef}>
            <div className={cn(
              "flex cursor-grab py-2 md:py-4",
              isDragging ? "cursor-grabbing" : ""
            )}>
              {topicCards.map((card, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex-grow-0 flex-shrink-0 basis-1/3 min-w-0 sm:basis-1/4 md:basis-1/6 lg:basis-1/8 px-2 sm:px-3 md:px-6",
                    "transition-all duration-500 ease-out",
                    slidesInView.includes(index) 
                      ? "opacity-100 scale-100" 
                      : "opacity-40 scale-85 blur-[1px]"
                  )}
                  style={{ contain: 'content' }}
                >
                  <TopicCard 
                    title={card.title}
                    category={card.category}
                    icon={card.icon}
                    isActive={activeIndex === index}
                    className="animate-fade-in transition-all duration-300"
                    style={{ animationDelay: `${(index % 10) * 30}ms` }}
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
            className="absolute left-0 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm border-primary/20 shadow-md hover:bg-primary/10 hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 h-8 w-8 md:h-10 md:w-10"
          >
            <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollNext} 
            disabled={nextBtnDisabled}
            className="absolute right-0 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm border-primary/20 shadow-md hover:bg-primary/10 hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100 h-8 w-8 md:h-10 md:w-10"
          >
            <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent opacity-0 pointer-events-none"></div>
        </div>
        
        <div className="flex justify-center mt-4 md:mt-8 space-x-1 md:space-x-2">
          {topicCards.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                stopAutoplay();
                emblaApi?.scrollTo(index);
                restartAutoplayAfterDelay();
              }}
              className={cn(
                "w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300",
                activeIndex === index 
                  ? "bg-primary w-3 md:w-4" 
                  : "bg-primary/30 hover:bg-primary/50"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicsAndPicks;

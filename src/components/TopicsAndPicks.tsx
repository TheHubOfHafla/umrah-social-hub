
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
  ChevronRight,
  ArrowRight
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
  
  return (
    <Link 
      to={`/events?category=${category}`} 
      className="block text-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={cn(
        "flex flex-col items-center transition-all duration-300",
        isHovered ? "scale-110 translate-y-[-8px]" : "",
        className
      )} style={style}>
        <div className={cn(
          "relative mb-3 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background p-4 shadow-sm transition-all duration-300",
          isHovered ? "shadow-xl border-primary/70 bg-gradient-to-br from-primary/20 to-accent/10" : ""
        )}>
          <div className={cn(
            "transition-all duration-300",
            isHovered ? "scale-115 text-primary" : ""
          )}>
            {icon}
          </div>
          <div className={cn(
            "absolute -inset-1 rounded-full opacity-0 bg-gradient-to-r from-primary/30 via-accent/20 to-transparent blur-xl transition-all duration-300",
            isHovered ? "opacity-100" : ""
          )}></div>
        </div>
        <span className={cn(
          "mt-2 block text-sm font-medium transition-colors duration-300",
          isHovered ? "text-primary" : ""
        )}>{title}</span>
        {isHovered && (
          <div className="mt-1 text-xs text-primary/80 flex items-center gap-1 animate-fade-in">
            <span>Explore</span>
            <ArrowRight className="h-3 w-3" />
          </div>
        )}
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
    skipSnaps: false,
    watchDrag: false,
    duration: 40,
    inViewThreshold: 0.7, 
    startIndex: 0
  });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);
  const [autoplayActive, setAutoplayActive] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [wrappedSlides, setWrappedSlides] = useState<number[]>([]);

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
      setIsTransitioning(true);
      emblaApi.scrollPrev();
      setTimeout(() => setIsTransitioning(false), 400);
      restartAutoplayAfterDelay();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      stopAutoplay();
      setIsTransitioning(true);
      emblaApi.scrollNext();
      setTimeout(() => setIsTransitioning(false), 400);
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
        if (!document.hidden && !isTransitioning) {
          setIsTransitioning(true);
          emblaApi.scrollNext();
          setTimeout(() => setIsTransitioning(false), 400);
        }
      }, 3000);
      setAutoplayActive(true);
    }
  }, [emblaApi, isTransitioning]);

  const restartAutoplayAfterDelay = useCallback(() => {
    setTimeout(() => {
      if (!autoplayActive) {
        startAutoplay();
      }
    }, 5000);
  }, [autoplayActive, startAutoplay]);

  const detectWrappedSlides = useCallback(() => {
    if (!emblaApi) return [];
    
    const engine = emblaApi.internalEngine();
    const scrollSnaps = engine.scrollSnapList;
    const scrollProgress = emblaApi.scrollProgress();
    
    // Detect slides at the wrap-around point
    const wrapped: number[] = [];
    if (scrollProgress < 0.1) {
      // Near the start, some of the last slides might be visible
      const slideCount = emblaApi.slideNodes().length;
      const firstVisible = emblaApi.slidesInView(true)[0];
      
      for (let i = Math.max(slideCount - 3, 0); i < slideCount; i++) {
        if (i !== firstVisible) {
          wrapped.push(i);
        }
      }
    } else if (scrollProgress > 0.9) {
      // Near the end, some of the first slides might be visible
      const firstVisible = emblaApi.slidesInView(true)[0];
      for (let i = 0; i < 3; i++) {
        if (i !== firstVisible) {
          wrapped.push(i);
        }
      }
    }
    
    return wrapped;
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setActiveIndex(emblaApi.selectedScrollSnap());
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());

    const inViewSlides: number[] = [];
    emblaApi.slidesInView(true).forEach(index => {
      inViewSlides.push(index);
    });
    setSlidesInView(inViewSlides);
    
    // Update wrapped slides on select
    setWrappedSlides(detectWrappedSlides());
  }, [emblaApi, detectWrappedSlides]);

  const onScroll = useCallback(() => {
    if (!emblaApi || isTransitioning) return;
    // Update which slides are in view during scrolling
    const inViewSlides: number[] = [];
    emblaApi.slidesInView(true).forEach(index => {
      inViewSlides.push(index);
    });
    setSlidesInView(inViewSlides);
    
    // Update wrapped slides on scroll
    setWrappedSlides(detectWrappedSlides());
  }, [emblaApi, isTransitioning, detectWrappedSlides]);

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
    setIsTransitioning(true);
    stopAutoplay();
  }, [stopAutoplay]);
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setIsTransitioning(false), 300);
    restartAutoplayAfterDelay();
  }, [restartAutoplayAfterDelay]);

  const scrollToSlide = useCallback((index: number) => {
    if (emblaApi) {
      stopAutoplay();
      setIsTransitioning(true);
      emblaApi.scrollTo(index);
      setTimeout(() => setIsTransitioning(false), 400);
      restartAutoplayAfterDelay();
    }
  }, [emblaApi, stopAutoplay, restartAutoplayAfterDelay]);

  useEffect(() => {
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('scroll', onScroll);
    emblaApi.on('pointerDown', handleDragStart);
    emblaApi.on('pointerUp', handleDragEnd);
    emblaApi.on('settle', () => setIsTransitioning(false));

    startAutoplay();
    
    return () => {
      stopAutoplay();
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('scroll', onScroll);
      emblaApi.off('pointerDown', handleDragStart);
      emblaApi.off('pointerUp', handleDragEnd);
      emblaApi.off('settle', () => setIsTransitioning(false));
    };
  }, [emblaApi, onSelect, onScroll, startAutoplay, stopAutoplay, handleDragStart, handleDragEnd]);

  return (
    <div className="relative w-full px-4 py-8 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse-soft">Categories & Our Picks</h2>
        
        <div 
          className="relative group" 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="overflow-hidden relative" ref={emblaRef}>
            <div className={cn(
              "flex cursor-grab transition-opacity duration-300",
              isDragging ? "cursor-grabbing" : "",
              isTransitioning ? "transition-transform duration-300 ease-out" : ""
            )}>
              {topicCards.map((card, index) => (
                <div 
                  key={index} 
                  className={cn(
                    "flex-grow-0 flex-shrink-0 basis-1/4 min-w-0 md:basis-1/6 lg:basis-1/8 px-2",
                    "transition-all duration-500 ease-out",
                    slidesInView.includes(index) 
                      ? "opacity-100 scale-100 blur-0" 
                      : "opacity-40 scale-85 blur-[1px]",
                    wrappedSlides.includes(index) ? "opacity-0" : "", // Hide wrapped slides
                    isTransitioning ? "transition-transform duration-300 ease-out" : ""
                  )}
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
            disabled={prevBtnDisabled || isTransitioning}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm border-primary/20 shadow-md hover:bg-primary/10 hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={scrollNext} 
            disabled={nextBtnDisabled || isTransitioning}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm border-primary/20 shadow-md hover:bg-primary/10 hover:border-primary/40 transition-all opacity-0 group-hover:opacity-100 hover:opacity-100 focus:opacity-100"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent opacity-0 pointer-events-none"></div>
        </div>
        
        <div className="flex justify-center mt-6 space-x-1">
          {topicCards.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              disabled={isTransitioning}
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
    </div>
  );
};

export default TopicsAndPicks;

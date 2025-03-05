
import { useState, useEffect, useCallback } from "react";
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
}

const TopicCard = ({ title, category, icon, className, style }: TopicCardProps) => {
  return (
    <Link to={`/events?category=${category}`} className="block text-center">
      <div className={cn(
        "group flex flex-col items-center transition-all duration-500",
        "hover:scale-125 hover:translate-y-[-8px]",
        className
      )} style={style}>
        <div className="relative mb-3 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background p-4 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-primary/60 group-hover:bg-primary/15">
          <div className="transition-all duration-500 group-hover:scale-110 group-hover:text-primary">
            {icon}
          </div>
          <div className="absolute -inset-1 rounded-full opacity-0 bg-gradient-to-r from-primary/10 to-transparent blur-xl transition-all duration-500 group-hover:opacity-100"></div>
        </div>
        <span className="mt-2 block text-sm font-medium transition-colors duration-500 group-hover:text-primary">{title}</span>
      </div>
    </Link>
  );
};

const TopicsAndPicks = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center', dragFree: true });
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slidesInView, setSlidesInView] = useState<number[]>([]);

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
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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
    if (!emblaApi) return;
    
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Categories & Our Picks</h2>
      
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex cursor-grab active:cursor-grabbing">
            {topicCards.map((card, index) => (
              <div 
                key={index} 
                className={cn(
                  "flex-grow-0 flex-shrink-0 basis-1/4 min-w-0 md:basis-1/6 lg:basis-1/8 px-2",
                  "transition-all duration-500",
                  slidesInView.includes(index) ? "opacity-100 scale-100" : "opacity-60 scale-90"
                )}
              >
                <TopicCard 
                  title={card.title}
                  category={card.category}
                  icon={card.icon}
                  className={cn(
                    "animate-fade-in transition-all", 
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
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm border-primary/20 shadow-md hover:bg-primary/10 hover:border-primary/40 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon" 
          onClick={scrollNext} 
          disabled={nextBtnDisabled}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/70 backdrop-blur-sm border-primary/20 shadow-md hover:bg-primary/10 hover:border-primary/40 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="flex justify-center mt-6 space-x-1">
        {topicCards.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
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

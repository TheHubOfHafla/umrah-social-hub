
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CarouselImage {
  src: string;
  alt: string;
}

interface EventCarouselProps {
  images: CarouselImage[];
  interval?: number;
  className?: string;
}

const EventCarousel = ({ 
  images, 
  interval = 5000, 
  className 
}: EventCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    setIsLoaded(new Array(images.length).fill(false));
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => {
      clearInterval(timer);
    };
  }, [currentIndex, interval, images.length]);

  const handleImageLoad = (index: number) => {
    setIsLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const goToNext = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match this with the CSS transition time
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex(prevIndex => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match this with the CSS transition time
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    
    setIsTransitioning(true);
    setCurrentIndex(index);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 600); // Match this with the CSS transition time
  };

  return (
    <div className={cn("relative w-full overflow-hidden h-[50vh] md:h-[70vh] lg:h-[80vh]", className)}>
      {/* Carousel Images */}
      {images.map((image, index) => (
        <div
          key={index}
          className={cn(
            "absolute inset-0 transition-opacity duration-600 ease-in-out",
            currentIndex === index ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          {/* Placeholder while loading */}
          {!isLoaded[index] && (
            <div className="absolute inset-0 bg-purple-100 animate-pulse" />
          )}

          <img
            src={image.src}
            alt={image.alt}
            className={cn(
              "w-full h-full object-cover transition-transform duration-[8000ms] ease-out",
              currentIndex === index && "scale-105"
            )}
            onLoad={() => handleImageLoad(index)}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
        </div>
      ))}

      {/* Navigation Controls */}
      <button
        onClick={goToPrevious}
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors duration-200 items-center justify-center"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={goToNext}
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/30 backdrop-blur-sm hover:bg-white/50 transition-colors duration-200 items-center justify-center"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 md:h-2.5 transition-all duration-300",
              currentIndex === index ? "w-8 bg-white" : "w-2 md:w-2.5 bg-white/50 hover:bg-white/70",
              "rounded-full"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EventCarousel;

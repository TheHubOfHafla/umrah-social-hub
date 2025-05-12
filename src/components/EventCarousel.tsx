
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  const [isLoaded, setIsLoaded] = useState<boolean[]>([]);

  useEffect(() => {
    setIsLoaded(new Array(images.length).fill(false));
  }, [images.length]);

  const handleImageLoad = (index: number) => {
    setIsLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  // Simplified component for a single image
  return (
    <div className={cn("relative w-full overflow-hidden h-[90vh]", className)}>
      {/* Single Image Display */}
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 opacity-100 z-10"
        >
          {/* Placeholder while loading */}
          {!isLoaded[index] && (
            <div className="absolute inset-0 bg-purple-100 animate-pulse" />
          )}

          <img
            src={image.src}
            alt={image.alt}
            className="w-full h-full object-cover"
            onLoad={() => handleImageLoad(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default EventCarousel;

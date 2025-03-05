
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface EventImageProps {
  src: string;
  alt: string;
}

const EventImage = ({ src, alt }: EventImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-md">
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && <Skeleton className="absolute inset-0" />}
    </div>
  );
};

export default EventImage;

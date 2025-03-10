
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface EventImageProps {
  src: string;
  alt: string;
}

const EventImage = ({ src, alt }: EventImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use the uploaded image instead of the dynamic src prop
  const imageSrc = "/lovable-uploads/2b781a41-72aa-4b72-9785-fe84e014bdd7.png";

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-md">
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
        onLoad={() => setImageLoaded(true)}
      />
      {!imageLoaded && <Skeleton className="absolute inset-0" />}
    </div>
  );
};

export default EventImage;

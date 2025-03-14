
import { Star } from "lucide-react";

interface ReviewStarsProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

const ReviewStars = ({ rating, size = 'md' }: ReviewStarsProps) => {
  const starSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`${starSizes[size]} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

export default ReviewStars;

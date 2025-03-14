
import { useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, ThumbsUp } from "lucide-react";
import ReviewStars from "./ReviewStars";

interface Author {
  name: string;
  avatar: string;
  attending: number;
}

interface Review {
  id: string;
  author: Author;
  rating: number;
  date: string;
  title: string;
  content: string;
  images?: string[];
  helpfulCount: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

const ReviewsSection = ({ 
  reviews, 
  averageRating, 
  totalReviews, 
  ratingDistribution 
}: ReviewsSectionProps) => {
  const [reviewsTab, setReviewsTab] = useState("recent");

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold tracking-tight">Reviews</h3>
        
        <Tabs 
          defaultValue="recent" 
          className="w-[300px]"
          value={reviewsTab}
          onValueChange={setReviewsTab}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="helpful">Most Helpful</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rating Summary */}
        <Card className="p-6 h-fit">
          <div className="flex flex-col items-center">
            <h4 className="text-xl font-semibold mb-2">{averageRating.toFixed(1)}</h4>
            <div className="flex mb-1">
              <ReviewStars rating={Math.round(averageRating)} />
            </div>
            <p className="text-sm text-muted-foreground mb-6">{totalReviews} reviews</p>
            
            <div className="w-full space-y-3">
              {[5, 4, 3, 2, 1].map(rating => (
                <div key={rating} className="flex items-center gap-2">
                  <div className="text-sm font-medium w-2">{rating}</div>
                  <Progress 
                    value={(ratingDistribution[rating] / totalReviews) * 100} 
                    className="h-2" 
                  />
                  <div className="text-sm text-muted-foreground w-8">
                    {ratingDistribution[rating]}
                  </div>
                </div>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <Button className="w-full">
              <MessageSquare className="h-4 w-4 mr-2" />
              Write a Review
            </Button>
          </div>
        </Card>
        
        {/* Reviews List */}
        <div className="lg:col-span-2">
          <ScrollArea className="h-[600px] pr-4">
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6">
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.author.avatar} />
                            <AvatarFallback>{review.author.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium">{review.author.name}</h4>
                            <p className="text-xs text-muted-foreground">
                              Attended {review.author.attending} events
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <ReviewStars rating={review.rating} />
                      </div>
                      
                      <h5 className="font-semibold mb-2">{review.title}</h5>
                      <p className="text-muted-foreground mb-4">{review.content}</p>
                      
                      {review.images && review.images.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {review.images.map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              alt="Review" 
                              className="h-20 w-20 object-cover rounded-md"
                            />
                          ))}
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <Button variant="ghost" size="sm">
                          <ThumbsUp className="h-3.5 w-3.5 mr-1.5" />
                          Helpful ({review.helpfulCount})
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          Report
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No reviews yet</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Be the first to review this organizer's events and help others make informed decisions.
                </p>
                <Button className="mt-4">
                  Write a Review
                </Button>
              </Card>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;

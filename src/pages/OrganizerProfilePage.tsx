
import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import EventGrid from "@/components/EventGrid";
import UserAvatar from "@/components/UserAvatar";
import { 
  Check, 
  ExternalLink, 
  MapPin, 
  Share2, 
  Heart, 
  Bell, 
  Mail, 
  Calendar, 
  Star,
  MessageSquare,
  ChevronDown,
  Users,
  ThumbsUp,  // Added the ThumbsUp icon import
  ThumbsDown  // Also added ThumbsDown for consistency since we have thumbs up
} from "lucide-react";
import { organizers } from "@/lib/data/organizers";
import { mockEvents } from "@/lib/data/events";
import { Event, EventAttendee } from "@/types";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const OrganizerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const organizer = organizers.find((org) => org.id === id);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [reviewsTab, setReviewsTab] = useState("recent");
  
  // Mock reviews data
  const [reviews, setReviews] = useState([
    {
      id: "1",
      author: { 
        name: "Sarah Johnson", 
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
        attending: 5
      },
      rating: 5,
      date: "2023-11-15",
      title: "Amazing organization!",
      content: "I've attended multiple events by this organizer and they're always well-planned and professional. The speakers are always excellent and the venues are perfect.",
      images: ["https://images.unsplash.com/photo-1511578314322-379afb476865"],
      helpfulCount: 12
    },
    {
      id: "2",
      author: { 
        name: "Michael Chen", 
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        attending: 2
      },
      rating: 4,
      date: "2023-10-22",
      title: "Great events, minor logistical issues",
      content: "The content of the events is always top-notch, but sometimes the check-in process could be smoother. Overall though, I highly recommend their events.",
      helpfulCount: 8
    },
    {
      id: "3",
      author: { 
        name: "Aisha Patel", 
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        attending: 7
      },
      rating: 5,
      date: "2023-09-30",
      title: "Consistently excellent",
      content: "I've been attending their events for over a year now, and each one has been excellent. Great speakers, well-organized, and always on time.",
      images: ["https://images.unsplash.com/photo-1475721027785-f74eccf877e2"],
      helpfulCount: 15
    },
  ]);

  if (!organizer) {
    return (
      <PageWrapper>
        <div className="container py-12">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold">Organizer not found</h2>
            <p className="text-muted-foreground">The organizer you're looking for doesn't exist or has been removed.</p>
          </Card>
        </div>
      </PageWrapper>
    );
  }

  const initials = organizer.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

  const pastEvents = events.filter(
    (event) => event.organizer.id === id && new Date(event.date.start) < new Date()
  );
  const upcomingEvents = events.filter(
    (event) => event.organizer.id === id && new Date(event.date.start) >= new Date()
  );
  
  const totalEvents = pastEvents.length + upcomingEvents.length;
  
  // Calculate average rating
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
  
  // Rating distribution
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length,
  };
  
  const totalReviews = reviews.length;
  
  const toggleFollow = () => setIsFollowing(!isFollowing);
  const toggleNotify = () => setIsNotified(!isNotified);

  const renderRatingStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`h-4 w-4 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <PageWrapper>
      <div className="container py-8">
        {/* Header/Profile Section */}
        <Card className="border-0 shadow-md overflow-hidden mb-8">
          {/* Cover photo */}
          <div className="h-48 bg-gradient-to-r from-primary/20 to-primary/10 relative">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent"></div>
          </div>
          
          <div className="px-6 pb-6 -mt-16">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex flex-col items-center z-10">
                <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                  <AvatarImage src={organizer.avatar} alt={organizer.name} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3 flex flex-col items-center">
                  <Badge variant="outline" className="mb-2">
                    {organizer.organizationType.charAt(0).toUpperCase() + organizer.organizationType.slice(1)}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{totalEvents} events hosted</span>
                  </div>
                </div>
              </div>
              
              {/* Organizer Info */}
              <div className="flex-1 mt-4 md:mt-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{organizer.name}</h2>
                  
                  <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                    <Button 
                      variant={isFollowing ? "default" : "outline"}
                      size="sm"
                      onClick={toggleFollow}
                      className="gap-1.5"
                    >
                      <Heart 
                        className={`h-4 w-4 ${isFollowing ? 'fill-white' : ''}`} 
                      />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      onClick={toggleNotify}
                      className={`gap-1.5 ${isNotified ? 'bg-primary/10 border-primary/30 text-primary' : ''}`}
                    >
                      <Bell className="h-4 w-4" />
                      {isNotified ? 'Notifications On' : 'Get Notified'}
                    </Button>
                    
                    <Button 
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                    >
                      <Mail className="h-4 w-4" />
                      Contact
                    </Button>
                    
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="gap-1.5"
                      asChild
                    >
                      <a 
                        href={organizer.website || "#"} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={!organizer.website ? 'pointer-events-none opacity-50' : ''}
                      >
                        <ExternalLink className="h-4 w-4" />
                        Website
                      </a>
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground">{organizer.bio}</p>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Followers</p>
                      <p className="font-semibold">1,248</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Events</p>
                      <p className="font-semibold">{totalEvents}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Star className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold">{averageRating.toFixed(1)} ({totalReviews} reviews)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Events Tabs */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold tracking-tight">Events</h3>
            
            <Tabs 
              defaultValue="upcoming" 
              className="w-[300px]"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past Events</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {activeTab === "upcoming" && (
            <>
              {upcomingEvents.length > 0 ? (
                <EventGrid events={upcomingEvents} />
              ) : (
                <Card className="p-12 text-center bg-muted/30">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No upcoming events</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This organizer doesn't have any upcoming events scheduled. Check back later or follow them to get notified about new events.
                  </p>
                </Card>
              )}
            </>
          )}
          
          {activeTab === "past" && (
            <>
              {pastEvents.length > 0 ? (
                <EventGrid events={pastEvents} />
              ) : (
                <Card className="p-12 text-center bg-muted/30">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-medium mb-2">No past events</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    This organizer hasn't hosted any events yet. Follow them to get notified when they schedule their first event.
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
        
        {/* Reviews Section */}
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
                  {renderRatingStars(Math.round(averageRating))}
                </div>
                <p className="text-sm text-muted-foreground mb-6">{totalReviews} reviews</p>
                
                <div className="w-full space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <div key={rating} className="flex items-center gap-2">
                      <div className="text-sm font-medium w-2">{rating}</div>
                      <Progress 
                        value={(ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100} 
                        className="h-2" 
                      />
                      <div className="text-sm text-muted-foreground w-8">
                        {ratingDistribution[rating as keyof typeof ratingDistribution]}
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
                            {renderRatingStars(review.rating)}
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
      </div>
    </PageWrapper>
  );
};

export default OrganizerProfilePage;

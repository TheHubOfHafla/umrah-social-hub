
import { useParams } from "react-router-dom";
import { useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import { Card } from "@/components/ui/card";
import { organizers } from "@/lib/data/organizers";
import { mockEvents } from "@/lib/data/events";
import { Event } from "@/types";

// Import refactored components
import ProfileHeader from "@/components/organizer/ProfileHeader";
import EventsSection from "@/components/organizer/EventsSection";
import ReviewsSection from "@/components/organizer/ReviewsSection";

const OrganizerProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const organizer = organizers.find((org) => org.id === id);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  
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

  return (
    <PageWrapper>
      <div className="container py-8">
        {/* Header/Profile Section */}
        <ProfileHeader 
          organizer={organizer} 
          totalEvents={totalEvents} 
          averageRating={averageRating} 
          totalReviews={totalReviews} 
        />
        
        {/* Events Tabs */}
        <EventsSection 
          pastEvents={pastEvents} 
          upcomingEvents={upcomingEvents} 
        />
        
        {/* Reviews Section */}
        <ReviewsSection 
          reviews={reviews} 
          averageRating={averageRating} 
          totalReviews={totalReviews} 
          ratingDistribution={ratingDistribution} 
        />
      </div>
    </PageWrapper>
  );
};

export default OrganizerProfilePage;

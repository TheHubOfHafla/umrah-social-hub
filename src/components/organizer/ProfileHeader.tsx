
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Bell, 
  Mail, 
  ExternalLink,
  Calendar,
  Users,
  Star
} from "lucide-react";
import { EventOrganizer } from "@/types";

interface ProfileHeaderProps {
  organizer: EventOrganizer;
  totalEvents: number;
  averageRating: number;
  totalReviews: number;
}

const ProfileHeader = ({ 
  organizer, 
  totalEvents, 
  averageRating, 
  totalReviews 
}: ProfileHeaderProps) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isNotified, setIsNotified] = useState(false);
  
  const toggleFollow = () => setIsFollowing(!isFollowing);
  const toggleNotify = () => setIsNotified(!isNotified);
  
  const initials = organizer.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  return (
    <div className="border-0 shadow-md overflow-hidden mb-8">
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
    </div>
  );
};

export default ProfileHeader;

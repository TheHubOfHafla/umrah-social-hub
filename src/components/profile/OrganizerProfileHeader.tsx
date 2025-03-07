
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Facebook, Twitter, Instagram, ExternalLink, UserPlus, UserCheck, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Container } from "@/components/ui/container";
import { EventOrganizer } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface OrganizerProfileHeaderProps {
  organizer: EventOrganizer;
  totalEvents?: number;
  followers?: number;
  isFollowing?: boolean;
}

const OrganizerProfileHeader = ({
  organizer,
  totalEvents = 72,
  followers = 369,
  isFollowing = false,
}: OrganizerProfileHeaderProps) => {
  const [following, setFollowing] = useState(isFollowing);
  const [followerCount, setFollowerCount] = useState(followers);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { toast } = useToast();

  const handleFollow = () => {
    setFollowing(!following);
    setFollowerCount(following ? followerCount - 1 : followerCount + 1);
    
    toast({
      title: following ? "Unfollowed" : "Now following",
      description: following 
        ? `You are no longer following ${organizer.name}` 
        : `You are now following ${organizer.name}`,
      variant: following ? "default" : "default",
    });
  };

  // Truncate description if needed
  const shortBio = organizer.bio && organizer.bio.length > 150 
    ? organizer.bio.substring(0, 150) + "..." 
    : organizer.bio;

  return (
    <div className="bg-gradient-to-b from-primary/5 to-background pt-8 pb-6">
      <Container>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          {/* Organizer Name */}
          <motion.h1 
            className="text-3xl md:text-4xl font-bold tracking-tight text-primary mb-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {organizer.name}
          </motion.h1>

          {/* Action Buttons */}
          <motion.div 
            className="flex items-center gap-3 mb-6"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Button 
              onClick={handleFollow}
              className={`rounded-full transition-all duration-300 ${
                following 
                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              {following ? (
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Following</span>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Follow</span>
                </motion.div>
              )}
            </Button>
            <Button variant="outline" className="rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300">
              Contact
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="flex items-center gap-8 mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex flex-col items-center">
              <motion.span 
                className="text-3xl font-bold text-primary"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              >
                {followerCount}
              </motion.span>
              <span className="text-sm text-muted-foreground">Followers</span>
            </div>
            <Separator orientation="vertical" className="h-10" />
            <div className="flex flex-col items-center">
              <motion.span 
                className="text-3xl font-bold text-primary"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
              >
                {totalEvents}
              </motion.span>
              <span className="text-sm text-muted-foreground">Total events</span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div 
            className="max-w-2xl mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <AnimatePresence mode="wait">
              {showFullDescription ? (
                <motion.p 
                  key="full-description"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-foreground/80 leading-relaxed"
                >
                  {organizer.bio}
                </motion.p>
              ) : (
                <motion.p 
                  key="short-description"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-foreground/80 leading-relaxed"
                >
                  {shortBio}
                </motion.p>
              )}
            </AnimatePresence>
            
            {organizer.bio && organizer.bio.length > 150 && (
              <motion.button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-primary font-medium mt-2 hover:underline"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showFullDescription ? "Show less" : "Show more"}
              </motion.button>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="flex items-center gap-4"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <SocialButton icon={<Facebook className="h-4 w-4" />} href="#" />
            <SocialButton icon={<Twitter className="h-4 w-4" />} href="#" />
            <SocialButton icon={<Instagram className="h-4 w-4" />} href="#" />
            <SocialButton icon={<Mail className="h-4 w-4" />} href="#" />
            {organizer.website && (
              <SocialButton 
                icon={<ExternalLink className="h-4 w-4" />} 
                href={organizer.website} 
                label="Website"
              />
            )}
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
};

const SocialButton = ({ icon, href, label }: { icon: React.ReactNode, href: string, label?: string }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-background hover:bg-primary/10 hover:text-primary transition-all duration-300 border border-gray-200 hover:border-primary/20"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.9 }}
    >
      {icon}
      {label && <span className="text-xs font-medium">{label}</span>}
    </motion.a>
  );
};

export default OrganizerProfileHeader;


import { useState } from "react";
import { Link } from "react-router-dom";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Music, 
  PartyPopper, 
  Theater, 
  Calendar, 
  Heart, 
  Gamepad, 
  Briefcase, 
  UtensilsCrossed 
} from "lucide-react";

interface TopicCardProps {
  title: string;
  category: EventCategory;
  icon: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const TopicCard = ({ title, category, icon, className, style }: TopicCardProps) => {
  return (
    <Link to={`/events?category=${category}`} className="block text-center">
      <div className={cn("group flex flex-col items-center transition-transform duration-300 hover:scale-105", className)} style={style}>
        <div className="relative mb-2 flex h-24 w-24 items-center justify-center rounded-full border border-border bg-background p-4 shadow-sm transition-all duration-300 group-hover:shadow-md">
          {icon}
        </div>
        <span className="mt-2 block text-sm font-medium">{title}</span>
      </div>
    </Link>
  );
};

const TopicsAndPicks = () => {
  const [activeTab, setActiveTab] = useState<'topics' | 'picks'>('topics');
  
  const topicCards = [
    { 
      title: "Music", 
      category: "music" as EventCategory, 
      icon: <Music className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Nightlife", 
      category: "nightlife" as EventCategory, 
      icon: <PartyPopper className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Performing Arts", 
      category: "lecture" as EventCategory, 
      icon: <Theater className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Holidays", 
      category: "travel" as EventCategory, 
      icon: <Calendar className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Dating", 
      category: "social" as EventCategory, 
      icon: <Heart className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Hobbies", 
      category: "workshop" as EventCategory, 
      icon: <Gamepad className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Business", 
      category: "education" as EventCategory, 
      icon: <Briefcase className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Food & Drink", 
      category: "charity" as EventCategory, 
      icon: <UtensilsCrossed className="h-10 w-10 text-foreground/80" /> 
    },
  ];
  
  const picksCards = [
    { 
      title: "Charity Events", 
      category: "charity" as EventCategory, 
      icon: <Heart className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Mosque Events", 
      category: "mosque" as EventCategory, 
      icon: <Calendar className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Community", 
      category: "community" as EventCategory, 
      icon: <PartyPopper className="h-10 w-10 text-foreground/80" /> 
    },
    { 
      title: "Workshops", 
      category: "workshop" as EventCategory, 
      icon: <Briefcase className="h-10 w-10 text-foreground/80" /> 
    },
  ];

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex border-b border-gray-200 gap-4">
          <button
            onClick={() => setActiveTab('topics')}
            className={cn(
              "pb-2 text-lg font-medium transition-colors",
              activeTab === 'topics' 
                ? "border-b-2 border-primary text-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('picks')}
            className={cn(
              "pb-2 text-lg font-medium transition-colors",
              activeTab === 'picks' 
                ? "border-b-2 border-[#9b87f5] text-[#9b87f5]" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Our Picks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
        {(activeTab === 'topics' ? topicCards : picksCards).map((card, index) => (
          <TopicCard 
            key={index}
            title={card.title}
            category={card.category}
            icon={card.icon}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          />
        ))}
      </div>
    </section>
  );
};

export default TopicsAndPicks;


import { useState } from "react";
import { Link } from "react-router-dom";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Users, 
  GraduationCap, 
  Building, 
  Plane, 
  Footprints, 
  Book, 
  Briefcase, 
  Users as UsersIcon,
  HelpCircle
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
  // Map of category values to their respective icons
  const getCategoryIcon = (category: EventCategory) => {
    switch(category) {
      case "charity":
        return <Heart className="h-10 w-10 text-foreground/80" />;
      case "community":
        return <Users className="h-10 w-10 text-foreground/80" />;
      case "education":
        return <GraduationCap className="h-10 w-10 text-foreground/80" />;
      case "mosque":
        return <Building className="h-10 w-10 text-foreground/80" />; // Changed Mosque to Building
      case "travel":
        return <Plane className="h-10 w-10 text-foreground/80" />;
      case "umrah":
        return <Footprints className="h-10 w-10 text-foreground/80" />;
      case "lecture":
        return <Book className="h-10 w-10 text-foreground/80" />;
      case "workshop":
        return <Briefcase className="h-10 w-10 text-foreground/80" />;
      case "social":
        return <UsersIcon className="h-10 w-10 text-foreground/80" />;
      case "other":
      default:
        return <HelpCircle className="h-10 w-10 text-foreground/80" />;
    }
  };
  
  // Create topic cards from the available categories
  const topicCards = categories.slice(0, 8).map(category => ({
    title: category.label,
    category: category.value,
    icon: getCategoryIcon(category.value)
  }));

  return (
    <section className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
        {topicCards.map((card, index) => (
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

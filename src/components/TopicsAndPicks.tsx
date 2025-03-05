
import { useState } from "react";
import { Link } from "react-router-dom";
import { EventCategory } from "@/types";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface TopicCardProps {
  title: string;
  category: EventCategory;
  imageUrl: string;
  className?: string;
}

const TopicCard = ({ title, category, imageUrl, className }: TopicCardProps) => {
  return (
    <Link to={`/events?category=${category}`}>
      <Card className={cn("group overflow-hidden border-none shadow-md transition-all duration-300 hover:shadow-lg", className)}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 w-full p-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const TopicsAndPicks = () => {
  const [activeTab, setActiveTab] = useState<'topics' | 'picks'>('topics');
  
  // Topic cards data with placeholder images
  const topicCards = [
    { title: "Charity Events", category: "charity" as EventCategory, imageUrl: "/placeholder.svg" },
    { title: "Educational Workshops", category: "education" as EventCategory, imageUrl: "/placeholder.svg" },
    { title: "Mosque Functions", category: "mosque" as EventCategory, imageUrl: "/placeholder.svg" },
    { title: "Travel Adventures", category: "travel" as EventCategory, imageUrl: "/placeholder.svg" },
    { title: "Community Gatherings", category: "community" as EventCategory, imageUrl: "/placeholder.svg" },
    { title: "Lectures & Talks", category: "lecture" as EventCategory, imageUrl: "/placeholder.svg" },
  ];
  
  const picksCards = [
    { title: "Upcoming Workshops", category: "workshop" as EventCategory, imageUrl: "/placeholder.svg" },
    { title: "Social Gatherings", category: "social" as EventCategory, imageUrl: "/placeholder.svg" },
    { title: "Umrah Journeys", category: "umrah" as EventCategory, imageUrl: "/placeholder.svg" },
    { title: "Featured Lectures", category: "lecture" as EventCategory, imageUrl: "/placeholder.svg" },
  ];

  return (
    <section className="container mx-auto px-4 py-10">
      <div className="mb-8">
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
            Topics
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

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {(activeTab === 'topics' ? topicCards : picksCards).map((card, index) => (
          <TopicCard 
            key={index}
            title={card.title}
            category={card.category}
            imageUrl={card.imageUrl}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          />
        ))}
      </div>
    </section>
  );
};

export default TopicsAndPicks;

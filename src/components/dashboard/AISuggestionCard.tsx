
import { useState } from "react";
import { 
  Card, 
  CardContent 
} from "@/components/ui/card";
import { 
  Lightbulb, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronRight, 
  Lock 
} from "lucide-react";
import { 
  Button 
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface AISuggestionCardProps {
  suggestions: string[];
  isPremium: boolean;
}

const AISuggestionCard = ({ 
  suggestions, 
  isPremium 
}: AISuggestionCardProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<number, string>>({});
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % suggestions.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };

  const handleRating = (index: number, rating: 'up' | 'down') => {
    if (isPremium) {
      setRatings({ ...ratings, [index]: rating });
    } else {
      setShowPremiumDialog(true);
    }
  };

  const handleDetailClick = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
    }
  };

  return (
    <>
      <div className="space-y-6">
        <div className="rounded-xl overflow-hidden border relative">
          <div className="bg-gradient-to-r from-primary/20 to-primary/5 px-4 py-3 flex items-center">
            <div className="bg-white rounded-full p-1 mr-3">
              <Lightbulb className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium">AI Suggestion {activeIndex + 1}/{suggestions.length}</h4>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
                onClick={handlePrev}
                disabled={suggestions.length <= 1}
              >
                <ChevronRight className="h-4 w-4 rotate-180" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 rounded-full hover:bg-white/20"
                onClick={handleNext}
                disabled={suggestions.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-card min-h-[140px] flex flex-col">
            <p className="text-sm">{suggestions[activeIndex]}</p>
            
            <div className="mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button 
                  variant={ratings[activeIndex] === 'up' ? 'default' : 'outline'} 
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => handleRating(activeIndex, 'up')}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Helpful
                </Button>
                <Button 
                  variant={ratings[activeIndex] === 'down' ? 'destructive' : 'outline'} 
                  size="sm"
                  className="h-8 gap-1.5"
                  onClick={() => handleRating(activeIndex, 'down')}
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  Not helpful
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 text-primary hover:text-primary/80"
                onClick={handleDetailClick}
              >
                Details
                <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
          
          {!isPremium && (
            <div className="absolute inset-0 bg-card/70 backdrop-blur-[2px] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button 
                className="gap-2"
                onClick={() => setShowPremiumDialog(true)}
              >
                <Lock className="h-4 w-4" />
                Unlock Premium Insights
              </Button>
            </div>
          )}
        </div>
        
        <div className="text-sm">
          <h4 className="text-md font-medium mb-2">How this helps:</h4>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Increase ticket sales with data-driven promotions</li>
            <li>Optimize pricing strategy for maximum revenue</li>
            <li>Target marketing efforts to your specific audience</li>
          </ul>
        </div>
      </div>
      
      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              Access advanced AI-powered insights and recommendations to grow your event business.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="rounded-lg bg-primary/5 p-4">
              <h4 className="font-medium flex items-center mb-2">
                <Lightbulb className="h-4 w-4 mr-2 text-primary" />
                Premium Features Include:
              </h4>
              <ul className="text-sm space-y-2 pl-6 list-disc text-muted-foreground">
                <li>Personalized AI marketing recommendations</li>
                <li>Pricing optimization suggestions</li>
                <li>Detailed audience behavior insights</li>
                <li>Competitive event analysis</li>
                <li>Custom promotion strategy planning</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              Maybe Later
            </Button>
            <Button type="submit">
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AISuggestionCard;


import { useState } from "react";
import { AlertTriangle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AISuggestionCardProps {
  suggestions: string[];
  isPremium: boolean;
}

const AISuggestionCard = ({ suggestions, isPremium }: AISuggestionCardProps) => {
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  const handleCardClick = () => {
    if (!isPremium) {
      setShowPremiumDialog(true);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span className="text-base font-medium">AI-Powered Suggestions</span>
      </div>

      {suggestions.map((suggestion, index) => (
        <Alert 
          key={index} 
          className={`${!isPremium ? 'cursor-pointer hover:bg-muted/60' : ''}`}
          onClick={!isPremium ? handleCardClick : undefined}
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          <AlertTitle className="font-medium text-sm">Suggestion {index + 1}</AlertTitle>
          <AlertDescription className="text-sm">{suggestion}</AlertDescription>
        </Alert>
      ))}

      {!isPremium && (
        <div className="mt-4 flex items-center justify-center">
          <Button 
            variant="outline" 
            className="text-xs"
            onClick={handleCardClick}
          >
            <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
            Unlock All AI Suggestions with Premium
          </Button>
        </div>
      )}

      <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Premium</DialogTitle>
            <DialogDescription>
              Get access to all AI-powered suggestions and premium insights to boost your event performance.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="rounded-lg bg-muted p-4 mb-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-500" />
                Premium Benefits
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  AI-powered marketing suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Advanced audience analytics
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Revenue optimization tools
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                  Competitor event analysis
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPremiumDialog(false)}>
              Maybe Later
            </Button>
            <Button>
              <Sparkles className="h-4 w-4 mr-2" />
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AISuggestionCard;

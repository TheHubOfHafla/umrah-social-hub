
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  ChevronRight, 
  RefreshCw, 
  MegaphoneIcon, 
  TrendingDown, 
  Users, 
  BarChart3 
} from "lucide-react";

interface Recommendation {
  eventId?: string;
  eventTitle?: string;
  type: string;
  message: string;
}

interface AISalesAssistantProps {
  recommendations: Recommendation[];
  isLoading?: boolean;
  onRefresh?: () => void;
}

const AISalesAssistant = ({ 
  recommendations = [], 
  isLoading = false,
  onRefresh 
}: AISalesAssistantProps) => {
  const [expanded, setExpanded] = useState(false);

  // Get icon based on recommendation type
  const getIcon = (type: string) => {
    switch (type) {
      case 'conversion':
        return <TrendingDown className="text-amber-500" />;
      case 'sales_speed':
        return <BarChart3 className="text-blue-500" />;
      case 'engagement':
        return <Users className="text-green-500" />;
      case 'general':
        return <MegaphoneIcon className="text-purple-500" />;
      default:
        return <Sparkles className="text-violet-500" />;
    }
  };

  // Display only first 3 recommendations when not expanded
  const displayRecommendations = expanded 
    ? recommendations 
    : recommendations.slice(0, 3);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-5 w-5 mr-2 text-[#8B5CF6]" />
          AI Sales Assistant
        </CardTitle>
        {onRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh} 
            disabled={isLoading}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Sparkles className="h-8 w-8 mx-auto opacity-50 mb-2" />
            <p>No recommendations available yet.</p>
            <p className="text-sm mt-1">Create more events to get insights!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayRecommendations.map((rec, index) => (
              <div 
                key={index}
                className="p-3 rounded-lg border hover:bg-accent/20 transition-colors duration-300"
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-background p-2 mt-0.5">
                    {getIcon(rec.type)}
                  </div>
                  <div>
                    {rec.eventTitle && (
                      <h4 className="text-sm font-medium">{rec.eventTitle}</h4>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {rec.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {recommendations.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-xs mt-2"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show less" : `Show ${recommendations.length - 3} more recommendations`}
                <ChevronRight className={`ml-1 h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISalesAssistant;

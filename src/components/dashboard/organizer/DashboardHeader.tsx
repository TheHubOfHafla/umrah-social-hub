
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DashboardHeaderProps {
  refetch: () => void;
  isLoading: boolean;
  error: Error | null;
}

const DashboardHeader = ({ refetch, isLoading, error }: DashboardHeaderProps) => {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of your events and analytics
          </p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={refetch}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Failed to load analytics data. Please try again."}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default DashboardHeader;

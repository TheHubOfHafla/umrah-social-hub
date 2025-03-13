
import { Loader2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  fullHeight?: boolean;
  message?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className,
  fullHeight = true,
  message = "Loading..."
}: LoadingSpinnerProps) => {
  const sizeMap = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <Container className={cn("py-6", className)}>
      <div className={cn(
        "flex flex-col justify-center items-center",
        fullHeight && "min-h-[60vh]"
      )}>
        <Loader2 className={cn(
          "animate-spin text-primary",
          sizeMap[size]
        )} />
        <p className="mt-4 text-muted-foreground text-sm">
          {message}
        </p>
      </div>
    </Container>
  );
};

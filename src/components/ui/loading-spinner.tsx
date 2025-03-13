
import { Container } from "@/components/ui/container";

export const LoadingSpinner = () => {
  return (
    <Container className="py-12">
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-center">
          <div className="h-8 w-64 bg-purple-200 rounded-md mx-auto mb-4"></div>
          <div className="h-4 w-48 bg-purple-100 rounded-md mx-auto"></div>
        </div>
      </div>
    </Container>
  );
};


import { Skeleton } from "@/components/ui/skeleton";
import { Container } from "@/components/ui/container";

const EventDetailSkeleton = () => {
  return (
    <Container className="py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-2/3">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-6 w-56 mb-4" />
          <Skeleton className="h-6 w-64 mb-8" />
          <Skeleton className="w-full aspect-video rounded-lg mb-8" />
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full mb-4" />
        </div>
        <div className="w-full lg:w-1/3">
          <div className="rounded-xl overflow-hidden">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default EventDetailSkeleton;


import { Container } from "@/components/ui/container";
import CreateEventForm from "@/components/event-creation/CreateEventForm";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useEventCreationAuth } from "@/hooks/useEventCreationAuth";

export default function CreateEventPage() {
  const { isCheckingAuth } = useEventCreationAuth();

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="py-8 md:py-12">
      <CreateEventForm />
    </Container>
  );
}

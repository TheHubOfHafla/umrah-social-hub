
import { useNavigate } from "react-router-dom";
import { Container } from "@/components/ui/container";
import Button from "@/components/Button";

const EventErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <Container size="md" className="py-16 text-center">
      <h1 className="text-2xl font-bold mb-4">Event not found</h1>
      <p className="text-muted-foreground mb-8">
        The event you're looking for doesn't exist or has been removed.
      </p>
      <Button onClick={() => navigate("/events")}>
        Browse all events
      </Button>
    </Container>
  );
};

export default EventErrorState;

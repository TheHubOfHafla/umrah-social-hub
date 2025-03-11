
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";

import { getEventById } from "@/lib/data/queries";
import { useToast } from "@/hooks/use-toast";
import RegistrationForm from "@/components/registration/RegistrationForm";
import EventSummaryCard from "@/components/registration/EventSummaryCard";
import ConfirmationDialog from "@/components/registration/ConfirmationDialog";
import RegisterSkeleton from "@/components/registration/RegisterSkeleton";

const RegisterPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState<{
    confirmationCode: string;
    qrCodeUrl: string;
  } | null>(null);

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId || ''),
    enabled: !!eventId,
  });

  const handleRegistrationSuccess = (formData: {
    email: string;
    confirmationCode: string;
    qrCodeUrl: string;
  }) => {
    setEmail(formData.email);
    setConfirmationData({
      confirmationCode: formData.confirmationCode,
      qrCodeUrl: formData.qrCodeUrl
    });
    setConfirmationOpen(true);
  };

  const handleConfirm = () => {
    setConfirmationOpen(false);
    toast({
      title: "Registration successful!",
      description: `You're now registered for ${event?.title}. Check your email for details.`,
    });
    navigate(`/events/${eventId}`);
  };

  if (isLoading || !event) {
    return <RegisterSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <Link to={`/events/${eventId}`} className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ChevronLeft size={16} className="mr-1" />
          Back to event
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Register for Event</h1>
              <p className="text-muted-foreground">
                Please fill out the form below to register for the event.
              </p>
            </div>

            <RegistrationForm 
              eventId={eventId || ''} 
              eventTitle={event.title}
              onRegistrationSuccess={handleRegistrationSuccess} 
            />
          </div>

          <div className="space-y-6">
            <EventSummaryCard event={event} />
          </div>
        </div>
      </div>

      <ConfirmationDialog
        open={confirmationOpen}
        onOpenChange={setConfirmationOpen}
        onConfirm={handleConfirm}
        eventTitle={event.title}
        userEmail={email}
        confirmationData={confirmationData}
      />
    </div>
  );
};

export default RegisterPage;

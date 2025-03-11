
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Button from "@/components/Button";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  eventTitle: string;
  userEmail: string;
  confirmationData: {
    confirmationCode: string;
    qrCodeUrl: string;
  } | null;
}

const ConfirmationDialog = ({
  open,
  onOpenChange,
  onConfirm,
  eventTitle,
  userEmail,
  confirmationData
}: ConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Registration Confirmed</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <Check className="h-8 w-8" />
          </div>
          <p className="text-center">
            Thank you for registering for <span className="font-semibold">{eventTitle}</span>!
          </p>
          <p className="text-center text-sm text-muted-foreground">
            We've sent a confirmation email to <span className="font-medium">{userEmail}</span> with all the details.
          </p>
          
          {confirmationData && (
            <div className="mt-4 border rounded-md p-4 w-full">
              <h3 className="text-center font-medium mb-2">Your Ticket</h3>
              <div className="flex justify-center mb-3">
                <img 
                  src={confirmationData.qrCodeUrl} 
                  alt="QR Code" 
                  className="w-36 h-36"
                />
              </div>
              <p className="text-center text-xs font-medium">
                Confirmation Code: {confirmationData.confirmationCode}
              </p>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-center">
          <Button onClick={onConfirm} className="w-full sm:w-auto">
            Back to Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;

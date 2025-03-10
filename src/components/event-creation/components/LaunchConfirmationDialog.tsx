
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface LaunchConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLaunch: () => void;
  isSaving: boolean;
}

const LaunchConfirmationDialog = ({
  open,
  onOpenChange,
  onLaunch,
  isSaving
}: LaunchConfirmationDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Launch this event?</AlertDialogTitle>
          <AlertDialogDescription>
            This will publish your event and make it visible to all users. Are you sure you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onLaunch} 
            className="bg-gradient-to-r from-purple-600 to-purple-400"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </>
            ) : (
              <>Launch Event</>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LaunchConfirmationDialog;

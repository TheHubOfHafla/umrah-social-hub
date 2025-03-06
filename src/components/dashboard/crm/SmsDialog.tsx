
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SmsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipientCount: number;
  messageText: string;
  setMessageText: (message: string) => void;
  onSendSms: () => void;
}

const SmsDialog = ({
  isOpen,
  onOpenChange,
  recipientCount,
  messageText,
  setMessageText,
  onSendSms,
}: SmsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send SMS Campaign</DialogTitle>
          <DialogDescription>
            Send an SMS to {recipientCount} selected users.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="sms-message">Message</Label>
            <Textarea
              id="sms-message"
              placeholder="Type your SMS message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground text-right">
              {messageText.length}/160 characters
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSendSms} disabled={!messageText}>
            Send SMS
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SmsDialog;

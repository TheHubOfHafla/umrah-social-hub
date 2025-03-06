
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface EmailDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  recipientCount: number;
  emailSubject: string;
  setEmailSubject: (subject: string) => void;
  emailBody: string;
  setEmailBody: (body: string) => void;
  onSendEmail: () => void;
}

const EmailDialog = ({
  isOpen,
  onOpenChange,
  recipientCount,
  emailSubject,
  setEmailSubject,
  emailBody,
  setEmailBody,
  onSendEmail,
}: EmailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Send Email Campaign</DialogTitle>
          <DialogDescription>
            Send an email to {recipientCount} selected users.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              placeholder="Email subject"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email-body">Email Content</Label>
            <Textarea
              id="email-body"
              placeholder="Type your email content here..."
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSendEmail} disabled={!emailSubject || !emailBody}>
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailDialog;

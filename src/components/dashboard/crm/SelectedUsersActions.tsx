
import React from "react";
import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SelectedUsersActionsProps {
  selectedUsersCount: number;
  openEmailDialog: () => void;
  openSmsDialog: () => void;
}

const SelectedUsersActions = ({
  selectedUsersCount,
  openEmailDialog,
  openSmsDialog
}: SelectedUsersActionsProps) => {
  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium">Selected Users</span>
        <Badge variant="outline">{selectedUsersCount}</Badge>
      </div>

      <div className="space-x-2">
        <Button 
          size="sm" 
          disabled={selectedUsersCount === 0}
          className="gap-1.5"
          onClick={openEmailDialog}
        >
          <Mail className="h-4 w-4" />
          Email
        </Button>

        <Button 
          size="sm" 
          variant="outline" 
          disabled={selectedUsersCount === 0}
          className="gap-1.5"
          onClick={openSmsDialog}
        >
          <MessageSquare className="h-4 w-4" />
          SMS
        </Button>
      </div>
    </div>
  );
};

export default SelectedUsersActions;

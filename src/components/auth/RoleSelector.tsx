
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserRound, Building } from "lucide-react";

interface RoleSelectorProps {
  value: 'attendee' | 'organizer';
  onChange: (value: 'attendee' | 'organizer') => void;
}

const RoleSelector = ({ value, onChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground text-center">Select account type for Google Sign In:</p>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="flex flex-col space-y-1"
      >
        <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-accent">
          <RadioGroupItem value="attendee" id="google-attendee" />
          <label
            htmlFor="google-attendee"
            className="flex flex-1 cursor-pointer items-center gap-2"
          >
            <UserRound className="h-4 w-4 text-primary" />
            <span className="text-sm">Attendee</span>
          </label>
        </div>
        <div className="flex items-center space-x-2 rounded-md border p-2 hover:bg-accent">
          <RadioGroupItem value="organizer" id="google-organizer" />
          <label
            htmlFor="google-organizer"
            className="flex flex-1 cursor-pointer items-center gap-2"
          >
            <Building className="h-4 w-4 text-primary" />
            <span className="text-sm">Organizer</span>
          </label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RoleSelector;

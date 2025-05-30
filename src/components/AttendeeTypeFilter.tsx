
import React from 'react';
import { Check, Users, Heart, Shield, ChevronUp, ChevronDown } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AttendeeType } from '@/types';

interface AttendeeTypeFilterProps {
  selectedType: AttendeeType | null;
  onChange: (type: AttendeeType | null) => void;
  className?: string;
  compact?: boolean;
  onToggleCompact?: () => void;
}

const attendeeTypes: { value: AttendeeType; label: string; icon: React.ReactNode }[] = [
  { 
    value: 'ladies-only', 
    label: 'Ladies Only', 
    icon: <Shield className="h-4 w-4 mr-2" />
  },
  { 
    value: 'couples', 
    label: 'Couples', 
    icon: <Heart className="h-4 w-4 mr-2" />
  },
  { 
    value: 'mixed', 
    label: 'Mixed', 
    icon: <Users className="h-4 w-4 mr-2" />
  },
  { 
    value: 'men-only', 
    label: 'Men Only', 
    icon: <Shield className="h-4 w-4 mr-2" />
  }
];

const AttendeeTypeFilter = ({ 
  selectedType, 
  onChange, 
  className,
  compact = false,
  onToggleCompact
}: AttendeeTypeFilterProps) => {
  const selectedOption = selectedType 
    ? attendeeTypes.find(type => type.value === selectedType) 
    : null;

  if (compact && onToggleCompact) {
    return (
      <Button 
        variant="ghost" 
        className="text-[#8B5CF6] hover:text-[#7C5AE2] hover:bg-[#8B5CF6]/10"
        onClick={onToggleCompact}
      >
        <ChevronDown className="h-4 w-4 mr-1" />
        <span className="text-xs">Show attendee filters</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center">
            {selectedOption ? (
              <>
                {selectedOption.icon}
                {selectedOption.label}
              </>
            ) : (
              <span>Event Type</span>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-popover">
        <DropdownMenuLabel>Event Types</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {attendeeTypes.map((type) => (
            <DropdownMenuItem
              key={type.value}
              className="cursor-pointer"
              onClick={() => onChange(selectedType === type.value ? null : type.value)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  {type.icon}
                  {type.label}
                </div>
                {selectedType === type.value && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            </DropdownMenuItem>
          ))}
          
          {selectedType && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onChange(null)}
              >
                Clear selection
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AttendeeTypeFilter;

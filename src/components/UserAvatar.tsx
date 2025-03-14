
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { User, EventAttendee } from "@/types";

interface UserAvatarProps {
  user: User | EventAttendee;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  namePosition?: 'bottom' | 'right';
}

const UserAvatar = ({ 
  user, 
  className, 
  size = 'md', 
  showName = false,
  namePosition = 'bottom'
}: UserAvatarProps) => {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
    xl: 'h-20 w-20'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const nameComponent = showName && (
    <span className={cn(
      "text-sm font-medium",
      size === 'xs' && "text-xs",
      namePosition === 'right' ? 'ml-2' : 'mt-1'
    )}>
      {user.name}
    </span>
  );

  return (
    <div className={cn(
      "flex",
      namePosition === 'bottom' ? 'flex-col items-center' : 'flex-row items-center',
      className
    )}>
      <Avatar className={cn("border", sizeClasses[size])}>
        <AvatarImage 
          src={user.avatar} 
          alt={user.name} 
          className="object-cover"
        />
        <AvatarFallback className="bg-primary/10 text-primary">
          {getInitials(user.name)}
        </AvatarFallback>
      </Avatar>
      {nameComponent}
    </div>
  );
};

export default UserAvatar;


import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary' | 'subtle' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  rounded?: boolean;
  gradient?: 'warm' | 'cool' | 'earth' | 'sunset' | 'blue' | 'purple';
  withShadow?: boolean;
  withHoverEffect?: boolean;
  withPulse?: boolean;
  withRipple?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'default', 
    size = 'md', 
    loading = false, 
    disabled, 
    icon, 
    iconPosition = 'left',
    fullWidth = false,
    rounded = false,
    gradient,
    withShadow = false,
    withHoverEffect = false,
    withPulse = false,
    withRipple = false,
    ...props 
  }, ref) => {
    // Map our custom variants to shadcn variants
    const shadcnVariant = 
      variant === 'primary' ? 'default' :
      variant === 'subtle' ? 'secondary' :
      variant === 'gradient' ? 'default' :
      variant;
    
    // Map our size values to shadcn sizes
    const shadcnSize = size === 'md' ? 'default' : size;
    
    return (
      <ShadcnButton
        ref={ref}
        variant={shadcnVariant}
        size={shadcnSize}
        disabled={loading || disabled}
        className={cn(
          'font-medium transition-all tracking-tight relative overflow-hidden',
          'active:scale-[0.98]',
          variant === 'primary' && 'bg-purple-600 text-white hover:bg-purple-700',
          variant === 'subtle' && 'bg-purple-100 text-purple-800 hover:bg-purple-200',
          variant === 'gradient' && {
            'bg-gradient-to-r from-purple-500 to-purple-600': gradient === 'purple' || !gradient,
            'bg-gradient-cool': gradient === 'cool' && !gradient?.includes('blue'),
            'bg-gradient-earth': gradient === 'earth' && !gradient?.includes('blue'),
            'bg-gradient-sunset': gradient === 'sunset' && !gradient?.includes('blue'),
            'bg-gradient-to-r from-purple-400 to-purple-600': gradient === 'blue',
            'text-white': true,
          },
          rounded ? 'rounded-md' : 'rounded-sm',
          fullWidth && 'w-full',
          loading && 'cursor-not-allowed',
          withShadow && 'shadow-md hover:shadow-lg',
          withHoverEffect && 'transition-transform duration-150 hover:scale-[1.02]',
          className
        )}
        {...props}
      >
        {withRipple && (
          <span className="absolute inset-0 overflow-hidden rounded-lg">
            <span className="ripple-effect" />
          </span>
        )}
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2 animate-fadeIn">{icon}</span>
        )}
        <span className="animate-fadeIn">{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2 animate-fadeIn">{icon}</span>
        )}
      </ShadcnButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;

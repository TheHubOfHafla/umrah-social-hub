
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
  gradient?: 'warm' | 'cool' | 'earth' | 'sunset' | 'blue';
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
          variant === 'primary' && 'bg-[#4A90E2] text-white hover:bg-[#3A7BC8]',
          variant === 'subtle' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          variant === 'gradient' && {
            'bg-gradient-cool': gradient === 'cool' && !gradient?.includes('blue'),
            'bg-gradient-earth': gradient === 'earth' && !gradient?.includes('blue'),
            'bg-gradient-sunset': gradient === 'sunset' && !gradient?.includes('blue'),
            'bg-gradient-to-r from-[#4A90E2] to-[#63B3ED]': gradient === 'blue' || !gradient,
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

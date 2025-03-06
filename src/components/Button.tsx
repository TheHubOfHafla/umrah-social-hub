
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
  gradient?: 'warm' | 'cool' | 'earth' | 'sunset';
  withShadow?: boolean;
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
          'font-medium transition-all tracking-tight',
          'active:scale-[0.98]',
          variant === 'primary' && 'bg-[#8B5CF6] text-white hover:bg-[#7C5AE2]', // Changed to purple
          variant === 'subtle' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          variant === 'gradient' && {
            'bg-gradient-warm': gradient === 'warm' || !gradient,
            'bg-gradient-cool': gradient === 'cool',
            'bg-gradient-earth': gradient === 'earth',
            'bg-gradient-sunset': gradient === 'sunset',
            'text-white': true,
          },
          rounded && 'rounded-full',
          fullWidth && 'w-full',
          loading && 'cursor-not-allowed',
          withShadow && 'shadow-soft hover:shadow-medium',
          className
        )}
        {...props}
      >
        {loading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </ShadcnButton>
    );
  }
);

Button.displayName = 'Button';

export default Button;

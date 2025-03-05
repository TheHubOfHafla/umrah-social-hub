
import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
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
    ...props 
  }, ref) => {
    // Map our custom variants to shadcn variants
    const shadcnVariant = 
      variant === 'primary' ? 'default' :
      variant === 'subtle' ? 'secondary' :
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
          variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          variant === 'subtle' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
          fullWidth && 'w-full',
          loading && 'cursor-not-allowed',
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

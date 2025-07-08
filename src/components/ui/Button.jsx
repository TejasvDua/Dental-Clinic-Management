import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'default', 
  size = 'default', 
  asChild = false,
  children,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background";
  
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-blue-600 hover:bg-blue-700 text-white",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 bg-red-600 hover:bg-red-700 text-white",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground border-gray-300 hover:bg-gray-50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 bg-gray-100 hover:bg-gray-200 text-gray-900",
    ghost: "hover:bg-accent hover:text-accent-foreground hover:bg-gray-100",
    link: "underline-offset-4 hover:underline text-primary text-blue-600"
  };

  const sizes = {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10"
  };

  const Component = asChild ? 'div' : 'button';
  
  return (
    <Component
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </Component>
  );
});

Button.displayName = "Button";

export { Button };
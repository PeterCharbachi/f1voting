import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'link';
}

export const Button = ({ children, className, variant = 'default', ...props }: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-white border border-primary hover:bg-primary/90 hover:border-primary/90 shadow-lg transform hover:scale-105', // F1 Red, with border
    secondary: 'bg-background-light text-text-light border border-background-light hover:bg-background-light/80 hover:border-background-light/80 shadow-md transform hover:scale-105', // Darker background, subtle border
    destructive: 'bg-red-700 text-white border border-red-700 hover:bg-red-800 hover:border-red-800 shadow-md transform hover:scale-105', // Stronger red
    outline: 'border border-text-muted text-text-light hover:bg-background-light/50 hover:border-text-light', // Subtle outline
    link: 'text-primary hover:text-primary/80 underline-offset-4 hover:underline', // F1 Red for links
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className} h-10 px-4 py-2`}
      {...props}
    >
      {children}
    </button>
  );
};
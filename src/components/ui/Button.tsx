import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'link' | 'destructive' | 'default' | 'outline';
  children: React.ReactNode;
}

export const Button = ({ variant = 'primary', children, className = '', ...props }: ButtonProps) => {
  const baseClasses = 'font-black uppercase italic tracking-widest transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-dark hover:shadow-f1',
    default: 'bg-primary text-white hover:bg-primary-dark hover:shadow-f1',
    secondary: 'bg-background-light text-text-white hover:bg-white/10 border border-white/10',
    link: 'text-text-muted hover:text-primary underline-offset-4 hover:underline lowercase italic normal-case tracking-normal font-normal',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'bg-transparent text-text-white border border-white/20 hover:bg-white/5'
  };

  const clipPath = variant === 'link' ? '' : 'polygon(0 0, 100% 0, 95% 100%, 0 100%)';

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} px-6 py-2.5 ${className}`}
      style={clipPath ? { clipPath } : {}}
      {...props}
    >
      {children}
    </button>
  );
};

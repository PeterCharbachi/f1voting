import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = ({ className = '', ...props }: InputProps) => {
  return (
    <input
      className={`bg-background-dark/80 border-2 border-background-light px-4 py-2.5 text-text-white focus:border-primary focus:outline-none transition-all duration-300 placeholder:text-text-muted/30 font-semibold ${className}`}
      style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}
      {...props}
    />
  );
};

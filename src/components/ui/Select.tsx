import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export const Select = ({ children, className = '', ...props }: SelectProps) => {
  return (
    <div className="relative group">
      <select
        className={`bg-background-dark/80 border-2 border-background-light px-4 py-2.5 text-text-white appearance-none focus:border-primary focus:outline-none transition-all duration-300 font-bold uppercase tracking-wide cursor-pointer w-full ${className}`}
        style={{ clipPath: 'polygon(0 0, 100% 0, 98% 100%, 0 100%)' }}
        {...props}
      >
        {children}
      </select>
      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none group-hover:text-primary transition-colors text-text-muted">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};

export default Select;

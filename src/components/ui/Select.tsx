import React from 'react';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
    <select 
        ref={ref}
        className={`flex h-10 w-full rounded-md border border-background-light bg-background-medium px-3 py-2 text-sm text-text-light ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-colors duration-300 ${className}`} // Updated styling
        {...props}
    />
));

export default Select;
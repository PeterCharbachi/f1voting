import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <div
      className={`bg-background-medium rounded-lg shadow-xl border border-background-light ${className}`} // Updated styling, slightly less rounded
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className, ...props }: CardProps) => (
  <div className={`p-6 border-b border-background-light ${className}`} {...props}>
    {children}
  </div>
);

export const CardContent = ({ children, className, ...props }: CardProps) => (
  <div className={`p-6 ${className}`} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ children, className, ...props }: CardProps) => (
    <h3 className={`text-text-light text-3xl font-bold uppercase ${className}`} {...props}> {/* More prominent F1-like title */}
        {children}
    </h3>
);
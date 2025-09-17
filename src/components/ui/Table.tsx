import React from 'react';

export const Table = ({ children, className, ...props }) => (
    <div className="overflow-x-auto rounded-lg border border-background-light"> 
        <table className={`min-w-full text-left ${className}`} {...props}>
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children, className, ...props }) => (
    <thead className={`bg-background-medium text-xs text-text-muted uppercase ${className}`} {...props}> 
        <tr>{children}</tr>
    </thead>
);

export const TableBody = ({ children, className, ...props }) => (
    <tbody className={`divide-y divide-background-light ${className}`} {...props}> 
        {children}
    </tbody>
);

export const Th = ({ children, className, ...props }) => (
    <th scope="col" className={`px-4 py-2 font-semibold ${className}`} {...props}> 
        {children}
    </th>
);

export const Tr = ({ children, className, ...props }) => (
    <tr className={`hover:bg-background-medium/50 transition-colors duration-200 ${className}`} {...props}> 
        {children}
    </tr>
);

export const Td = ({ children, className, ...props }) => (
    <td className={`px-4 py-2 text-text-light ${className}`} {...props}> 
        {children}
    </td>
);
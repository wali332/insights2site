import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  glass = true,
  className = '',
  ...props 
}) => {
  const baseStyles = "rounded-2xl p-6 transition-all duration-300";
  const glassStyles = "bg-white/70 backdrop-blur-lg shadow-xl border border-white/40";
  const solidStyles = "bg-white shadow-lg border border-gray-100";

  return (
    <div 
      className={`${baseStyles} ${glass ? glassStyles : solidStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

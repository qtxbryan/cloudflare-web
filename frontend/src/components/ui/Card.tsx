import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`glass-panel rounded-2xl ${className}`}>
      {children}
    </div>
  );
}

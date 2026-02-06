import type { ReactNode } from 'react';

interface BentoBoxProps {
  children?: ReactNode;
  className?: string;
}

export function BentoBox({ children, className = '' }: BentoBoxProps) {
  return (
    <div
      className={`grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  );
}

import type { ReactNode } from 'react';

type BadgeVariant = 'green' | 'orange' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'bg-green-400/10 text-green-400 border border-green-400/20 badge-glow',
  orange: 'bg-[#FF6633]/10 text-[#FF6633] border border-[#FF6633]/20',
  gray: 'bg-white/5 text-[#9ca3af] border border-white/10',
};

export function Badge({ variant = 'gray', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

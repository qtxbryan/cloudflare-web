import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-r from-[#FF6633] to-[#E07318] text-white button-glow hover:opacity-90 active:scale-[0.98]',
  outline:
    'border border-[#FF6633] text-[#FF6633] hover:bg-[#FF6633]/10 active:scale-[0.98]',
  ghost: 'text-[#9ca3af] hover:text-[#e5e2e3] hover:bg-white/5',
};

export function Button({
  variant = 'primary',
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';
  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}

import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
  error?: string;
}

export function Input({
  label,
  leftIcon,
  rightElement,
  error,
  className = '',
  id,
  ...rest
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 text-[#9ca3af] pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={`w-full glass-input rounded-xl px-4 py-3 text-[#e5e2e3] text-sm placeholder:text-[#9ca3af]/60 outline-none focus:border-[#FF6633]/50 focus:ring-1 focus:ring-[#FF6633]/30 transition-all ${leftIcon ? 'pl-10' : ''} ${rightElement ? 'pr-10' : ''} ${className}`}
          {...rest}
        />
        {rightElement && (
          <span className="absolute right-3">{rightElement}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

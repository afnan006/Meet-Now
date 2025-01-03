import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  children: ReactNode;
}

export function Button({ 
  variant = 'primary', 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        {
          'bg-rose-500 text-white hover:bg-rose-600': variant === 'primary',
          'bg-stone-100 text-stone-900 hover:bg-stone-200': variant === 'secondary',
          'border-2 border-stone-200 text-stone-900 hover:bg-stone-50': variant === 'outline',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
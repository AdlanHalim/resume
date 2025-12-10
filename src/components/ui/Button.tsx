import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    children,
    disabled,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = `
    inline-flex items-center justify-center gap-2 font-medium rounded-xl
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed
  `;

    const variants = {
        primary: `
      bg-gradient-to-r from-primary-500 to-primary-600 text-white
      shadow-lg shadow-primary-500/25
      hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:shadow-primary-500/30
      focus:ring-primary-500
    `,
        secondary: `
      bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200
      border border-slate-200 dark:border-slate-700
      hover:bg-slate-200 dark:hover:bg-slate-700
      focus:ring-slate-400
    `,
        danger: `
      bg-gradient-to-r from-red-500 to-red-600 text-white
      shadow-lg shadow-red-500/25
      hover:from-red-600 hover:to-red-700 hover:shadow-xl hover:shadow-red-500/30
      focus:ring-red-500
    `,
        ghost: `
      text-slate-600 dark:text-slate-400
      hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100
      focus:ring-slate-400
    `,
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                icon
            )}
            {children}
        </button>
    );
}

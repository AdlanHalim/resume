import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
    isDark: boolean;
    toggle: () => void;
}

export function ThemeToggle({ isDark, toggle }: ThemeToggleProps) {
    return (
        <button
            onClick={toggle}
            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700
                 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
            ) : (
                <Moon className="w-5 h-5 text-slate-600" />
            )}
        </button>
    );
}

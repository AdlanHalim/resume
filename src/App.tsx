import { useState, useEffect } from 'react';
import { ResumeProvider } from './context/ResumeContext';
import { MultiStepForm } from './components/MultiStepForm';
import { ThemeToggle } from './components/ui/ThemeToggle';
import { FileText, Sparkles } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ResumeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-400/10 dark:bg-primary-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-primary-400/10 dark:bg-primary-500/10 blur-3xl" />
        </div>

        {/* Header */}
        <header className="relative z-10 sticky top-0 backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Resume Generator
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Powered by Gemini AI</p>
              </div>
            </div>
            <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
          </div>
        </header>

        {/* Main content */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MultiStepForm />
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-slate-200/50 dark:border-slate-700/50 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Free & Open Source • No data stored • Powered by Google Gemini AI
            </p>
          </div>
        </footer>
      </div>
    </ResumeProvider>
  );
}

export default App;

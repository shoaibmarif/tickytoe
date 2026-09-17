import React from 'react';
import { Home, AlertCircle } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
        404
      </h1>
      <p className="text-base text-slate-600 dark:text-slate-400 max-w-md mb-6">
        The grid coordinate you are looking for does not exist or has been relocated.
      </p>
      <a
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-glow-indigo transition-all"
      >
        <Home className="w-4 h-4" />
        <span>Return to Game</span>
      </a>
    </div>
  );
};

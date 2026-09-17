import React from 'react';
import { Moon, Sun, Volume2, VolumeX, BarChart3, Settings, Sparkles } from 'lucide-react';
import { Theme } from '../hooks/useTheme.js';

interface HeaderProps {
  theme: Theme;
  isDark: boolean;
  onThemeToggle: () => void;
  soundEnabled: boolean;
  onSoundToggle: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  currentStreak?: number;
}

export const Header: React.FC<HeaderProps> = ({
  isDark,
  onThemeToggle,
  soundEnabled,
  onSoundToggle,
  onOpenStats,
  onOpenSettings,
  currentStreak = 0,
}) => {
  return (
    <header className="w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#090d16]/70 backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[2px] shadow-glow-indigo">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
                <path d="M4 4L10 10M10 4L4 10" stroke="#22d3ee" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="17" cy="17" r="3.5" stroke="#f43f5e" strokeWidth="2.5" />
              </svg>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-cyan-200 font-heading">
                tickytoe
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              Unbeatable AI & Multiplayer
            </p>
          </div>
        </a>

        {/* Quick Toolbar */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Win Streak Pill */}
          {currentStreak > 0 && (
            <button
              onClick={onOpenStats}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold hover:bg-amber-500/20 transition-all"
              title="Current Winning Streak"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentStreak} Streak</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={onSoundToggle}
            aria-label={soundEnabled ? 'Mute audio' : 'Unmute audio'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5 text-indigo-500" /> : <VolumeX className="w-5 h-5 opacity-60" />}
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            aria-label="View Game Statistics"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            title="Statistics"
          >
            <BarChart3 className="w-5 h-5" />
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            aria-label="Game Settings"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onThemeToggle}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};

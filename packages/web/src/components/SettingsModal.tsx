import React from 'react';
import { X, Volume2, Clock, Sparkles, User, Sliders } from 'lucide-react';
import { Player } from '@tictactoe/core';
import { SymbolTheme, WebSettings } from '../types.js';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: WebSettings;
  onUpdateSettings: (newSettings: Partial<WebSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Game Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options */}
        <div className="py-4 space-y-5">
          {/* Turn Timer */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Turn Speed Timer</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Off', val: 0 },
                { label: '5s', val: 5 },
                { label: '10s', val: 10 },
                { label: '15s', val: 15 },
              ].map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => onUpdateSettings({ turnTimerSeconds: opt.val })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    settings.turnTimerSeconds === opt.val
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow-indigo'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Symbol Theme */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Piece Style & Theme</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'classic' as SymbolTheme, label: 'Classic', preview: 'X & O' },
                { id: 'cyber' as SymbolTheme, label: 'Cyber Glow', preview: 'Neon' },
                { id: 'emoji' as SymbolTheme, label: 'Emoji', preview: '⚔️ & 🛡️' },
              ].map((themeOpt) => (
                <button
                  key={themeOpt.id}
                  onClick={() => onUpdateSettings({ symbolTheme: themeOpt.id })}
                  className={`p-2.5 rounded-xl text-center border transition-all ${
                    settings.symbolTheme === themeOpt.id
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow-indigo'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="text-xs font-bold">{themeOpt.label}</div>
                  <div className="text-[11px] opacity-80 mt-0.5">{themeOpt.preview}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Starting Player vs AI */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <User className="w-4 h-4 text-emerald-500" />
              <span>You Play As (Vs AI)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['X', 'O'] as Player[]).map((p) => (
                <button
                  key={p}
                  onClick={() => onUpdateSettings({ playerSymbol: p })}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    settings.playerSymbol === p
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow-indigo'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {p === 'X' ? 'Player X (First)' : 'Player O (Second)'}
                </button>
              ))}
            </div>
          </div>

          {/* Sound & Volume */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-indigo-500" />
                <span>Audio Volume</span>
              </label>
              <button
                onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                className="text-xs font-semibold text-indigo-500 hover:underline"
              >
                {settings.soundEnabled ? 'Disable Sound' : 'Enable Sound'}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.volume}
              disabled={!settings.soundEnabled}
              onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer disabled:opacity-40"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

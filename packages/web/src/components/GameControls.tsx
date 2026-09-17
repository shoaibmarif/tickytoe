import React from 'react';
import { RotateCcw, Undo2, Users, Bot, Grid3X3, Radio, Globe } from 'lucide-react';
import { Difficulty, GameMode, GridSize } from '@tictactoe/core';

interface GameControlsProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  gridSize: GridSize;
  onGridSizeChange: (size: GridSize) => void;
  difficulty: Difficulty;
  onDifficultyChange: (diff: Difficulty) => void;
  onNewGame: () => void;
  onUndo: () => void;
  canUndo: boolean;
  onOpenOnlineLobby?: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  mode,
  onModeChange,
  gridSize,
  onGridSizeChange,
  difficulty,
  onDifficultyChange,
  onNewGame,
  onUndo,
  canUndo,
  onOpenOnlineLobby,
}) => {
  const difficulties: { key: Difficulty; label: string }[] = [
    { key: 'easy', label: 'Easy' },
    { key: 'medium', label: 'Medium' },
    { key: 'hard', label: 'Hard' },
    { key: 'unbeatable', label: 'Master' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto mt-6 space-y-4">
      {/* Primary Action Buttons */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={onNewGame}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-indigo active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{mode === 'online' ? 'Rematch / Reset' : 'New Game'}</span>
        </button>

        {mode !== 'online' ? (
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
              canUndo
                ? 'bg-white/70 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95'
                : 'opacity-40 cursor-not-allowed bg-transparent border-slate-200/40 dark:border-slate-800/40 text-slate-400'
            }`}
            title="Undo last move"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">Undo</span>
          </button>
        ) : (
          onOpenOnlineLobby && (
            <button
              onClick={onOpenOnlineLobby}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold border border-indigo-500/30 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 active:scale-95 transition-all"
            >
              <Globe className="w-4 h-4" />
              <span>Room Lobby</span>
            </button>
          )
        )}
      </div>

      {/* Selectors Bar */}
      <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200 dark:border-slate-800 space-y-3">
        {/* Mode & Grid Size Row */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold">
            <button
              onClick={() => onModeChange('ai')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'ai'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Vs AI</span>
            </button>
            <button
              onClick={() => onModeChange('pvp')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'pvp'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Local 2P</span>
            </button>
            <button
              onClick={() => onModeChange('online')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                mode === 'online'
                  ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Online P2P</span>
            </button>
          </div>

          {/* Grid Size Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/50 dark:border-slate-700/50 text-xs font-semibold">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-2 flex items-center gap-1 hidden sm:flex">
              <Grid3X3 className="w-3 h-3" />
              Size
            </span>
            {([3, 4, 5] as GridSize[]).map((size) => (
              <button
                key={size}
                onClick={() => onGridSizeChange(size)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  gridSize === size
                    ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {size}x{size}
              </button>
            ))}
          </div>
        </div>

        {/* AI Difficulty Selector (When in AI mode) */}
        {mode === 'ai' && (
          <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              Difficulty:
            </span>
            <div className="flex items-center gap-1">
              {difficulties.map((diff) => (
                <button
                  key={diff.key}
                  onClick={() => onDifficultyChange(diff.key)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    difficulty === diff.key
                      ? 'bg-indigo-600 text-white shadow-glow-indigo'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

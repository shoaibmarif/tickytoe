import React from 'react';
import { Bot, User, Clock, Flame } from 'lucide-react';
import { Difficulty, GameMode, GameStatus, Player } from '@tictactoe/core';
import { SymbolTheme } from '../types.js';

interface ScoreBoardProps {
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  mode: GameMode;
  difficulty: Difficulty;
  playerSymbol: Player;
  scores: { X: number; O: number; draws: number };
  symbolTheme: SymbolTheme;
  timeLeft?: number | null;
  totalTime?: number;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  currentPlayer,
  status,
  winner,
  mode,
  difficulty,
  playerSymbol,
  scores,
  symbolTheme,
  timeLeft,
  totalTime = 0,
}) => {
  const isPlayerXTurn = status === 'in_progress' && currentPlayer === 'X';
  const isPlayerOTurn = status === 'in_progress' && currentPlayer === 'O';

  const isPlayerXHuman = mode === 'pvp' || playerSymbol === 'X';
  const isPlayerOHuman = mode === 'pvp' || playerSymbol === 'O';

  const getPlayerXLabel = () => {
    if (mode === 'pvp') return 'Player 1';
    return playerSymbol === 'X' ? 'You' : 'AI';
  };

  const getPlayerOLabel = () => {
    if (mode === 'pvp') return 'Player 2';
    return playerSymbol === 'O'
      ? 'You'
      : `AI (${difficulty.slice(0, 1).toUpperCase() + difficulty.slice(1, 4)})`;
  };

  // Format symbol rendering
  const getSymbolText = (p: Player) => {
    if (symbolTheme === 'emoji') return p === 'X' ? '⚔️' : '🛡️';
    return p;
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-4 sm:mb-6">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4 items-stretch">
        {/* Player X Card */}
        <div
          className={`flex flex-col justify-between p-2.5 sm:p-4 rounded-2xl border transition-all duration-300 relative ${
            isPlayerXTurn
              ? 'bg-cyan-500/10 border-cyan-500 shadow-glow-cyan ring-1 ring-cyan-400 scale-[1.01]'
              : winner === 'X'
              ? 'bg-cyan-500/20 border-cyan-500 ring-2 ring-cyan-400'
              : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-1 mb-1 sm:mb-2">
              <span className="text-lg sm:text-2xl font-black text-cyan-500 flex items-center leading-none">
                {getSymbolText('X')}
              </span>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {isPlayerXHuman ? (
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                ) : (
                  <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                )}
                <span className="truncate">{getPlayerXLabel()}</span>
              </div>
            </div>

            {/* Active Turn Header Pill */}
            {isPlayerXTurn && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  Turn
                </span>
              </div>
            )}
          </div>

          <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              Score
            </span>
            <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
              {scores.X}
            </span>
          </div>
        </div>

        {/* Center Round State & Timer */}
        <div className="flex flex-col items-center justify-center p-1.5 sm:p-2 text-center rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60">
          {timeLeft !== null && timeLeft !== undefined && totalTime > 0 && status === 'in_progress' ? (
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 flex items-center justify-center font-bold text-xs sm:text-sm transition-colors ${
                  timeLeft <= 3
                    ? 'border-rose-500 text-rose-500 bg-rose-500/10 animate-bounce'
                    : 'border-indigo-500 text-indigo-500 bg-indigo-500/10'
                }`}
              >
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-0.5 inline" />
                {timeLeft}s
              </div>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Timer
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-[10px] sm:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">
                Draws
              </div>
              <div className="text-base sm:text-xl font-extrabold text-slate-700 dark:text-slate-300">
                {scores.draws}
              </div>
            </div>
          )}

          {/* Status badge */}
          <div className="mt-1.5 text-[10px] sm:text-[11px] font-semibold">
            {status === 'in_progress' ? (
              <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 whitespace-nowrap block">
                {currentPlayer === 'X' ? 'Player X' : 'Player O'}&apos;s turn
              </span>
            ) : status === 'won' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                <Flame className="w-3 h-3 flex-shrink-0" />
                {mode === 'ai'
                  ? winner === playerSymbol
                    ? 'You Won!'
                    : 'AI Won!'
                  : `Player ${winner} Won!`}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">
                Draw Match!
              </span>
            )}
          </div>
        </div>

        {/* Player O Card */}
        <div
          className={`flex flex-col justify-between p-2.5 sm:p-4 rounded-2xl border transition-all duration-300 relative ${
            isPlayerOTurn
              ? 'bg-rose-500/10 border-rose-500 shadow-glow-rose ring-1 ring-rose-400 scale-[1.01]'
              : winner === 'O'
              ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-400'
              : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div>
            <div className="flex items-center justify-between gap-1 mb-1 sm:mb-2">
              <span className="text-lg sm:text-2xl font-black text-rose-500 flex items-center leading-none">
                {getSymbolText('O')}
              </span>
              <div className="flex items-center gap-1 text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {isPlayerOHuman ? (
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                ) : (
                  <Bot className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                )}
                <span className="truncate">{getPlayerOLabel()}</span>
              </div>
            </div>

            {/* Active Turn Header Pill */}
            {isPlayerOTurn && (
              <div className="mb-2">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Turn
                </span>
              </div>
            )}
          </div>

          <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
            <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium">
              Score
            </span>
            <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white leading-none">
              {scores.O}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

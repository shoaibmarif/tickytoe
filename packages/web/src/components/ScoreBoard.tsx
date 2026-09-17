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
  isOnlineHost?: boolean;
  isOnlineConnected?: boolean;
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
  isOnlineHost = true,
  isOnlineConnected = false,
}) => {
  const isPlayerXTurn = status === 'in_progress' && currentPlayer === 'X';
  const isPlayerOTurn = status === 'in_progress' && currentPlayer === 'O';

  const isPlayerXHuman = mode === 'pvp' || mode === 'online' || playerSymbol === 'X';
  const isPlayerOHuman = mode === 'pvp' || mode === 'online' || playerSymbol === 'O';

  const getPlayerXLabel = () => {
    if (mode === 'online') {
      return isOnlineHost ? 'You (X)' : 'Opponent (X)';
    }
    if (mode === 'pvp') return 'Player 1';
    return playerSymbol === 'X' ? 'You' : 'AI';
  };

  const getPlayerOLabel = () => {
    if (mode === 'online') {
      return !isOnlineHost ? 'You (O)' : 'Opponent (O)';
    }
    if (mode === 'pvp') return 'Player 2';
    return playerSymbol === 'O'
      ? 'You'
      : `AI (${difficulty.slice(0, 1).toUpperCase() + difficulty.slice(1)})`;
  };

  // Format symbol rendering
  const getSymbolText = (p: Player) => {
    if (symbolTheme === 'emoji') return p === 'X' ? '⚔️' : '🛡️';
    return p;
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-6">
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
        {/* Player X Card */}
        <div
          className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300 relative ${
            isPlayerXTurn
              ? 'bg-cyan-500/10 border-cyan-500 shadow-glow-cyan scale-[1.02]'
              : winner === 'X'
              ? 'bg-cyan-500/20 border-cyan-500 ring-2 ring-cyan-400'
              : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xl sm:text-2xl font-black text-cyan-500 flex items-center gap-1.5">
              {getSymbolText('X')}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isPlayerXHuman ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              <span>{getPlayerXLabel()}</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Score</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {scores.X}
            </span>
          </div>
          {isPlayerXTurn && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cyan-500 text-[10px] font-bold text-slate-950 uppercase tracking-wider animate-pulse">
              Active Turn
            </div>
          )}
        </div>

        {/* Center Round State & Timer */}
        <div className="flex flex-col items-center justify-center p-2 text-center">
          {timeLeft !== null && timeLeft !== undefined && totalTime > 0 && status === 'in_progress' ? (
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-11 h-11 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors ${
                  timeLeft <= 3
                    ? 'border-rose-500 text-rose-500 bg-rose-500/10 animate-bounce'
                    : 'border-indigo-500 text-indigo-500 bg-indigo-500/10'
                }`}
              >
                <Clock className="w-3.5 h-3.5 mr-0.5 inline" />
                {timeLeft}s
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Timer
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">
                Draws
              </div>
              <div className="text-lg sm:text-xl font-extrabold text-slate-700 dark:text-slate-300">
                {scores.draws}
              </div>
            </div>
          )}

          {/* Status badge */}
          <div className="mt-2 text-[11px] font-semibold">
            {mode === 'online' && (
              <div className="mb-1 flex items-center justify-center gap-1">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isOnlineConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'
                  }`}
                />
                <span className="text-[10px] text-slate-400 font-medium">
                  {isOnlineConnected ? 'P2P Live' : 'P2P Waiting'}
                </span>
              </div>
            )}
            {status === 'in_progress' ? (
              <span className="text-slate-600 dark:text-slate-300">
                {currentPlayer === 'X' ? 'Player X' : 'Player O'}&apos;s turn
              </span>
            ) : status === 'won' ? (
              <span className="text-emerald-500 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                {mode === 'online'
                  ? winner === (isOnlineHost ? 'X' : 'O')
                    ? 'You Won!'
                    : 'Opponent Won!'
                  : winner === playerSymbol && mode === 'ai'
                  ? 'You Won!'
                  : `Player ${winner} Won!`}
              </span>
            ) : (
              <span className="text-amber-500">Draw Match!</span>
            )}
          </div>
        </div>

        {/* Player O Card */}
        <div
          className={`p-3 sm:p-4 rounded-2xl border transition-all duration-300 relative ${
            isPlayerOTurn
              ? 'bg-rose-500/10 border-rose-500 shadow-glow-rose scale-[1.02]'
              : winner === 'O'
              ? 'bg-rose-500/20 border-rose-500 ring-2 ring-rose-400'
              : 'bg-white/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xl sm:text-2xl font-black text-rose-500 flex items-center gap-1.5">
              {getSymbolText('O')}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {isPlayerOHuman ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              <span>{getPlayerOLabel()}</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Score</span>
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {scores.O}
            </span>
          </div>
          {isPlayerOTurn && (
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-rose-500 text-[10px] font-bold text-white uppercase tracking-wider animate-pulse">
              Active Turn
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { X, Trophy, Flame, Award, Trash2 } from 'lucide-react';
import { GameStats } from '@tictactoe/core';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
  onResetStats: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
  onResetStats,
}) => {
  if (!isOpen) return null;

  const winRate =
    stats.totalGames > 0
      ? Math.round(((stats.xWins + stats.oWins) / (stats.totalGames * 2)) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
              Game Statistics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Matches
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5 block whitespace-nowrap">
                {stats.totalGames}
              </span>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Win Rate
              </span>
              <span className="text-xl sm:text-2xl font-black text-indigo-500 mt-0.5 block whitespace-nowrap">
                {winRate}%
              </span>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <Flame className="w-3 h-3 text-amber-500" /> Streak
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-500 mt-0.5 block whitespace-nowrap">
                {stats.currentStreak}
              </span>
            </div>

            <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <Award className="w-3 h-3 text-rose-500" /> Best
              </span>
              <span className="text-xl sm:text-2xl font-black text-rose-500 mt-0.5 block whitespace-nowrap">
                {stats.bestStreak}
              </span>
            </div>
          </div>

          {/* Breakdown Bar */}
          <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-800/60 space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Result Distribution
            </span>
            <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold mb-1">
              <span className="text-cyan-500">X Wins: {stats.xWins}</span>
              <span className="text-slate-400">Draws: {stats.draws}</span>
              <span className="text-rose-500">O Wins: {stats.oWins}</span>
            </div>
            <div className="h-3 rounded-full bg-slate-200 dark:bg-slate-800 flex overflow-hidden">
              {stats.totalGames > 0 ? (
                <>
                  <div
                    style={{ width: `${(stats.xWins / stats.totalGames) * 100}%` }}
                    className="bg-cyan-500 h-full transition-all"
                  />
                  <div
                    style={{ width: `${(stats.draws / stats.totalGames) * 100}%` }}
                    className="bg-slate-400 h-full transition-all"
                  />
                  <div
                    style={{ width: `${(stats.oWins / stats.totalGames) * 100}%` }}
                    className="bg-rose-500 h-full transition-all"
                  />
                </>
              ) : (
                <div className="w-full bg-slate-300 dark:bg-slate-800 h-full" />
              )}
            </div>
          </div>

          {/* Match History */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Recent Matches
            </span>
            {stats.history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4 italic">
                No matches played yet. Play a game to see your history!
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {stats.history.slice(-8).reverse().map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 text-xs gap-1.5 sm:gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-black px-2 py-0.5 rounded-md ${
                          item.winner === 'X'
                            ? 'bg-cyan-500/20 text-cyan-500'
                            : item.winner === 'O'
                            ? 'bg-rose-500/20 text-rose-500'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}
                      >
                        {item.winner === 'draw' ? 'DRAW' : `${item.winner} WON`}
                      </span>
                      <span className="text-slate-500 capitalize">
                        {item.mode === 'ai' ? `vs AI (${item.difficulty})` : '2-Player'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] sm:text-xs">
                      <span>{item.gridSize}x{item.gridSize}</span>
                      <span>{item.totalMoves} moves</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              if (window.confirm('Reset all match history and scores?')) {
                onResetStats();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Stats</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  Share2,
  Check,
  Sparkles,
  RotateCcw,
  LogOut,
  Clock,
  Zap,
} from 'lucide-react';
import { Player } from '@tictactoe/core';
import { OnlineConnectionStatus } from '../hooks/useWebRTC.js';

interface OnlineStatusBannerProps {
  status: OnlineConnectionStatus;
  roomCode: string | null;
  isHost: boolean;
  mySymbol: Player;
  opponentSymbol: Player;
  currentPlayer: Player;
  gameStatus: 'in_progress' | 'won' | 'draw';
  latency: number | null;
  lastEmote: { emoji: string; id: number } | null;
  rematchRequestedByOpponent: boolean;
  forfeitMessage?: string | null;
  onOpenLobby: () => void;
  onSendEmote: (emoji: string) => void;
  onSendRematchRequest: () => void;
  onSendRematchAccept: () => void;
  onDisconnect: () => void;
}

const QUICK_EMOTES = ['👏', '🔥', '⚔️', '🤯', '🎉', '😎'];

export const OnlineStatusBanner: React.FC<OnlineStatusBannerProps> = ({
  status,
  roomCode,
  isHost,
  mySymbol,
  opponentSymbol,
  currentPlayer,
  gameStatus,
  latency,
  lastEmote,
  rematchRequestedByOpponent,
  forfeitMessage,
  onOpenLobby,
  onSendEmote,
  onSendRematchRequest,
  onSendRematchAccept,
  onDisconnect,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [displayedEmote, setDisplayedEmote] = useState<{ emoji: string; id: number } | null>(null);

  // Floating emote pop-in
  useEffect(() => {
    if (lastEmote) {
      setDisplayedEmote(lastEmote);
      const timer = setTimeout(() => {
        setDisplayedEmote(null);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [lastEmote]);

  const handleCopyLink = () => {
    if (!roomCode) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const isMyTurn = gameStatus === 'in_progress' && currentPlayer === mySymbol;

  return (
    <div className="relative w-full max-w-xl mx-auto mb-4">
      {/* Floating incoming emote animation */}
      {displayedEmote && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 animate-bounce pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl text-2xl">
            <span>{displayedEmote.emoji}</span>
          </div>
        </div>
      )}

      <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg transition-all space-y-2.5">
        {/* Top Line: Connection Badge, Room Code, Ping, Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            {status === 'connected' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Opponent Connected</span>
                {latency !== null && (
                  <span className="text-[10px] text-slate-400 font-mono ml-1">
                    ({latency}ms)
                  </span>
                )}
              </div>
            ) : status === 'waiting' || status === 'creating' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span>Waiting for Opponent...</span>
              </div>
            ) : status === 'connecting' ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold">
                <Wifi className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting...</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-bold">
                <WifiOff className="w-3.5 h-3.5" />
                <span>Opponent Disconnected</span>
              </div>
            )}

            {/* Room Code Badge */}
            {roomCode && (
              <button
                onClick={onOpenLobby}
                className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="View Room Details"
              >
                Room #{roomCode}
              </button>
            )}
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1.5">
            {roomCode && status !== 'connected' && (
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 font-semibold transition-all text-[11px]"
              >
                {copiedLink ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                <span>{copiedLink ? 'Copied' : 'Invite'}</span>
              </button>
            )}

            <button
              onClick={onOpenLobby}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition-all text-[11px]"
            >
              Lobby
            </button>

            <button
              onClick={onDisconnect}
              className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              title="Leave Room"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Forfeit Victory Banner */}
        {forfeitMessage && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold text-xs animate-fadeIn">
            <Sparkles className="w-4 h-4 flex-shrink-0 animate-bounce" />
            <span>{forfeitMessage}</span>
          </div>
        )}

        {/* Turn & Player Role Banner */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
            <span>You:</span>
            <span
              className={`font-black px-1.5 py-0.5 rounded-md ${
                mySymbol === 'X'
                  ? 'text-cyan-500 bg-cyan-500/10'
                  : 'text-rose-500 bg-rose-500/10'
              }`}
            >
              Player {mySymbol} ({isHost ? 'Host' : 'Guest'})
            </span>
            <span className="text-slate-400 text-[10px]">vs</span>
            <span
              className={`font-black px-1.5 py-0.5 rounded-md ${
                opponentSymbol === 'X'
                  ? 'text-cyan-500 bg-cyan-500/10'
                  : 'text-rose-500 bg-rose-500/10'
              }`}
            >
              Player {opponentSymbol}
            </span>
          </div>

          {status === 'connected' && (
            <div>
              {isMyTurn ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-black text-[11px] shadow-sm animate-pulse">
                  <Zap className="w-3 h-3" />
                  Your Turn!
                </span>
              ) : gameStatus === 'in_progress' ? (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold text-[11px]">
                  <Clock className="w-3 h-3 animate-spin" />
                  Opponent's Turn...
                </span>
              ) : null}
            </div>
          )}
        </div>

        {/* Rematch Proposal / Request Section */}
        {gameStatus !== 'in_progress' && status === 'connected' && (
          rematchRequestedByOpponent ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs animate-fadeIn">
              <span className="font-semibold text-indigo-600 dark:text-indigo-300">
                Opponent wants a rematch!
              </span>
              <button
                onClick={onSendRematchAccept}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo active:scale-95 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Accept Rematch</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs">
              <span className="text-slate-500 dark:text-slate-400">Match concluded</span>
              <button
                onClick={onSendRematchRequest}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-glow-indigo active:scale-95 transition-all"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Request Rematch</span>
              </button>
            </div>
          )
        )}

        {/* Quick Emotes & Reaction Bar (When Connected) */}
        {status === 'connected' && (
          <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Send Reaction:
            </span>
            <div className="flex items-center gap-1">
              {QUICK_EMOTES.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => onSendEmote(emoji)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-125 transition-transform text-sm"
                  title={`Send ${emoji}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

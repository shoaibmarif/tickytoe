import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  Radio,
  Share2,
  Users,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { OnlineConnectionStatus } from '../hooks/useWebRTC.js';

interface OnlineLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: OnlineConnectionStatus;
  roomCode: string | null;
  isHost?: boolean;
  errorMessage: string | null;
  onCreateRoom: () => Promise<string>;
  onJoinRoom: (code: string) => Promise<void>;
}

export const OnlineLobbyModal: React.FC<OnlineLobbyModalProps> = ({
  isOpen,
  onClose,
  status,
  roomCode,
  errorMessage,
  onCreateRoom,
  onJoinRoom,
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [inputCode, setInputCode] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-create room when opening modal in create tab if idle
  useEffect(() => {
    if (isOpen && tab === 'create' && status === 'idle' && !roomCode) {
      onCreateRoom().catch(() => {});
    }
  }, [isOpen, tab, status, roomCode, onCreateRoom]);

  // If connected, automatically close modal after brief delay
  useEffect(() => {
    if (status === 'connected' && isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [status, isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (!roomCode) return;
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    setIsSubmitting(true);
    try {
      await onJoinRoom(inputCode);
    } catch {
      // Error handled via errorMessage prop
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#111726] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-glow-indigo">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Online P2P Match
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  2 Players Max
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct browser-to-browser encrypted WebRTC match
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation: Only Create Room & Join Room */}
        <div className="flex items-center gap-1.5 p-1 mx-6 mt-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/40 text-xs font-semibold">
          <button
            onClick={() => setTab('create')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              tab === 'create'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Create Room</span>
          </button>
          <button
            onClick={() => setTab('join')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all ${
              tab === 'join'
                ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Join Room</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Global Status / Error Alerts */}
          {status === 'connected' && (
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-medium animate-fadeIn">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <div>
                <span className="font-bold">Opponent Connected!</span> Starting your match now...
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-start gap-2 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs animate-fadeIn">
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {/* TAB 1: CREATE ROOM */}
          {tab === 'create' && (
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  Share this 6-Digit Room Code
                </span>

                {/* Big 6-digit Code Display */}
                <div className="flex items-center justify-center gap-2">
                  {roomCode ? (
                    roomCode.split('').map((digit, idx) => (
                      <span
                        key={idx}
                        className="w-10 h-12 sm:w-12 sm:h-14 rounded-xl bg-white dark:bg-slate-800 border-2 border-indigo-500/40 text-slate-900 dark:text-white font-mono font-black text-2xl sm:text-3xl flex items-center justify-center shadow-inner"
                      >
                        {digit}
                      </span>
                    ))
                  ) : (
                    <div className="h-12 flex items-center justify-center text-sm text-slate-400 animate-pulse">
                      Generating Room Code...
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={handleCopyCode}
                    disabled={!roomCode}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-glow-indigo transition-all active:scale-95 disabled:opacity-50"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    disabled={!roomCode}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold text-xs transition-all active:scale-95 disabled:opacity-50"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Invite Link'}</span>
                  </button>
                </div>
              </div>

              {/* Waiting Radar Pulse Animation */}
              <div className="flex items-center justify-center gap-2.5 p-3 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500" />
                </span>
                <span>Waiting for 1 opponent to join (max 2 players)...</span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
                <span>
                  You will play as: <strong className="text-cyan-500">Player X (First Move)</strong>
                </span>
                <button
                  onClick={() => onCreateRoom()}
                  className="text-indigo-500 hover:underline font-semibold"
                >
                  Generate New Code
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: JOIN ROOM */}
          {tab === 'join' && (
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">
                  Enter 6-Digit Room Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 849201"
                  className="w-full text-center tracking-[0.4em] font-mono font-black text-2xl sm:text-3xl py-3 px-4 rounded-xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none text-slate-900 dark:text-white transition-all shadow-inner"
                  autoFocus
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Ask host for their 6-digit room code. Maximum 2 players per room.
                </p>
              </div>

              <button
                type="submit"
                disabled={inputCode.length !== 6 || isSubmitting || status === 'connecting'}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm shadow-glow-indigo transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'connecting' || isSubmitting ? (
                  <>
                    <Wifi className="w-4 h-4 animate-spin" />
                    <span>Connecting to Room...</span>
                  </>
                ) : (
                  <>
                    <span>Join Game</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-slate-400 text-center">
                You will play as: <strong className="text-rose-500">Player O (Second Move)</strong>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

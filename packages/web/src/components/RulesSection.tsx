import React, { useState } from 'react';
import {
  ChevronDown,
  Sparkles,
  BookOpen,
  Brain,
  Zap,
  HelpCircle,
  ShieldCheck,
  Radio,
  Clock,
  Volume2,
  Undo2,
  Layers,
  FileCode2,
  Terminal,
} from 'lucide-react';

export const RulesSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const features = [
    {
      icon: <Layers className="w-5 h-5 text-cyan-500" />,
      title: '3 Dynamic Grid Sizes',
      desc: 'Play Classic 3x3 (3-in-a-row), Expanded 4x4 (4-in-a-row), or Epic 5x5 (4-in-a-row Gomoku-style).',
    },
    {
      icon: <Brain className="w-5 h-5 text-indigo-500" />,
      title: '4 AI Difficulty Levels',
      desc: 'From Easy and Medium to Hard and Master (Minimax decision algorithm with alpha-beta pruning).',
    },
    {
      icon: <Radio className="w-5 h-5 text-rose-500" />,
      title: 'P2P Online Multiplayer',
      desc: 'Serverless WebRTC direct browser-to-browser connections with 6-digit room codes, 2-player capacity, 5s heartbeats, and forfeit on tab close.',
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      title: 'Blitz Speed Turn Timer',
      desc: 'Configurable countdown timers (5s, 10s, 15s) with tension-building procedural audio ticks and auto-move on timeout.',
    },
    {
      icon: <Volume2 className="w-5 h-5 text-emerald-500" />,
      title: 'Procedural Web Audio API',
      desc: 'Zero audio assets downloaded: 100% synthesized sound waves for moves, victories, draws, and countdowns with custom volume controls.',
    },
    {
      icon: <Undo2 className="w-5 h-5 text-purple-500" />,
      title: 'Move History & 1-Click Undo',
      desc: 'Full move-by-move audit log with precise timestamps and non-destructive undo support in single and local modes.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
      title: 'Custom Themes & Symbols',
      desc: 'High-contrast Light Mode, deep OLED Dark Mode, and symbol themes (Classic X & O, Emoji ⚔️ & 🛡️).',
    },
    {
      icon: <FileCode2 className="w-5 h-5 text-indigo-400" />,
      title: 'Google Chrome Extension (MV3)',
      desc: 'Full offline sandbox extension for instant popup matches without internet connectivity or website tracking.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: '100% Private & Zero-Log',
      desc: 'No user accounts, no tracking cookies, and zero server logging. Local HTML5 storage with one-click data reset.',
    },
  ];

  const references = [
    {
      title: 'Historical Origins & Etymology',
      desc: 'Tic Tac Toe traces back to ancient civilizations. An early precursor known as Terni Lapilli was played across the Roman Empire (~1st century BC), where players moved three pebbles on chalk grids. In ancient Egypt, boards etched into temple roofs date to ~1400 BC (Three Men’s Morris). The modern term "Noughts and Crosses" was first recorded in Britain in 1864 in Notes and Queries, while "Tic-tac-toe" emerged in 20th-century America.',
    },
    {
      title: 'Mathematical Theory & Combinatorics',
      desc: '3x3 Tic Tac Toe is mathematically classified as a finite, deterministic, two-player, zero-sum game of perfect information. There are 3^9 = 19,683 potential board states, but only 5,478 are legally reachable. Taking into account 8 rotational and reflective symmetries, there are only 765 unique game states. The game contains 138 terminal winning positions for Player X, 91 for Player O, and 44 distinct terminal draw positions. It has been mathematically proven that optimal play by both players unconditionally guarantees a draw.',
    },
    {
      title: 'Computer Science: Minimax & Alpha-Beta Pruning',
      desc: 'Tic Tac Toe was among the very first games implemented on digital computers. In 1952, Alexander S. Douglas developed OXO on the EDSAC computer at Cambridge University. Modern game engines, including tickytoe, use the Minimax algorithm formulated by John von Neumann (1928), augmented with Alpha-Beta Pruning (John McCarthy, 1956) to recursively evaluate game trees and select minimax-optimal moves with O(b^(d/2)) search efficiency.',
    },
    {
      title: 'WebRTC Networking & Cryptographic Standards',
      desc: 'tickytoe online multiplayer implements standard IETF & W3C specifications for real-time browser communication: RFC 8825 (Overview: Real-Time Protocols for WebRTC), RFC 8827 (WebRTC Security Architecture), and RFC 5389 (Session Traversal Utilities for NAT - STUN). DataChannels utilize Datagram Transport Layer Security (DTLS) and Stream Control Transmission Protocol (SCTP) for end-to-end encrypted packet transmission.',
    },
  ];

  const faqs = [
    {
      q: 'Can the Unbeatable AI be defeated on the 3x3 board?',
      a: 'Mathematically, 3x3 Tic Tac Toe is a zero-sum solved game. When the AI utilizes Minimax with alpha-beta pruning, optimal human play will always result in a draw. The AI evaluates every possible future move and will never make a tactical error.',
    },
    {
      q: 'How do the 4x4 and 5x5 grid modes work in tickytoe?',
      a: 'In 4x4 mode, the objective is to connect 4 consecutive marks horizontally, vertically, or diagonally across 16 cells. In 5x5 mode, players aim to align 4 consecutive marks across 25 cells. This creates deeper tactical possibilities reminiscent of Gomoku and Five-in-a-Row.',
    },
    {
      q: 'How does Online P2P multiplayer work?',
      a: 'Online matches connect directly between browsers using WebRTC without routing game moves through intermediate application servers. One player creates a room and shares the 6-digit code. Each room supports a maximum of 2 players, verifies connection health every 5 seconds, and awards an automatic forfeit victory if a player closes their tab or disconnects.',
    },
    {
      q: 'Can I play tickytoe offline or install it as an extension?',
      a: 'Yes! tickytoe functions completely offline. You can install it on your device as a Progressive Web App (PWA) or load the official tickytoe Google Chrome Extension (Manifest V3) for instant access directly from your browser toolbar.',
    },
    {
      q: 'Does tickytoe store my personal data or gameplay history?',
      a: 'No. tickytoe employs a strict zero-log architecture. No accounts, cookies, analytics pixels, or backend databases exist. Your match statistics and audio settings remain stored locally on your device in HTML5 LocalStorage and can be reset at any time.',
    },
  ];

  return (
    <section className="w-full max-w-5xl mx-auto mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800/80 space-y-16">
      {/* 1. All Features Provided */}
      <div>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Feature Suite</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Everything Built Into tickytoe
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-1">
            Engineered with modern web technologies, sensory audio feedback, and client-side privacy.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-sm space-y-2 hover:border-indigo-500/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm font-heading">
                {f.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Historical & Mathematical References */}
      <div>
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Mathematical & Historical Compendium</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            The Science & History of Tic Tac Toe
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-1">
            Explore the mathematics, game theory, and computational history behind the timeless classic.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {references.map((ref, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md space-y-2"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <span>Reference {i + 1}</span>
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base font-heading">
                {ref.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {ref.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Strategies & Rules Cards */}
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Brain className="w-3.5 h-3.5" />
            <span>Gameplay Tactics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-heading">
            Mastering The Grid
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 font-heading">
              Classic 3x3 Strategy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Always claim the center cell on turn one if available, or take a corner. Create double-threat forks where two winning paths are open at once to guarantee victory against human opponents.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 font-heading">
              Tactical 4x4 Grid
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              With 16 squares and 4-in-a-row to win, central 2x2 control is decisive. Build open-ended rows of 3 to force unblockable victory sequences on your subsequent turn.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5 font-heading">
              Dynamic 5x5 Grid
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Connecting 4 on a 5x5 board requires multi-directional defense. Watch diagonal intersections carefully and counter-attack before opponents establish uninterrupted alignments.
            </p>
          </div>
        </div>
      </div>

      {/* 4. FAQ Accordion */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-5 py-4 text-left flex items-center justify-between font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openFaq === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-5 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

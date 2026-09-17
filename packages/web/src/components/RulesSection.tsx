import React, { useState } from 'react';
import { ChevronDown, Sparkles, BookOpen, Brain, Zap, HelpCircle } from 'lucide-react';

export const RulesSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Can the Unbeatable (Master) AI be beaten in 3x3?',
      a: 'Mathematically, standard 3x3 Tic Tac Toe is a zero-sum solved game. When the computer uses the Minimax decision algorithm with alpha-beta pruning, optimal human play will always lead to a draw. The AI will never make an error or lose.'
    },
    {
      q: 'How do the 4x4 and 5x5 grid modes work?',
      a: 'In 4x4 mode, the objective is to connect 4 in a row (horizontally, vertically, or diagonally). In 5x5 mode, players aim to align 4 consecutive marks in a row. This creates faster-paced, highly tactical gameplay akin to Gomoku.'
    },
    {
      q: 'Can I play Tic Tac Toe with a friend on the same computer or phone?',
      a: 'Yes! Simply toggle the mode to "2 Players" in the control bar. You can pass the device back and forth or take turns playing with the mouse or keyboard.'
    },
    {
      q: 'Does this game store my match data or history online?',
      a: 'No. All gameplay state, audio generation, and match statistics run 100% locally inside your browser using HTML5 LocalStorage. Zero telemetry, zero tracking, and zero ads.'
    }
  ];

  return (
    <section className="w-full max-w-4xl mx-auto mt-16 pt-12 border-t border-slate-200/80 dark:border-slate-800/80 space-y-12">
      {/* Strategies & Rules Cards */}
      <div>
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Gameplay & Master Strategies</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Mastering The Grid
          </h2>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
              Classic 3x3 Strategy
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Always claim the center cell on turn one if available, or a corner cell. Create double-threat forks where two winning paths are open at once.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
              Tactical 4x4 Grid
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              With 16 squares and 4-in-a-row to win, central 2x2 control is decisive. Build open-ended rows of 3 to force unblockable victory sequences.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-1.5">
              Dynamic 5x5 Grid
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Connecting 4 on a 5x5 board requires multi-directional defense. Watch diagonal intersections and counter-attack before opponents establish 3 uninterrupted marks.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
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

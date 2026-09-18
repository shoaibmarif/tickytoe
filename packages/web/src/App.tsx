import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Difficulty,
  GameMode,
  GameStats,
  GridSize,
  TicTacToeEngine,
} from '@tictactoe/core';
import { Header } from './components/Header.js';
import { ScoreBoard } from './components/ScoreBoard.js';
import { GameBoard } from './components/GameBoard.js';
import { GameControls } from './components/GameControls.js';
import { StatsModal } from './components/StatsModal.js';
import { SettingsModal } from './components/SettingsModal.js';
import { RulesSection } from './components/RulesSection.js';
import { PrivacyPolicy } from './components/PrivacyPolicy.js';
import { NotFound } from './components/NotFound.js';
import { Footer } from './components/Footer.js';
import { useTheme } from './hooks/useTheme.js';
import { useAudio } from './hooks/useAudio.js';
import { useConfetti } from './hooks/useConfetti.js';
import { WebSettings } from './types.js';

const INITIAL_STATS: GameStats = {
  totalGames: 0,
  xWins: 0,
  oWins: 0,
  draws: 0,
  currentStreak: 0,
  bestStreak: 0,
  history: [],
};

const INITIAL_SETTINGS: WebSettings = {
  symbolTheme: 'classic',
  turnTimerSeconds: 0, // off by default
  soundEnabled: true,
  volume: 0.5,
  playerSymbol: 'X',
};

export const App: React.FC = () => {
  const { theme, isDark, toggleTheme } = useTheme();

  // Settings
  const [settings, setSettings] = useState<WebSettings>(() => {
    if (typeof window === 'undefined') return INITIAL_SETTINGS;
    try {
      const saved = localStorage.getItem('ttt_settings');
      return saved ? { ...INITIAL_SETTINGS, ...JSON.parse(saved) } : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  const updateSettings = (partial: Partial<WebSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      localStorage.setItem('ttt_settings', JSON.stringify(next));
      return next;
    });
  };

  // Stats
  const [stats, setStats] = useState<GameStats>(() => {
    if (typeof window === 'undefined') return INITIAL_STATS;
    try {
      const saved = localStorage.getItem('ttt_stats');
      return saved ? { ...INITIAL_STATS, ...JSON.parse(saved) } : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const saveStats = (newStats: GameStats) => {
    setStats(newStats);
    localStorage.setItem('ttt_stats', JSON.stringify(newStats));
  };

  const resetStats = () => {
    saveStats(INITIAL_STATS);
  };

  // Sound & Confetti
  const { playMove, playWin, playDraw, playClick, playTick } = useAudio(
    settings.soundEnabled,
    settings.volume
  );
  const { triggerConfetti } = useConfetti();

  // Modals
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Engine & Game State
  const engineRef = useRef<TicTacToeEngine>(
    new TicTacToeEngine({
      gridSize: 3,
      mode: 'ai',
      difficulty: 'unbeatable',
      playerSymbol: settings.playerSymbol,
    })
  );

  const [gameState, setGameState] = useState(engineRef.current.getState());
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  // Speed Timer
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Synchronize scores from stats
  useEffect(() => {
    setScores({
      X: stats.xWins,
      O: stats.oWins,
      draws: stats.draws,
    });
  }, [stats]);

  // Turn Timer effect
  useEffect(() => {
    if (settings.turnTimerSeconds <= 0 || gameState.status !== 'in_progress') {
      setTimeLeft(null);
      return;
    }

    setTimeLeft(settings.turnTimerSeconds);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          // Time expired! Auto-make random move for active player
          playTick();
          const emptyIndices = gameState.board
            .map((v, i) => (v === null ? i : -1))
            .filter((i) => i !== -1);
          if (emptyIndices.length > 0) {
            const randomMove = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
            const nextState = engineRef.current.makeMove(randomMove);
            setGameState(nextState);
          }
          return settings.turnTimerSeconds;
        }
        if (prev <= 4) {
          playTick();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState.currentPlayer, gameState.status, settings.turnTimerSeconds, playTick]);

  // Handle Game Result (Win/Draw recording)
  const handleGameCompletion = useCallback(
    (nextState: typeof gameState) => {
      if (nextState.status === 'won' && nextState.winner) {
        triggerConfetti();
        playWin();

        const isHumanWinner =
          nextState.mode === 'pvp' || nextState.winner === settings.playerSymbol;

        setStats((prev) => {
          const newStreak = isHumanWinner ? prev.currentStreak + 1 : 0;
          const updated: GameStats = {
            ...prev,
            totalGames: prev.totalGames + 1,
            xWins: nextState.winner === 'X' ? prev.xWins + 1 : prev.xWins,
            oWins: nextState.winner === 'O' ? prev.oWins + 1 : prev.oWins,
            currentStreak: newStreak,
            bestStreak: Math.max(prev.bestStreak, newStreak),
            history: [
              ...prev.history,
              {
                id: Date.now().toString(),
                winner: nextState.winner!,
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                mode: nextState.mode,
                difficulty: nextState.difficulty,
                gridSize: nextState.gridSize,
                totalMoves: nextState.history.length,
              },
            ],
          };
          localStorage.setItem('ttt_stats', JSON.stringify(updated));
          return updated;
        });
      } else if (nextState.status === 'draw') {
        playDraw();
        setStats((prev) => {
          const updated: GameStats = {
            ...prev,
            totalGames: prev.totalGames + 1,
            draws: prev.draws + 1,
            currentStreak: 0,
            history: [
              ...prev.history,
              {
                id: Date.now().toString(),
                winner: 'draw',
                date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                mode: nextState.mode,
                difficulty: nextState.difficulty,
                gridSize: nextState.gridSize,
                totalMoves: nextState.history.length,
              },
            ],
          };
          localStorage.setItem('ttt_stats', JSON.stringify(updated));
          return updated;
        });
      }
    },
    [settings.playerSymbol, playWin, playDraw, triggerConfetti]
  );

  // Human cell click handler
  const handleCellClick = (index: number) => {
    if (gameState.status !== 'in_progress') return;
    if (gameState.board[index] !== null) return;

    // In AI mode, prevent human from clicking when it's AI's turn
    if (gameState.mode === 'ai' && gameState.currentPlayer !== settings.playerSymbol) {
      return;
    }

    playMove(gameState.currentPlayer);
    const nextState = engineRef.current.makeMove(index);
    setGameState(nextState);

    if (nextState.status !== 'in_progress') {
      handleGameCompletion(nextState);
    }
  };

  // AI Turn Execution effect
  useEffect(() => {
    if (
      gameState.mode === 'ai' &&
      gameState.status === 'in_progress' &&
      gameState.currentPlayer !== settings.playerSymbol
    ) {
      const timer = setTimeout(() => {
        const aiSymbol = settings.playerSymbol === 'X' ? 'O' : 'X';
        playMove(aiSymbol);
        const nextState = engineRef.current.makeAIMove();
        setGameState(nextState);

        if (nextState.status !== 'in_progress') {
          handleGameCompletion(nextState);
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [gameState, settings.playerSymbol, playMove, handleGameCompletion]);

  // Controls Handlers
  const handleNewGame = () => {
    playClick();
    const nextState = engineRef.current.reset({
      playerSymbol: settings.playerSymbol,
    });
    setGameState(nextState);
  };

  const handleUndo = () => {
    playClick();
    const nextState = engineRef.current.undo();
    setGameState(nextState);
  };

  const handleModeChange = (mode: GameMode) => {
    playClick();
    const nextState = engineRef.current.reset({
      mode,
      playerSymbol: settings.playerSymbol,
    });
    setGameState(nextState);
  };

  const handleGridSizeChange = (gridSize: GridSize) => {
    playClick();
    const nextState = engineRef.current.reset({
      gridSize,
      mode: gameState.mode,
      playerSymbol: settings.playerSymbol,
    });
    setGameState(nextState);
  };

  const handleDifficultyChange = (difficulty: Difficulty) => {
    playClick();
    const nextState = engineRef.current.reset({
      difficulty,
      playerSymbol: settings.playerSymbol,
    });
    setGameState(nextState);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is in an input or modal is open
      if (isStatsOpen || isSettingsOpen) {
        if (e.key === 'Escape') {
          setIsStatsOpen(false);
          setIsSettingsOpen(false);
        }
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        handleNewGame();
      } else if (e.key === 'u' || e.key === 'U') {
        if (gameState.history.length > 0) {
          handleUndo();
        }
      } else if (e.key === 's' || e.key === 'S') {
        setIsStatsOpen(true);
      } else if (e.key === 'm' || e.key === 'M') {
        updateSettings({ soundEnabled: !settings.soundEnabled });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStatsOpen, isSettingsOpen, gameState.history.length, settings.soundEnabled]);

  // SPA Route Matching
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const isPrivacyRoute =
    pathname === '/privacy' || pathname === '/privacy/' || pathname === '/privacy.html';
  const isKnownRoute = pathname === '/' || pathname === '' || isPrivacyRoute;

  if (!isKnownRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col transition-colors">
        <Header
          theme={theme}
          isDark={isDark}
          onThemeToggle={toggleTheme}
          soundEnabled={settings.soundEnabled}
          onSoundToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          currentStreak={stats.currentStreak}
        />
        <main className="max-w-7xl mx-auto px-3 sm:px-6 py-8 flex-1 w-full flex items-center justify-center">
          <NotFound />
        </main>
        <Footer />
      </div>
    );
  }

  if (isPrivacyRoute) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col transition-colors">
        <Header
          theme={theme}
          isDark={isDark}
          onThemeToggle={toggleTheme}
          soundEnabled={settings.soundEnabled}
          onSoundToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
          onOpenStats={() => setIsStatsOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          currentStreak={stats.currentStreak}
        />
        <main className="max-w-4xl mx-auto px-3 sm:px-6 py-6 sm:py-12 flex-1 w-full">
          <PrivacyPolicy />
        </main>
        <Footer />
      </div>
    );
  }

  // Main Game Workbench
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-zinc-100 flex flex-col transition-colors">
      <Header
        theme={theme}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        soundEnabled={settings.soundEnabled}
        onSoundToggle={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        currentStreak={stats.currentStreak}
      />

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8 flex-1 w-full">
        {/* Score Board */}
        <ScoreBoard
          currentPlayer={gameState.currentPlayer}
          status={gameState.status}
          winner={gameState.winner}
          mode={gameState.mode}
          difficulty={gameState.difficulty}
          playerSymbol={settings.playerSymbol}
          scores={scores}
          symbolTheme={settings.symbolTheme}
          timeLeft={timeLeft}
          totalTime={settings.turnTimerSeconds}
        />

        {/* Interactive Board */}
        <GameBoard
          board={gameState.board}
          gridSize={gameState.gridSize}
          onCellClick={handleCellClick}
          winLine={gameState.winLine}
          winner={gameState.winner}
          symbolTheme={settings.symbolTheme}
          disabled={
            gameState.status !== 'in_progress' ||
            (gameState.mode === 'ai' && gameState.currentPlayer !== settings.playerSymbol)
          }
          currentPlayer={gameState.currentPlayer}
        />

        {/* Controls */}
        <GameControls
          mode={gameState.mode}
          onModeChange={handleModeChange}
          gridSize={gameState.gridSize}
          onGridSizeChange={handleGridSizeChange}
          difficulty={gameState.difficulty}
          onDifficultyChange={handleDifficultyChange}
          onNewGame={handleNewGame}
          onUndo={handleUndo}
          canUndo={gameState.history.length > 0}
        />

        {/* Strategy Guide & FAQs for SEO */}
        <RulesSection />
      </main>

      <Footer />

      {/* Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        stats={stats}
        onResetStats={resetStats}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
};


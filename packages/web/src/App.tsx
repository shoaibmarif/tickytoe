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
import { OnlineLobbyModal } from './components/OnlineLobbyModal.js';
import { OnlineStatusBanner } from './components/OnlineStatusBanner.js';
import { RulesSection } from './components/RulesSection.js';
import { PrivacyPolicy } from './components/PrivacyPolicy.js';
import { NotFound } from './components/NotFound.js';
import { Footer } from './components/Footer.js';
import { useTheme } from './hooks/useTheme.js';
import { useAudio } from './hooks/useAudio.js';
import { useConfetti } from './hooks/useConfetti.js';
import { useWebRTC, WebRTCMessage } from './hooks/useWebRTC.js';
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
  const [isOnlineLobbyOpen, setIsOnlineLobbyOpen] = useState(false);

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

  // WebRTC Multiplayer Setup
  const webrtcRef = useRef<ReturnType<typeof useWebRTC> | null>(null);
  const [forfeitMessage, setForfeitMessage] = useState<string | null>(null);

  const handleOpponentDisconnect = useCallback(() => {
    const currentMode = engineRef.current.getState().mode;
    const currentStatus = engineRef.current.getState().status;

    if (currentMode === 'online' && currentStatus === 'in_progress') {
      const activeSymbol = webrtcRef.current?.mySymbol ?? 'X';
      const nextState = engineRef.current.forfeit(activeSymbol);
      setGameState(nextState);
      triggerConfetti();
      playWin();
      setForfeitMessage('Opponent closed the tab / disconnected. You win by forfeit! 🏆');

      setStats((prev) => {
        const newStreak = prev.currentStreak + 1;
        const updated: GameStats = {
          ...prev,
          totalGames: prev.totalGames + 1,
          xWins: activeSymbol === 'X' ? prev.xWins + 1 : prev.xWins,
          oWins: activeSymbol === 'O' ? prev.oWins + 1 : prev.oWins,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          history: [
            ...prev.history,
            {
              id: Date.now().toString(),
              winner: activeSymbol,
              date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              mode: 'online',
              gridSize: nextState.gridSize,
              totalMoves: nextState.history.length,
            },
          ],
        };
        localStorage.setItem('ttt_stats', JSON.stringify(updated));
        return updated;
      });
    }
  }, [playWin, triggerConfetti]);

  const handleWebRTCMessage = useCallback(
    (msg: WebRTCMessage) => {
      if (msg.type === 'move') {
        playMove(gameState.currentPlayer);
        const nextState = engineRef.current.makeMove(msg.index);
        setGameState(nextState);
        if (nextState.status !== 'in_progress') {
          handleGameCompletion(nextState);
        }
      } else if (msg.type === 'reset') {
        setForfeitMessage(null);
        const mySym = webrtcRef.current?.mySymbol ?? 'X';
        const nextState = engineRef.current.reset({
          gridSize: msg.gridSize ?? gameState.gridSize,
          mode: 'online',
          playerSymbol: mySym,
        });
        setGameState(nextState);
      } else if (msg.type === 'rematch_accept') {
        setForfeitMessage(null);
        const mySym = webrtcRef.current?.mySymbol ?? 'X';
        const nextState = engineRef.current.reset({
          mode: 'online',
          playerSymbol: mySym,
        });
        setGameState(nextState);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gameState.currentPlayer, gameState.gridSize, playMove]
  );

  const webrtc = useWebRTC(handleWebRTCMessage, handleOpponentDisconnect);
  webrtcRef.current = webrtc;

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

        const activeSymbol =
          nextState.mode === 'online'
            ? webrtcRef.current?.mySymbol ?? 'X'
            : settings.playerSymbol;

        const isHumanWinner =
          nextState.mode === 'pvp' || nextState.winner === activeSymbol;

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

    // In Online mode, ensure connection and player's turn
    if (gameState.mode === 'online') {
      if (webrtc.status !== 'connected') {
        setIsOnlineLobbyOpen(true);
        return;
      }
      if (gameState.currentPlayer !== webrtc.mySymbol) {
        return;
      }
    }

    playMove(gameState.currentPlayer);
    const nextState = engineRef.current.makeMove(index);
    setGameState(nextState);

    if (gameState.mode === 'online') {
      webrtc.sendMove(index);
    }

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
    setForfeitMessage(null);
    if (gameState.mode === 'online') {
      if (webrtc.status === 'connected') {
        webrtc.sendReset(gameState.gridSize);
      }
      const nextState = engineRef.current.reset({
        mode: 'online',
        playerSymbol: webrtc.mySymbol,
      });
      setGameState(nextState);
      return;
    }

    const nextState = engineRef.current.reset({
      playerSymbol: settings.playerSymbol,
    });
    setGameState(nextState);
  };

  const handleUndo = () => {
    if (gameState.mode === 'online') return;
    playClick();
    const nextState = engineRef.current.undo();
    setGameState(nextState);
  };

  const handleModeChange = (mode: GameMode) => {
    playClick();
    setForfeitMessage(null);
    if (mode === 'online') {
      const nextState = engineRef.current.reset({
        mode: 'online',
        playerSymbol: 'X',
      });
      setGameState(nextState);
      if (webrtc.status !== 'connected') {
        setIsOnlineLobbyOpen(true);
      }
      return;
    }

    if (gameState.mode === 'online') {
      webrtc.disconnect();
    }

    const nextState = engineRef.current.reset({
      mode,
      playerSymbol: settings.playerSymbol,
    });
    setGameState(nextState);
  };

  const handleGridSizeChange = (gridSize: GridSize) => {
    playClick();
    if (gameState.mode === 'online' && webrtc.status === 'connected') {
      webrtc.sendReset(gridSize);
    }
    const nextState = engineRef.current.reset({
      gridSize,
      mode: gameState.mode,
      playerSymbol: gameState.mode === 'online' ? webrtc.mySymbol : settings.playerSymbol,
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

  // URL Room Query Parameter Auto-Join Listener (?room=123456)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get('room');
    if (roomParam && roomParam.length === 6) {
      handleModeChange('online');
      webrtc.joinRoom(roomParam).catch(() => {});
      setIsOnlineLobbyOpen(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // SPA Route Matching (Rule 3)
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
        <main className="max-w-7xl mx-auto px-4 py-8 flex-1 w-full flex items-center justify-center">
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
        <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full">
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

      <main className="max-w-4xl mx-auto px-4 py-6 sm:py-10 flex-1 w-full">
        {/* Online Multiplayer Banner */}
        {gameState.mode === 'online' && (
          <OnlineStatusBanner
            status={webrtc.status}
            roomCode={webrtc.roomCode}
            isHost={webrtc.isHost}
            mySymbol={webrtc.mySymbol}
            opponentSymbol={webrtc.opponentSymbol}
            currentPlayer={gameState.currentPlayer}
            gameStatus={gameState.status}
            latency={webrtc.latency}
            lastEmote={webrtc.lastEmote}
            rematchRequestedByOpponent={webrtc.rematchRequestedByOpponent}
            forfeitMessage={forfeitMessage}
            onOpenLobby={() => setIsOnlineLobbyOpen(true)}
            onSendEmote={webrtc.sendEmote}
            onSendRematchRequest={webrtc.sendRematchRequest}
            onSendRematchAccept={() => {
              setForfeitMessage(null);
              webrtc.sendRematchAccept();
              const next = engineRef.current.reset({
                mode: 'online',
                playerSymbol: webrtc.mySymbol,
              });
              setGameState(next);
            }}
            onDisconnect={() => {
              setForfeitMessage(null);
              webrtc.disconnect();
              handleModeChange('pvp');
            }}
          />
        )}

        {/* Score Board */}
        <ScoreBoard
          currentPlayer={gameState.currentPlayer}
          status={gameState.status}
          winner={gameState.winner}
          mode={gameState.mode}
          difficulty={gameState.difficulty}
          playerSymbol={gameState.mode === 'online' ? webrtc.mySymbol : settings.playerSymbol}
          scores={scores}
          symbolTheme={settings.symbolTheme}
          timeLeft={timeLeft}
          totalTime={settings.turnTimerSeconds}
          isOnlineHost={webrtc.isHost}
          isOnlineConnected={webrtc.status === 'connected'}
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
            (gameState.mode === 'ai' && gameState.currentPlayer !== settings.playerSymbol) ||
            (gameState.mode === 'online' &&
              (webrtc.status !== 'connected' || gameState.currentPlayer !== webrtc.mySymbol))
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
          canUndo={gameState.mode !== 'online' && gameState.history.length > 0}
          onOpenOnlineLobby={() => setIsOnlineLobbyOpen(true)}
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

      <OnlineLobbyModal
        isOpen={isOnlineLobbyOpen}
        onClose={() => setIsOnlineLobbyOpen(false)}
        status={webrtc.status}
        roomCode={webrtc.roomCode}
        isHost={webrtc.isHost}
        errorMessage={webrtc.errorMessage}
        onCreateRoom={webrtc.createRoom}
        onJoinRoom={webrtc.joinRoom}
      />
    </div>
  );
};

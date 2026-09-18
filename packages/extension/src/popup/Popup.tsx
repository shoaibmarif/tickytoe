import React, { useEffect, useRef, useState } from 'react';
import {
  Difficulty,
  GameMode,
  GridSize,
  Player,
  TicTacToeEngine,
} from '@tictactoe/core';
import {
  RotateCcw,
  Undo2,
  ExternalLink,
  Bot,
  Users,
  Sparkles,
  Volume2,
  VolumeX,
  Flame,
  Trophy,
} from 'lucide-react';

const WEB_APP_URL = 'https://tictactoe-pro.netlify.app/';
const GITHUB_URL = 'https://github.com/shoaibmarif';
const LINKEDIN_URL = 'https://www.linkedin.com/in/shoaibmarif/';
const EXT_VERSION = 'v1.0.0';

// Web Audio API Sound Synthesizer (No external audio file dependencies)
const playSound = (type: 'move-x' | 'move-o' | 'win' | 'draw' | 'click' | 'reset') => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } else if (type === 'move-x') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'move-o') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(392.0, ctx.currentTime); // G4
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } else if (type === 'win') {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.22);
      });
    } else if (type === 'draw') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'reset') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(330, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.06);
    }
  } catch {
    // AudioContext fallback
  }
};

export const Popup: React.FC = () => {
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [mode, setMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('unbeatable');
  const [playerSymbol, setPlayerSymbol] = useState<Player>('X');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0, streak: 0 });

  const engineRef = useRef<TicTacToeEngine>(
    new TicTacToeEngine({
      gridSize: 3,
      mode: 'ai',
      difficulty: 'unbeatable',
      playerSymbol: 'X',
    })
  );

  const [gameState, setGameState] = useState(engineRef.current.getState());

  // Safe navigation helper for Chrome extensions and web
  const openUrl = (url: string) => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url });
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  // Load scores and sound setting from chrome.storage or localStorage
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['ttt_ext_scores', 'ttt_ext_sound'], (res) => {
        if (res.ttt_ext_scores) setScores(res.ttt_ext_scores);
        if (typeof res.ttt_ext_sound === 'boolean') setSoundEnabled(res.ttt_ext_sound);
      });
    } else {
      try {
        const savedScores = localStorage.getItem('ttt_ext_scores');
        if (savedScores) setScores(JSON.parse(savedScores));
        const savedSound = localStorage.getItem('ttt_ext_sound');
        if (savedSound !== null) setSoundEnabled(savedSound === 'true');
      } catch {
        // Fallback gracefully
      }
    }
  }, []);

  const saveScores = (newScores: { X: number; O: number; draws: number; streak: number }) => {
    setScores(newScores);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ ttt_ext_scores: newScores });
      chrome.runtime?.sendMessage?.({ type: 'UPDATE_STREAK', streak: newScores.streak });
    } else {
      try {
        localStorage.setItem('ttt_ext_scores', JSON.stringify(newScores));
      } catch {
        // Safe fallback
      }
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) playSound('click');
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ ttt_ext_sound: next });
    } else {
      try {
        localStorage.setItem('ttt_ext_sound', String(next));
      } catch {
        // Safe fallback
      }
    }
  };

  // Process game end (win, draw, streaks)
  const handleGameEnd = (state: typeof gameState) => {
    if (state.status === 'won' && state.winner) {
      if (soundEnabled) playSound('win');
      const isHumanWin = state.mode === 'pvp' || state.winner === playerSymbol;
      const nextStreak = isHumanWin ? scores.streak + 1 : 0;
      const updated = {
        ...scores,
        [state.winner]: scores[state.winner] + 1,
        streak: nextStreak,
      };
      saveScores(updated);
    } else if (state.status === 'draw') {
      if (soundEnabled) playSound('draw');
      const updated = { ...scores, draws: scores.draws + 1 };
      saveScores(updated);
    }
  };

  // Handle cell click by user
  const handleCellClick = (index: number) => {
    if (gameState.status !== 'in_progress') return;
    if (gameState.board[index] !== null) return;
    if (gameState.mode === 'ai' && gameState.currentPlayer !== playerSymbol) return;

    if (soundEnabled) {
      playSound(gameState.currentPlayer === 'X' ? 'move-x' : 'move-o');
    }

    const nextState = engineRef.current.makeMove(index);
    setGameState(nextState);

    handleGameEnd(nextState);
  };

  // AI Turn Execution in Extension
  useEffect(() => {
    const aiSymbol: Player = playerSymbol === 'X' ? 'O' : 'X';
    if (
      gameState.mode === 'ai' &&
      gameState.status === 'in_progress' &&
      gameState.currentPlayer === aiSymbol
    ) {
      setIsAiThinking(true);
      const timer = setTimeout(() => {
        const nextState = engineRef.current.makeAIMove();
        setIsAiThinking(false);
        setGameState(nextState);

        if (soundEnabled && nextState.status === 'in_progress') {
          playSound(aiSymbol === 'X' ? 'move-x' : 'move-o');
        }

        handleGameEnd(nextState);
      }, 300);

      return () => {
        clearTimeout(timer);
        setIsAiThinking(false);
      };
    }
  }, [gameState, playerSymbol, soundEnabled]);

  const handleReset = () => {
    if (soundEnabled) playSound('reset');
    const nextState = engineRef.current.reset({
      gridSize,
      mode,
      difficulty,
      playerSymbol,
    });
    setGameState(nextState);
  };

  const handleUndo = () => {
    if (gameState.history.length === 0 || isAiThinking) return;
    if (soundEnabled) playSound('click');
    const nextState = engineRef.current.undo();
    setGameState(nextState);
  };

  const handleModeChange = (newMode: GameMode) => {
    if (soundEnabled) playSound('click');
    setMode(newMode);
    const nextState = engineRef.current.reset({
      gridSize,
      mode: newMode,
      difficulty,
      playerSymbol,
    });
    setGameState(nextState);
  };

  const handleGridChange = (newSize: GridSize) => {
    if (soundEnabled) playSound('click');
    setGridSize(newSize);
    const nextState = engineRef.current.reset({
      gridSize: newSize,
      mode,
      difficulty,
      playerSymbol,
    });
    setGameState(nextState);
  };

  const handleDifficultyChange = (newDiff: Difficulty) => {
    if (soundEnabled) playSound('click');
    setDifficulty(newDiff);
    const nextState = engineRef.current.reset({
      gridSize,
      mode: 'ai',
      difficulty: newDiff,
      playerSymbol,
    });
    setGameState(nextState);
  };

  const handleSymbolChange = (newSymbol: Player) => {
    if (soundEnabled) playSound('click');
    setPlayerSymbol(newSymbol);
    const nextState = engineRef.current.reset({
      gridSize,
      mode,
      difficulty,
      playerSymbol: newSymbol,
    });
    setGameState(nextState);
  };

  return (
    <div
      style={{
        padding: '14px 16px 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Extension Header */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(99, 102, 241, 0.35)',
            }}
          >
            <Sparkles size={16} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontWeight: 800, fontSize: '15px', letterSpacing: '-0.02em', color: '#ffffff' }}>
                tickytoe
              </span>
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '1px 5px',
                  borderRadius: '6px',
                  background: 'rgba(99, 102, 241, 0.15)',
                  color: '#818cf8',
                  border: '1px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                {EXT_VERSION}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button
            onClick={toggleSound}
            style={{
              background: soundEnabled ? '#1e293b' : '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: soundEnabled ? '#38bdf8' : '#64748b',
              padding: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={() => openUrl(WEB_APP_URL)}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '8px',
              color: '#94a3b8',
              padding: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Open Web App (Full Screen)"
          >
            <ExternalLink size={15} />
          </button>
        </div>
      </header>

      {/* Game Mode & Grid Size Selector Row */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
          {/* Mode switch */}
          <div
            style={{
              display: 'flex',
              background: '#0e1526',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid #1e293b',
              flex: 1,
            }}
          >
            <button
              onClick={() => handleModeChange('ai')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: '7px',
                border: 'none',
                background: mode === 'ai' ? '#6366f1' : 'transparent',
                color: mode === 'ai' ? '#ffffff' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Bot size={13} />
              <span>Vs AI</span>
            </button>
            <button
              onClick={() => handleModeChange('pvp')}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '5px 8px',
                borderRadius: '7px',
                border: 'none',
                background: mode === 'pvp' ? '#6366f1' : 'transparent',
                color: mode === 'pvp' ? '#ffffff' : '#94a3b8',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <Users size={13} />
              <span>2-Player</span>
            </button>
          </div>

          {/* Grid Size Switch */}
          <div
            style={{
              display: 'flex',
              background: '#0e1526',
              padding: '3px',
              borderRadius: '10px',
              border: '1px solid #1e293b',
            }}
          >
            {([3, 4, 5] as GridSize[]).map((size) => (
              <button
                key={size}
                onClick={() => handleGridChange(size)}
                style={{
                  padding: '5px 8px',
                  borderRadius: '7px',
                  border: 'none',
                  background: gridSize === size ? '#06b6d4' : 'transparent',
                  color: gridSize === size ? '#ffffff' : '#94a3b8',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {size}x{size}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary controls row: AI Difficulty & Player Symbol */}
        {mode === 'ai' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
            {/* Difficulty Pills */}
            <div
              style={{
                display: 'flex',
                background: '#0e1526',
                padding: '2px',
                borderRadius: '8px',
                border: '1px solid #1e293b',
                flex: 1,
              }}
            >
              {(['easy', 'medium', 'hard', 'unbeatable'] as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleDifficultyChange(diff)}
                  style={{
                    flex: 1,
                    padding: '4px 2px',
                    borderRadius: '6px',
                    border: 'none',
                    background: difficulty === diff ? '#334155' : 'transparent',
                    color: difficulty === diff ? (diff === 'unbeatable' ? '#38bdf8' : '#f8fafc') : '#64748b',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    cursor: 'pointer',
                  }}
                  title={diff === 'unbeatable' ? 'Unbeatable Minimax AI' : `${diff} difficulty`}
                >
                  {diff === 'unbeatable' ? 'Master' : diff}
                </button>
              ))}
            </div>

            {/* Play as X or O */}
            <div
              style={{
                display: 'flex',
                background: '#0e1526',
                padding: '2px',
                borderRadius: '8px',
                border: '1px solid #1e293b',
              }}
            >
              {(['X', 'O'] as Player[]).map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleSymbolChange(sym)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    border: 'none',
                    background: playerSymbol === sym ? (sym === 'X' ? '#06b6d4' : '#f43f5e') : 'transparent',
                    color: playerSymbol === sym ? '#ffffff' : '#64748b',
                    fontSize: '10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                  title={`Play as ${sym}`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Scoreboard Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '6px',
          background: '#0e1526',
          padding: '8px 10px',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '11px' }}>
            {mode === 'ai' ? (playerSymbol === 'X' ? 'YOU (X)' : 'AI (X)') : 'P1 (X)'}
          </div>
          <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '15px' }}>{scores.X}</div>
        </div>

        <div>
          <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '10px' }}>DRAWS</div>
          <div style={{ color: '#cbd5e1', fontWeight: 900, fontSize: '15px' }}>{scores.draws}</div>
        </div>

        <div>
          <div style={{ color: '#f43f5e', fontWeight: 800, fontSize: '11px' }}>
            {mode === 'ai' ? (playerSymbol === 'O' ? 'YOU (O)' : 'AI (O)') : 'P2 (O)'}
          </div>
          <div style={{ color: '#ffffff', fontWeight: 900, fontSize: '15px' }}>{scores.O}</div>
        </div>

        <div style={{ borderLeft: '1px solid #1e293b', paddingLeft: '4px' }}>
          <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
            <Flame size={11} color="#f59e0b" /> STREAK
          </div>
          <div style={{ color: '#fbbf24', fontWeight: 900, fontSize: '15px' }}>{scores.streak}</div>
        </div>
      </div>

      {/* Status Bar */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 700,
          padding: '6px 12px',
          borderRadius: '8px',
          background:
            gameState.status === 'won'
              ? 'rgba(16, 185, 129, 0.12)'
              : gameState.status === 'draw'
              ? 'rgba(245, 158, 11, 0.12)'
              : isAiThinking
              ? 'rgba(6, 182, 212, 0.12)'
              : '#0e1526',
          border:
            gameState.status === 'won'
              ? '1px solid rgba(16, 185, 129, 0.3)'
              : gameState.status === 'draw'
              ? '1px solid rgba(245, 158, 11, 0.3)'
              : '1px solid #1e293b',
          color:
            gameState.status === 'won'
              ? '#34d399'
              : gameState.status === 'draw'
              ? '#fbbf24'
              : isAiThinking
              ? '#38bdf8'
              : '#94a3b8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
        }}
      >
        {isAiThinking ? (
          <>
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#06b6d4',
                animation: 'pulse 1s infinite ease-in-out',
              }}
            />
            <span>AI is calculating optimal move...</span>
          </>
        ) : gameState.status === 'won' ? (
          <>
            <Trophy size={14} color="#34d399" />
            <span>
              Player {gameState.winner} Wins!{' '}
              {mode === 'ai' && gameState.winner === playerSymbol ? '🎉 Great Job!' : ''}
            </span>
          </>
        ) : gameState.status === 'draw' ? (
          <span>Match Drawn! Well fought.</span>
        ) : (
          <span>Turn: Player {gameState.currentPlayer}</span>
        )}
      </div>

      {/* Dynamic Grid Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gap: gridSize === 5 ? '5px' : gridSize === 4 ? '6px' : '8px',
          background: '#0e1526',
          padding: '10px',
          borderRadius: '16px',
          border: '1px solid #1e293b',
          width: '100%',
          aspectRatio: '1 / 1',
          boxSizing: 'border-box',
        }}
      >
        {gameState.board.map((cell, idx) => {
          const isWinning = gameState.winLine?.indices.includes(idx);
          const fontSize = gridSize === 5 ? '20px' : gridSize === 4 ? '26px' : '34px';

          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={
                gameState.status !== 'in_progress' ||
                cell !== null ||
                isAiThinking ||
                (gameState.mode === 'ai' && gameState.currentPlayer !== playerSymbol)
              }
              style={{
                background: isWinning
                  ? cell === 'X'
                    ? 'rgba(6, 182, 212, 0.22)'
                    : 'rgba(244, 63, 94, 0.22)'
                  : '#151d30',
                border: isWinning
                  ? `2px solid ${cell === 'X' ? '#06b6d4' : '#f43f5e'}`
                  : '1px solid #1e293b',
                borderRadius: gridSize === 5 ? '8px' : '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize,
                fontWeight: 900,
                color: cell === 'X' ? '#06b6d4' : '#f43f5e',
                cursor:
                  cell === null && gameState.status === 'in_progress' && !isAiThinking
                    ? 'pointer'
                    : 'default',
                transition: 'all 0.15s ease',
                boxShadow: isWinning
                  ? `0 0 12px ${cell === 'X' ? 'rgba(6, 182, 212, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`
                  : 'none',
              }}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Action Toolbar: New Game & Undo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            color: '#ffffff',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
          }}
        >
          <RotateCcw size={14} />
          <span>New Game</span>
        </button>

        <button
          onClick={handleUndo}
          disabled={gameState.history.length === 0 || isAiThinking}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '9px 14px',
            borderRadius: '10px',
            background: '#1e293b',
            color: gameState.history.length === 0 || isAiThinking ? '#475569' : '#e2e8f0',
            border: '1px solid #334155',
            fontSize: '12px',
            fontWeight: 700,
            cursor: gameState.history.length === 0 || isAiThinking ? 'not-allowed' : 'pointer',
            opacity: gameState.history.length === 0 || isAiThinking ? 0.6 : 1,
          }}
          title="Undo Last Move"
        >
          <Undo2 size={14} />
          <span>Undo</span>
        </button>
      </div>

      {/* Full Web App Card Promo */}
      <div
        onClick={() => openUrl(WEB_APP_URL)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '10px 12px',
          cursor: 'pointer',
        }}
      >
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
            Play Full Web App
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>
            Full screen, sound controls, dark theme & stats
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#38bdf8',
          }}
        >
          <span>Launch</span>
          <ExternalLink size={13} />
        </div>
      </div>

      {/* Developer Profile & Social Links Footer */}
      <footer
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          paddingTop: '6px',
          borderTop: '1px solid #1e293b',
        }}
      >
        <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>Created by</span>
          <span style={{ fontWeight: 700, color: '#f8fafc' }}>Shoaib M Arif</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* GitHub Link */}
          <button
            onClick={() => openUrl(GITHUB_URL)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '7px',
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#cbd5e1',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>

          {/* LinkedIn Link */}
          <button
            onClick={() => openUrl(LINKEDIN_URL)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              borderRadius: '7px',
              background: '#0a66c2',
              border: 'none',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <svg style={{ width: '12px', height: '12px', fill: 'currentColor' }} viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64a1.66 1.66 0 1 0 0 3.32 1.66 1.66 0 0 0 0-3.32z" />
            </svg>
            <span>LinkedIn</span>
          </button>
        </div>

        <div style={{ fontSize: '9px', color: '#64748b' }}>
          tickytoe {EXT_VERSION} • Manifest V3 • 100% Private & Offline
        </div>
      </footer>
    </div>
  );
};

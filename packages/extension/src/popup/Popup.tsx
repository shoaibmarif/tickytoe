import React, { useEffect, useRef, useState } from 'react';
import {
  Difficulty,
  GameMode,
  TicTacToeEngine,
} from '@tictactoe/core';
import { RotateCcw, ExternalLink, Bot, Users, Sparkles } from 'lucide-react';

export const Popup: React.FC = () => {
  const [mode, setMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('unbeatable');
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const engineRef = useRef<TicTacToeEngine>(
    new TicTacToeEngine({
      gridSize: 3,
      mode: 'ai',
      difficulty: 'unbeatable',
      playerSymbol: 'X',
    })
  );

  const [gameState, setGameState] = useState(engineRef.current.getState());

  // Load scores from chrome.storage or localStorage
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(['ttt_ext_scores'], (res) => {
        if (res.ttt_ext_scores) setScores(res.ttt_ext_scores);
      });
    }
  }, []);

  const saveScores = (newScores: { X: number; O: number; draws: number }) => {
    setScores(newScores);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ ttt_ext_scores: newScores });
    }
  };

  const handleCellClick = (index: number) => {
    if (gameState.status !== 'in_progress') return;
    if (gameState.board[index] !== null) return;
    if (gameState.mode === 'ai' && gameState.currentPlayer !== 'X') return;

    const nextState = engineRef.current.makeMove(index);
    setGameState(nextState);

    if (nextState.status === 'won' && nextState.winner) {
      const updated = {
        ...scores,
        [nextState.winner]: scores[nextState.winner] + 1,
      };
      saveScores(updated);
    } else if (nextState.status === 'draw') {
      const updated = { ...scores, draws: scores.draws + 1 };
      saveScores(updated);
    }
  };

  // AI Turn Execution in Extension
  useEffect(() => {
    if (
      gameState.mode === 'ai' &&
      gameState.status === 'in_progress' &&
      gameState.currentPlayer === 'O'
    ) {
      const timer = setTimeout(() => {
        const nextState = engineRef.current.makeAIMove();
        setGameState(nextState);

        if (nextState.status === 'won' && nextState.winner) {
          const updated = {
            ...scores,
            [nextState.winner]: scores[nextState.winner] + 1,
          };
          saveScores(updated);
        } else if (nextState.status === 'draw') {
          const updated = { ...scores, draws: scores.draws + 1 };
          saveScores(updated);
        }
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [gameState, scores]);

  const handleReset = () => {
    const nextState = engineRef.current.reset({
      mode,
      difficulty,
      playerSymbol: 'X',
    });
    setGameState(nextState);
  };

  const openWebApp = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
      chrome.tabs.create({ url: 'https://tictactoe-pro.netlify.app/' });
    } else {
      window.open('https://tictactoe-pro.netlify.app/', '_blank');
    }
  };

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={16} color="#ffffff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: '15px', color: '#ffffff' }}>
            Tic Tac Toe
          </span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '999px',
              background: '#1e1b4b',
              color: '#818cf8',
              border: '1px solid #3730a3',
            }}
          >
            MV3
          </span>
        </div>

        <button
          onClick={openWebApp}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '4px',
          }}
          title="Open Web App"
        >
          <ExternalLink size={16} />
        </button>
      </div>

      {/* Score Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          background: '#111726',
          padding: '10px',
          borderRadius: '12px',
          border: '1px solid #1e293b',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ color: '#06b6d4', fontWeight: 800, fontSize: '13px' }}>Player X</div>
          <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '16px' }}>{scores.X}</div>
        </div>
        <div>
          <div style={{ color: '#94a3b8', fontWeight: 700, fontSize: '11px' }}>DRAWS</div>
          <div style={{ color: '#cbd5e1', fontWeight: 800, fontSize: '16px' }}>{scores.draws}</div>
        </div>
        <div>
          <div style={{ color: '#f43f5e', fontWeight: 800, fontSize: '13px' }}>
            {mode === 'ai' ? 'AI' : 'Player O'}
          </div>
          <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '16px' }}>{scores.O}</div>
        </div>
      </div>

      {/* Status banner */}
      <div
        style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 600,
          color:
            gameState.status === 'won'
              ? '#10b981'
              : gameState.status === 'draw'
              ? '#f59e0b'
              : '#94a3b8',
        }}
      >
        {gameState.status === 'in_progress'
          ? `Turn: Player ${gameState.currentPlayer}`
          : gameState.status === 'won'
          ? `Player ${gameState.winner} Wins!`
          : 'Match Drawn!'}
      </div>

      {/* 3x3 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: '#111726',
          padding: '12px',
          borderRadius: '16px',
          border: '1px solid #1e293b',
          width: '100%',
          aspectRatio: '1/1',
        }}
      >
        {gameState.board.map((cell, idx) => {
          const isWinning = gameState.winLine?.indices.includes(idx);
          return (
            <button
              key={idx}
              onClick={() => handleCellClick(idx)}
              disabled={
                gameState.status !== 'in_progress' ||
                cell !== null ||
                (gameState.mode === 'ai' && gameState.currentPlayer === 'O')
              }
              style={{
                background: isWinning ? '#0e2a3a' : '#172033',
                border: isWinning ? '2px solid #06b6d4' : '1px solid #1e293b',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: 900,
                color: cell === 'X' ? '#06b6d4' : '#f43f5e',
                cursor: cell === null && gameState.status === 'in_progress' ? 'pointer' : 'default',
              }}
            >
              {cell}
            </button>
          );
        })}
      </div>

      {/* Quick Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <button
          onClick={handleReset}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            borderRadius: '10px',
            background: '#6366f1',
            color: '#ffffff',
            border: 'none',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={14} />
          <span>New Game</span>
        </button>

        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => {
              const nextMode = mode === 'ai' ? 'pvp' : 'ai';
              setMode(nextMode);
              const nextState = engineRef.current.reset({ mode: nextMode });
              setGameState(nextState);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '6px 10px',
              borderRadius: '8px',
              background: '#1e293b',
              color: '#cbd5e1',
              border: 'none',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {mode === 'ai' ? <Bot size={12} /> : <Users size={12} />}
            <span>{mode === 'ai' ? 'Vs AI' : '2-Player'}</span>
          </button>

          {mode === 'ai' && (
            <button
              onClick={() => {
                const nextDiff = difficulty === 'unbeatable' ? 'easy' : 'unbeatable';
                setDifficulty(nextDiff);
                const nextState = engineRef.current.reset({ difficulty: nextDiff });
                setGameState(nextState);
              }}
              style={{
                padding: '6px 10px',
                borderRadius: '8px',
                background: '#1e293b',
                color: '#cbd5e1',
                border: 'none',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {difficulty === 'unbeatable' ? 'Master' : 'Easy'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

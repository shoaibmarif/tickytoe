import React from 'react';
import { CellState, GridSize, Player, WinLine } from '@tictactoe/core';
import { Cell } from './Cell.js';
import { SymbolTheme } from '../types.js';

interface GameBoardProps {
  board: CellState[];
  gridSize: GridSize;
  onCellClick: (index: number) => void;
  winLine: WinLine | null;
  winner: Player | null;
  symbolTheme: SymbolTheme;
  disabled: boolean;
  currentPlayer: Player;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  board,
  gridSize,
  onCellClick,
  winLine,
  winner,
  symbolTheme,
  disabled,
  currentPlayer,
}) => {
  const getGridClasses = () => {
    switch (gridSize) {
      case 3:
        return 'grid-cols-3 max-w-[340px] sm:max-w-[380px] gap-2.5 sm:gap-3';
      case 4:
        return 'grid-cols-4 max-w-[380px] sm:max-w-[430px] gap-2 sm:gap-2.5';
      case 5:
        return 'grid-cols-5 max-w-[420px] sm:max-w-[480px] gap-1.5 sm:gap-2';
      default:
        return 'grid-cols-3 max-w-[360px] gap-3';
    }
  };

  return (
    <div className="relative mx-auto w-full flex items-center justify-center p-2">
      {/* Background ambient glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-indigo-500/15 to-rose-500/10 rounded-3xl blur-2xl -z-10" />

      {/* Grid container */}
      <div
        className={`w-full grid ${getGridClasses()} p-3 sm:p-4 rounded-3xl bg-slate-100/80 dark:bg-[#111726]/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl transition-all duration-300`}
      >
        {board.map((cellValue, idx) => (
          <Cell
            key={idx}
            index={idx}
            value={cellValue}
            onClick={() => onCellClick(idx)}
            isWinningCell={winLine?.indices.includes(idx) ?? false}
            winner={winner}
            symbolTheme={symbolTheme}
            disabled={disabled}
            hoverSymbol={currentPlayer}
          />
        ))}
      </div>
    </div>
  );
};

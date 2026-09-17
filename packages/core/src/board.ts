import { CellState, GridSize, Player, WinLine } from './types.js';

const combosCache = new Map<string, WinLine[]>();

export function getDefaultWinTarget(size: GridSize): number {
  switch (size) {
    case 3:
      return 3;
    case 4:
      return 4;
    case 5:
      return 4; // 4-in-a-row on 5x5 board for fast, dynamic play
    default:
      return 3;
  }
}

export function createEmptyBoard(size: GridSize): CellState[] {
  return Array<CellState>(size * size).fill(null);
}

export function getWinningCombinations(size: GridSize, winTarget?: number): WinLine[] {
  const target = winTarget ?? getDefaultWinTarget(size);
  const cacheKey = `${size}_${target}`;
  const cached = combosCache.get(cacheKey);
  if (cached) return cached;

  const combos: WinLine[] = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - target; c++) {
      const indices: number[] = [];
      for (let i = 0; i < target; i++) {
        indices.push(r * size + (c + i));
      }
      combos.push({ indices, direction: 'row' });
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - target; r++) {
      const indices: number[] = [];
      for (let i = 0; i < target; i++) {
        indices.push((r + i) * size + c);
      }
      combos.push({ indices, direction: 'col' });
    }
  }

  // Main diagonals (top-left to bottom-right)
  for (let r = 0; r <= size - target; r++) {
    for (let c = 0; c <= size - target; c++) {
      const indices: number[] = [];
      for (let i = 0; i < target; i++) {
        indices.push((r + i) * size + (c + i));
      }
      combos.push({ indices, direction: 'diag_main' });
    }
  }

  // Anti diagonals (top-right to bottom-left)
  for (let r = 0; r <= size - target; r++) {
    for (let c = target - 1; c < size; c++) {
      const indices: number[] = [];
      for (let i = 0; i < target; i++) {
        indices.push((r + i) * size + (c - i));
      }
      combos.push({ indices, direction: 'diag_anti' });
    }
  }

  combosCache.set(cacheKey, combos);
  return combos;
}

export function checkWinner(
  board: CellState[],
  size: GridSize,
  winTarget?: number
): { winner: Player | null; winLine: WinLine | null } {
  const combos = getWinningCombinations(size, winTarget);

  for (const combo of combos) {
    const firstCell = board[combo.indices[0]];
    if (!firstCell) continue;

    let allMatch = true;
    for (let i = 1; i < combo.indices.length; i++) {
      if (board[combo.indices[i]] !== firstCell) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      return { winner: firstCell, winLine: combo };
    }
  }

  return { winner: null, winLine: null };
}

export function isBoardFull(board: CellState[]): boolean {
  return board.every((cell) => cell !== null);
}

export function getAvailableMoves(board: CellState[]): number[] {
  const moves: number[] = [];
  for (let i = 0; i < board.length; i++) {
    if (board[i] === null) {
      moves.push(i);
    }
  }
  return moves;
}

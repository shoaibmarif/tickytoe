import { CellState, Difficulty, GridSize, Player } from './types.js';
import { checkWinner, getAvailableMoves, getWinningCombinations, getDefaultWinTarget } from './board.js';

export function getAIMove(
  board: CellState[],
  size: GridSize,
  aiPlayer: Player,
  difficulty: Difficulty,
  winTarget?: number
): number {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return -1;
  if (availableMoves.length === board.length) {
    // First move preference: center or random corner
    const center = Math.floor(board.length / 2);
    if (board[center] === null && Math.random() > 0.3) return center;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  const humanPlayer: Player = aiPlayer === 'X' ? 'O' : 'X';
  const target = winTarget ?? getDefaultWinTarget(size);

  switch (difficulty) {
    case 'easy':
      return getEasyMove(board, availableMoves, size, aiPlayer, humanPlayer, target);
    case 'medium':
      return getMediumMove(board, availableMoves, size, aiPlayer, humanPlayer, target);
    case 'hard':
      return getHardMove(board, availableMoves, size, aiPlayer, humanPlayer, target);
    case 'unbeatable':
    default:
      return getUnbeatableMove(board, availableMoves, size, aiPlayer, humanPlayer, target);
  }
}

function getEasyMove(
  board: CellState[],
  available: number[],
  size: GridSize,
  ai: Player,
  human: Player,
  target: number
): number {
  // 30% chance to act smart (win or block), otherwise purely random
  if (Math.random() < 0.3) {
    const winMove = findWinningMove(board, available, size, ai, target);
    if (winMove !== -1) return winMove;
    const blockMove = findWinningMove(board, available, size, human, target);
    if (blockMove !== -1) return blockMove;
  }
  return available[Math.floor(Math.random() * available.length)];
}

function getMediumMove(
  board: CellState[],
  available: number[],
  size: GridSize,
  ai: Player,
  human: Player,
  target: number
): number {
  // Check instant win
  const winMove = findWinningMove(board, available, size, ai, target);
  if (winMove !== -1) return winMove;

  // Check instant block
  const blockMove = findWinningMove(board, available, size, human, target);
  if (blockMove !== -1) return blockMove;

  // 65% chance to take strategic cell (center or corner), 35% random
  if (Math.random() < 0.65) {
    const strategic = getStrategicMove(board, available, size);
    if (strategic !== -1) return strategic;
  }

  return available[Math.floor(Math.random() * available.length)];
}

function getHardMove(
  board: CellState[],
  available: number[],
  size: GridSize,
  ai: Player,
  human: Player,
  target: number
): number {
  // 15% slip-up chance, otherwise plays unbeatable
  if (Math.random() < 0.15) {
    return getMediumMove(board, available, size, ai, human, target);
  }
  return getUnbeatableMove(board, available, size, ai, human, target);
}

function getUnbeatableMove(
  board: CellState[],
  available: number[],
  size: GridSize,
  ai: Player,
  human: Player,
  target: number
): number {
  // 1. Instant Win Check
  const winMove = findWinningMove(board, available, size, ai, target);
  if (winMove !== -1) return winMove;

  // 2. Instant Block Check
  const blockMove = findWinningMove(board, available, size, human, target);
  if (blockMove !== -1) return blockMove;

  // For 3x3, run complete Minimax with Alpha-Beta
  if (size === 3) {
    let bestScore = -Infinity;
    let bestMove = available[0];

    // Center preference
    const center = 4;
    if (board[center] === null) return center;

    // Order moves for faster alpha-beta pruning
    const orderedMoves = orderMoves(available, size);

    for (const move of orderedMoves) {
      board[move] = ai;
      const score = minimax(board, 0, false, -Infinity, Infinity, size, ai, human, target, 9);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    }
    return bestMove;
  }

  // For 4x4 and 5x5, use depth-limited heuristic minimax with Alpha-Beta pruning
  const maxDepth = size === 4 ? 4 : 3;
  let bestScore = -Infinity;
  let bestMove = available[0];

  const orderedMoves = orderMoves(available, size);

  for (const move of orderedMoves) {
    board[move] = ai;
    const score = minimax(board, 0, false, -Infinity, Infinity, size, ai, human, target, maxDepth);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

function findWinningMove(
  board: CellState[],
  available: number[],
  size: GridSize,
  player: Player,
  target: number
): number {
  for (const move of available) {
    board[move] = player;
    const { winner } = checkWinner(board, size, target);
    board[move] = null;
    if (winner === player) {
      return move;
    }
  }
  return -1;
}

function orderMoves(moves: number[], size: number): number[] {
  const centerR = (size - 1) / 2;
  const centerC = (size - 1) / 2;

  return [...moves].sort((a, b) => {
    const rA = Math.floor(a / size);
    const cA = a % size;
    const distA = Math.hypot(rA - centerR, cA - centerC);

    const rB = Math.floor(b / size);
    const cB = b % size;
    const distB = Math.hypot(rB - centerR, cB - centerC);

    return distA - distB;
  });
}

function evaluateBoard(
  board: CellState[],
  size: GridSize,
  ai: Player,
  human: Player,
  target: number
): number {
  const combos = getWinningCombinations(size, target);
  let score = 0;

  for (const combo of combos) {
    let aiCount = 0;
    let humanCount = 0;

    for (const idx of combo.indices) {
      if (board[idx] === ai) aiCount++;
      else if (board[idx] === human) humanCount++;
    }

    if (aiCount > 0 && humanCount > 0) {
      // Blocked line, neither can win with this combo
      continue;
    }

    if (aiCount > 0) {
      if (aiCount === target) score += 10000;
      else if (aiCount === target - 1) score += 500;
      else if (aiCount === target - 2) score += 50;
      else score += 5;
    } else if (humanCount > 0) {
      if (humanCount === target) score -= 10000;
      else if (humanCount === target - 1) score -= 600; // prioritize blocking opponent threat
      else if (humanCount === target - 2) score -= 60;
      else score -= 5;
    }
  }

  // Bonus for controlling center cells
  const centerStart = Math.floor((size - 1) / 2);
  const centerEnd = Math.ceil((size - 1) / 2);
  for (let r = centerStart; r <= centerEnd; r++) {
    for (let c = centerStart; c <= centerEnd; c++) {
      const idx = r * size + c;
      if (board[idx] === ai) score += 10;
      else if (board[idx] === human) score -= 10;
    }
  }

  return score;
}

function minimax(
  board: CellState[],
  depth: number,
  isMaximizing: boolean,
  alpha: number,
  beta: number,
  size: GridSize,
  ai: Player,
  human: Player,
  target: number,
  maxDepth: number
): number {
  const { winner } = checkWinner(board, size, target);
  if (winner === ai) return 1000 - depth;
  if (winner === human) return depth - 1000;

  const available = getAvailableMoves(board);
  if (available.length === 0) return 0;
  if (depth >= maxDepth) {
    return evaluateBoard(board, size, ai, human, target);
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of available) {
      board[move] = ai;
      const evaluation = minimax(board, depth + 1, false, alpha, beta, size, ai, human, target, maxDepth);
      board[move] = null;
      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of available) {
      board[move] = human;
      const evaluation = minimax(board, depth + 1, true, alpha, beta, size, ai, human, target, maxDepth);
      board[move] = null;
      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function getStrategicMove(_board: CellState[], available: number[], size: GridSize): number {
  // Try center
  const center = Math.floor((size * size) / 2);
  if (available.includes(center)) return center;

  // Try corners
  const corners = [0, size - 1, size * (size - 1), size * size - 1];
  const availableCorners = corners.filter((c) => available.includes(c));
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  return -1;
}

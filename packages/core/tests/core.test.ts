import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  checkWinner,
  isBoardFull,
  getWinningCombinations,
  getAvailableMoves,
  TicTacToeEngine,
  getAIMove,
  CellState
} from '../src/index.js';

describe('Board & Win Detection', () => {
  it('should initialize empty boards of varying sizes correctly', () => {
    expect(createEmptyBoard(3)).toHaveLength(9);
    expect(createEmptyBoard(4)).toHaveLength(16);
    expect(createEmptyBoard(5)).toHaveLength(25);
    expect(createEmptyBoard(3).every((cell) => cell === null)).toBe(true);
  });

  it('should generate correct winning combination counts', () => {
    // 3x3: 3 rows, 3 cols, 2 diagonals = 8
    expect(getWinningCombinations(3, 3)).toHaveLength(8);
    // 4x4: 4 rows, 4 cols, 2 diagonals = 10
    expect(getWinningCombinations(4, 4)).toHaveLength(10);
  });

  it('should detect row, column, and diagonal wins in 3x3', () => {
    // Row win
    const rowBoard: CellState[] = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null
    ];
    expect(checkWinner(rowBoard, 3).winner).toBe('X');

    // Col win
    const colBoard: CellState[] = [
      'O', 'X', null,
      'O', 'X', null,
      'O', null, null
    ];
    expect(checkWinner(colBoard, 3).winner).toBe('O');

    // Main diagonal
    const diagBoard: CellState[] = [
      'X', 'O', null,
      'O', 'X', null,
      null, null, 'X'
    ];
    expect(checkWinner(diagBoard, 3).winner).toBe('X');

    // Anti diagonal
    const antiDiagBoard: CellState[] = [
      null, 'O', 'X',
      'O', 'X', null,
      'X', null, null
    ];
    expect(checkWinner(antiDiagBoard, 3).winner).toBe('X');
  });

  it('should detect draws', () => {
    const drawBoard: CellState[] = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X'
    ];
    expect(checkWinner(drawBoard, 3).winner).toBeNull();
    expect(isBoardFull(drawBoard)).toBe(true);
  });

  it('should list available moves accurately', () => {
    const board: CellState[] = [
      'X', null, 'O',
      null, 'X', null,
      null, null, 'O'
    ];
    expect(getAvailableMoves(board)).toEqual([1, 3, 5, 6, 7]);
  });
});

describe('Game Engine Lifecycle', () => {
  it('alternates turns and records move history', () => {
    const engine = new TicTacToeEngine({ gridSize: 3, mode: 'pvp' });
    let state = engine.makeMove(0); // X
    expect(state.board[0]).toBe('X');
    expect(state.currentPlayer).toBe('O');
    expect(state.history).toHaveLength(1);

    state = engine.makeMove(1); // O
    expect(state.board[1]).toBe('O');
    expect(state.currentPlayer).toBe('X');
    expect(state.history).toHaveLength(2);
  });

  it('supports undo', () => {
    const engine = new TicTacToeEngine({ gridSize: 3, mode: 'pvp' });
    engine.makeMove(0);
    engine.makeMove(4);
    const state = engine.undo();
    expect(state.board[4]).toBeNull();
    expect(state.board[0]).toBe('X');
    expect(state.currentPlayer).toBe('O');
  });

  it('serializes and deserializes accurately', () => {
    const engine = new TicTacToeEngine({ gridSize: 3, mode: 'pvp' });
    engine.makeMove(4); // X in center
    const json = engine.serialize();

    const restored = TicTacToeEngine.deserialize(json);
    expect(restored.getState().board[4]).toBe('X');
    expect(restored.getState().currentPlayer).toBe('O');
  });
});

describe('AI & Minimax Logic', () => {
  it('takes immediate winning move', () => {
    const board: CellState[] = [
      'X', 'X', null,
      'O', 'O', null,
      null, null, null
    ];
    const move = getAIMove(board, 3, 'X', 'unbeatable', 3);
    expect(move).toBe(2);
  });

  it('blocks immediate opponent win', () => {
    const board: CellState[] = [
      'X', 'X', null,
      'O', null, null,
      null, null, null
    ];
    const move = getAIMove(board, 3, 'O', 'unbeatable', 3);
    expect(move).toBe(2);
  });

  it('unbeatable AI vs AI always ends in a draw in 3x3', () => {
    const engine = new TicTacToeEngine({ gridSize: 3, mode: 'pvp' });
    while (engine.getState().status === 'in_progress') {
      const state = engine.getState();
      const bestMove = getAIMove(
        state.board,
        state.gridSize,
        state.currentPlayer,
        'unbeatable',
        3
      );
      expect(bestMove).toBeGreaterThanOrEqual(0);
      engine.makeMove(bestMove);
    }
    expect(engine.getState().status).toBe('draw');
    expect(engine.getState().winner).toBeNull();
  });
});



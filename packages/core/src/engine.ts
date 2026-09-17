import { Difficulty, GameMode, GameState, GridSize, Player } from './types.js';
import { checkWinner, createEmptyBoard, getDefaultWinTarget, isBoardFull } from './board.js';
import { getAIMove } from './ai.js';

export class TicTacToeEngine {
  private state: GameState;

  constructor(options?: {
    gridSize?: GridSize;
    winTarget?: number;
    mode?: GameMode;
    difficulty?: Difficulty;
    playerSymbol?: Player;
  }) {
    const gridSize = options?.gridSize ?? 3;
    const winTarget = options?.winTarget ?? getDefaultWinTarget(gridSize);
    this.state = {
      gridSize,
      winTarget,
      board: createEmptyBoard(gridSize),
      currentPlayer: 'X',
      status: 'in_progress',
      winner: null,
      winLine: null,
      history: [],
      mode: options?.mode ?? 'ai',
      difficulty: options?.difficulty ?? 'unbeatable',
      playerSymbol: options?.playerSymbol ?? 'X',
    };
  }

  public getState(): GameState {
    return {
      ...this.state,
      board: [...this.state.board],
      history: [...this.state.history],
      winLine: this.state.winLine ? { ...this.state.winLine, indices: [...this.state.winLine.indices] } : null,
    };
  }

  public makeMove(index: number): GameState {
    if (this.state.status !== 'in_progress') return this.getState();
    if (index < 0 || index >= this.state.board.length) return this.getState();
    if (this.state.board[index] !== null) return this.getState();

    // Place piece
    const player = this.state.currentPlayer;
    this.state.board[index] = player;
    this.state.history.push({
      index,
      player,
      timestamp: Date.now(),
    });

    // Check win / draw
    const { winner, winLine } = checkWinner(this.state.board, this.state.gridSize, this.state.winTarget);
    if (winner) {
      this.state.status = 'won';
      this.state.winner = winner;
      this.state.winLine = winLine;
      return this.getState();
    }

    if (isBoardFull(this.state.board)) {
      this.state.status = 'draw';
      return this.getState();
    }

    // Toggle turn
    this.state.currentPlayer = player === 'X' ? 'O' : 'X';
    return this.getState();
  }

  public makeAIMove(): GameState {
    if (this.state.status !== 'in_progress' || this.state.mode !== 'ai') {
      return this.getState();
    }

    const aiSymbol: Player = this.state.playerSymbol === 'X' ? 'O' : 'X';
    if (this.state.currentPlayer !== aiSymbol) {
      return this.getState();
    }

    const move = getAIMove(
      this.state.board,
      this.state.gridSize,
      aiSymbol,
      this.state.difficulty,
      this.state.winTarget
    );

    if (move !== -1) {
      return this.makeMove(move);
    }

    return this.getState();
  }

  public undo(): GameState {
    if (this.state.history.length === 0) return this.getState();

    // If vs AI and game is in progress or was won/draw by AI, undo 2 moves (AI + Player)
    // If only 1 move was played, undo 1.
    const movesToUndo = this.state.mode === 'ai' && this.state.history.length >= 2 ? 2 : 1;

    for (let i = 0; i < movesToUndo; i++) {
      const lastMove = this.state.history.pop();
      if (lastMove) {
        this.state.board[lastMove.index] = null;
      }
    }

    this.state.status = 'in_progress';
    this.state.winner = null;
    this.state.winLine = null;

    if (this.state.history.length === 0) {
      this.state.currentPlayer = 'X';
    } else {
      const lastPlayer = this.state.history[this.state.history.length - 1].player;
      this.state.currentPlayer = lastPlayer === 'X' ? 'O' : 'X';
    }

    return this.getState();
  }

  public reset(options?: {
    gridSize?: GridSize;
    winTarget?: number;
    mode?: GameMode;
    difficulty?: Difficulty;
    playerSymbol?: Player;
  }): GameState {
    const gridSize = options?.gridSize ?? this.state.gridSize;
    const winTarget = options?.winTarget ?? getDefaultWinTarget(gridSize);
    this.state = {
      gridSize,
      winTarget,
      board: createEmptyBoard(gridSize),
      currentPlayer: 'X',
      status: 'in_progress',
      winner: null,
      winLine: null,
      history: [],
      mode: options?.mode ?? this.state.mode,
      difficulty: options?.difficulty ?? this.state.difficulty,
      playerSymbol: options?.playerSymbol ?? this.state.playerSymbol,
    };

    // If human chose 'O' and mode is AI, AI makes the first move!
    if (this.state.mode === 'ai' && this.state.playerSymbol === 'O') {
      this.makeAIMove();
    }

    return this.getState();
  }

  public forfeit(winner: Player): GameState {
    this.state.status = 'won';
    this.state.winner = winner;
    this.state.winLine = null;
    return this.getState();
  }

  public serialize(): string {
    return JSON.stringify(this.state);
  }

  public static deserialize(json: string): TicTacToeEngine {
    const data = JSON.parse(json) as GameState;
    const engine = new TicTacToeEngine({
      gridSize: data.gridSize,
      winTarget: data.winTarget,
      mode: data.mode,
      difficulty: data.difficulty,
      playerSymbol: data.playerSymbol,
    });
    engine.state = data;
    return engine;
  }
}

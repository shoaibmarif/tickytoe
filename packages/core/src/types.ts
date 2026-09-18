export type Player = 'X' | 'O';
export type CellState = Player | null;
export type GridSize = 3 | 4 | 5;
export type GameMode = 'ai' | 'pvp';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'unbeatable';
export type GameStatus = 'in_progress' | 'won' | 'draw';

export interface WinLine {
  indices: number[];
  direction: 'row' | 'col' | 'diag_main' | 'diag_anti';
}

export interface MoveRecord {
  index: number;
  player: Player;
  timestamp: number;
}

export interface GameState {
  gridSize: GridSize;
  winTarget: number;
  board: CellState[];
  currentPlayer: Player;
  status: GameStatus;
  winner: Player | null;
  winLine: WinLine | null;
  history: MoveRecord[];
  mode: GameMode;
  difficulty: Difficulty;
  playerSymbol: Player;
}

export interface MatchHistoryItem {
  id: string;
  winner: Player | 'draw';
  date: string;
  mode: GameMode;
  difficulty?: Difficulty;
  gridSize: GridSize;
  totalMoves: number;
}

export interface GameStats {
  totalGames: number;
  xWins: number;
  oWins: number;
  draws: number;
  currentStreak: number;
  bestStreak: number;
  history: MatchHistoryItem[];
}

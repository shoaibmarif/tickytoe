import { Player } from '@tictactoe/core';

export type SymbolTheme = 'classic' | 'cyber' | 'emoji';

export interface SymbolDisplay {
  X: string | React.ReactNode;
  O: string | React.ReactNode;
}

export interface WebSettings {
  symbolTheme: SymbolTheme;
  turnTimerSeconds: number; // 0 for off, 5, 10, 15
  soundEnabled: boolean;
  volume: number; // 0 to 1
  playerSymbol: Player; // which symbol human plays as in AI mode
}

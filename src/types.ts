export type GameStatus = 'PLAYING' | 'WON' | 'LOST';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: DifficultyLevel;
  label: string;
  limit: number;
  wordComplexity: string;
  description: string;
}

export interface WordItem {
  word: string;
  hint: string;
  difficulty?: DifficultyLevel;
}

export interface WordCategory {
  id: string;
  name: string;
  badge: string;
  description: string;
  words: WordItem[];
}

export interface GameStats {
  played: number;
  won: number;
  lost: number;
  currentStreak: number;
  maxStreak: number;
  lastPlayedAt?: string;
}

export interface TerminalLine {
  id: string;
  text: string;
  type: 'system' | 'prompt' | 'input' | 'success' | 'error' | 'info' | 'divider';
}

export type ViewTab = 'GAME_BOARD' | 'CLASSIC_HTML' | 'TERMINAL' | 'API_DOCS' | 'CODE_STUDIO' | 'VIVA_GUIDE';

export type ThemeMode = 'dark' | 'light';

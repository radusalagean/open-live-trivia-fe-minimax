export interface User {
  _id: string;
  username: string;
  rights: number;
  coins: number;
  joined: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LeaderboardEntry {
  _id: string;
  username: string;
  rights: number;
  coins: number;
  joined: string;
  lastSeen: string;
  playing?: boolean;
}

export interface LeaderboardResponse {
  page: number;
  pages: number;
  itemsCount: number;
  perPage: number;
  items: LeaderboardEntry[];
}

export type GameStateType = 'waiting' | 'split' | 'transition';

export interface GameState {
  category: string;
  clue: string;
  answer: string;
  currentValue: number;
  elapsedSplitSeconds: number;
  totalSplitSeconds: number;
  freeAttemptsLeft: number;
  entryReported: boolean;
  playerCount: number;
  gameState: GameStateType;
  attempts: Attempt[];
  revealedChars: string[];
  isSplitting: boolean;
  isRevealed: boolean;
  players: Player[];
  myAttempt: Attempt | null;
  peerAttempts: Attempt[];
  coins: number;
  status: 'waiting' | 'playing' | 'revealed';
  timerResetCount: number;
  roundWon: boolean;
  revealedAnswer?: string;
  entryId?: number;
}

export interface Player {
  id: string;
  username: string;
  avatar?: string;
  isMe: boolean;
  rights?: number;
  coins?: number;
  joined?: string;
}

export interface Attempt {
  userId: string;
  username: string;
  message: string;
  correct: boolean;
  correctAnswer?: string;
}

export interface SystemInfo {
  serverVersion: string;
  minAppVersionCode: number;
  latestAppVersionCode: number;
  isTriviaServiceRunning: boolean;
}

export interface Report {
  _id: string;
  reporters: { _id: string; username: string }[];
  banned: boolean;
  lastReported: string;
  entryId: number;
  category: string;
  clue: string;
  answer: string;
}

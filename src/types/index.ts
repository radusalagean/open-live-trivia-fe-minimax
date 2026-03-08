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

export interface GameState {
  currentRound: number;
  totalRounds: number;
  currentEntry: string;
  revealedChars: string[];
  isSplitting: boolean;
  isRevealed: boolean;
  players: Player[];
  myAttempt: Attempt | null;
  peerAttempts: Attempt[];
  coins: number;
  status: 'waiting' | 'playing' | 'revealed';
}

export interface Player {
  id: string;
  username: string;
  avatar?: string;
  isMe: boolean;
}

export interface Attempt {
  playerId: string;
  username: string;
  answer: string;
  isCorrect: boolean;
  timestamp: number;
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

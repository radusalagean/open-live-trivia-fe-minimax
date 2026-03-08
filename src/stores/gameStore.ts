import { create } from 'zustand';
import type { GameState, Player, Attempt, GameStateType } from '@/types';

interface GameStore extends GameState {
  setCategory: (category: string) => void;
  setClue: (clue: string) => void;
  setAnswer: (answer: string) => void;
  setCurrentValue: (value: number) => void;
  setSplitTimes: (elapsed: number, total: number) => void;
  setFreeAttemptsLeft: (count: number) => void;
  setEntryReported: (reported: boolean) => void;
  setPlayerCount: (count: number) => void;
  setGameState: (state: GameStateType) => void;
  setAttempts: (attempts: Attempt[]) => void;
  addAttempt: (attempt: Attempt) => void;
  setRevealedChars: (chars: string[]) => void;
  setSplitting: (isSplitting: boolean) => void;
  setRevealed: (isRevealed: boolean) => void;
  setPlayers: (players: Player[]) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setMyAttempt: (attempt: Attempt | null) => void;
  addPeerAttempt: (attempt: Attempt) => void;
  clearPeerAttempts: () => void;
  setCoins: (coins: number) => void;
  updateCoins: (delta: number) => void;
  setStatus: (status: GameState['status']) => void;
  reset: () => void;
}

const initialState: GameState = {
  category: '',
  clue: '',
  answer: '',
  currentValue: 0,
  elapsedSplitSeconds: 0,
  totalSplitSeconds: 0,
  freeAttemptsLeft: 3,
  entryReported: false,
  playerCount: 0,
  gameState: 'waiting',
  attempts: [],
  revealedChars: [],
  isSplitting: false,
  isRevealed: false,
  players: [],
  myAttempt: null,
  peerAttempts: [],
  coins: 0,
  status: 'waiting',
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setCategory: (category) => set({ category }),
  
  setClue: (clue) => set({ clue }),
  
  setAnswer: (answer) => set({ answer }),
  
  setCurrentValue: (currentValue) => set({ currentValue }),
  
  setSplitTimes: (elapsed, total) => set({ 
    elapsedSplitSeconds: elapsed, 
    totalSplitSeconds: total 
  }),
  
  setFreeAttemptsLeft: (freeAttemptsLeft) => set({ freeAttemptsLeft }),
  
  setEntryReported: (entryReported) => set({ entryReported }),
  
  setPlayerCount: (playerCount) => set({ playerCount }),
  
  setGameState: (gameState) => set({ gameState }),
  
  setAttempts: (attempts) => set({ attempts }),
  
  addAttempt: (attempt) => set((state) => ({ 
    attempts: [...state.attempts, attempt] 
  })),
  
  setRevealedChars: (chars) => set({ revealedChars: chars }),
  
  setSplitting: (isSplitting) => set({ isSplitting }),
  
  setRevealed: (isRevealed) => set({ isRevealed }),
  
  setPlayers: (players) => set({ players }),
  
  addPlayer: (player) => set((state) => ({ 
    players: [...state.players, player] 
  })),
  
  removePlayer: (playerId) => set((state) => ({ 
    players: state.players.filter((p) => p.id !== playerId) 
  })),
  
  setMyAttempt: (attempt) => set({ myAttempt: attempt }),
  
  addPeerAttempt: (attempt) => set((state) => ({ 
    peerAttempts: [...state.peerAttempts, attempt] 
  })),
  
  clearPeerAttempts: () => set({ peerAttempts: [], attempts: [] }),
  
  setCoins: (coins) => set({ coins }),
  
  updateCoins: (delta) => set((state) => ({ coins: state.coins + delta })),
  
  setStatus: (status) => set({ status }),
  
  reset: () => set(initialState),
}));

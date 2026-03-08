import { create } from 'zustand';
import type { GameState, Player, Attempt } from '@/types';

interface GameStore extends GameState {
  setRound: (round: number, total: number) => void;
  setEntry: (entry: string) => void;
  addRevealedChar: (char: string) => void;
  resetRevealed: () => void;
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
  currentRound: 0,
  totalRounds: 0,
  currentEntry: '',
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

  setRound: (round, total) => set({ currentRound: round, totalRounds: total }),
  
  setEntry: (entry) => set({ currentEntry: entry }),
  
  addRevealedChar: (char) => set((state) => ({ 
    revealedChars: [...state.revealedChars, char] 
  })),
  
  resetRevealed: () => set({ revealedChars: [], isRevealed: false, isSplitting: false }),
  
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
  
  clearPeerAttempts: () => set({ peerAttempts: [] }),
  
  setCoins: (coins) => set({ coins }),
  
  updateCoins: (delta) => set((state) => ({ coins: state.coins + delta })),
  
  setStatus: (status) => set({ status }),
  
  reset: () => set(initialState),
}));

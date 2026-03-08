import { useEffect, useRef, useCallback } from 'react';
import { socket, connectSocket, disconnectSocket } from '@/lib/socket';
import { useGameStore } from '@/stores/gameStore';
import { useAuthStore } from '@/stores/authStore';

export const useSocket = () => {
  const token = useAuthStore((s) => s.token);
  const isConnected = useRef(false);

  const {
    setRound,
    setEntry,
    addRevealedChar,
    resetRevealed,
    setSplitting,
    setRevealed,
    addPlayer,
    removePlayer,
    addPeerAttempt,
    clearPeerAttempts,
    updateCoins,
    setStatus,
    setCoins,
  } = useGameStore();

  useEffect(() => {
    if (!token || isConnected.current) return;

    connectSocket();
    isConnected.current = true;

    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    socket.on('unauthorized', (data: { message: string }) => {
      console.error('Socket unauthorized:', data.message);
    });

    const onAuthenticated = (data: { coins: number }) => {
      console.log('Authenticated, coins:', data.coins);
      setCoins(data.coins);
    };

    const onWelcome = (data: { 
      round: number; 
      totalRounds: number; 
      entry: string;
      revealedChars: string[];
    }) => {
      setRound(data.round, data.totalRounds);
      setEntry(data.entry);
      setStatus('playing');
      if (data.revealedChars) {
        data.revealedChars.forEach((char: string) => addRevealedChar(char));
      }
    };

    const onPeerJoin = (player: { id: string; username: string; avatar?: string }) => {
      addPlayer({ ...player, isMe: false });
    };

    const onPeerLeft = (data: { id: string }) => {
      removePlayer(data.id);
    };

    const onPeerAttempt = (attempt: { 
      playerId: string; 
      username: string; 
      answer: string;
      isCorrect: boolean;
      timestamp: number;
    }) => {
      addPeerAttempt(attempt);
    };

    const onRound = (data: { round: number; totalRounds: number; entry: string }) => {
      clearPeerAttempts();
      resetRevealed();
      setRound(data.round, data.totalRounds);
      setEntry(data.entry);
      setStatus('playing');
    };

    const onSplit = (data: { char: string }) => {
      setSplitting(true);
      addRevealedChar(data.char);
    };

    const onReveal = () => {
      setSplitting(false);
      setRevealed(true);
      setStatus('revealed');
    };

    const onCoinDiff = (data: { diff: number }) => {
      updateCoins(data.diff);
    };

    socket.on('authenticated', onAuthenticated);
    socket.on('WELCOME', onWelcome);
    socket.on('PEER_JOIN', onPeerJoin);
    socket.on('PEER_LEFT', onPeerLeft);
    socket.on('PEER_ATTEMPT', onPeerAttempt);
    socket.on('ROUND', onRound);
    socket.on('SPLIT', onSplit);
    socket.on('REVEAL', onReveal);
    socket.on('COIN_DIFF', onCoinDiff);

    return () => {
      isConnected.current = false;
      disconnectSocket();
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('unauthorized');
      socket.off('authenticated', onAuthenticated);
      socket.off('WELCOME', onWelcome);
      socket.off('PEER_JOIN', onPeerJoin);
      socket.off('PEER_LEFT', onPeerLeft);
      socket.off('PEER_ATTEMPT', onPeerAttempt);
      socket.off('ROUND', onRound);
      socket.off('SPLIT', onSplit);
      socket.off('REVEAL', onReveal);
      socket.off('COIN_DIFF', onCoinDiff);
    };
  }, [token]);

  const submitAttempt = useCallback((answer: string) => {
    socket.emit('ATTEMPT', { answer });
  }, []);

  const sendReaction = useCallback((emoji: string) => {
    socket.emit('REACTION', { emoji });
  }, []);

  const reportEntry = useCallback((reason: string) => {
    socket.emit('REPORT_ENTRY', { reason });
  }, []);

  const requestPlayerList = useCallback(() => {
    socket.emit('REQUEST_PLAYER_LIST');
  }, []);

  return {
    submitAttempt,
    sendReaction,
    reportEntry,
    requestPlayerList,
  };
};

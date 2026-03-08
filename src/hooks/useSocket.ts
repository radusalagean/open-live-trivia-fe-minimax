import { useEffect, useRef, useCallback } from 'react';
import { socket, connectSocket, disconnectSocket, setAuthenticated } from '@/lib/socket';
import { useGameStore } from '@/stores/gameStore';
import { useAuthStore } from '@/stores/authStore';

export const useSocket = () => {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const isConnected = useRef(false);

  const {
    setCategory,
    setClue,
    setAnswer,
    setCurrentValue,
    setSplitTimes,
    setFreeAttemptsLeft,
    setEntryReported,
    setPlayerCount,
    setGameState,
    setAttempts,
    setRevealedChars,
    setSplitting,
    setRevealed,
    addPlayer,
    removePlayer,
    addPeerAttempt,
    clearPeerAttempts,
    updateCoins,
    setCoins,
    setStatus,
  } = useGameStore();

  useEffect(() => {
    if (!token || isConnected.current) return;

    connectSocket(token);
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
      setAuthenticated(false);
    });

    const onAuthenticated = () => {
      console.log('Authenticated');
      setAuthenticated(true);
    };

    const onWelcome = (data: { 
      gameState: number;
      userCoins: number;
      category: string;
      clue: string;
      answer: string;
      currentValue: number;
      elapsedSplitSeconds: number;
      totalSplitSeconds: number;
      freeAttemptsLeft: number;
      entryReported: boolean;
      players: number;
      attempts: Array<{
        userId: string;
        username: string;
        message: string;
        correct: boolean;
      }>;
    }) => {
      console.log('WELCOME:', data);
      setCoins(data.userCoins);
      setCategory(data.category);
      setClue(data.clue);
      setAnswer(data.answer);
      setCurrentValue(data.currentValue);
      setSplitTimes(data.elapsedSplitSeconds, data.totalSplitSeconds);
      setFreeAttemptsLeft(data.freeAttemptsLeft);
      setEntryReported(data.entryReported);
      setPlayerCount(data.players);
      setGameState(data.gameState === 1 ? 'split' : data.gameState === 2 ? 'transition' : 'waiting');
      setAttempts(data.attempts || []);
      
      const revealedChars = data.answer.replace(/_/g, '').split('');
      setRevealedChars(revealedChars);
      
      setStatus('playing');
      setSplitting(data.gameState === 1);
      setRevealed(data.gameState === 2);
    };

    const onPeerJoin = (player: { userId: string; username: string }) => {
      console.log('PEER_JOIN:', player);
      if (user && player.userId !== user._id) {
        addPlayer({ id: player.userId, username: player.username, isMe: false });
      }
      useGameStore.getState().setPlayerCount(useGameStore.getState().playerCount + 1);
    };

    const onPeerLeft = (data: { userId: string }) => {
      console.log('PEER_LEFT:', data);
      removePlayer(data.userId);
      useGameStore.getState().setPlayerCount(Math.max(0, useGameStore.getState().playerCount - 1));
    };

    const onPeerAttempt = (attempt: { 
      userId: string; 
      username: string; 
      message: string;
      correct: boolean;
    }) => {
      console.log('PEER_ATTEMPT:', attempt);
      addPeerAttempt(attempt);
      useGameStore.getState().addAttempt(attempt);
    };

    const onRound = (data: { 
      entryId: number;
      category: string;
      clue: string;
      answer: string;
      currentValue: number;
    }) => {
      console.log('ROUND:', data);
      clearPeerAttempts();
      setRevealedChars([]);
      setCategory(data.category);
      setClue(data.clue);
      setAnswer(data.answer);
      setCurrentValue(data.currentValue);
      setGameState('waiting');
      setSplitting(false);
      setRevealed(false);
      setStatus('playing');
    };

    const onSplit = (data: { 
      answer: string;
      currentValue: number;
    }) => {
      console.log('SPLIT:', data);
      const currentTotalSplitSeconds = useGameStore.getState().totalSplitSeconds;
      setSplitting(true);
      setGameState('split');
      setAnswer(data.answer);
      setCurrentValue(data.currentValue);
      setSplitTimes(0, currentTotalSplitSeconds);
      
      const revealedChars = data.answer.replace(/_/g, '').split('');
      setRevealedChars(revealedChars);
    };

    const onReveal = (data: { answer: string }) => {
      console.log('REVEAL:', data);
      setSplitting(false);
      setRevealed(true);
      setGameState('transition');
      setAnswer(data.answer);
      setStatus('revealed');
    };

    const onCoinDiff = (data: { coinDiff: number }) => {
      updateCoins(data.coinDiff);
    };

    const onInsufficientFunds = () => {
      console.log('INSUFFICIENT_FUNDS');
    };

    const onPlayerList = (data: { 
      players: Array<{
        _id: string;
        username: string;
        rights: number;
        coins: number;
        joined: string;
      }>;
    }) => {
      const playerList = data.players.map((p) => ({
        id: p._id,
        username: p.username,
        rights: p.rights,
        coins: p.coins,
        joined: p.joined,
        isMe: user ? p._id === user._id : false,
      }));
      useGameStore.getState().setPlayers(playerList);
    };

    const onEntryReportedOk = () => {
      console.log('ENTRY_REPORTED_OK');
      setEntryReported(true);
    };

    const onEntryReportedError = () => {
      console.log('ENTRY_REPORTED_ERROR');
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
    socket.on('INSUFFICIENT_FUNDS', onInsufficientFunds);
    socket.on('PLAYER_LIST', onPlayerList);
    socket.on('ENTRY_REPORTED_OK', onEntryReportedOk);
    socket.on('ENTRY_REPORTED_ERROR', onEntryReportedError);

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
      socket.off('INSUFFICIENT_FUNDS', onInsufficientFunds);
      socket.off('PLAYER_LIST', onPlayerList);
      socket.off('ENTRY_REPORTED_OK', onEntryReportedOk);
      socket.off('ENTRY_REPORTED_ERROR', onEntryReportedError);
    };
  }, [token, user]);

  const submitAttempt = useCallback((answer: string) => {
    socket.emit('ATTEMPT', { message: answer });
  }, []);

  const reportEntry = useCallback(() => {
    socket.emit('REPORT_ENTRY');
  }, []);

  const requestPlayerList = useCallback(() => {
    socket.emit('REQUEST_PLAYER_LIST');
  }, []);

  return {
    submitAttempt,
    reportEntry,
    requestPlayerList,
  };
};

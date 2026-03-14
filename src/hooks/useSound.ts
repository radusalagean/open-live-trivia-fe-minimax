import { useEffect, useCallback } from 'react';
import { socket } from '@/lib/socket';
import { useSettingsStore } from '../stores/settingsStore';
import { playSound } from '../lib/sounds';
import { useAuthStore } from '../stores/authStore';

export const useSound = () => {
  const soundEffects = useSettingsStore((state) => state.soundEffects);
  const user = useAuthStore((state) => state.user);

  const playerId = user?._id || null;

  const play = useCallback(
    (soundName: 'won' | 'lost' | 'attempt' | 'split') => {
      if (soundEffects) {
        playSound(soundName);
      }
    },
    [soundEffects]
  );

  useEffect(() => {
    const handleAttempt = (attempt: { userId: string; correct: boolean }) => {
      if (attempt.correct) {
        if (attempt.userId === playerId) {
          play('won');
        } else {
          play('lost');
        }
        return;
      }
      play('attempt');
    };

    const handleSplit = () => {
      play('split');
    };

    socket.on('PEER_ATTEMPT', handleAttempt);
    socket.on('SPLIT', handleSplit);

    return () => {
      socket.off('PEER_ATTEMPT', handleAttempt);
      socket.off('SPLIT', handleSplit);
    };
  }, [playerId, play]);
};

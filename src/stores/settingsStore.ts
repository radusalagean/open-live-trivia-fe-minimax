import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  soundEffects: boolean;
  notifications: boolean;
  relativeTime: boolean;
  showRules: boolean;
  setSoundEffects: (enabled: boolean) => void;
  setNotifications: (enabled: boolean) => void;
  setRelativeTime: (enabled: boolean) => void;
  setShowRules: (enabled: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEffects: true,
      notifications: true,
      relativeTime: false,
      showRules: true,

      setSoundEffects: (soundEffects) => set({ soundEffects }),
      setNotifications: (notifications) => set({ notifications }),
      setRelativeTime: (relativeTime) => set({ relativeTime }),
      setShowRules: (showRules) => set({ showRules }),
    }),
    {
      name: 'open-live-trivia-settings',
    }
  )
);

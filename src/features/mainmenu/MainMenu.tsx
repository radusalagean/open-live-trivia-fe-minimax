import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { systemApi } from '@/api/endpoints';
import { useEffect, useState, useRef, useCallback } from 'react';
import { BuildInfoLabel } from '@/components/BuildInfoLabel';
import { Disclaimer } from '@/components/Disclaimer';
import { AnimatedCoins } from '@/components/AnimatedCoins';
import { UserBadge } from '@/components/UserBadge';
import { playSound } from '@/lib/sounds';
import { toast } from '@/lib/toast';

const RIGHTS_LABELS = ['', 'Moderator', 'Admin'];

const GAME_RULES = `• An entry is displayed every round
• Every player has 3 free attempts available to submit the correct answer
• Additional attempts will cost 1 point
• The answers are case insensitive
• Every 5 seconds, a new random character is revealed from the answer (defined as a split)
• Entries range from 10 to 100 points in value (based on their difficulty)
• Their value decreases as more characters are revealed
• The first player to submit the correct answer wins the prize and the round is over
• This is a real-time multiplayer game, be nice to each other 😉`;

export const MainMenu = () => {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useAuthStore();
  const showRules = useSettingsStore((state) => state.showRules);
  const soundEffects = useSettingsStore((state) => state.soundEffects);
  const [showRulesDialog, setShowRulesDialog] = useState(false);
  const prevCoinsRef = useRef<number | null>(null);
  const isFirstLoadRef = useRef(true);

  const handleCoinChange = useCallback((newCoins: number) => {
    if (prevCoinsRef.current !== null && prevCoinsRef.current !== newCoins) {
      const diff = newCoins - prevCoinsRef.current;
      if (diff > 0) {
        if (soundEffects) {
          playSound('won');
        }
        toast.success(`You won ${Math.abs(diff).toFixed(2)} points`);
      } else if (diff < 0) {
        if (soundEffects) {
          playSound('lost');
        }
        toast.error(`You lost ${Math.abs(diff).toFixed(2)} points`);
      }
    }
    prevCoinsRef.current = newCoins;
  }, [soundEffects]);

  useEffect(() => {
    if (user?.coins !== undefined && isFirstLoadRef.current) {
      prevCoinsRef.current = user.coins;
      isFirstLoadRef.current = false;
    }
  }, [user?.coins]);

  useEffect(() => {
    const loadUser = async () => {
      const previousCoins = user?.coins;
      await fetchUser();
      if (previousCoins !== undefined) {
        setTimeout(() => {
          const currentCoins = useAuthStore.getState().user?.coins;
          if (currentCoins !== undefined) {
            handleCoinChange(currentCoins);
          }
        }, 100);
      }
    };
    loadUser();
    systemApi.getInfo().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRightsLabel = (rights: number) => {
    return RIGHTS_LABELS[rights] || 'User';
  };

  const handlePlayNow = () => {
    if (showRules) {
      setShowRulesDialog(true);
    } else {
      navigate('/game');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <UserBadge user={user} />
          {user && user.rights > 0 && (
            <button
              onClick={() => navigate('/moderate')}
              className="text-xs bg-rights-indicator text-white px-2 py-1 rounded hover:bg-warn transition-colors"
            >
              {getRightsLabel(user.rights)}
            </button>
          )}
        </div>
        
        <a
          href="https://github.com/radusalagean/open-live-trivia-fe-minimax"
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded-lg hover:bg-dark-grey transition-colors"
        >
          <img src="/github-icon.png" alt="GitHub" className="w-6 h-6" />
        </a>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Open Live Trivia"
          className="w-28 h-28 mb-6"
        />

        {/* Coins */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow mb-8">
          <img src="/coin.png" alt="Coins" className="w-6 h-6 align-middle" />
          <AnimatedCoins value={user?.coins || 0} animated={true} className="text-xl text-black font-bold align-bottom" />
        </div>

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={handlePlayNow}
            className="w-full btn-primary"
          >
            Play Now
          </button>

          <button
            onClick={() => navigate('/leaderboard')}
            className="w-full btn-secondary"
          >
            Leaderboard
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-full btn-secondary"
          >
            Settings
          </button>

          <button
            onClick={handleLogout}
            className="w-full btn-negative"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <BuildInfoLabel />
        <div className="mt-2 max-w-xs mx-auto">
          <Disclaimer />
        </div>
        <div className="mt-4 text-right">
          <a href="/privacy-policy.html" className="text-xs text-gray-500 hover:text-primary underline">Privacy Policy</a>
        </div>
      </div>

      {/* Rules Dialog */}
      {showRulesDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Game rules</h2>
            <div className="text-gray-600 whitespace-pre-line mb-6">{GAME_RULES}</div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRulesDialog(false)}
                className="flex-1 py-2 bg-light-grey text-gray-700 rounded-lg hover:bg-dark-grey transition-colors"
              >
                Take me back
              </button>
              <button
                onClick={() => {
                  setShowRulesDialog(false);
                  navigate('/game');
                }}
                className="flex-1 py-2 bg-primary text-white rounded-lg hover:brightness-110 transition-all"
              >
                Let's play
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

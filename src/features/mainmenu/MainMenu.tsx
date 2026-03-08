import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { systemApi } from '@/api/endpoints';
import { useEffect } from 'react';
import { BUILD_INFO } from '@/build-info';

const RIGHTS_LABELS = ['', 'Moderator', 'Admin'];

export const MainMenu = () => {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
    systemApi.getInfo().catch(console.error);
  }, [fetchUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRightsLabel = (rights: number) => {
    return RIGHTS_LABELS[rights] || 'User';
  };

  return (
    <div className="flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-end items-start">
        
        <div className="flex items-center gap-4">
          {user && user.rights > 0 && (
            <button
              onClick={() => navigate('/moderate')}
              className="text-xs bg-rights-indicator text-white px-2 py-1 rounded"
            >
              {getRightsLabel(user.rights)}
            </button>
          )}
          
          <a
            href="https://github.com/radusalagean/open-live-trivia-fe-minimax"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1"
          >
            <img src="/github-icon.png" alt="GitHub" className="w-6 h-6" />
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Open Live Trivia"
          className="w-28 h-28 mb-6"
        />

        {/* Coins */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow mb-8">
          <img src="/coin.png" alt="Coins" className="w-6 h-6" />
          <span className="font-mono text-xl text-black font-bold">{user?.coins?.toFixed(2) || '0.00'}</span>
        </div>

        {/* Buttons */}
        <div className="w-full max-w-xs space-y-3">
          <button
            onClick={() => navigate('/game')}
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
        <span className="text-xs text-super-ultra-dark-grey">Built at: {BUILD_INFO.builtAt}</span>
      </div>
    </div>
  );
};

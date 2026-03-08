import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { systemApi } from '@/api/endpoints';
import { useEffect } from 'react';

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
      <div className="flex justify-between items-start">
        <span className="text-sm text-super-ultra-dark-grey">v1.0.0</span>
        
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
            href="https://github.com/radusalagean/open-live-trivia-api"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1"
          >
            <svg className="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center mb-6">
          <span className="text-white text-4xl font-bold">?</span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow mb-8">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-yellow-600 rounded-full"></div>
          </div>
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
      <div className="flex justify-between items-end">
        <div></div>
        <a
          href="#"
          className="text-sm text-super-ultra-dark-grey italic hover:text-gray-500"
        >
          Privacy Policy
        </a>
      </div>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { systemApi } from '@/api/endpoints';
import { useEffect, useState } from 'react';
import type { SystemInfo } from '@/types';

const RIGHTS_LABELS = ['', 'Moderator', 'Admin'];

export const MainMenu = () => {
  const navigate = useNavigate();
  const { user, logout, fetchUser } = useAuthStore();
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);

  useEffect(() => {
    fetchUser();
    systemApi.getInfo().then(setSystemInfo).catch(console.error);
  }, [fetchUser]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRightsLabel = (rights: number) => {
    return RIGHTS_LABELS[rights] || 'User';
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 p-4 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Open Live Trivia</h1>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-lg w-full space-y-6">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {user?.username?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.username}</h2>
                <p className="text-gray-400 text-sm">Joined: {user?.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-yellow-400">{user?.coins ?? 0}</p>
                <p className="text-gray-400 text-sm">Coins</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-400">{systemInfo?.isTriviaServiceRunning ? 'Online' : 'Offline'}</p>
                <p className="text-gray-400 text-sm">Game</p>
              </div>
            </div>

            {user && user.rights > 0 && (
              <div className="mb-4 p-3 bg-purple-500/20 border border-purple-500 rounded-lg">
                <p className="text-purple-400 text-sm">{getRightsLabel(user.rights)} Panel</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate('/game')}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Play Now
            </button>

            <button
              onClick={() => navigate('/leaderboard')}
              className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Leaderboard
            </button>

            <button
              onClick={() => navigate('/settings')}
              className="w-full py-4 px-6 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

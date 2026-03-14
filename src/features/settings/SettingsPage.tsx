import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { authApi, systemApi } from '@/api/endpoints';
import { formatDate } from '@/lib/dateTime';

interface ToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

const Toggle = ({ enabled, onChange }: ToggleProps) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`w-12 h-6 rounded-full relative transition-colors ${
      enabled ? 'bg-primary' : 'bg-super-dark-grey'
    }`}
  >
    <div
      className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-0.5'
      }`}
    />
  </button>
);

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const soundEffects = useSettingsStore((state) => state.soundEffects);
  const notifications = useSettingsStore((state) => state.notifications);
  const relativeTime = useSettingsStore((state) => state.relativeTime);
  const showRules = useSettingsStore((state) => state.showRules);
  const setSoundEffects = useSettingsStore((state) => state.setSoundEffects);
  const setNotifications = useSettingsStore((state) => state.setNotifications);
  const setRelativeTime = useSettingsStore((state) => state.setRelativeTime);
  const setShowRules = useSettingsStore((state) => state.setShowRules);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await authApi.deleteAccount();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDisconnectAll = async () => {
    setDisconnecting(true);
    try {
      await systemApi.disconnectEveryone();
    } catch (error) {
      console.error('Failed to disconnect everyone:', error);
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md flex items-center">
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:text-primary-dark clickable px-2 py-1"
        >
          ← Back
        </button>
        <h1 className="flex-1 text-center text-gray-800 font-bold text-lg">Settings</h1>
        <div className="w-10"></div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Account Section */}
          <div className="p-4 border-b border-light-grey">
            <h2 className="text-gray-800 font-bold mb-3">Account</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Username</span>
                <span className="text-gray-800 font-medium">{user?.username}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Joined</span>
                <span className="text-gray-800">{user?.joined ? formatDate(user.joined, relativeTime) : 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Role</span>
                <span className="text-gray-800 capitalize">
                  {user?.rights === 0 ? 'User' : user?.rights === 1 ? 'Moderator' : 'Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="p-4 border-b border-light-grey">
            <h2 className="text-gray-800 font-bold mb-3">Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Sound Effects</span>
                <Toggle enabled={soundEffects} onChange={setSoundEffects} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Notifications</span>
                <Toggle enabled={notifications} onChange={setNotifications} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Relative Time</span>
                <Toggle enabled={relativeTime} onChange={setRelativeTime} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Show Rules on Game Join</span>
                <Toggle enabled={showRules} onChange={setShowRules} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-super-ultra-dark-grey text-white font-bold rounded-lg hover:bg-gray-600 transition-colors"
            >
              Logout
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 bg-negative/10 text-negative font-bold rounded-lg hover:bg-negative/20 transition-colors"
            >
              Delete Account
            </button>
          </div>

          {/* Admin Section */}
          {user?.rights === 2 && (
            <div className="p-4 border-t border-light-grey">
              <h2 className="text-gray-800 font-bold mb-3 text-negative">Danger Zone</h2>
              <button
                onClick={handleDisconnectAll}
                disabled={disconnecting}
                className="w-full py-3 bg-negative text-white font-bold rounded-lg disabled:opacity-50 hover:bg-red-600 transition-colors"
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect All Players'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Delete Account</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 bg-light-grey text-gray-700 rounded-lg hover:bg-dark-grey transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 bg-negative text-white rounded-lg disabled:opacity-50 hover:bg-red-600 transition-colors"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

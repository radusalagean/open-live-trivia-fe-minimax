import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/endpoints';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md flex items-center">
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:text-primary-dark"
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
                <span className="text-gray-800">{user?.joined ? new Date(user.joined).toLocaleDateString() : 'N/A'}</span>
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
                <button className="w-12 h-6 bg-super-dark-grey rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Notifications</span>
                <button className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-super-ultra-dark-grey text-white font-bold rounded-lg"
            >
              Logout
            </button>

            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 bg-negative/10 text-negative font-bold rounded-lg"
            >
              Delete Account
            </button>
          </div>
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
                className="flex-1 py-2 bg-light-grey text-gray-700 rounded-lg hover:bg-medium-grey"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 bg-negative text-white rounded-lg disabled:opacity-50"
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

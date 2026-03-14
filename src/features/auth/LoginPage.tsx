import { useState, useEffect, useCallback, useRef } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/stores/authStore';
import { systemApi, authApi } from '@/api/endpoints';
import { Disclaimer } from '@/components/Disclaimer';
import { BuildInfoLabel } from '@/components/BuildInfoLabel';

const FRONTEND_VERSION = '1.0.0';
const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 50;
const USERNAME_CHECK_DEBOUNCE_MS = 500;

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, register } = useAuthStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [versionWarning, setVersionWarning] = useState<string | null>(null);
  const idTokenRef = useRef<string | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const checkServerVersion = async () => {
      try {
        const info = await systemApi.getInfo();
        if (info.minAppVersionCode > parseInt(FRONTEND_VERSION.replace(/\./g, ''), 10)) {
          setError('Your app version is outdated. Please update to continue.');
          setLoading(true);
        } else if (info.latestAppVersionCode > parseInt(FRONTEND_VERSION.replace(/\./g, ''), 10)) {
          setVersionWarning('A newer version is available. Consider updating for the best experience.');
        }
      } catch (err) {
        console.error('Failed to check server version:', err);
      }
    };
    checkServerVersion();
  }, []);

  const checkUsernameAvailability = useCallback(async (usernameToCheck: string) => {
    if (!usernameToCheck.trim()) {
      setUsernameStatus('idle');
      return;
    }

    if (usernameToCheck.length < USERNAME_MIN_LENGTH) {
      setUsernameStatus('idle');
      return;
    }

    setUsernameStatus('checking');
    try {
      await authApi.checkUsername(usernameToCheck);
      setUsernameStatus('available');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { status?: number } };
        if (axiosErr.response?.status === 409) {
          setUsernameStatus('unavailable');
          return;
        }
      }
      setUsernameStatus('idle');
    }
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!isRegistering || !username.trim()) {
      setUsernameStatus('idle');
      return;
    }

    if (username.length > USERNAME_MAX_LENGTH) {
      setUsernameStatus('idle');
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      checkUsernameAvailability(username);
    }, USERNAME_CHECK_DEBOUNCE_MS);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [username, isRegistering, checkUsernameAvailability]);

  const getUsernameValidationError = (): string | null => {
    if (!username.trim()) return null;
    if (username.length < USERNAME_MIN_LENGTH) {
      return `Username must be at least ${USERNAME_MIN_LENGTH} characters`;
    }
    if (username.length > USERNAME_MAX_LENGTH) {
      return `Username must be no more than ${USERNAME_MAX_LENGTH} characters`;
    }
    return null;
  };

  const canRegister = (): boolean => {
    return (
      username.trim().length >= USERNAME_MIN_LENGTH &&
      username.length <= USERNAME_MAX_LENGTH &&
      usernameStatus === 'available'
    );
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      if (isRegistering) {
        const validationError = getUsernameValidationError();
        if (validationError) {
          setError(validationError);
          setLoading(false);
          return;
        }
        if (!canRegister()) {
          setError('Please enter a valid username');
          setLoading(false);
          return;
        }
        await register(idToken, username);
      } else {
        try {
          await login(idToken);
        } catch (loginErr: unknown) {
          if (loginErr && typeof loginErr === 'object' && 'response' in loginErr) {
            const axiosErr = loginErr as { response?: { status?: number } };
            if (axiosErr.response?.status === 404) {
              idTokenRef.current = idToken;
              setIsRegistering(true);
              setError('');
              setLoading(false);
              return;
            }
          }
          throw loginErr;
        }
      }
      navigate('/');
    } catch (err: unknown) {
      console.error('Login error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Authentication failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    setError('');
  };

  const getUsernameStatusText = (): string | null => {
    if (usernameStatus === 'checking') return 'Checking...';
    if (usernameStatus === 'available') return 'Username available';
    if (usernameStatus === 'unavailable') return 'Username unavailable';
    return null;
  };

  const getUsernameStatusClass = (): string => {
    if (usernameStatus === 'available') return 'text-green-600';
    if (usernameStatus === 'unavailable') return 'text-error';
    return 'text-gray-500';
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        {/* Logo */}
        <img
          src="/logo.png"
          alt="Open Live Trivia"
          className="w-28 h-28 mx-auto mb-6"
        />
        
        {isRegistering && (
          <div className="mb-4">
            <label className="block text-gray-600 text-sm mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={handleUsernameChange}
              className="w-full px-4 py-3 input-field"
              placeholder="Choose a username"
              maxLength={USERNAME_MAX_LENGTH}
            />
            {getUsernameValidationError() && (
              <p className="mt-1 text-xs text-error">{getUsernameValidationError()}</p>
            )}
            {getUsernameStatusText() && (
              <p className={`mt-1 text-xs ${getUsernameStatusClass()}`}>
                {getUsernameStatusText()}
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error text-error text-sm rounded-lg">
            {error}
          </div>
        )}

        {versionWarning && !error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-400 text-yellow-700 text-sm rounded-lg">
            {versionWarning}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading || (isRegistering && !canRegister())}
          className="w-full py-3 px-4 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:brightness-110 transition-all"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          {isRegistering ? 'Sign up with Google' : 'Sign in with Google'}
        </button>

        <button
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
            setUsernameStatus('idle');
          }}
          className="w-full mt-4 text-primary hover:text-primary-dark text-sm transition-colors"
        >
          {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
        </button>

        <div className="mt-6">
          <Disclaimer />
        </div>

        <div className="mt-4 text-center">
          <BuildInfoLabel />
        </div>

        <div className="mt-4 text-right">
          <a href="/privacy-policy.html" className="text-xs text-gray-500 hover:text-primary underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import { useGameStore } from '@/stores/gameStore';
import { useAuthStore } from '@/stores/authStore';

export const GamePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { submitAttempt, reportEntry, requestPlayerList } = useSocket();
  const [answer, setAnswer] = useState('');
  const [showPlayerDrawer, setShowPlayerDrawer] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const {
    category,
    clue,
    answer: currentAnswer,
    currentValue,
    elapsedSplitSeconds,
    totalSplitSeconds,
    entryReported,
    playerCount,
    isSplitting,
    isRevealed,
    players,
    attempts,
    coins,
    status,
  } = useGameStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [localElapsed, setLocalElapsed] = useState(0);
  
  useEffect(() => {
    if (!isSplitting) {
      setLocalElapsed(0);
      return;
    }
    
    const maxSeconds = totalSplitSeconds || 15;
    const interval = setInterval(() => {
      setLocalElapsed((prev) => {
        if (prev >= maxSeconds) {
          clearInterval(interval);
          return maxSeconds;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isSplitting, totalSplitSeconds]);

  const displayedElapsed = isSplitting ? localElapsed : elapsedSplitSeconds;
  const displayedTotal = totalSplitSeconds || 15;
  const progressPercent = ((displayedTotal - displayedElapsed) / displayedTotal) * 100;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() && status === 'playing') {
      submitAttempt(answer.trim());
      setAnswer('');
    }
  };

  const handleReport = () => {
    reportEntry();
    setShowMenu(false);
  };

  const displayedAnswer = isRevealed || isSplitting ? currentAnswer : currentAnswer.replace(/[A-Za-z]/g, '_');
  const myUserId = user?._id;
  const myAttempts = attempts.filter((a) => a.userId === myUserId);
  const myLatestAttempt = myAttempts[myAttempts.length - 1];
  const canSubmit = status === 'playing' && answer.trim();

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 p-3 shadow-md flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-white"
        >
          ← Back
        </button>
        
        <button
          onClick={() => {
            setShowPlayerDrawer(!showPlayerDrawer);
            if (!showPlayerDrawer) requestPlayerList();
          }}
          className="flex items-center gap-2 text-gray-300 hover:text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{playerCount}</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-yellow-400">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-bold">{coins}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="max-w-2xl w-full space-y-4">
          {/* Category & Entry Card */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg relative">
            {/* Menu Button */}
            <div className="absolute top-2 right-2" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-gray-700 rounded-lg shadow-xl z-10">
                  <button
                    onClick={handleReport}
                    disabled={entryReported}
                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-600 disabled:opacity-50 ${entryReported ? 'text-gray-500' : 'text-red-400'}`}
                  >
                    {entryReported ? 'Entry Reported' : 'Report Entry'}
                  </button>
                </div>
              )}
            </div>

            {/* Category */}
            {category && (
              <div className="text-center mb-4">
                <span className="text-blue-400 text-sm font-medium uppercase tracking-wide">
                  {category}
                </span>
              </div>
            )}

            {/* Clue */}
            {clue && (
              <div className="text-center mb-4">
                <p className="text-gray-300 text-lg">{clue}</p>
              </div>
            )}

            {/* Answer */}
            <div className="text-center mb-4">
              <div className="text-3xl md:text-4xl font-bold text-white tracking-widest font-mono">
                {displayedAnswer}
              </div>
            </div>

            {/* Timer Progress Bar */}
            {isSplitting && (
              <div className="mb-4">
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-center text-gray-400 text-xs mt-1">
                  {displayedTotal - displayedElapsed}s
                </div>
              </div>
            )}

            {/* Current Value */}
            <div className="text-center mb-4">
              <span className="text-yellow-400 text-2xl font-bold">{currentValue}</span>
              <span className="text-gray-400 text-sm ml-1">coins</span>
            </div>

            {/* Answer Input */}
            {status === 'playing' && (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {myLatestAttempt ? 'Submit Another Answer' : 'Submit Answer'}
                </button>
              </form>
            )}

            {/* My Attempts Results */}
            {myLatestAttempt && (
              <div className={`text-center p-4 rounded-lg ${myLatestAttempt.correct ? 'bg-green-900/50' : 'bg-gray-700'}`}>
                <p className="text-gray-400 text-sm">Your {myAttempts.length > 1 ? `attempt ${myAttempts.length}` : 'answer'}:</p>
                <p className="text-xl font-bold text-white">{myLatestAttempt.message}</p>
                {myLatestAttempt.correct && (
                  <p className="text-sm text-green-400">Correct!</p>
                )}
              </div>
            )}
          </div>

          {/* Attempts List */}
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg max-h-48 overflow-y-auto">
            <h3 className="text-gray-400 text-sm mb-3">Attempts ({attempts.length})</h3>
            <div className="space-y-2">
              {attempts.map((attempt, i) => (
                <div 
                  key={i} 
                  className={`flex justify-between items-center p-2 rounded ${attempt.userId === myUserId ? 'bg-blue-900/30' : 'bg-gray-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{attempt.username}</span>
                    {attempt.userId === myUserId && (
                      <span className="text-xs bg-blue-600 text-white px-1 rounded">You</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-300">{attempt.message}</span>
                    {attempt.correct && (
                      <span className="text-green-400">✓</span>
                    )}
                  </div>
                </div>
              ))}
              {attempts.length === 0 && (
                <p className="text-gray-500 text-sm">No attempts yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Player Drawer Overlay */}
      {showPlayerDrawer && (
        <div className="fixed inset-0 z-20">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPlayerDrawer(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-gray-800 shadow-xl flex flex-col">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-white font-bold text-lg">Players</h2>
              <button
                onClick={() => setShowPlayerDrawer(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {players.length > 0 ? (
                <div className="space-y-2">
                  {players.map((player) => (
                    <div 
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white font-bold">
                          {player.username[0].toUpperCase()}
                        </div>
                        <span className="text-white">{player.username}</span>
                        {player.isMe && (
                          <span className="text-xs bg-blue-600 text-white px-1 rounded">You</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center">No players online</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-700">
              <button
                onClick={requestPlayerList}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

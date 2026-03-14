import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, UsersIcon, VolumeIcon, VolumeMuted } from '@/components/icons';
import { useSocket } from '@/hooks/useSocket';
import { useSound } from '@/hooks/useSound';
import { useGameStore } from '@/stores/gameStore';
import { useAuthStore } from '@/stores/authStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { stopAllSounds } from '@/lib/sounds';
import { Avatar } from '@/components/Avatar';

export const GamePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { submitAttempt, reportEntry, requestPlayerList } = useSocket();
  const { setSoundEffects, soundEffects } = useSettingsStore();
  useSound();
  const [answer, setAnswer] = useState('');
  const [showPlayerDrawer, setShowPlayerDrawer] = useState(false);
  const [isClosingDrawer, setIsClosingDrawer] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const attemptsEndRef = useRef<HTMLDivElement>(null);

  const {
    category,
    clue,
    answer: currentAnswer,
    currentValue,
    totalSplitSeconds,
    elapsedSplitSeconds,
    entryReported,
    playerCount,
    isSplitting,
    isRevealed,
    players,
    attempts,
    coins,
    status,
    gameState,
    timerResetCount,
    roundWon,
    revealedAnswer,
  } = useGameStore();

  const [localElapsed, setLocalElapsed] = useState(0);
  const prevTimerResetCount = useRef(timerResetCount);
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (timerResetCount !== prevTimerResetCount.current) {
      prevTimerResetCount.current = timerResetCount;
      setLocalElapsed(0);
    } else if (elapsedSplitSeconds > 0 && isSplitting) {
      setLocalElapsed(elapsedSplitSeconds);
    }
  }, [timerResetCount, elapsedSplitSeconds, isSplitting]);
  
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (isRevealed || gameState === 'waiting' || !isSplitting) {
      return;
    }
    
    const maxSeconds = totalSplitSeconds || 15;
    const startFrom = elapsedSplitSeconds > 0 ? elapsedSplitSeconds : 0;
    setLocalElapsed(startFrom);
    
    intervalRef.current = window.setInterval(() => {
      setLocalElapsed((prev) => {
        if (prev >= maxSeconds) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return maxSeconds;
        }
        return prev + 1;
      });
    }, 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isSplitting, totalSplitSeconds, gameState, isRevealed, elapsedSplitSeconds]);

  const progressPercent = totalSplitSeconds > 0 
    ? ((totalSplitSeconds - localElapsed) / totalSplitSeconds) * 100 
    : 0;

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

  const handleCopyAttempt = (message: string) => {
    if (status === 'playing') {
      setAnswer(message);
    }
  };

  const myUserId = user?._id;
  const canSubmit = status === 'playing' && gameState === 'split' && !roundWon && answer.trim();

  const getRightsLabel = (rights?: number) => {
    if (rights === 1) return 'MOD';
    if (rights === 2) return 'ADMIN';
    return null;
  };

  useEffect(() => {
    attemptsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [attempts]);

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:text-primary-dark clickable p-1"
          >
            <ArrowLeftIcon />
          </button>
          <button
            onClick={() => {
              setShowPlayerDrawer(!showPlayerDrawer);
              requestPlayerList();
            }}
            className="flex items-center gap-1 text-primary rounded px-2 py-1 hover:bg-dark-grey transition-colors"
          >
            <UsersIcon />
            <span className="font-medium">{playerCount}</span>
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          <img src="/coin.png" alt="Coins" className="w-5 h-5" />
          <span className="font-bold text-gray-800" style={{ fontFamily: '"Share Tech Mono", monospace' }}>{coins.toFixed(2)}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (!soundEffects) {
                stopAllSounds();
              }
              setSoundEffects(!soundEffects);
            }}
            className="text-gray-600 hover:text-gray-800 clickable p-1"
          >
            {soundEffects ? <VolumeIcon /> : <VolumeMuted />}
          </button>
          <div className="flex items-center gap-2 text-gray-700 bg-light-grey px-3 py-1 rounded">
            <Avatar userId={user?._id || ''} username={user?.username || ''} size="sm" />
            <span className="font-medium max-w-[100px] truncate">{user?.username}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Entry Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300">
          <div className="p-3">
            {/* Category & Coins Row */}
            <div className="flex items-center justify-between mb-3">
              {category && (
                <span className="text-category">{category}</span>
              )}
              
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-gray-800 font-bold" style={{ fontFamily: '"Share Tech Mono", monospace' }}>{currentValue.toFixed(2)}</span>
<img src="/coin.png" alt="Coins" className="w-5 h-5 align-middle" />
              </div>

              {/* Menu Button */}
              <div className="ml-2 relative" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-super-ultra-dark-grey hover:text-gray-700 clickable rounded-full"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-xl z-10 border border-dark-grey">
                    <button
                      onClick={handleReport}
                      disabled={entryReported}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-light-grey disabled:opacity-50 ${entryReported ? 'text-gray-400' : 'text-negative'}`}
                    >
                      {entryReported ? 'Entry Reported' : 'Report Entry'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Clue */}
            {clue && (
              <div className="mb-3">
                <p className="text-gray-700 text-base">{clue}</p>
              </div>
            )}

            {/* Answer */}
            <div className="text-center mb-3">
              <div 
                className={`answer-text inline-block px-2 py-0.5 transition-all duration-300 ${
                  roundWon ? 'bg-correct-answer text-white' : 
                  isRevealed ? 'bg-reveal-answer text-white' : ''
                }`}
              >
                {revealedAnswer || currentAnswer}
              </div>
            </div>

            {/* Timer Progress Bar */}
            <div className={`-mx-3 -mb-3 transition-all duration-300 ${isSplitting && !roundWon && !isRevealed ? 'opacity-100' : 'opacity-0'}`}>
              <div className="h-1 bg-dark-grey">
                <div 
                  className="h-full bg-accent"
                  style={{ width: `${Math.max(0, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Attempts List - Android style bubbles */}
        <div className="space-y-2">
          {attempts.map((attempt, i) => {
            const isMyAttempt = attempt.userId === myUserId;
            return (
              <div 
                key={i} 
                className={`flex ${isMyAttempt ? 'justify-end' : 'justify-start'}`}
              >
                {!isMyAttempt && (
                  <Avatar userId={attempt.userId} username={attempt.username} size="sm" className="mr-2" />
                )}
                <div 
                  onClick={() => isMyAttempt && handleCopyAttempt(attempt.message)}
                  className={`max-w-[75%] px-4 py-2 rounded-xl ${
                    attempt.correct 
                      ? 'bg-accent text-black' 
                      : 'bg-dark-grey text-black'
                  } ${isMyAttempt && status === 'playing' ? 'cursor-pointer hover:brightness-95' : ''}`}
                >
                  {!isMyAttempt && (
                    <p className="text-xs text-gray-500 mb-1 font-light italic">{attempt.username}</p>
                  )}
                  <p className={attempt.correct ? 'font-semibold' : ''}>
                    {attempt.message}
                  </p>
                </div>
                {isMyAttempt && (
                  <Avatar userId={attempt.userId} username={attempt.username} size="sm" className="ml-2" />
                )}
              </div>
            );
          })}
          {attempts.length === 0 && (
            <p className="text-super-ultra-dark-grey text-sm text-center py-4">No attempts yet</p>
          )}
          <div ref={attemptsEndRef} />
        </div>
      </div>

      {/* Sticky Input Bar */}
      <div className="bg-white border-t border-light-grey p-3 flex-shrink-0">
        {status === 'playing' && (
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="input-field flex-1"
              autoFocus
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!canSubmit}
              className="p-2 bg-primary text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        )}
      </div>

      {/* Player Drawer Overlay */}
      {(showPlayerDrawer || isClosingDrawer) && (
        <div className="fixed inset-0 z-20">
          <div 
            className="absolute inset-0 bg-black/30"
            onClick={() => {
              setIsClosingDrawer(true);
              setTimeout(() => {
                setShowPlayerDrawer(false);
                setIsClosingDrawer(false);
              }, 300);
            }}
          />
          <div className={`absolute left-0 top-0 bottom-0 w-80 bg-white shadow-xl flex flex-col ${isClosingDrawer ? 'animate-slide-out-x' : 'animate-slide-in-x'}`}>
            <div className="p-4 border-b border-light-grey flex justify-between items-center">
              <h2 className="text-gray-800 font-bold text-lg">Players</h2>
              <button
                onClick={() => {
                  setIsClosingDrawer(true);
                  setTimeout(() => {
                    setShowPlayerDrawer(false);
                    setIsClosingDrawer(false);
                  }, 300);
                }}
                className="text-gray-500 hover:text-gray-700"
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
                      className="flex items-center justify-between p-3 bg-light-grey rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar userId={player.id} username={player.username} size="sm" />
                        <span className="text-gray-800">{player.username}</span>
                        {player.isMe && (
                          <span className="text-xs bg-primary text-white px-1 rounded">You</span>
                        )}
                        {player.rights && player.rights > 0 && (
                          <span className="text-xs bg-rights-indicator text-white px-1 rounded">
                            {getRightsLabel(player.rights)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-super-ultra-dark-grey text-center">No players online</p>
              )}
            </div>
            <div className="p-4 border-t border-light-grey">
              <button
                onClick={requestPlayerList}
                className="w-full py-2 btn-primary"
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

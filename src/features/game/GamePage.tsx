import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import { useGameStore } from '@/stores/gameStore';
import { useAuthStore } from '@/stores/authStore';

const EMOJIS = ['👍', '👎', '😂', '😮', '😢', '🔥'];

export const GamePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { submitAttempt, sendReaction, reportEntry } = useSocket();
  const [answer, setAnswer] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const {
    currentRound,
    totalRounds,
    revealedChars,
    isSplitting,
    isRevealed,
    players,
    myAttempt,
    peerAttempts,
    coins,
    status,
  } = useGameStore();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      submitAttempt(answer.trim());
      setAnswer('');
    }
  };

  const handleReport = () => {
    if (reportReason.trim()) {
      reportEntry(reportReason.trim());
      setShowReportModal(false);
      setReportReason('');
    }
  };

  const maskedAnswer = isRevealed 
    ? useGameStore.getState().currentEntry 
    : revealedChars.join('') || '_ '.repeat(useGameStore.getState().currentEntry.length || 5);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 p-3 shadow-md">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <div className="flex items-center gap-4">
            <span className="text-yellow-400 font-bold">{coins} coins</span>
            <span className="text-gray-400">
              Round {currentRound}/{totalRounds}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl w-full space-y-6">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-gray-400 text-sm mb-2">Guess the Movie</h2>
              <div className="text-4xl font-bold text-white tracking-widest">
                {maskedAnswer}
              </div>
              {isSplitting && (
                <div className="mt-2 text-blue-400 animate-pulse">Revealing...</div>
              )}
            </div>

            {status === 'playing' && !myAttempt && (
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={!answer.trim()}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Submit Answer
                </button>
              </form>
            )}

            {myAttempt && (
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <p className="text-gray-400 text-sm">Your answer:</p>
                <p className="text-xl font-bold text-white">{myAttempt.answer}</p>
                <p className={`text-sm ${myAttempt.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                  {myAttempt.isCorrect ? 'Correct!' : 'Wrong!'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
            <h3 className="text-gray-400 text-sm mb-3">Players ({players.length})</h3>
            <div className="flex flex-wrap gap-2">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`px-3 py-1 rounded-full text-sm ${player.isMe ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'}`}
                >
                  {player.username}
                </div>
              ))}
            </div>
          </div>

          {peerAttempts.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-4 shadow-lg">
              <h3 className="text-gray-400 text-sm mb-3">Other Answers</h3>
              <div className="space-y-2">
                {peerAttempts.map((attempt, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-700 rounded-lg p-3">
                    <span className="text-white">{attempt.username}</span>
                    <span className="text-gray-400">{attempt.answer}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center gap-2">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => sendReaction(emoji)}
                className="w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-full text-xl transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowReportModal(true)}
            className="w-full py-2 text-red-400 hover:text-red-300 text-sm"
          >
            Report this entry
          </button>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-4">Report Entry</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Reason for reporting..."
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 mb-4"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

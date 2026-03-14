import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardApi } from '@/api/endpoints';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatDate } from '@/lib/dateTime';
import type { LeaderboardEntry } from '@/types';
import { Avatar } from '@/components/Avatar';

const RIGHTS_LABELS = ['', 'MOD', 'ADMIN'];

export const LeaderboardPage = () => {
  const navigate = useNavigate();
  const relativeTime = useSettingsStore((state) => state.relativeTime);
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLeaderboard = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const response = await leaderboardApi.getLeaderboard(pageNum);
      if (pageNum === 1) {
        setEntries(response.items);
      } else {
        setEntries((prev) => [...prev, ...response.items]);
      }
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(1);
  }, [fetchLeaderboard]);

  const handleLoadMore = () => {
    if (loading || page >= totalPages) {
      return;
    }
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLeaderboard(nextPage);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && page < totalPages) {
      handleLoadMore();
    }
  }, [loading, page, totalPages]);

  const getPlaceColor = (index: number) => {
    if (index === 0) return 'bg-gold text-white';
    if (index === 1) return 'bg-silver text-white';
    if (index === 2) return 'bg-bronze text-white';
    return 'bg-accent text-white';
  };

  const getRightsLabel = (rights: number) => {
    return RIGHTS_LABELS[rights] || '';
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
        <h1 className="flex-1 text-center text-gray-800 font-bold text-lg">Leaderboard</h1>
        <div className="w-12"></div>
      </div>

      {/* Leaderboard List */}
      <div 
        className="flex-1 overflow-auto p-4"
        onScroll={handleScroll}
      >
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {entries.map((entry, index) => (
            <div
              key={entry._id}
              className={`flex items-center p-3 ${index !== entries.length - 1 ? 'border-b border-light-grey' : ''}`}
            >
              {/* Place Badge */}
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${getPlaceColor(index)}`}>
                {index + 1}
              </span>
              
              {/* Avatar */}
              <Avatar userId={entry._id} username={entry.username} className="ml-3" />
              
              {/* Username & Rights */}
              <div className="flex-1 ml-3 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-gray-800 font-bold truncate">{entry.username}</p>
                  {entry.rights > 0 && (
                    <span className="text-xs bg-rights-indicator text-white px-1 rounded flex-shrink-0">
                      {getRightsLabel(entry.rights)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {entry.playing ? (
                    <span className="text-xs text-green-600 font-medium">Playing</span>
                  ) : entry.lastSeen ? (
                    <span className="text-xs text-gray-500">Last seen {formatDate(entry.lastSeen, relativeTime)}</span>
                  ) : null}
                </div>
              </div>
              
              {/* Coins */}
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <span className="text-gray-800 font-bold align-bottom" style={{ fontFamily: '"Share Tech Mono", monospace' }}>{entry.coins.toLocaleString()}</span>
                <img src="/coin.png" alt="Coins" className="w-5 h-5 align-middle" />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}

          {!loading && page < totalPages && (
            <button
              onClick={handleLoadMore}
              className="w-full py-3 text-center text-primary hover:text-primary-dark font-medium"
            >
              Load More
            </button>
          )}

          {!loading && entries.length === 0 && (
            <div className="text-center py-8 text-super-ultra-dark-grey">
              No entries yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

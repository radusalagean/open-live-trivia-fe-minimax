import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { leaderboardApi } from '@/api/endpoints';
import type { LeaderboardEntry } from '@/types';

export const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaderboard = useCallback(async (pageNum: number, isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      const response = await leaderboardApi.getLeaderboard(pageNum);
      if (isRefresh) {
        setEntries(response.items);
      } else {
        setEntries((prev) => [...prev, ...response.items]);
      }
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(1);
  }, [fetchLeaderboard]);

  const handleRefresh = () => {
    setPage(1);
    fetchLeaderboard(1, true);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchLeaderboard(nextPage);
    }
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && page < totalPages) {
      handleLoadMore();
    }
  }, [loading, page, totalPages]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="bg-gray-800 p-4 shadow-md">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <h1 className="text-xl font-bold text-white">Leaderboard</h1>
          <button
            onClick={handleRefresh}
            className="text-gray-400 hover:text-white"
            disabled={refreshing}
          >
            {refreshing ? '...' : '↻'}
          </button>
        </div>
      </div>

      <div 
        className="flex-1 overflow-auto p-4"
        onScroll={handleScroll}
      >
        <div className="max-w-lg mx-auto space-y-2">
          {entries.map((entry, index) => (
            <div
              key={entry._id}
              className={`flex items-center gap-4 bg-gray-800 rounded-lg p-4 ${
                index === 0 ? 'border-2 border-yellow-400' :
                index === 1 ? 'border-2 border-gray-300' :
                index === 2 ? 'border-2 border-amber-600' : ''
              }`}
            >
              <div className={`w-8 text-center font-bold ${
                index === 0 ? 'text-yellow-400' :
                index === 1 ? 'text-gray-300' :
                index === 2 ? 'text-amber-600' : 'text-gray-400'
              }`}>
                #{index + 1}
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {entry.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{entry.username}</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-bold">{entry.coins.toLocaleString()}</p>
                <p className="text-gray-500 text-xs">coins</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {!loading && entries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No entries yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

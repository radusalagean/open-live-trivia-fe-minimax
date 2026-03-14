import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportApi } from '@/api/endpoints';
import { useSettingsStore } from '@/stores/settingsStore';
import { formatDate } from '@/lib/dateTime';
import type { Report } from '@/types';

export const ModerationPage = () => {
  const navigate = useNavigate();
  const relativeTime = useSettingsStore((state) => state.relativeTime);
  const [activeTab, setActiveTab] = useState<'reported' | 'banned'>('reported');
  const [reports, setReports] = useState<Report[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchReports = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const status = activeTab === 'reported' ? 'active' : 'banned';
      const response = await reportApi.getReports(pageNum, status);
      if (pageNum === 1) {
        setReports(response.items || []);
      } else {
        setReports((prev) => [...prev, ...(response.items || [])]);
      }
      setTotalPages(response.pages);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setPage(1);
    fetchReports(1);
  }, [fetchReports]);

  const handleLoadMore = () => {
    if (loading || page >= totalPages) {
      return;
    }
    const nextPage = page + 1;
    setPage(nextPage);
    fetchReports(nextPage);
  };

  const handleBan = async (reportId: string) => {
    setActionLoading(reportId);
    try {
      await reportApi.banEntry(reportId);
      fetchReports();
    } catch (error) {
      console.error('Failed to ban entry:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnban = async (reportId: string) => {
    setActionLoading(reportId);
    try {
      await reportApi.unbanEntry(reportId);
      fetchReports();
    } catch (error) {
      console.error('Failed to unban entry:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDismiss = async (reportId: string) => {
    setActionLoading(reportId);
    try {
      await reportApi.dismissReport(reportId);
      fetchReports();
    } catch (error) {
      console.error('Failed to dismiss report:', error);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white px-4 py-3 shadow-md flex items-center">
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:text-primary-dark"
        >
          ← Back
        </button>
        <h1 className="flex-1 text-center text-gray-800 font-bold text-lg">Moderation</h1>
        <button
          onClick={fetchReports}
          className="text-primary hover:text-primary-dark"
          disabled={loading}
        >
          ↻
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-light-grey">
        <button
          onClick={() => { setActiveTab('reported'); setPage(1); }}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'reported'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          }`}
        >
          Reported Entries
        </button>
        <button
          onClick={() => { setActiveTab('banned'); setPage(1); }}
          className={`flex-1 py-3 text-center font-medium ${
            activeTab === 'banned'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          }`}
        >
          Banned Entries
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-8 text-super-ultra-dark-grey">
            No {activeTab === 'reported' ? 'reported' : 'banned'} entries
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {reports.map((report) => (
              <div key={report._id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4">
                  {/* Category */}
                  {report.category && (
                    <span className="text-category text-xs">{report.category}</span>
                  )}
                  
                  {/* Entry Info */}
                  <div className="mt-2 space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Clue:</span>
                      <p className="text-gray-800">{report.clue}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Answer:</span>
                      <p className="text-gray-800 font-mono font-bold">{report.answer}</p>
                    </div>
                  </div>

                  {/* Reporters */}
                  {report.reporters && report.reporters.length > 0 && (
                    <div className="mt-3 text-xs text-gray-500">
                      Reported by: {report.reporters.map(u => u.username).join(', ')}
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="mt-2 text-xs text-gray-400">
                    {formatDate(report.lastReported, relativeTime)}
                  </div>
                </div>

                {/* Actions */}
                <div className="border-t border-light-grey p-3 flex gap-2">
                  {activeTab === 'reported' ? (
                    <>
                      <button
                        onClick={() => handleBan(report._id)}
                        disabled={actionLoading === report._id}
                        className="flex-1 py-2 bg-negative text-white rounded text-sm font-medium disabled:opacity-50"
                      >
                        {actionLoading === report._id ? 'Banning...' : 'Ban'}
                      </button>
                      <button
                        onClick={() => handleDismiss(report._id)}
                        disabled={actionLoading === report._id}
                        className="flex-1 py-2 bg-gray-500 text-white rounded text-sm font-medium disabled:opacity-50"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleUnban(report._id)}
                      disabled={actionLoading === report._id}
                      className="flex-1 py-2 bg-primary text-white rounded text-sm font-medium disabled:opacity-50"
                    >
                      {actionLoading === report._id ? 'Unbanning...' : 'Unban'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            </div>

            {!loading && page < totalPages && (
              <button
                onClick={handleLoadMore}
                className="w-full py-3 text-center text-primary hover:text-primary-dark font-medium"
              >
                Load More
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

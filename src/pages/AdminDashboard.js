import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchStats = async () => {
      try {
        const { data } = await API.get('/admin/stats');
        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load admin stats');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, []);

  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-light-gray">Admin access only.</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-off-white text-xl">Loading admin stats...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-off-white mb-6">Admin Dashboard</h1>
      <p className="text-sm text-light-gray/80 mb-8">Overview of user growth, engagement and AI activity.</p>

      <button
        onClick={async () => {
          try {
            const { data } = await API.get('/beta/export');

            // Convert to CSV
            const headers = ['Name', 'Email', 'Phone', 'Signed Up At', 'IP Address'];
            const csvContent = [
              headers.join(','),
              ...data.map(row => [
                `"${row.name}"`,
                `"${row.email}"`,
                `"${row.phone || ''}"`,
                `"${new Date(row.signedUpAt).toLocaleString()}"`,
                `"${row.ipAddress || ''}"`
              ].join(','))
            ].join('\n');

            // Download file
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', 'beta_subscribers.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } catch (err) {
            console.error('Export failed', err);
            alert('Failed to download subscribers');
          }
        }}
        className="mb-8 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-primary-black font-bold rounded-lg transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Beta Subscribers (CSV)
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-secondary-black border border-dark-gray rounded-xl p-6">
          <div className="text-sm text-light-gray mb-1">Total Users</div>
          <div className="text-3xl font-bold text-off-white mb-2">{stats?.users ?? 0}</div>
          <div className="text-xs text-light-gray/70">Signups today: {stats?.usersToday ?? 0}</div>
          <div className="text-xs text-light-gray/70">Logins today: {stats?.dailyLoginUsers ?? 0}</div>
          <div className="text-xs text-light-gray/70">Signups last 7 days: {stats?.usersLast7Days ?? 0}</div>
        </div>
        <div className="bg-secondary-black border border-dark-gray rounded-xl p-6">
          <div className="text-sm text-light-gray mb-1">Comments</div>
          <div className="text-3xl font-bold text-off-white mb-2">{stats?.comments ?? 0}</div>
          <div className="text-xs text-light-gray/70">Today: {stats?.commentsToday ?? 0}</div>
          <div className="text-xs text-light-gray/70">Last 7 days: {stats?.commentsLast7Days ?? 0}</div>
        </div>
        <div className="bg-secondary-black border border-dark-gray rounded-xl p-6">
          <div className="text-sm text-light-gray mb-1">Assets With Polls</div>
          <div className="text-3xl font-bold text-off-white mb-2">{stats?.polls ?? 0}</div>
          <div className="text-xs text-light-gray/70">Sentiment votes: {stats?.sentimentVotes ?? 0}</div>
          <div className="text-xs text-light-gray/70">Intent votes: {stats?.tradeVotes ?? 0}</div>
        </div>
        <div className="bg-secondary-black border border-dark-gray rounded-xl p-6 md:col-span-3">
          <div className="text-sm text-light-gray mb-1">Daily Active Users</div>
          <div className="text-3xl font-bold text-off-white mb-2">{stats?.dailyActiveUsers ?? 0}</div>
          <div className="text-xs text-light-gray/70">Unique users who commented or voted today.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-secondary-black border border-dark-gray rounded-xl p-6">
          <div className="text-sm text-light-gray mb-1">AI Intelligence Summaries</div>
          <div className="text-3xl font-bold text-off-white mb-2">{stats?.aiAnalyses ?? 0}</div>
          <div className="text-xs text-light-gray/70">Total generated across stocks and crypto.</div>
        </div>
        <div className="bg-secondary-black border border-dark-gray rounded-xl p-6">
          <div className="text-sm text-light-gray mb-1">Market Snapshots Stored</div>
          <div className="text-3xl font-bold text-off-white mb-2">{stats?.marketSnapshots ?? 0}</div>
          <div className="text-xs text-light-gray/70">Historical price snapshots captured by background jobs.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-secondary-black border border-dark-gray rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-off-white">Top Assets by Comments</h2>
            <span className="text-xs text-light-gray/60">Most discussed</span>
          </div>
          <div className="space-y-2">
            {(stats?.topCommentedAssets || []).length === 0 && (
              <div className="text-xs text-light-gray/60">No comments yet.</div>
            )}
            {(stats?.topCommentedAssets || []).map((row) => (
              <div key={row.asset} className="flex items-center justify-between text-sm">
                <span className="text-off-white/90">{row.asset}</span>
                <span className="text-light-gray/80">{row.count} comments</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-secondary-black border border-dark-gray rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-off-white">Top Assets by Sentiment Votes</h2>
            <span className="text-xs text-light-gray/60">Most polled</span>
          </div>
          <div className="space-y-2">
            {(stats?.topSentimentAssets || []).length === 0 && (
              <div className="text-xs text-light-gray/60">No sentiment votes yet.</div>
            )}
            {(stats?.topSentimentAssets || []).map((row) => (
              <div key={row.asset} className="flex items-center justify-between text-sm">
                <span className="text-off-white/90">{row.asset}</span>
                <span className="text-light-gray/80">{row.count} votes</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

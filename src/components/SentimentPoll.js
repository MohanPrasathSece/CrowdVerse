import React, { useEffect, useState } from 'react';
import { getSentiment, voteSentiment, getMySentiment } from '../utils/apiEnhanced';
import { AuthContext } from '../context/AuthContext';

const SentimentPoll = ({ asset, onRefreshRef }) => {
  const { user } = React.useContext(AuthContext);
  const [stats, setStats] = useState({ bullish: 0, bearish: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myVote, setMyVote] = useState(null);

  const fetchStats = async () => {
    try {
      const { data } = await getSentiment(asset);
      setStats(data);
    } catch (err) {
      setError('Failed to load sentiment');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof onRefreshRef === 'function') {
      onRefreshRef(() => fetchStats());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onRefreshRef, asset]);

  useEffect(() => {
    let cancelled = false;
    fetchStats();
    (async () => {
      try {
        const { data } = await getMySentiment(asset);
        if (!cancelled) setMyVote(data?.sentiment || null);
      } catch (_) {}
    })();

    // auto refresh every 15s
    const id = setInterval(fetchStats, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);

  const handleVote = async (sentiment) => {
    if (!user) return alert('Login required');
    try {
      await voteSentiment(asset, sentiment);
      setMyVote(sentiment);
      fetchStats();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to vote');
    }
  };

  if (loading) return <div className="text-light-gray animate-pulse">Loading poll...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="border border-dark-gray/60 rounded-2xl p-5 bg-secondary-black/50 hover:shadow-lg hover:shadow-off-white/5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-off-white font-semibold">Market Sentiment</h3>
        <span className={`text-[11px] px-2 py-1 rounded-lg border uppercase tracking-[0.15em] ${
          (stats.bullish || 0) >= (stats.bearish || 0)
            ? 'border-green-500 text-green-300 bg-green-600/10'
            : 'border-red-500 text-red-300 bg-red-600/10'
        }`}>
          {stats.bullish >= stats.bearish ? 'Bullish' : 'Bearish'}
        </span>
      </div>

      <div className="flex items-center gap-2 p-1 rounded-xl border border-dark-gray/70 bg-primary-black/50">
        <button
          onClick={() => handleVote('bullish')}
          className={`flex-1 text-sm px-3 py-2 rounded-lg transition-all ${
            myVote === 'bullish'
              ? 'bg-green-500/15 text-green-300 border border-green-500 scale-[1.01]'
              : 'text-light-gray/80 hover:text-green-300 hover:bg-green-600/10 border border-transparent'
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l7-7 4 4 7-7" />
            </svg>
            Bullish
          </span>
        </button>
        <button
          onClick={() => handleVote('bearish')}
          className={`flex-1 text-sm px-3 py-2 rounded-lg transition-all ${
            myVote === 'bearish'
              ? 'bg-red-500/15 text-red-300 border border-red-500 scale-[1.01]'
              : 'text-light-gray/80 hover:text-red-300 hover:bg-red-600/10 border border-transparent'
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7l7 7 4-4 7 7" />
            </svg>
            Bearish
          </span>
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-light-gray/70 mb-1">
            <span>Bullish</span>
            <span className="text-off-white/90">{stats.bullish.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full rounded-md bg-primary-black/60 border border-dark-gray/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-600/70 to-green-400/70 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, stats.bullish || 0))}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-light-gray/70 mb-1">
            <span>Bearish</span>
            <span className="text-off-white/90">{stats.bearish.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full rounded-md bg-primary-black/60 border border-dark-gray/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600/70 to-red-400/70 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, stats.bearish || 0))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-[11px] text-light-gray/70 text-center mt-3">
        {stats.totalVotes} votes
        {myVote && <span className="text-light-gray/60 ml-2">(Your vote: {myVote})</span>}
      </div>
    </div>
  );
};

export default SentimentPoll;

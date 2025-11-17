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
    <div className="border border-dark-gray/60 rounded-xl p-4 space-y-3 bg-secondary-black/40">
      <h3 className="text-off-white font-semibold">Market Sentiment</h3>
      <div className="flex items-center justify-around text-sm text-light-gray/80">
        <button
          onClick={() => handleVote('bullish')}
          className={`px-4 py-2 rounded-lg border transition-all ${myVote === 'bullish' ? 'border-green-500 text-green-300 bg-green-600/10' : 'border-dark-gray hover:bg-green-600/20 hover:text-green-300'}`}
        >
          Bullish
        </button>
        <button
          onClick={() => handleVote('bearish')}
          className={`px-4 py-2 rounded-lg border transition-all ${myVote === 'bearish' ? 'border-red-500 text-red-300 bg-red-600/10' : 'border-dark-gray hover:bg-red-600/20 hover:text-red-300'}`}
        >
          Bearish
        </button>
      </div>
      <div className="text-xs text-light-gray/70 text-center">
        Bullish {stats.bullish.toFixed(1)}% | Bearish {stats.bearish.toFixed(1)}% — {stats.totalVotes} votes
        {myVote && <span className="text-light-gray/60 ml-2">(Your vote: {myVote})</span>}
      </div>
    </div>
  );
};

export default SentimentPoll;

import React, { useEffect, useState } from 'react';
import { getIntent, voteIntent, getMyIntent } from '../utils/apiEnhanced';
import { AuthContext } from '../context/AuthContext';

const IntentPoll = ({ asset, onRefreshRef }) => {
  const { user } = React.useContext(AuthContext);
  const [stats, setStats] = useState({ buy: 0, sell: 0, hold: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myIntent, setMyIntent] = useState(null);

  const fetchStats = async () => {
    try {
      const { data } = await getIntent(asset);
      setStats(data);
    } catch (err) {
      setError('Failed to load intent');
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
        const { data } = await getMyIntent(asset);
        if (!cancelled) setMyIntent(data?.action || null);
      } catch (_) {}
    })();

    const id = setInterval(fetchStats, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);

  const handleVote = async (action) => {
    if (!user) return alert('Login required');
    try {
      await voteIntent(asset, action);
      setMyIntent(action);
      fetchStats();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to vote');
    }
  };

  if (loading) return <div className="text-light-gray animate-pulse">Loading poll...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="border border-dark-gray/60 rounded-xl p-4 space-y-3 bg-secondary-black/40">
      <h3 className="text-off-white font-semibold">Your Position</h3>
      <div className="flex items-center justify-around text-sm text-light-gray/80">
        {['buy', 'sell', 'hold'].map((action) => (
          <button
            key={action}
            onClick={() => handleVote(action)}
            className={`px-4 py-2 rounded-lg border transition-all capitalize ${
              myIntent === action ? 'border-off-white text-off-white bg-off-white/10' : 'border-dark-gray hover:bg-off-white/10'
            }`}
          >
            {action}
          </button>
        ))}
      </div>
      <div className="text-xs text-light-gray/70 text-center">
        Buy {stats.buy.toFixed(1)}% | Sell {stats.sell.toFixed(1)}% | Hold {stats.hold.toFixed(1)}%
        {myIntent && <span className="text-light-gray/60 ml-2">(Your action: {myIntent})</span>}
      </div>
    </div>
  );
};

export default IntentPoll;

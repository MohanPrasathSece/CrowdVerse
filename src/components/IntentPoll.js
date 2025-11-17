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
        if (user) {
          const { data } = await getMyIntent(asset);
          if (!cancelled) setMyIntent(data?.action || null);
        } else {
          setMyIntent(null);
        }
      } catch (_) {}
    })();

    const id = setInterval(fetchStats, 15000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset, user]);

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
    <div className="border border-dark-gray/60 rounded-2xl p-5 bg-secondary-black/50 hover:shadow-lg hover:shadow-off-white/5 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-off-white font-semibold">Trading Intent</h3>
        {myIntent && (
          <span className="text-[11px] px-2 py-1 rounded-lg border border-off-white/30 text-light-gray/80 uppercase tracking-[0.15em]">
            You: {myIntent}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 p-1 rounded-xl border border-dark-gray/70 bg-primary-black/50">
        <button
          onClick={() => handleVote('buy')}
          className={`flex-1 text-sm px-3 py-2 rounded-lg transition-all capitalize ${
            myIntent === 'buy'
              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500 scale-[1.01]'
              : 'text-light-gray/80 hover:text-emerald-300 hover:bg-emerald-600/10 border border-transparent'
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17L17 7" />
              <path d="M7 7h10v10" />
            </svg>
            Buy
          </span>
        </button>
        <button
          onClick={() => handleVote('sell')}
          className={`flex-1 text-sm px-3 py-2 rounded-lg transition-all capitalize ${
            myIntent === 'sell'
              ? 'bg-red-500/15 text-red-300 border border-red-500 scale-[1.01]'
              : 'text-light-gray/80 hover:text-red-300 hover:bg-red-600/10 border border-transparent'
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 7L7 17" />
              <path d="M17 17H7V7" />
            </svg>
            Sell
          </span>
        </button>
        <button
          onClick={() => handleVote('hold')}
          className={`flex-1 text-sm px-3 py-2 rounded-lg transition-all capitalize ${
            myIntent === 'hold'
              ? 'bg-slate-500/15 text-slate-300 border border-slate-500 scale-[1.01]'
              : 'text-light-gray/80 hover:text-slate-300 hover:bg-slate-600/10 border border-transparent'
          }`}
        >
          <span className="inline-flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 12h12" />
            </svg>
            Hold
          </span>
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-light-gray/70 mb-1">
            <span>Buy</span>
            <span className="text-off-white/90">{stats.buy.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full rounded-md bg-primary-black/60 border border-dark-gray/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-600/70 to-emerald-400/70 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, stats.buy || 0))}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-light-gray/70 mb-1">
            <span>Sell</span>
            <span className="text-off-white/90">{stats.sell.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full rounded-md bg-primary-black/60 border border-dark-gray/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600/70 to-red-400/70 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, stats.sell || 0))}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-light-gray/70 mb-1">
            <span>Hold</span>
            <span className="text-off-white/90">{stats.hold.toFixed(1)}%</span>
          </div>
          <div className="h-2 w-full rounded-md bg-primary-black/60 border border-dark-gray/60 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-slate-600/70 to-slate-400/70 transition-all"
              style={{ width: `${Math.max(0, Math.min(100, stats.hold || 0))}%` }}
            />
          </div>
        </div>
      </div>

      <div className="text-[11px] text-light-gray/70 text-center mt-3">
        Buy {stats.buy.toFixed(1)}% · Sell {stats.sell.toFixed(1)}% · Hold {stats.hold.toFixed(1)}%
      </div>
    </div>
  );
};

export default IntentPoll;

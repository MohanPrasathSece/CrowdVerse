import React, { useMemo, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import SentimentPoll from '../components/SentimentPoll';
import IntentPoll from '../components/IntentPoll';
import CommentsPanel from '../components/CommentsPanel';
import IntelligencePanel from '../components/IntelligencePanel';
import getSocket from '../utils/socket';

const Asset = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const assetSymbol = (symbol || '').toUpperCase();
  const assetName = useMemo(() => state.name || assetSymbol, [state.name, assetSymbol]);
  const marketType = state.marketType || 'stocks'; // Default to stocks if not specified

  const refreshRefs = useRef({});

  useEffect(() => {
    const socket = getSocket();
    socket.emit('join_asset', assetSymbol);
    const handler = (payload) => {
      if (payload?.asset !== assetSymbol) return;
      // Tell children to refresh if they exposed refresh callbacks
      refreshRefs.current.sentiment?.();
      refreshRefs.current.intent?.();
      refreshRefs.current.comments?.();
    };
    socket.on('asset_update', handler);
    return () => {
      socket.emit('leave_asset', assetSymbol);
      socket.off('asset_update', handler);
    };
  }, [assetSymbol]);

  return (
    <div className="min-h-screen bg-primary-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 opacity-100`}>
        <div className="w-full max-w-5xl space-y-8 py-6 sm:py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.35em] text-light-gray/60">Asset</div>
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold text-off-white tracking-tight">{assetName}</h1>
              <div className="text-sm sm:text-base text-light-gray/70">{assetSymbol}</div>
            </div>
            <button
              onClick={() => navigate('/dashboard', { state: { activeView: marketType } })}
              className="px-4 py-2 rounded-lg border border-dark-gray text-light-gray hover:text-off-white hover:bg-secondary-black/60 transition-all"
            >
              ← Back
            </button>
          </div>
          <div className="h-px w-48 bg-dark-gray/50"></div>
        </div>
      </div>

        {/* Polls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SentimentPoll asset={assetSymbol} onRefreshRef={(fn) => (refreshRefs.current.sentiment = fn)} />
          <IntentPoll asset={assetSymbol} onRefreshRef={(fn) => (refreshRefs.current.intent = fn)} />
        </div>

        {/* Comments */}
        <CommentsPanel asset={assetSymbol} onRefreshRef={(fn) => (refreshRefs.current.comments = fn)} />

        {/* AI */}
        <IntelligencePanel asset={assetSymbol} assetName={assetName} />
      </div>
    </div>
  );
};

export default Asset;

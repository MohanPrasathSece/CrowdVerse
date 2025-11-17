import React, { useEffect, useState } from 'react';
import { getAISummary, getComments } from '../utils/apiEnhanced';

const IntelligencePanel = ({ asset, assetName }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const clean = (txt) => {
    if (!txt) return '';
    let s = String(txt);
    s = s.replace(/^\s*#{1,6}\s*/g, '');
    s = s.replace(/^\s*(Global\s+News\s+Summary|Community\s+Comments\s+Summary|Market\s+Sentiment\s+Summary|Final\s+(AI\s+)?Takeaway)\s*[:\-]?\s*/i, '');
    return s.trim();
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const recent = await getComments(asset, 1, 8);
        const recentComments = (recent.data || []).map((c) => `${c.user?.emailOrMobile || 'User'}: ${c.text}`);
        const payloadName = assetName || asset;
        const resp = await getAISummary(payloadName, recentComments, [], '');
        if (cancelled) return;
        setData(resp.data);
      } catch (e) {
        setError('Failed to load intelligence panel');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [asset, assetName]);

  if (loading) return <div className="text-light-gray animate-pulse">Loading intelligence...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!data) return null;

  return (
    <div className="border border-dark-gray/60 rounded-2xl p-4 bg-secondary-black/40 space-y-4">
      <h3 className="text-off-white font-semibold">Quick Intelligence Panel</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="p-3 rounded-xl border border-dark-gray/40 bg-primary-black/40">
          <div className="text-xs uppercase tracking-[0.25em] text-light-gray/60 mb-1">Global News Summary</div>
          <div className="text-off-white/90 whitespace-pre-wrap">{clean(data.global_news_summary) || '—'}</div>
        </div>
        <div className="p-3 rounded-xl border border-dark-gray/40 bg-primary-black/40">
          <div className="text-xs uppercase tracking-[0.25em] text-light-gray/60 mb-1">Community Comments Summary</div>
          <div className="text-off-white/90 whitespace-pre-wrap">{clean(data.user_comments_summary) || '—'}</div>
        </div>
        <div className="p-3 rounded-xl border border-dark-gray/40 bg-primary-black/40">
          <div className="text-xs uppercase tracking-[0.25em] text-light-gray/60 mb-1">Market Sentiment Summary</div>
          <div className="text-off-white/90 whitespace-pre-wrap">{clean(data.market_sentiment_summary) || '—'}</div>
        </div>
        <div className="p-3 rounded-xl border border-dark-gray/40 bg-primary-black/40">
          <div className="text-xs uppercase tracking-[0.25em] text-light-gray/60 mb-1">Final AI Takeaway</div>
          <div className="text-off-white/90 whitespace-pre-wrap">{clean(data.final_summary) || '—'}</div>
        </div>
      </div>
    </div>
  );
};

export default IntelligencePanel;

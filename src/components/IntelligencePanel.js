import React, { useEffect, useState } from 'react';
import { getAISummary, getComments } from '../utils/apiEnhanced';

const IntelligencePanel = ({ asset, assetName }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [expanded, setExpanded] = useState({ g: false, c: false, m: false, f: false });

  const clean = (txt) => {
    if (!txt) return '';
    let s = String(txt);
    s = s.replace(/^\s*#{1,6}\s*/g, '');
    s = s.replace(/^\s*(Global\s+News\s+Summary|Community\s+Comments\s+Summary|Market\s+Sentiment\s+Summary|Final\s+(AI\s+)?Takeaway)\s*[:\-]?\s*/i, '');
    // Remove common markdown emphasis markers
    s = s.replace(/\*\*(.*?)\*\*/g, '$1'); // **bold**
    s = s.replace(/\*(.*?)\*/g, '$1');       // *italic*
    s = s.replace(/__(.*?)__/g, '$1');        // __bold__
    s = s.replace(/_(.*?)_/g, '$1');          // _italic_
    return s.trim();
  };

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
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
        setRefreshing(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, [asset, assetName]);

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setError('');
    setData(null);
    const run = async () => {
      try {
        const recent = await getComments(asset, 1, 8);
        const recentComments = (recent.data || []).map((c) => `${c.user?.emailOrMobile || 'User'}: ${c.text}`);
        const payloadName = assetName || asset;
        const resp = await getAISummary(payloadName, recentComments, [], '', true);
        setData(resp.data);
      } catch (e) {
        setError('Failed to load intelligence panel');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    };
    run();
  };

  if (loading) return <div className="text-light-gray animate-pulse">Loading intelligence...</div>;
  if (error) return <div className="text-red-400">{error}</div>;
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-off-white font-semibold text-lg">Quick Intelligence Panel</h3>
        <button onClick={onRefresh} disabled={refreshing} className={`px-3 py-1.5 rounded-lg border text-light-gray hover:text-off-white ${refreshing ? 'opacity-60 cursor-not-allowed' : 'border-dark-gray hover:bg-secondary-black/60'}`}>
          {refreshing ? 'Refreshing…' : 'Refresh'}
        </button>
      </div>

      {/* Two-column spacious cards, all visible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
          <div className="mb-3 flex items-center gap-2 text-light-gray/70">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            <div className="text-[11px] uppercase tracking-[0.25em]">Global News Summary</div>
          </div>
          <div className="text-off-white/90 whitespace-pre-wrap leading-relaxed">{clean(data.global_news_summary) || '—'}</div>
        </div>

        <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
          <div className="mb-3 flex items-center gap-2 text-light-gray/70">
            <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
            <div className="text-[11px] uppercase tracking-[0.25em]">Community Comments Summary</div>
          </div>
          <div className="text-off-white/90 whitespace-pre-wrap leading-relaxed">{clean(data.user_comments_summary) || '—'}</div>
        </div>

        <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
          <div className="mb-3 flex items-center gap-2 text-light-gray/70">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <div className="text-[11px] uppercase tracking-[0.25em]">Market Sentiment Summary</div>
          </div>
          <div className="text-off-white/90 whitespace-pre-wrap leading-relaxed">{clean(data.market_sentiment_summary) || '—'}</div>
        </div>

        <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
          <div className="mb-3 flex items-center gap-2 text-light-gray/70">
            <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400" />
            <div className="text-[11px] uppercase tracking-[0.25em]">Final AI Takeaway</div>
          </div>
          <div className="text-off-white/90 whitespace-pre-wrap leading-relaxed">{clean(data.final_summary) || '—'}</div>
        </div>
      </div>
    </div>
  );
};

export default IntelligencePanel;

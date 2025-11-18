import React, { useEffect, useState } from 'react';
import { getAISummary, getComments } from '../utils/apiEnhanced';

const IntelligencePanel = ({ asset, assetName }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const clean = (txt) => {
    if (!txt) return '';
    let s = String(txt);
    // Remove all HTML tags first
    s = s.replace(/<[^>]*>/g, '');
    // Remove markdown headers (including ### pattern)
    s = s.replace(/^\s*#{1,6}\s*/g, '');
    // Remove section headers with various formats (more aggressive)
    s = s.replace(/^\s*(###?\s*)?(Global\s+News\s+Summary|Community\s+Comments\s+Summary|Market\s+Sentiment\s+Summary|Final\s+(AI\s+)?Takeaway)\s*[:-]?\s*/gi, '');
    // Remove specific unwanted phrases completely
    s = s.replace(/(###?\s*)?(Global\s+News\s+Summary|Community\s+Comments\s+Summary|Market\s+Sentiment\s+Summary|Final\s+(AI\s+)?Takeaway)\s+(No\s+recent\s+(news\s+headlines|comments|data|sentiment)\s+provided\.?)/gi, '');
    s = s.replace(/No\s+recent\s+(news\s+headlines|comments|data|sentiment)\s+provided\.?/gi, '');
    // Remove headers with HTML tags or special formatting (backup)
    s = s.replace(/<[^>]*>(###?\s*)?(Global\s+News\s+Summary|Community\s+Comments\s+Summary|Market\s+Sentiment\s+Summary|Final\s+(AI\s+)?Takeaway)<\/[^>]*>/gi, '');
    s = s.replace(/\*\*(###?\s*)?(Global\s+News\s+Summary|Community\s+Comments\s+Summary|Market\s+Sentiment\s+Summary|Final\s+(AI\s+)?Takeaway)\*\*/gi, '');
    s = s.replace(/\*(###?\s*)?(Global\s+News\s+Summary|Community\s+Comments\s+Summary|Market\s+Sentiment\s+Summary|Final\s+(AI\s+)?Takeaway)\*/gi, '');
    // Remove common markdown emphasis markers
    s = s.replace(/\*\*(.*?)\*\*/g, '$1'); // **bold**
    s = s.replace(/\*(.*?)\*/g, '$1');       // *italic*
    s = s.replace(/__(.*?)__/g, '$1');        // __bold__
    s = s.replace(/_(.*?)_/g, '$1');          // _italic_
    // Clean up extra whitespace and newlines
    s = s.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n');
    return s.trim();
  };

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        // Try to get cached intelligence data first
        const payloadName = assetName || asset;
        const resp = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/ai-summary/intelligence/${payloadName}`);
        const data = await resp.json();
        
        if (cancelled) return;
        setData(data);
      } catch (e) {
        console.error('Failed to load cached intelligence data:', e);
        // Fallback to AI generation if cache fails
        try {
          let recentComments = [];
          try {
            const recent = await getComments(asset, 1, 8);
            recentComments = (recent.data || []).map((c) => `${c.user?.emailOrMobile || 'User'}: ${c.text}`);
          } catch (_) {
            recentComments = [];
          }
          const payloadName = assetName || asset;
          const resp = await getAISummary(payloadName, recentComments, [], '');
          if (cancelled) return;
          setData(resp.data);
        } catch (fallbackError) {
          setError('Failed to load intelligence panel');
        }
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
        let recentComments = [];
        try {
          const recent = await getComments(asset, 1, 8);
          recentComments = (recent.data || []).map((c) => `${c.user?.emailOrMobile || 'User'}: ${c.text}`);
        } catch (_) {
          recentComments = [];
        }
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
            <div className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold">Global News Summary</div>
          </div>
          <div className="text-off-white/90 whitespace-pre-wrap leading-[2.25] text-sm sm:text-base">{clean(data.global_news_summary) || '—'}</div>
        </div>

        <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
          <div className="mb-3 flex items-center gap-2 text-light-gray/70">
            <span className="inline-block w-2 h-2 rounded-full bg-sky-400" />
            <div className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold">Community Comments Summary</div>
          </div>
          <div className="text-off-white/90 whitespace-pre-wrap leading-[2.25] text-sm sm:text-base">{clean(data.user_comments_summary) || '—'}</div>
        </div>

        <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
          <div className="mb-3 flex items-center gap-2 text-light-gray/70">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400" />
            <div className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold">Market Sentiment Summary</div>
          </div>
          <div className="text-off-white/90 whitespace-pre-wrap leading-[2.25] text-sm sm:text-base">{clean(data.market_sentiment_summary) || '—'}</div>
        </div>

        <div className="p-6 rounded-3xl border border-dark-gray/60 bg-primary-black/30 hover:shadow-lg hover:shadow-off-white/5 transition-all">
          <div className="mb-3 flex items-center gap-2 text-light-gray/70">
            <span className="inline-block w-2 h-2 rounded-full bg-fuchsia-400" />
            <div className="text-sm sm:text-base uppercase tracking-[0.25em] font-semibold">Final AI Takeaway</div>
          </div>
          <div className="text-off-white/90 whitespace-pre-wrap leading-[2.25] text-sm sm:text-base">{clean(data.final_summary) || '—'}</div>
        </div>
      </div>
    </div>
  );
};

export default IntelligencePanel;

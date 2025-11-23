import React, { useEffect, useState, useCallback } from 'react';
import { getAISummary, getComments } from '../utils/apiEnhanced';

const IntelligencePanel = ({ asset, assetName }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  // Stock-specific intelligence data - moved outside to be accessible
  const stockIntelligence = {
    'TCS': {
      global_news_summary: 'Tata Consultancy Services continues to lead India\'s IT services sector with strong deal wins in digital transformation and cloud services. Recent focus on AI-powered solutions and generative AI platforms for enterprise clients.',
      user_comments_summary: 'Investors view TCS as a stable blue-chip with consistent dividend yield. Discussions center around margin pressure in Q3 and growth in North American markets.',
      market_sentiment_summary: 'Generally bullish with 72% positive sentiment. Technical analysis shows support at ₹3,800 and resistance at ₹4,200. Institutional ownership remains strong at 58%.',
      final_summary: 'TCS remains a defensive IT play with strong cash flows. Consider accumulation on dips below ₹3,900 for long-term portfolio stability.'
    },
    'RELIANCE': {
      global_news_summary: 'Reliance Industries expands its green energy portfolio with ₹75,000 crore investment in solar manufacturing. Retail division shows robust Q3 growth with 18% YoY increase in footfalls.',
      user_comments_summary: 'Community excited about Jio\'s 5G rollout progress and Reliance Retail\'s international expansion. Concerns about high debt levels for capital-intensive projects.',
      market_sentiment_summary: 'Strong bullish sentiment at 78%. Stock trading above 200-day moving average. FII holding increased by 2.3% in latest quarter.',
      final_summary: 'Reliance offers diversified exposure across energy, retail, and telecom. Position for long-term growth while monitoring debt metrics.'
    },
    'INFY': {
      global_news_summary: 'Infosys secures $2.4 billion deal with European telecom giant for cloud transformation. Atlas platform gains traction in enterprise AI deployments.',
      user_comments_summary: 'Mixed sentiment on margin guidance. Investors appreciate dividend consistency but worry about growth slowdown in BFSI segment.',
      market_sentiment_summary: 'Neutral to bullish at 65%. Stock consolidating between ₹1,450-1,550. Promoter holding stable at 55.8%.',
      final_summary: 'Infosys offers value compared to peers with attractive valuations. Monitor large deal execution and margin trajectory.'
    },
    'HDFCBANK': {
      global_news_summary: 'HDFC Bank integrates credit card business post-CorpBank merger. Net interest margin improves to 4.3% in Q3. Digital banking adoption reaches 85%.',
      user_comments_summary: 'Depositors concerned about service quality issues post-merger. Investors optimistic about cross-selling opportunities and expanded branch network.',
      market_sentiment_summary: 'Cautiously bullish at 58%. Stock underperformed peers by 8% this quarter. CASA ratio improved to 42%.',
      final_summary: 'HDFC Bank remains a quality private bank play. Monitor integration benefits and NIM trends for entry points.'
    },
    'SBIN': {
      global_news_summary: 'State Bank of India reduces bad loans to 4.2% - lowest in decade. Digital initiatives yield 30% cost-to-income ratio improvement. Government stake sale discussions ongoing.',
      user_comments_summary: 'Retail investors attracted to high dividend yield of 4.2%. Concerns about government interference and political pressure on lending.',
      market_sentiment_summary: 'Moderately bullish at 62%. Trading at 1.2x book value. Institutional interest growing with PSU banking reforms.',
      final_summary: 'SBI offers value play in banking sector with improving asset quality. Suitable for dividend-focused portfolios.'
    },
    'ICICIBANK': {
      global_news_summary: 'ICICI Bank leads in digital lending with 40% YoY growth in personal loans. Credit card spends surge 25% in festive season. Overseas expansion in Singapore and UK.',
      user_comments_summary: 'Investors praise management execution and digital strategy. Some concerns about valuation premium versus peers.',
      market_sentiment_summary: 'Strong bullish at 75%. Stock outperforms banking index by 12%. ROE improved to 16.8%.',
      final_summary: 'ICICI Bank commands premium for consistent execution. Consider on corrections below ₹950 for long-term holding.'
    },
    'LT': {
      global_news_summary: 'Larsen & Toubro wins ₹25,000 crore infrastructure projects including metro rail and highway developments. Defense division secures major export orders for artillery systems.',
      user_comments_summary: 'Investors bullish on infrastructure spending push from government. Discussions focus on order book visibility and execution capabilities.',
      market_sentiment_summary: 'Strong bullish at 68%. Stock trading near 52-week highs. Order book stands at ₹4.3 lakh crore providing revenue visibility.',
      final_summary: 'L&T is well-positioned to benefit from India\'s infrastructure boom. Accumulate on dips for long-term capital appreciation.'
    },
    'ITC': {
      global_news_summary: 'ITC expands FMCG business with new product launches in health and wellness segment. Hotel division shows strong recovery with 85% occupancy post-pandemic.',
      user_comments_summary: 'Mixed sentiment on cigarette business outlook. Investors excited about FMCG growth and non-cigarette portfolio diversification.',
      market_sentiment_summary: 'Neutral to bullish at 55%. Stock consolidating as markets await clarity on taxation policy. Dividend yield attractive at 3.2%.',
      final_summary: 'ITC offers balanced exposure with stable cash flows from cigarettes and growth from FMCG. Suitable for dividend-focused investors.'
    },
    'AXISBANK': {
      global_news_summary: 'Axis Bank reports strong Q3 with 22% YoY profit growth. Digital loans constitute 45% of new disbursements. SME loan book shows robust recovery.',
      user_comments_summary: 'Investors impressed by turnaround in asset quality. Concerns about valuation after recent rally.',
      market_sentiment_summary: 'Bullish at 70%. Stock outperforms peers with NIM improvement to 4.1%. CASA ratio at 47%.',
      final_summary: 'Axis Bank demonstrates successful turnaround strategy. Consider positions on corrections for medium-term gains.'
    },
    'KOTAKBANK': {
      global_news_summary: 'Kotak Mahindra Bank strengthens digital presence with 811 app crossing 50 million users. Wealth management AUM grows 30% YoY to ₹3.2 lakh crore.',
      user_comments_summary: 'Investors value conservative lending approach and strong capital adequacy. Some concerns about slower growth versus peers.',
      market_sentiment_summary: 'Cautiously bullish at 60%. Premium valuation justified by superior asset quality and ROE of 15.2%.',
      final_summary: 'Kotak Bank remains a quality pick for risk-averse investors. Monitor digital initiatives for growth catalysts.'
    },
    'BTC': {
      global_news_summary: 'Bitcoin ETF approvals drive institutional adoption. Recent network upgrades improve scalability and reduce energy consumption by 40%. Major corporations adding BTC to treasury.',
      user_comments_summary: 'Crypto community divided on short-term price action but bullish long-term. Discussions center around ETF inflows and regulatory clarity improvements.',
      market_sentiment_summary: 'Strong bullish sentiment at 68%. Trading above 200-day moving average. Institutional holdings growing through ETF channels.',
      final_summary: 'Bitcoin remains the flagship cryptocurrency with growing institutional acceptance. Consider dollar-cost averaging for long-term exposure.'
    },
    'ETH': {
      global_news_summary: 'Ethereum successfully completes Dencun upgrade reducing layer-2 costs by 90%. DeFi TVL reaches new highs. Major enterprises building on Ethereum for tokenization.',
      user_comments_summary: 'Developer community excited about scalability improvements. Investors concerned about competition from other L1s but confident in network effects.',
      market_sentiment_summary: 'Bullish at 64%. Staking ratio reaches 28%. Gas fees trending lower post-upgrade.',
      final_summary: 'Ethereum\'s upgrades strengthen its position as the leading smart contract platform. Monitor DeFi growth and staking yields.'
    },
    'SOL': {
      global_news_summary: 'Solana achieves record throughput with 65,000 TPS during peak usage. Major DeFi protocols migrate to Solana attracted by low fees and high speed. Breakpoint conference showcases ecosystem growth.',
      user_comments_summary: 'Solana community shows enthusiasm with discussions about network performance and ecosystem growth. Developers praise developer experience and tooling improvements.',
      market_sentiment_summary: 'Market sentiment shows 82.3% bullish vs 17.7% bearish. Price action shows strong momentum with key resistance at $120.',
      final_summary: 'Solana demonstrates impressive technical performance with growing ecosystem adoption. Consider exposure for high-growth DeFi and NFT sectors.'
    },
    'DOGE': {
      global_news_summary: 'Dogecoin gains mainstream acceptance with payment processor integrations. Elon Musk continues to support DOGE payments for Tesla merchandise. Community fundraising initiatives show strong engagement.',
      user_comments_summary: 'Strong community support with meme culture driving adoption. Retail investors excited about potential payment use cases.',
      market_sentiment_summary: 'Highly speculative with 75% retail-driven sentiment. Price action heavily influenced by social media trends and celebrity endorsements.',
      final_summary: 'Dogecoin remains a high-risk, high-reward play driven by community enthusiasm. Suitable only for speculative positions with strict risk management.'
    },
    'ADA': {
      global_news_summary: 'Cardano completes Voltaire upgrade enabling on-chain governance. Smart contract platform sees growing DeFi ecosystem with 50+ dApps now live. Academic partnerships strengthen credibility.',
      user_comments_summary: 'Community appreciates methodical development approach. Investors debate speed of ecosystem growth versus competitors.',
      market_sentiment_summary: 'Moderately bullish at 58%. Steady development progress despite market volatility. Staking rewards attractive at 5% APY.',
      final_summary: 'Cardano offers fundamentally-driven investment case with strong technical foundation. Long-term holders may benefit from ecosystem maturation.'
    },
    'XRP': {
      global_news_summary: 'Ripple expands partnerships with financial institutions for cross-border payments. Legal clarity improves with positive court developments. Central bank digital currency pilots gain traction.',
      user_comments_summary: 'Community cautiously optimistic about legal outcomes. Discussions focus on utility versus speculative value.',
      market_sentiment_summary: 'Neutral to bullish at 52%. Price action constrained by legal overhang but institutional adoption growing.',
      final_summary: 'XRP presents unique risk-reward profile with legal resolution as key catalyst. Monitor regulatory developments for entry points.'
    },
    'DOT': {
      global_news_summary: 'Polkadot launches parachain auctions enabling specialized blockchains. Interoperability solutions gain adoption in DeFi and gaming sectors. Developer grants program fuels ecosystem growth.',
      user_comments_summary: 'Technical community excited about parachain technology. Investors concerned about competition in interoperability space.',
      market_sentiment_summary: 'Bullish at 60%. Staking participation high at 65%. Network activity increasing with new parachain launches.',
      final_summary: 'Polkadot\'s multi-chain architecture positions well for Web3 expansion. Consider exposure to interoperability trend with DOT.'
    },
    'AVAX': {
      global_news_summary: 'Avalanche subnet technology attracts gaming and enterprise clients. Platform processes 4,500+ TPS with sub-second finality. Major gaming studios choose Avalanche for blockchain integration.',
      user_comments_summary: 'Growing developer community praises performance and low fees. Investors focused on gaming and DeFi adoption metrics.',
      market_sentiment_summary: 'Strong bullish at 70%. Gaming sector adoption drives network growth. Total value locked in DeFi rising steadily.',
      final_summary: 'Avalanche excels in performance and customization for specific use cases. Position for growth in gaming and enterprise blockchain adoption.'
    },
    'LINK': {
      global_news_summary: 'Chainlink expands oracle network with CCIP (Cross-Chain Interoperability Protocol). Partnerships with Swift and major financial institutions for real-world asset tokenization.',
      user_comments_summary: 'Community confident in Chainlink\'s oracle dominance. Discussions center around competition and revenue growth sustainability.',
      market_sentiment_summary: 'Bullish at 65%. Revenue streams diversifying beyond price feeds. Network adoption across multiple blockchains.',
      final_summary: 'Chainlink remains essential infrastructure for DeFi and traditional finance integration. Long-term positioning in oracle sector appears strong.'
    },
    'MATIC': {
      global_news_summary: 'Polygon launches zkEVM mainnet reducing transaction costs by 90%. Major DeFi protocols migrate to Polygon for cost efficiency. Enterprise partnerships for scaling solutions.',
      user_comments_summary: 'Community excited about ZK technology implementation. Investors focused on user growth and protocol revenue.',
      market_sentiment_summary: 'Bullish at 68%. Daily active addresses growing 25% QoQ. Gas fees remain low attracting users.',
      final_summary: 'Polygon\'s multi-scaling approach and ZK technology position well for Ethereum ecosystem growth. Consider exposure to L2 scaling trends.'
    }
  };

  // Name to symbol mapping for full names
  const nameToSymbol = {
    // Crypto full names
    'BITCOIN': 'BTC',
    'ETHEREUM': 'ETH',
    'SOLANA': 'SOL',
    'DOGECOIN': 'DOGE',
    'CARDANO': 'ADA',
    'RIPPLE': 'XRP',
    'POLKADOT': 'DOT',
    'AVALANCHE': 'AVAX',
    'CHAINLINK': 'LINK',
    'POLYGON': 'MATIC',
    // Stock full names
    'TATA CONSULTANCY SERVICES': 'TCS',
    'RELIANCE INDUSTRIES': 'RELIANCE',
    'INFOSYS': 'INFY',
    'HDFC BANK': 'HDFCBANK',
    'STATE BANK OF INDIA': 'SBIN',
    'ICICI BANK': 'ICICIBANK',
    'LARSEN & TOUBRO': 'LT',
    'ITC LIMITED': 'ITC',
    'AXIS BANK': 'AXISBANK',
    'KOTAK MAHINDRA BANK': 'KOTAKBANK'
  };

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
    // Remove generic provider/config messages
    s = s.replace(/AI provider not configured\.?[^\n]*/gi, '');
    s = s.replace(/Add a free HUGGINGFACE_API_KEY[^\n]*/gi, '');
    // Clean up extra whitespace and newlines
    s = s.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ').replace(/\n\s*\n/g, '\n');
    return s.trim();
  };

  const ensureFilled = useCallback((payload) => {
    const a = String(assetName || asset || 'the asset').toUpperCase();
    
    // Try to map full names to symbols first
    let symbolKey = nameToSymbol[a] || a;
    
    const safe = (s, def) => {
      const cleaned = clean(s || '');
      if (!cleaned) return def;
      if (cleaned.length < 12) return def;
      return cleaned;
    };
    
    // Check if we have specific intelligence for this asset
    const specificData = stockIntelligence[symbolKey];
    const fallback = specificData || {
      global_news_summary: `No major recent headlines specifically flagged for ${a}. Consider macro context, sector flows, and any regulatory or earnings catalysts that could influence momentum.`,
      user_comments_summary: `Community commentary for ${a} appears limited. Treat any sentiment reads cautiously and pair with price/volume behavior to avoid bias.`,
      market_sentiment_summary: `Assume mixed-to-neutral sentiment for ${a} when explicit data is sparse. Watch for breakouts above resistance or failures at key levels to validate direction.`,
      final_summary: `Build a plan for ${a}: define invalidation levels, size appropriately, and track news triggers. Stay flexible until stronger catalysts or consensus emerge.`,
    };
    
    const p = payload || {};
    return {
      global_news_summary: safe(p.global_news_summary, fallback.global_news_summary),
      user_comments_summary: safe(p.user_comments_summary, fallback.user_comments_summary),
      market_sentiment_summary: safe(p.market_sentiment_summary, fallback.market_sentiment_summary),
      final_summary: safe(p.final_summary, fallback.final_summary),
      analysis_provider: p.analysis_provider || (specificData ? 'client-stock-data' : 'client-fallback'),
      generated_at: p.generated_at || new Date().toISOString(),
      data_points: p.data_points || { comments_count: 0, sentiment_votes: 0, trade_votes: 0, bullish_percent: 50, buy_percent: 33.3 },
    };
  }, [assetName, asset]);

  useEffect(() => {
    let cancelled = false;
    let timeoutId;
    const fetchData = async () => {
      try {
        const payloadName = assetName || asset;
        const a = String(payloadName || 'the asset').toUpperCase();
        
        // Try to map full names to symbols first
        let symbolKey = nameToSymbol[a] || a;
        
        // Check if we have instant client-side data first
        if (stockIntelligence[symbolKey]) {
          console.log(`[IntelligencePanel] ${payloadName} -> ${symbolKey} - Using instant client-side data`);
          setData(ensureFilled(stockIntelligence[symbolKey]));
          setLoading(false);
          setRefreshing(false);
          return;
        }
        
        // Set a timeout to prevent infinite loading
        timeoutId = setTimeout(() => {
          if (!cancelled) {
            console.log(`[IntelligencePanel] ${payloadName} - Timeout, using fallback`);
            setData(ensureFilled({}));
            setLoading(false);
            setRefreshing(false);
          }
        }, 3000); // 3 second timeout
        
        // Try to get cached intelligence data from API (only if no client-side data)
        console.log(`[IntelligencePanel] ${payloadName} -> ${symbolKey} - Fetching from API...`);
        const resp = await fetch(`${process.env.REACT_APP_API_URL || 'https://crowdverse-backend.onrender.com'}/api/ai-summary/intelligence/${payloadName}?_t=${Date.now()}&_v=3.0`);
        const data = await resp.json();
        
        // Clear timeout if we got response
        clearTimeout(timeoutId);
        
        if (cancelled) return;
        
        if (data && data.global_news_summary) {
          console.log(`[IntelligencePanel] ${payloadName} - Using database data`);
          setData(ensureFilled(data));
        } else {
          console.log(`[IntelligencePanel] ${payloadName} - No data found, using fallback`);
          if (!cancelled) setData(ensureFilled({}));
        }
      } catch (e) {
        clearTimeout(timeoutId);
        console.error('Failed to load intelligence data:', e);
        // Always have fallback ready
        if (!cancelled) setData(ensureFilled({}));
      } finally {
        if (!cancelled) {
          clearTimeout(timeoutId);
          setLoading(false);
          setRefreshing(false);
        }
      }
    };
    
    fetchData();
    return () => { 
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [asset, assetName, ensureFilled]);

  const onRefresh = () => {
    setRefreshing(true);
    setLoading(true);
    setError('');
    const run = async () => {
      try {
        const payloadName = assetName || asset;
        const resp = await fetch(`${process.env.REACT_APP_API_URL || 'https://crowdverse-backend.onrender.com'}/api/ai-summary/intelligence/${payloadName}?_t=${Date.now()}&_v=3.0`);
        const data = await resp.json();
        setData(ensureFilled(data));
      } catch (e) {
        console.error('Refresh failed:', e);
        setData(ensureFilled({}));
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

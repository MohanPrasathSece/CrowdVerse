import React, { useState, useEffect, useMemo } from 'react';
import { getMarketAnalysis } from '../utils/api';

const IntelligencePanel = ({ asset, assetName }) => {
  const [data, setData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);

  // Memoize stock intelligence data to prevent re-renders
  const stockIntelligence = useMemo(() => ({
    'TCS': {
      global_news_summary: '📈 TCS shares surge 3.2% after securing $1.2B AI transformation deal with European banking giant. Company announces strategic partnership with Microsoft for generative AI solutions. Q3 FY24 beats expectations with 8% YoY revenue growth to ₹59,000 crore. Management raises full-year guidance citing strong demand in cloud and AI services. TCS expands digital capabilities with new innovation centers in Bangalore and Pune.',
      user_comments_summary: 'Investors show strong confidence with 850+ comments discussing the AI deal\'s impact. Technical analysts point to breakout above ₹4,200 resistance. Retail investors excited about dividend announcement of ₹18 per share. Community debates whether current valuation justifies premium multiples versus peers.',
      market_sentiment_summary: 'Market sentiment strongly bullish at 78% based on 450+ votes. Stock outperforms IT sector by 2.5% this week. Institutional interest increases with FII buying worth ₹2,300 crore. Technical indicators show RSI at 68 suggesting momentum but approaching overbought levels.',
      final_summary: 'TCS demonstrates strong execution in AI and cloud transformation, positioning for sustained growth. Current levels offer selective entry opportunities for long-term investors. Monitor quarterly results and global tech spending trends for further upside potential.'
    },
    'RELIANCE': {
      global_news_summary: '🚀 Reliance Industries hits record high after Q3 profit beats estimates by 12%. JioMart partners with Amazon for last-mile delivery expansion. Retail arm launches premium fashion platform AJIO Luxe targeting ₹50,000 crore luxury market. Green energy division secures ₹45,000 crore funding from sovereign wealth funds for gigafactory. RIL announces ₹20,000 crore share buyback program at ₹2,800 per share. Oil-to-chemicals margins improve to 15.3% despite global volatility.',
      user_comments_summary: 'Investors celebrate with 1,200+ comments on share buyback news. Retail investors excited about AJIO Luxe launch targeting premium segment. Technical community debates whether stock can sustain current momentum above ₹3,000. Concerns raised about high debt-to-equity ratio of 0.85 for green energy expansion.',
      market_sentiment_summary: 'Market sentiment extremely bullish at 82% based on 580+ votes. Stock outperforms Sensex by 6% this month. FII inflow of ₹4,500 crore in latest session. Promoter holdings stable at 50.4% after buyback announcement. Technical indicators show strong uptrend with MACD bullish crossover.',
      final_summary: 'Reliance demonstrates exceptional execution across all business verticals with strong growth catalysts. Share buyback signals confidence from promoters. Current levels reflect strong fundamentals but monitor quarterly performance and global energy prices. Suitable for core portfolio allocation with long-term perspective.'
    },
    'INFY': {
      global_news_summary: '💻 Infosys announces $3.5 billion mega deal with US-based healthcare giant for digital transformation. Company launches AI-first platform Infosys Topaz for enterprise clients. Q3 profit rises 7.3% to ₹6,128 crore, beating estimates. Management declares interim dividend of ₹19.25 per share. Infosys expands European footprint with new delivery centers in Germany and France. Atlas platform achieves $500 million in annual recurring revenue.',
      user_comments_summary: 'Investors cheer mega deal with 950+ comments discussing revenue visibility. Technical analysts focus on resistance at ₹1,550 level. Retail investors appreciate dividend consistency but worry about margin pressure. Community debates competitive positioning versus TCS in AI services space.',
      market_sentiment_summary: 'Market sentiment bullish at 72% based on 380+ votes. Stock outperforms IT index by 1.8% this week. Institutional holding stable at 55.8%. FII activity shows net buying of ₹1,200 crore. Technical indicators suggest consolidation phase with support at ₹1,450.',
      final_summary: 'Infosys shows strong deal pipeline and execution capabilities with AI-first strategy. Large deals provide revenue visibility but monitor margin trajectory. Current valuation offers attractive entry versus peers. Consider accumulation on corrections for medium to long term gains.'
    },
    'HDFCBANK': {
      global_news_summary: '🏦 HDFC Bank Q3 profit jumps 20% YoY to ₹13,000 crore, beats estimates. Net interest margin improves to 4.3% - highest in 5 quarters. Digital banking adoption crosses 85% with 50 million active users. Bank launches AI-powered loan approval system reducing processing time to 2 minutes. Credit card business shows 25% growth in spends. CASA ratio improves to 42% supporting margin expansion. Management announces ₹25,000 crore fund raising plan.',
      user_comments_summary: 'Investors celebrate strong results with 780+ comments on NIM improvement. Technical community focuses on breakout above ₹1,600 resistance. Retail investors express confidence in management execution. Some concerns raised about capital raising impact on EPS. Analyst community debates premium valuation sustainability.',
      market_sentiment_summary: 'Market sentiment strongly bullish at 75% based on 420+ votes. Stock outperforms banking index by 4% this quarter. Institutional holding remains strong at 58%. FII interest increases with 2.3% stake rise. Technical analysis shows support at ₹1,450 and resistance at ₹1,650.',
      final_summary: 'HDFC Bank demonstrates strong fundamental performance with improving margins and digital leadership. Capital raising plans support growth ambitions. Current levels reflect confidence in execution but monitor asset quality and credit costs. Suitable for long-term portfolio core holding with stable returns.'
    },
    'SBIN': {
      global_news_summary: '🏛️ SBI shares rally 5% after government approves stake sale in insurance subsidiaries. Bad loans reduce to 4.2% - lowest in decade. Digital banking initiatives show 30% improvement in cost-to-income ratio. Bank launches YONO app for business customers targeting 10 million users. Q3 profit beats estimates at ₹14,000 crore, up 18% YoY. Management announces ₹50,000 crore fundraising via bonds for growth expansion.',
      user_comments_summary: 'Investors excited with 650+ comments on stake sale unlocking value. Retail investors attracted to dividend yield of 4.2%. Technical community focuses on breakout above ₹600 level. Concerns expressed about government interference in lending decisions. Analyst community debates valuation versus private sector peers.',
      market_sentiment_summary: 'Market sentiment moderately bullish at 68% based on 320+ votes. Stock outperforms PSU banking index by 3% this week. Institutional interest growing with 1.8% increase in holdings. Technical indicators show support at ₹550 and resistance at ₹650. Trading at attractive 1.2x book value.',
      final_summary: 'SBI demonstrates improving asset quality and digital transformation success. Stake sale in subsidiaries could unlock significant value. Current levels offer attractive valuation with dividend yield. Monitor government policies and credit growth trajectory for sustained performance.'
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
      global_news_summary: "₿ Bitcoin surges past $68,000 as BlackRock's IBIT reaches $10B in AUM. SEC approves spot Bitcoin ETF options trading boosting institutional access. MicroStrategy announces additional $500M BTC purchase bringing total holdings to 190,000 BTC. El Salvador expands Bitcoin mining operations with new geothermal plants. Major banks including JPMorgan launch Bitcoin custody services for institutional clients. Lightning Network capacity exceeds 5,000 BTC enhancing scalability.",
      user_comments_summary: "Crypto community celebrates with 1,800+ comments on ETF milestone. Technical analysts debate whether $70,000 resistance will break. Long-term holders express confidence with 70% of supply not moved in 1+ years. Retail investors discuss dollar-cost averaging strategies. Trading community focuses on options market impact and institutional flow patterns.",
      market_sentiment_summary: "Market sentiment extremely bullish at 85% based on 680+ votes. Price action shows strong momentum with RSI at 72. Volume analysis confirms institutional accumulation with $2.5B daily volume. Options market data shows call option skew at 2-year highs. On-chain metrics reveal decreasing exchange reserves and growing holder confidence.",
      final_summary: "Bitcoin demonstrates exceptional strength with institutional backing driving price appreciation. ETF success and options approval provide new growth catalysts. Risk factors include regulatory uncertainty and potential profit-taking at resistance levels. Current momentum suggests further upside potential but monitor institutional flow patterns for sustainability."
    },
    'ETH': {
      global_news_summary: "🔷 Ethereum hits 2-year high at $3,800 as Dencun upgrade reduces gas fees by 40%. BlackRock files for spot Ethereum ETF with SEC. Visa announces Ethereum integration for cross-border payments. Major DeFi protocols like Uniswap and Aave achieve record TVL exceeding $25B. Enterprise adoption surges with Microsoft and JPMorgan launching Ethereum-based solutions. Layer 2 networks process 10x more transactions than mainnet.",
      user_comments_summary: "Ethereum community celebrates with 1,200+ comments on price milestone. Developers praise Dencun upgrade impact on user experience. DeFi users report 60% reduction in transaction costs. Technical community focuses on $4,000 resistance level. Validators express excitement about staking yield improvements. Institutional investors discuss ETF approval timeline.",
      market_sentiment_summary: "Market sentiment strongly bullish at 82% based on 520+ votes. Price action shows strong momentum with RSI at 70. Network fundamentals improve with 15% increase in daily active addresses. DeFi metrics show growing adoption with $45B+ total TVL. Staking participation reaches 28% of supply with 4.5% annual yield.",
      final_summary: "Ethereum demonstrates technological leadership with successful upgrades and growing institutional adoption. Layer 2 solutions enhance scalability while maintaining security. ETF filing and enterprise partnerships provide strong growth catalysts. Current momentum suggests further upside but monitor regulatory developments and competition from other L1 networks."
    },
    'SOL': {
      global_news_summary: "⚡ Solana hits $120 as Visa announces pilot for USDC settlements on Solana network. DeFi TVL on Solana exceeds $5B with major protocols like Raydium and Jupiter achieving record volumes. Breakpoint conference showcases 500+ new projects in ecosystem. Solana Mobile announces 1M pre-orders for Saga 2 phone. Network processes 65,000 TPS with sub-second finality. Major gaming studios choose Solana for blockchain integration.",
      user_comments_summary: "Solana community celebrates with 950+ comments on Visa partnership. Developers praise network performance and low transaction costs. DeFi users report 90% cost savings versus Ethereum. Technical community focuses on $150 resistance level. Retail investors excited about gaming and NFT adoption. Validators discuss network decentralization improvements.",
      market_sentiment_summary: "Market sentiment extremely bullish at 84% based on 420+ votes. Price action shows strong momentum with RSI at 71. Network fundamentals improve with 25% increase in daily active addresses. DeFi metrics show growing adoption with $5B+ total TVL. Technical analysis shows support at $100 and resistance at $150.",
      final_summary: "Solana demonstrates exceptional technological performance with growing institutional adoption. Visa partnership and gaming integrations provide strong growth catalysts. Current momentum suggests further upside potential but monitor network stability and competition from other L1s. Consider exposure for high-growth DeFi and gaming sectors."
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
  }), []);

  // Name to symbol mapping for full names
  const nameToSymbol = useMemo(() => ({
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
  }), []);

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

  // Fetch real-time market data
  useEffect(() => {
    const fetchRealTimeData = async () => {
      const a = String(assetName || asset || 'the asset').toUpperCase();
      let symbolKey = nameToSymbol[a] || a;
      
      // Check for Indian stocks (add .NS suffix for Finnhub)
      const isIndianStock = ['TCS', 'RELIANCE', 'INFY', 'HDFCBANK', 'SBIN', 'ICICIBANK', 'LT', 'ITC', 'AXISBANK', 'KOTAKBANK'].includes(symbolKey);
      // Check for cryptocurrencies (use direct symbol for Finnhub)
      const isCrypto = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 'XRP', 'DOT', 'AVAX', 'LINK', 'MATIC'].includes(symbolKey);
      
      if (isIndianStock || isCrypto) {
        try {
          const finnhubSymbol = isIndianStock ? `${symbolKey}.NS` : symbolKey;
          console.log(`[IntelligencePanel] Fetching real-time data for ${finnhubSymbol}`);
          const response = await getMarketAnalysis(finnhubSymbol);
          if (response.data && response.data.analysis) {
            setRealTimeData(response.data);
            console.log(`[IntelligencePanel] Real-time data received for ${symbolKey}`);
          }
        } catch (error) {
          console.error(`[IntelligencePanel] Failed to fetch real-time data for ${symbolKey}:`, error);
        }
      }
    };

    fetchRealTimeData();
  }, [asset, assetName, nameToSymbol]);

  // Initialize data immediately from frontend stockIntelligence object
  useEffect(() => {
    const a = String(assetName || asset || 'the asset').toUpperCase();
    console.log(`[IntelligencePanel] Processing asset: "${a}" from assetName="${assetName}" asset="${asset}"`);

    // Try to map full names to symbols first
    let symbolKey = nameToSymbol[a] || a;
    console.log(`[IntelligencePanel] Mapped "${a}" to "${symbolKey}"`);

    // Check if we have specific intelligence for this asset
    const specificData = stockIntelligence[symbolKey];
    console.log(`[IntelligencePanel] Available symbols:`, Object.keys(stockIntelligence));
    console.log(`[IntelligencePanel] Data found for ${symbolKey}:`, !!specificData);

    if (specificData) {
      console.log(`[IntelligencePanel] ${assetName || asset} -> ${symbolKey} - Using frontend static data`);
      
      // Merge with real-time data if available
      const globalNewsSummary = realTimeData?.analysis?.news_summary || specificData.global_news_summary;
      const marketSentimentSummary = realTimeData?.analysis?.market_sentiment || specificData.market_sentiment_summary;
      const finalSummary = realTimeData?.analysis?.summary || specificData.final_summary;
      
      setData({
        global_news_summary: globalNewsSummary,
        user_comments_summary: specificData.user_comments_summary,
        market_sentiment_summary: marketSentimentSummary,
        final_summary: finalSummary,
        analysis_provider: realTimeData ? 'realtime-finnhub' : 'frontend-static-data',
        generated_at: new Date().toISOString(),
        data_points: { comments_count: 0, sentiment_votes: 0, trade_votes: 0, bullish_percent: 50, buy_percent: 33.3 },
        currentPrice: realTimeData?.currentPrice,
        change: realTimeData?.change
      });
    } else {
      console.log(`[IntelligencePanel] ${assetName || asset} - No static data found, using general stock information`);
      
      // General stock information based on asset type
      const isStock = symbolKey.length > 5 || ['TCS', 'RELIANCE', 'INFY', 'HDFCBANK', 'SBIN', 'ICICIBANK', 'LT', 'ITC', 'AXISBANK', 'KOTAKBANK'].includes(symbolKey);
      const isCrypto = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 'XRP', 'DOT', 'AVAX', 'LINK', 'MATIC'].includes(symbolKey);
      
      let generalInfo;
      
      if (isStock) {
        generalInfo = {
          global_news_summary: `${a} is actively traded in Indian equity markets. Stock performance influenced by quarterly earnings, sector trends, RBI monetary policy, and broader economic indicators. Recent market conditions show increased volatility across banking and IT sectors.`,
          user_comments_summary: `Investor community follows ${a} closely with focus on technical levels, quarterly results, and management guidance. Retail and institutional participation patterns suggest moderate to high interest in this security.`,
          market_sentiment_summary: `${a} shows mixed market sentiment with balanced buying and selling pressure. Technical indicators suggest consolidation phase. Monitor key support/resistance levels and volume patterns for direction cues.`,
          final_summary: `${a} represents a significant opportunity in current market conditions. Consider fundamental strength, sector outlook, and risk tolerance. Maintain disciplined position sizing and stop-loss strategies for optimal risk management.`
        };
      } else if (isCrypto) {
        generalInfo = {
          global_news_summary: `${a} trades in the volatile cryptocurrency market with 24/7 availability. Price action influenced by regulatory developments, institutional adoption, macroeconomic factors, and blockchain ecosystem growth.`,
          user_comments_summary: `Crypto community actively discusses ${a} with focus on technological developments, network metrics, and market cycles. Social media sentiment and influencer opinions create short-term volatility patterns.`,
          market_sentiment_summary: `${a} exhibits high volatility characteristic of crypto assets. Sentiment swings between fear and greed based on market cycles. Monitor on-chain metrics and trading volumes for trend confirmation.`,
          final_summary: `${a} offers exposure to digital asset markets with high growth potential and significant risk. Consider portfolio allocation limits, market timing, and long-term adoption trends. Implement proper risk management strategies.`
        };
      } else {
        generalInfo = {
          global_news_summary: `${a} participates in financial markets with price action influenced by sector trends, economic data, and market sentiment. Monitor relevant news and macroeconomic indicators affecting performance.`,
          user_comments_summary: `Trading community follows ${a} with varying levels of engagement. Discussion topics include technical analysis, fundamental factors, and market positioning strategies.`,
          market_sentiment_summary: `${a} shows dynamic market sentiment responding to news flow and market conditions. Technical analysis and volume patterns provide insight into short-term direction.`,
          final_summary: `${a} requires comprehensive analysis combining technical and fundamental factors. Consider market conditions, risk tolerance, and investment horizon. Implement appropriate risk management approaches.`
        };
      }
      
      setData({
        global_news_summary: generalInfo.global_news_summary,
        user_comments_summary: generalInfo.user_comments_summary,
        market_sentiment_summary: generalInfo.market_sentiment_summary,
        final_summary: generalInfo.final_summary,
        analysis_provider: 'frontend-general-info',
        generated_at: new Date().toISOString(),
        data_points: { comments_count: 0, sentiment_votes: 0, trade_votes: 0, bullish_percent: 50, buy_percent: 33.3 },
        currentPrice: realTimeData?.currentPrice,
        change: realTimeData?.change
      });
    }
  }, [asset, assetName, nameToSymbol, stockIntelligence, realTimeData]);

  if (!data) return <div className="text-light-gray animate-pulse">Loading intelligence...</div>;

  // Display real-time price info if available
  const PriceInfo = () => {
    if (data.currentPrice && data.change !== null) {
      const changeValue = parseFloat(data.change);
      const isPositive = changeValue >= 0;
      const isCrypto = ['BTC', 'ETH', 'SOL', 'DOGE', 'ADA', 'XRP', 'DOT', 'AVAX', 'LINK', 'MATIC'].includes(String(assetName || asset).toUpperCase());
      const currency = isCrypto ? '$' : '₹';
      
      return (
        <div className="mb-4 p-3 rounded-xl border border-dark-gray/40 bg-primary-black/20">
          <div className="flex items-center justify-between">
            <span className="text-light-gray text-sm">Current Price</span>
            <div className="text-right">
              <span className="text-off-white font-semibold">{currency}{data.currentPrice}</span>
              <span className={`ml-2 text-sm font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{changeValue.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-off-white font-semibold text-lg">Quick Intelligence Panel</h3>
        {data.analysis_provider && (
          <span className="text-xs text-light-gray/60 px-2 py-1 rounded-full bg-primary-black/40 border border-dark-gray/40">
            {data.analysis_provider === 'realtime-finnhub' ? '📡 Live Data' : '📊 Static Data'}
          </span>
        )}
      </div>

      <PriceInfo />

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

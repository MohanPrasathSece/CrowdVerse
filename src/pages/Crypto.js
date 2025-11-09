import React, { useState, useEffect } from 'react';
import { getCryptoMarkets } from '../utils/api';

const Crypto = () => {
  const [crypto, setCrypto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let cancelled = false;

    const fetchCrypto = async () => {
      try {
        const { data } = await getCryptoMarkets();
        if (cancelled) return;

        const items = Array.isArray(data?.results) ? data.results : [];

        const formatted = items.map((item, idx) => {
          const priceValue = typeof item.price === 'number' ? item.price : null;
          const changeValue = typeof item.change === 'number' ? item.change : null;

          const formatNumber = (value) =>
            typeof value === 'number'
              ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
              : '—';

          return {
            id: item.symbol ?? idx,
            rank: item.rank ?? idx + 1,
            name: item.name ?? '—',
            symbol: (item.symbol ?? '').toUpperCase(),
            price: formatNumber(priceValue),
            change: changeValue,
            open: formatNumber(item.open),
            high: formatNumber(item.high),
            low: formatNumber(item.low),
            prevClose: formatNumber(item.prevClose),
          };
        });

        setCrypto(formatted);
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load cryptocurrencies. Please try again.');
          console.error(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchCrypto();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCrypto = crypto.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-off-white text-xl animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-off-white"></div>
            <span>Loading cryptocurrencies...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500 text-red-200 px-4 py-3 rounded animate-fadeIn">
        {error}
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-off-white mb-2 animate-slideInLeft">
              Cryptocurrency Market
            </h2>
            <p className="text-light-gray animate-slideInLeft">Top cryptocurrencies by market cap and trading volume</p>
          </div>
          <div className="mt-4 md:mt-0 animate-slideInRight">
            <input
              type="text"
              placeholder="Search crypto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-secondary-black border border-dark-gray rounded-lg text-off-white focus:outline-none focus:ring-2 focus:ring-off-white hover-glow"
            />
          </div>
        </div>

        {/* Crypto Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 animate-slideInLeft">
          <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
            <div className="text-sm text-light-gray mb-1">Total Market Cap</div>
            <div className="text-2xl font-bold text-off-white">$2.85T</div>
            <div className="text-green-400 text-sm">+4.2% (24h)</div>
          </div>
          <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
            <div className="text-sm text-light-gray mb-1">24h Volume</div>
            <div className="text-2xl font-bold text-off-white">$89.5B</div>
            <div className="text-blue-400 text-sm">High activity</div>
          </div>
          <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
            <div className="text-sm text-light-gray mb-1">BTC Dominance</div>
            <div className="text-2xl font-bold text-off-white">52.3%</div>
            <div className="text-yellow-400 text-sm">Leading</div>
          </div>
          <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
            <div className="text-sm text-light-gray mb-1">Fear & Greed</div>
            <div className="text-2xl font-bold text-green-400">74</div>
            <div className="text-green-400 text-sm">Greed</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredCrypto.map((coin, index) => (
          <div
            key={coin.id ?? coin.rank}
            className="bg-gradient-bg border border-dark-gray rounded-2xl p-6 hover-enlarge transition-all animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-primary-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg animate-pulse">
                  #{coin.rank}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-off-white mb-1">{coin.name}</h3>
                  <p className="text-sm text-light-gray font-medium">{coin.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-off-white mb-1">{coin.price}</div>
                <div
                  className={`text-sm font-medium ${
                    coin.change === null ? 'text-light-gray'
                      : coin.change >= 0
                        ? 'text-green-400'
                        : 'text-red-400'
                  }`}
                >
                  {coin.change === null ? '—' : `${coin.change >= 0 ? '+' : ''}${coin.change.toFixed(2)}%`}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-dark-gray">
                <span className="text-light-gray text-sm">Open</span>
                <span className="text-off-white font-medium">{coin.open}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dark-gray">
                <span className="text-light-gray text-sm">High / Low</span>
                <span className="text-off-white font-medium">{coin.high} / {coin.low}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-light-gray text-sm">Prev Close</span>
                <span className="text-off-white font-medium">{coin.prevClose}</span>
              </div>
            </div>

            {/* Crypto-specific indicators */}
            <div className="mt-4 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-light-gray">Live</span>
              </div>
              <div className="text-light-gray">
                {coin.symbol === 'BTC' && 'Leader'}
                {coin.symbol === 'ETH' && 'Smart Contracts'}
                {coin.symbol === 'SOL' && 'High Throughput'}
                {coin.symbol === 'DOGE' && 'Meme Coin'}
                {coin.symbol === 'ADA' && 'Research-Driven'}
                {coin.symbol === 'XRP' && 'Banking'}
                {coin.symbol === 'DOT' && 'Interoperability'}
                {coin.symbol === 'AVAX' && 'Scalable'}
                {coin.symbol === 'LINK' && 'Oracle'}
                {coin.symbol === 'MATIC' && 'Layer 2'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCrypto.length === 0 && searchTerm && (
        <div className="text-center py-12 animate-fadeIn">
          <div className="text-xl text-light-gray">No cryptocurrencies found matching "{searchTerm}"</div>
        </div>
      )}
    </div>
  );
};

export default Crypto;

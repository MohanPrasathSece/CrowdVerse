import React, { useState, useEffect } from 'react';
import { getStockMarkets } from '../utils/api';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await getStockMarkets();
        if (cancelled) return;

        const items = Array.isArray(data?.results) ? data.results : [];

        const formatted = items.map((item, idx) => ({
          rank: item.rank ?? idx + 1,
          name: item.name ?? '—',
          symbol: item.symbol ?? '—',
          price: typeof item.price === 'number' ? item.price : null,
          open: typeof item.open === 'number' ? item.open : null,
          high: typeof item.high === 'number' ? item.high : null,
          low: typeof item.low === 'number' ? item.low : null,
          prevClose: typeof item.prevClose === 'number' ? item.prevClose : null,
          change: typeof item.change === 'number' ? item.change : null,
        }));

        setStocks(formatted);
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load stocks. Please try again.');
          console.error(err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredStocks = stocks.filter((stock) =>
    (stock.name ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (stock.symbol ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value) =>
    typeof value === 'number'
      ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : '—';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-off-white text-xl animate-pulse">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-off-white"></div>
            <span>Loading stocks...</span>
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
              Global Equities Snapshot
            </h2>
            <p className="text-light-gray animate-slideInLeft">Live prices for leading international stocks</p>
          </div>
          <div className="mt-4 md:mt-0 animate-slideInRight">
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-secondary-black border border-dark-gray rounded-lg text-off-white focus:outline-none focus:ring-2 focus:ring-off-white hover-glow"
            />
          </div>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-slideInLeft">
          <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
            <div className="text-sm text-light-gray mb-1">Market Cap</div>
            <div className="text-2xl font-bold text-off-white">₹285.7L Cr</div>
            <div className="text-green-400 text-sm">+2.1% today</div>
          </div>
          <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
            <div className="text-sm text-light-gray mb-1">Total Volume</div>
            <div className="text-2xl font-bold text-off-white">₹45.2K Cr</div>
            <div className="text-blue-400 text-sm">Active trading</div>
          </div>
          <div className="bg-gradient-bg p-4 rounded-xl border border-dark-gray hover-lift">
            <div className="text-sm text-light-gray mb-1">Gainers/Losers</div>
            <div className="text-2xl font-bold text-off-white">7:3</div>
            <div className="text-green-400 text-sm">Bullish trend</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStocks.map((stock, index) => (
          <div
            key={stock.rank}
            className="bg-gradient-bg border border-dark-gray rounded-2xl p-6 hover-enlarge transition-all animate-fadeIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-off-white text-primary-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg animate-pulse">
                  #{stock.rank}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-off-white mb-1">{stock.name}</h3>
                  <p className="text-sm text-light-gray font-medium">{stock.symbol}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-off-white mb-1">{formatCurrency(stock.price)}</div>
                {stock.change !== null ? (
                  <div className={`text-sm font-medium ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                  </div>
                ) : (
                  <div className="text-sm font-medium text-light-gray">—</div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-dark-gray">
                <span className="text-light-gray text-sm">Open</span>
                <span className="text-off-white font-medium">{formatCurrency(stock.open)}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-dark-gray">
                <span className="text-light-gray text-sm">High / Low</span>
                <span className="text-off-white font-medium">{formatCurrency(stock.high)} / {formatCurrency(stock.low)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-light-gray text-sm">Prev Close</span>
                <span className="text-off-white font-medium">{formatCurrency(stock.prevClose)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredStocks.length === 0 && searchTerm && (
        <div className="text-center py-12 animate-fadeIn">
          <div className="text-xl text-light-gray">No stocks found matching "{searchTerm}"</div>
        </div>
      )}
    </div>
  );
};

export default Stocks;

import React from 'react';

const positions = [
  {
    asset: 'US Growth Equity ETF',
    allocation: '28%',
    value: '$42,694',
    cost: '$38,510',
    pl: '+$4,184',
    trend: '+3.6%',
  },
  {
    asset: 'Global Quality Dividend ETF',
    allocation: '18%',
    value: '$27,446',
    cost: '$26,220',
    pl: '+$1,226',
    trend: '+1.8%',
  },
  {
    asset: 'Digital Assets Basket',
    allocation: '25%',
    value: '$38,120',
    cost: '$34,980',
    pl: '+$3,140',
    trend: '+6.4%',
  },
  {
    asset: 'Emerging Markets Equity',
    allocation: '12%',
    value: '$18,298',
    cost: '$17,040',
    pl: '+$1,258',
    trend: '+2.1%',
  },
  {
    asset: 'Short Duration Treasuries',
    allocation: '10%',
    value: '$15,248',
    cost: '$15,000',
    pl: '+$248',
    trend: '+0.4%',
  },
  {
    asset: 'Private Credit Fund',
    allocation: '7%',
    value: '$10,674',
    cost: '$10,200',
    pl: '+$474',
    trend: '+1.1%',
  },
];

const Portfolio = () => (
  <div className="bg-primary-black min-h-screen text-off-white">
    <div className="max-w-6xl mx-auto px-6 py-16 space-y-12">
      <div className="space-y-3">
        <span className="uppercase tracking-[0.35em] text-xs text-light-gray/60">Portfolio Overview</span>
        <h1 className="text-4xl font-semibold">Balanced Growth Allocation</h1>
        <p className="text-sm text-light-gray/70 max-w-2xl">
          A diversified blend across equities, digital assets, and alternative holdings designed for a moderate risk appetite and long-term compounding.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Value', value: '$152,480', delta: '+5.1% YTD', tone: 'positive' },
          { title: 'Annual Yield', value: '3.4%', delta: 'Blend of dividends + staking', tone: 'neutral' },
          { title: 'Risk Profile', value: 'Moderate', delta: 'Max drawdown -12.4%', tone: 'neutral' },
          { title: 'Cash Buffer', value: '$12,480', delta: '2 months runway', tone: 'neutral' },
        ].map((card) => (
          <div
            key={card.title}
            className="p-6 rounded-2xl border border-dark-gray/60 bg-primary-black/60 backdrop-blur-sm hover-enlarge transition-all"
          >
            <div className="text-xs uppercase tracking-[0.25em] text-light-gray/60 mb-3">{card.title}</div>
            <div className="text-3xl font-semibold text-off-white">{card.value}</div>
            <div
              className={`text-sm mt-2 ${
                card.tone === 'positive'
                  ? 'text-green-400'
                  : card.tone === 'negative'
                    ? 'text-red-400'
                    : 'text-light-gray/60'
              }`}
            >
              {card.delta}
            </div>
          </div>
        ))}
      </div>

      <div className="border border-dark-gray/60 rounded-3xl bg-primary-black/60 backdrop-blur-sm">
        <div className="px-8 py-6 border-b border-dark-gray/40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Current Positions</h2>
            <p className="text-sm text-light-gray/70">
              Updated hourly with live price feeds to keep allocations in sync with market movements.
            </p>
          </div>
          <div className="text-xs uppercase tracking-[0.25em] text-light-gray/60">
            Last Rebalanced • 12 days ago
          </div>
        </div>

        <div className="px-8 py-6 overflow-x-auto">
          <table className="min-w-full text-sm text-light-gray/80">
            <thead className="text-xs uppercase tracking-[0.2em] text-light-gray/60">
              <tr>
                <th className="text-left py-3">Asset</th>
                <th className="text-left py-3">Allocation</th>
                <th className="text-left py-3">Value</th>
                <th className="text-left py-3">Cost Basis</th>
                <th className="text-left py-3">P/L</th>
                <th className="text-left py-3">1M Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-gray/40">
              {positions.map((row) => (
                <tr key={row.asset} className="hover:bg-secondary-black/40 transition-colors">
                  <td className="py-3 pr-6 text-off-white/90">{row.asset}</td>
                  <td className="py-3 pr-6">{row.allocation}</td>
                  <td className="py-3 pr-6">{row.value}</td>
                  <td className="py-3 pr-6 text-light-gray/60">{row.cost}</td>
                  <td className="py-3 pr-6 text-green-400">{row.pl}</td>
                  <td className="py-3 pr-6 text-green-400">{row.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
);

export default Portfolio;

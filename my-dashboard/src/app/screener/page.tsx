'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ScreenerPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scrId, setScrId] = useState('most_actives');

  const screeners = [
    { id: 'most_actives', label: '熱門交易量最大 (Most Actives)' },
    { id: 'day_gainers', label: '今日最大漲幅 (Day Gainers)' },
    { id: 'day_losers', label: '今日最大跌幅 (Day Losers)' },
    { id: 'undervalued_growth_stocks', label: '低估值成長股 (Undervalued Growth)' },
    { id: 'growth_technology_stocks', label: '科技成長股 (Tech Growth)' },
    { id: 'undervalued_large_caps', label: '低估值大型股 (Undervalued Large Caps)' },
    { id: 'aggressive_small_caps', label: '積極型小型股 (Aggressive Small Caps)' },
    { id: 'small_cap_gainers', label: '小型股飆股 (Small Cap Gainers)' },
    { id: 'portfolio_anchors', label: '投資組合基石/穩健股 (Portfolio Anchors)' },
  ];

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setData([]);

    try {
      const response = await fetch('/api/screener', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scrId })
      });

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || '載入失敗');
      }
    } catch (err: any) {
      setError(err.message || '網路連線錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-teal-500 hover:text-teal-400 font-medium inline-flex items-center mb-6 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首頁
        </Link>
        <h1 className="text-4xl font-extrabold text-foreground mb-4 flex items-center gap-3">
          <span className="text-teal-500">🔍</span> 股票篩選器 (Yahoo Finance) (實驗版)
        </h1>
        <p className="text-foreground/60 text-lg flex flex-col md:flex-row items-start md:items-center gap-3">
          即時獲取市場焦點標的。 
          <span className="text-xs bg-teal-500/20 text-teal-400 px-3 py-1.5 rounded-full border border-teal-500/30 flex items-center gap-1">
            <span className="animate-pulse">⚡</span> API 快取已啟用 (每日更新)
          </span>
        </p>
      </div>

      <div className="bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
          <div className="w-full md:w-auto">
            <label className="block text-foreground/70 font-semibold mb-2">選擇篩選策略</label>
            <select
              value={scrId}
              onChange={(e) => setScrId(e.target.value)}
              className="w-full md:w-64 bg-background border border-foreground/20 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {screeners.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className={`w-full md:w-auto px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${loading
              ? 'bg-teal-500/50 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-500 hover:scale-105 active:scale-95 shadow-teal-500/25'
              }`}
          >
            {loading ? '資料抓取中...' : '開始篩選'}
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 font-medium">
            ⚠️ 發生錯誤：{error}
          </div>
        )}

        {/* 骨架屏載入動畫 */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-full h-16 bg-foreground/5 rounded-xl animate-pulse"></div>
            ))}
          </div>
        )}

        {/* 資料表格 */}
        {!loading && data.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-foreground/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-foreground/5 text-foreground/70 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold border-b border-foreground/10">代號</th>
                  <th className="p-4 font-semibold border-b border-foreground/10">公司名稱</th>
                  <th className="p-4 font-semibold border-b border-foreground/10 text-right">目前價格</th>
                  <th className="p-4 font-semibold border-b border-foreground/10 text-right">變化 (%)</th>
                  <th className="p-4 font-semibold border-b border-foreground/10 text-right">本益比</th>
                  <th className="p-4 font-semibold border-b border-foreground/10 text-right">市值</th>
                  <th className="p-4 font-semibold border-b border-foreground/10 text-right">交易量</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-foreground/5">
                {data.map((stock, idx) => (
                  <tr key={idx} className="hover:bg-foreground/5 transition-colors">
                    <td className="p-4 font-bold text-teal-400">
                      <a href={`https://finance.yahoo.com/quote/${stock.symbol}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {stock.symbol}
                      </a>
                    </td>
                    <td className="p-4 text-foreground/90 font-medium truncate max-w-[200px]" title={stock.shortName}>{stock.shortName}</td>
                    <td className="p-4 font-bold text-right">${stock.price}</td>
                    <td className={`p-4 font-bold text-right ${parseFloat(stock.changePercent) < 0 ? 'text-rose-500' : 'text-emerald-500'
                      }`}>
                      {parseFloat(stock.changePercent) > 0 ? '+' : ''}{stock.changePercent}%
                    </td>
                    <td className="p-4 text-foreground/80 font-mono text-right">{stock.peRatio}</td>
                    <td className="p-4 text-foreground/80 text-right">{stock.marketCap}</td>
                    <td className="p-4 text-foreground/80 text-right">{stock.volume}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <div className="text-center py-16 text-foreground/40 border-2 border-dashed border-foreground/10 rounded-2xl">
            <span className="text-4xl mb-4 block">📈</span>
            <p>選擇策略並點擊上方按鈕開始獲取即時資料</p>
          </div>
        )}
      </div>
    </div>
  );
}

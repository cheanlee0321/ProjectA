"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function FundamentalAnalysisPage() {
  const [ticker, setTicker] = useState('');
  const [market, setMarket] = useState<'US' | 'TW' | 'TWO'>('US');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticker.trim()) {
      let finalTicker = ticker.trim().toUpperCase();
      if (market === 'TW' && !finalTicker.endsWith('.TW')) finalTicker += '.TW';
      if (market === 'TWO' && !finalTicker.endsWith('.TWO')) finalTicker += '.TWO';
      router.push(`/fundamental/${finalTicker}`);
    }
  };

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 lg:p-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-7xl mx-auto relative">
        <div className="mb-8 flex items-center">
          <Link href="/" className="text-foreground/50 hover:text-foreground transition-colors flex items-center group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首頁
          </Link>
        </div>

        <div className="border-b border-foreground/10 pb-8 mb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-6 drop-shadow-lg flex items-center justify-center gap-4">
            <span className="text-5xl">🏢</span>
            個股基本面分析
          </h1>
          <p className="mt-4 text-foreground/60 text-xl max-w-2xl mx-auto">
            快速查詢並深度解析公司財務體質，支援美股與台股市場。
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          {/* Market Selector */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <button 
              type="button"
              onClick={() => setMarket('US')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${market === 'US' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-foreground/5 border border-foreground/10 text-foreground/60 hover:bg-foreground/10'}`}
            >
              美股 (US)
            </button>
            <button 
              type="button"
              onClick={() => setMarket('TW')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${market === 'TW' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-foreground/5 border border-foreground/10 text-foreground/60 hover:bg-foreground/10'}`}
            >
              台股上市 (TW)
            </button>
            <button 
              type="button"
              onClick={() => setMarket('TWO')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${market === 'TWO' ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]' : 'bg-foreground/5 border border-foreground/10 text-foreground/60 hover:bg-foreground/10'}`}
            >
              台股上櫃 (TWO)
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-foreground/40 group-focus-within:text-rose-400 transition-colors" />
            </div>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder={market === 'US' ? '請輸入股票代號，例如: AAPL, TSLA' : '請輸入股票代號，例如: 2330, 2317'}
              className="block w-full pl-16 pr-6 py-6 bg-foreground/5 border border-foreground/10 rounded-3xl text-xl text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500/50 focus:bg-foreground/10 transition-all backdrop-blur-xl shadow-2xl"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="submit"
              className="absolute inset-y-2 right-2 px-8 bg-rose-500/80 hover:bg-rose-500 text-white rounded-2xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] hover:scale-[1.02] active:scale-95"
            >
              分析
            </button>
          </form>
          
          <div className="mt-8 flex items-center justify-center gap-4 text-foreground/40 text-sm">
            <span>熱門搜尋:</span>
            {(market === 'US' ? ['AAPL', 'NVDA', 'MSFT', 'TSLA'] : market === 'TW' ? ['2330', '2317', '2454'] : ['6488', '8299', '3105']).map(sym => (
              <button 
                key={sym}
                onClick={() => {
                  let finalSym = sym;
                  if (market === 'TW') finalSym += '.TW';
                  if (market === 'TWO') finalSym += '.TWO';
                  router.push(`/fundamental/${finalSym}`);
                }}
                className="hover:text-rose-400 transition-colors border border-foreground/10 rounded-full px-3 py-1 bg-foreground/5 hover:bg-foreground/10"
              >
                {sym}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

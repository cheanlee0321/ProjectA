"use client";

import { useState, useMemo } from 'react';

export default function PECalculator() {
  const [eps, setEps] = useState<number>(15.5);
  const [avgPE, setAvgPE] = useState<number>(18);
  const [marginOfSafety, setMarginOfSafety] = useState<number>(20);

  const results = useMemo(() => {
    const fairValue = eps * avgPE;
    const cheapValue = fairValue * (1 - marginOfSafety / 100);
    const expensiveValue = fairValue * (1 + marginOfSafety / 100);

    return {
      fairValue,
      cheapValue,
      expensiveValue
    };
  }, [eps, avgPE, marginOfSafety]);

  return (
    <div className="bg-background/80 rounded-2xl p-6 border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)] relative overflow-hidden my-8">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span className="text-3xl">🎯</span>
        <h3 className="text-xl font-bold text-indigo-400">本益比 (P/E) 合理股價計算機</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">預估未來一年 EPS (每股盈餘)</label>
              <span className="text-lg font-bold text-indigo-300">{eps.toFixed(2)} 元</span>
            </div>
            <p className="text-xs text-foreground/50">公司未來一年預計能為每股賺多少錢</p>
            <input 
              type="range" 
              min="1" 
              max="100" 
              step="0.5"
              value={eps} 
              onChange={(e) => setEps(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">歷史平均本益比 (P/E Ratio)</label>
              <span className="text-lg font-bold text-indigo-300">{avgPE} 倍</span>
            </div>
            <p className="text-xs text-foreground/50">市場過去願意花多少倍的價錢買這家公司的獲利</p>
            <input 
              type="range" 
              min="5" 
              max="100" 
              step="1"
              value={avgPE} 
              onChange={(e) => setAvgPE(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">安全邊際 (Margin of Safety)</label>
              <span className="text-lg font-bold text-indigo-300">{marginOfSafety}%</span>
            </div>
            <p className="text-xs text-foreground/50">為了容錯，買入價要比合理價打幾折？</p>
            <input 
              type="range" 
              min="5" 
              max="50" 
              step="5"
              value={marginOfSafety} 
              onChange={(e) => setMarginOfSafety(Number(e.target.value))}
              className="w-full accent-indigo-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-indigo-950/20 rounded-xl p-5 border border-indigo-500/10 flex flex-col justify-center space-y-4">
          
          <div className="p-4 bg-rose-500/10 rounded-lg border border-rose-500/20 flex justify-between items-center">
            <div>
              <p className="text-xs text-rose-300 mb-1">昂貴價 (合理價 + {marginOfSafety}%)</p>
              <p className="text-xs text-foreground/60">不建議買進，甚至可考慮獲利了結</p>
            </div>
            <p className="text-2xl font-black text-rose-400">{results.expensiveValue.toFixed(1)} <span className="text-sm font-normal">元</span></p>
          </div>

          <div className="p-5 bg-indigo-500/20 rounded-lg border border-indigo-500/40 flex justify-between items-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <div>
              <p className="text-sm font-bold text-indigo-300 mb-1">合理價 (Fair Value)</p>
              <p className="text-xs text-foreground/70">EPS × 歷史本益比</p>
            </div>
            <p className="text-4xl font-black text-indigo-400">{results.fairValue.toFixed(1)} <span className="text-lg font-normal">元</span></p>
          </div>

          <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20 flex justify-between items-center">
            <div>
              <p className="text-xs text-emerald-300 mb-1">便宜價 (打 {100 - marginOfSafety} 折)</p>
              <p className="text-xs text-foreground/60">具備安全邊際，是極佳的買點</p>
            </div>
            <p className="text-2xl font-black text-emerald-400">{results.cheapValue.toFixed(1)} <span className="text-sm font-normal">元</span></p>
          </div>

        </div>

      </div>
    </div>
  );
}

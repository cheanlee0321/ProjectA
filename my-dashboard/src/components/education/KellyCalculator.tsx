"use client";

import { useState, useMemo } from 'react';

export default function KellyCalculator() {
  const [winRate, setWinRate] = useState<number>(45);
  const [winLossRatio, setWinLossRatio] = useState<number>(2.0);

  const results = useMemo(() => {
    const p = winRate / 100;
    const q = 1 - p;
    const b = winLossRatio;

    // f* = p - (q / b)
    const kellyFraction = p - (q / b);
    const percentage = kellyFraction * 100;

    return {
      kellyFraction,
      percentage: percentage > 0 ? percentage : 0,
      isEdgePositive: kellyFraction > 0
    };
  }, [winRate, winLossRatio]);

  return (
    <div className="bg-background/80 rounded-2xl p-6 border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)] relative overflow-hidden my-8">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span className="text-3xl">🎰</span>
        <h3 className="text-xl font-bold text-amber-500">凱利公式 (Kelly Criterion) 最佳下注計算機</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Inputs */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">勝率 (Win Rate)</label>
              <span className="text-lg font-bold text-amber-400">{winRate}%</span>
            </div>
            <p className="text-xs text-foreground/50">你交易獲利的機率（散戶通常在 30% ~ 50% 之間）</p>
            <input 
              type="range" 
              min="10" 
              max="90" 
              step="1"
              value={winRate} 
              onChange={(e) => setWinRate(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">盈虧比 (Win/Loss Ratio)</label>
              <span className="text-lg font-bold text-amber-400">{winLossRatio.toFixed(1)} 倍</span>
            </div>
            <p className="text-xs text-foreground/50">平均每次獲利金額 ÷ 平均每次虧損金額（停利 ÷ 停損）</p>
            <input 
              type="range" 
              min="0.5" 
              max="5.0" 
              step="0.1"
              value={winLossRatio} 
              onChange={(e) => setWinLossRatio(Number(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-amber-950/20 rounded-xl p-5 border border-amber-500/10 flex flex-col justify-center text-center">
          
          {results.isEdgePositive ? (
            <>
              <p className="text-sm text-foreground/80 mb-2">根據公式，單次交易建議投入總資金的：</p>
              <p className="text-5xl font-black text-amber-400 my-4 shadow-amber-400/20 drop-shadow-lg">
                {results.percentage.toFixed(1)}%
              </p>
              <div className="text-xs text-foreground/60 mt-2 bg-background/50 p-3 rounded-lg text-left">
                <strong>💡 解讀：</strong> 即使你的勝率只有 {winRate}%（代表多數時候都在賠錢），但只要維持 {winLossRatio} 的盈虧比，每次只拿總資金的 {results.percentage.toFixed(1)}% 去下注，長期下來你的資金將會呈現指數型增長，且<strong>絕對不會破產</strong>。這就是資金控管的數學奇蹟。
              </div>
            </>
          ) : (
            <>
              <div className="text-6xl mb-4">⚠️</div>
              <p className="text-2xl font-black text-rose-500 mb-2">期望值為負！</p>
              <p className="text-sm text-foreground/80 mb-4">建議投入資金：<strong className="text-rose-400">0%</strong></p>
              <div className="text-xs text-rose-400/80 bg-rose-950/30 p-3 rounded-lg text-left">
                <strong>💀 警告：</strong> 在目前的勝率與盈虧比下，這個策略是「必敗策略」。任何的下注最終都會導致破產。請提高勝率，或拉高盈虧比（嚴格停損）。
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}

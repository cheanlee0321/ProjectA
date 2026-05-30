"use client";

import { useState } from 'react';

export default function FireCalculator() {
  const [monthlyExpense, setMonthlyExpense] = useState(50000);
  const [safeWithdrawalRate, setSafeWithdrawalRate] = useState(4); // usually 4%

  const annualExpense = monthlyExpense * 12;
  const multiplier = 100 / safeWithdrawalRate;
  const fireNumber = annualExpense * multiplier;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-yellow-500/5 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
        <span className="text-3xl">🏖️</span>
        <div>
          <h3 className="text-xl font-bold text-yellow-500">FIRE 自由數字計算機</h3>
          <p className="text-sm text-foreground/70 mt-1">計算看看，你需要存到多少錢，才能立刻向老闆遞辭呈？</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">退休後預期每月花費 (台幣)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>
            <input 
              type="number" 
              value={monthlyExpense}
              onChange={(e) => setMonthlyExpense(Number(e.target.value))}
              className="w-full bg-background border border-foreground/20 rounded-xl pl-8 pr-4 py-3 text-foreground font-medium focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">安全提領率 (%)</label>
          <div className="relative">
            <input 
              type="number" 
              value={safeWithdrawalRate}
              onChange={(e) => setSafeWithdrawalRate(Number(e.target.value))}
              className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-foreground font-medium focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 transition-all"
              step="0.5"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50">%</span>
          </div>
          <p className="text-xs text-foreground/50 mt-2">經典 4% 法則建議填寫 4%。若要更保守可填 3% 或 3.5%。</p>
        </div>
      </div>

      <div className="bg-background/60 p-6 rounded-xl border border-yellow-500/20 text-center">
        <h4 className="text-sm font-bold text-foreground/60 mb-2 uppercase tracking-wider">你的財富自由目標數字是</h4>
        <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent my-4">
          {formatCurrency(fireNumber)}
        </div>
        <p className="text-sm text-foreground/70 mt-4 leading-relaxed max-w-lg mx-auto">
          只要存到這筆錢，並投入到能穩定產生 {safeWithdrawalRate}% 年化報酬的投資組合（如大盤 ETF），
          你每年提領 <strong className="text-yellow-500">{formatCurrency(annualExpense)}</strong> 當生活費，這筆錢在未來 30 年內幾乎永遠花不完！
        </p>
      </div>
    </div>
  );
}

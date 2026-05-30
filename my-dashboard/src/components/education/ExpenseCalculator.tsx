"use client";

import { useState } from 'react';

export default function ExpenseCalculator() {
  const [initialInvestment, setInitialInvestment] = useState(1000000);
  const [annualReturn, setAnnualReturn] = useState(8);
  const years = 30;

  // Calculate final amounts
  const calculateFinal = (expenseRatio: number) => {
    const netReturn = (annualReturn - expenseRatio) / 100;
    return initialInvestment * Math.pow(1 + netReturn, years);
  };

  const finalLowFee = calculateFinal(0.05);
  const finalHighFee = calculateFinal(2.0);
  const difference = finalLowFee - finalHighFee;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
        <span className="text-3xl">🧮</span>
        <div>
          <h3 className="text-xl font-bold text-emerald-400">內扣費用震撼教育計算機</h3>
          <p className="text-sm text-foreground/70 mt-1">自己算算看，只差 2% 的費用，30 年後會差多少錢？</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">初始投資本金 (台幣)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>
            <input 
              type="number" 
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(Number(e.target.value))}
              className="w-full bg-background border border-foreground/20 rounded-xl pl-8 pr-4 py-3 text-foreground font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">市場預期年化報酬率 (%)</label>
          <div className="relative">
            <input 
              type="number" 
              value={annualReturn}
              onChange={(e) => setAnnualReturn(Number(e.target.value))}
              className="w-full bg-background border border-foreground/20 rounded-xl px-4 py-3 text-foreground font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50">%</span>
          </div>
        </div>
      </div>

      <div className="bg-background/60 p-6 rounded-xl border border-foreground/10">
        <p className="text-sm text-foreground/80 mb-6">假設投資期間為 <strong>{years} 年</strong>，期間不拿出任何本金與利息：</p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                指數型 ETF (內扣 0.05%)
              </span>
              <span className="font-bold text-lg">{formatCurrency(finalLowFee)}</span>
            </div>
            <div className="w-full bg-foreground/5 rounded-full h-3 overflow-hidden">
              <div className="bg-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: '100%' }}></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-rose-400 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                主動型基金 (內扣 2.00%)
              </span>
              <span className="font-bold text-lg">{formatCurrency(finalHighFee)}</span>
            </div>
            <div className="w-full bg-foreground/5 rounded-full h-3 overflow-hidden">
              <div className="bg-rose-500 h-3 rounded-full transition-all duration-1000 ease-out" style={{ width: `${Math.max(0, (finalHighFee / finalLowFee) * 100)}%` }}></div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 bg-gradient-to-r from-rose-500/10 to-transparent border-l-4 border-rose-500 rounded-r-lg">
          <p className="text-sm text-foreground/80 leading-relaxed">
            這就是金融業不願告訴你的秘密。<br/>
            只因為每年多收了不到 2% 的管理費，30 年後你的總資產竟然憑空蒸發了 
            <strong className="text-rose-500 text-2xl ml-2 font-black tracking-tight">{formatCurrency(difference)}</strong>！
          </p>
        </div>
      </div>
    </div>
  );
}

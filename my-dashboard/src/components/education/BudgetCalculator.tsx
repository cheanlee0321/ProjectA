"use client";

import { useState } from 'react';

export default function BudgetCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(50000);

  const needs = monthlyIncome * 0.5;
  const wants = monthlyIncome * 0.3;
  const savings = monthlyIncome * 0.2;

  return (
    <div className="bg-background/80 rounded-2xl p-6 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] relative overflow-hidden my-8">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span className="text-3xl">⚖️</span>
        <h3 className="text-xl font-bold text-emerald-400">50/30/20 預算分配計算機</h3>
      </div>

      <div className="relative z-10 space-y-8">
        
        {/* Input */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-foreground/80">您的每月稅後淨收入 (NTD)</label>
            <span className="text-xl font-black text-emerald-300">{(monthlyIncome).toLocaleString()} 元</span>
          </div>
          <input 
            type="range" 
            min="25000" 
            max="200000" 
            step="1000"
            value={monthlyIncome} 
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Visual Bar */}
        <div className="h-4 w-full flex rounded-full overflow-hidden border border-foreground/10">
          <div className="bg-rose-500/80 h-full transition-all duration-300" style={{ width: '50%' }}></div>
          <div className="bg-amber-500/80 h-full transition-all duration-300" style={{ width: '30%' }}></div>
          <div className="bg-emerald-500/80 h-full transition-all duration-300" style={{ width: '20%' }}></div>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-rose-400">50% 生活必需</span>
                <span className="text-xs bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full">Needs</span>
              </div>
              <p className="text-xs text-foreground/70 mb-4 leading-relaxed">房租、水電費、保險費、交通費、基本伙食費。如果這部分超過 50%，代表你可能需要搬家或換工作了。</p>
            </div>
            <p className="text-2xl font-black text-rose-400">{(needs).toLocaleString()}</p>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-amber-400">30% 彈性想要</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">Wants</span>
              </div>
              <p className="text-xs text-foreground/70 mb-4 leading-relaxed">聚餐、看電影、買衣服、旅遊。用來犒賞自己的心理帳戶，花這筆錢時請心安理得，不要有罪惡感。</p>
            </div>
            <p className="text-2xl font-black text-amber-400">{(wants).toLocaleString()}</p>
          </div>

          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-emerald-400">20% 儲蓄投資</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">Savings</span>
              </div>
              <p className="text-xs text-foreground/70 mb-4 leading-relaxed">還清壞債、建立緊急預備金、買股票 ETF。這是用來「買回未來自由」的救命錢，發薪水第一天就要先扣除。</p>
            </div>
            <p className="text-2xl font-black text-emerald-400">{(savings).toLocaleString()}</p>
          </div>

        </div>

      </div>
    </div>
  );
}

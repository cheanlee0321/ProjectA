"use client";

import { useState } from 'react';

export default function PositionSizeCalculator() {
  const [capital, setCapital] = useState(1000000);
  const [entryPrice, setEntryPrice] = useState(100);
  const [stopLossPrice, setStopLossPrice] = useState(90);

  const riskPercentage = 0.02; // 2%
  const riskAmount = capital * riskPercentage;
  
  let riskPerShare = entryPrice - stopLossPrice;
  let isValid = riskPerShare > 0;
  
  let maxShares = 0;
  let totalInvestment = 0;
  
  if (isValid) {
    maxShares = Math.floor(riskAmount / riskPerShare);
    totalInvestment = maxShares * entryPrice;
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="mt-8 p-6 sm:p-8 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 pb-4 border-b border-foreground/10">
        <span className="text-3xl">🛡️</span>
        <div>
          <h3 className="text-xl font-bold text-indigo-400">絕對 2% 資金控管計算機</h3>
          <p className="text-sm text-foreground/70 mt-1">單筆交易最多只能賠總資金的 2%，來算算你這次最多能買幾股？</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">您的總投資本金</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>
            <input 
              type="number" 
              value={capital}
              onChange={(e) => setCapital(Number(e.target.value))}
              className="w-full bg-background border border-foreground/20 rounded-xl pl-8 pr-4 py-3 text-foreground font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">預計買進股價 (Entry)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>
            <input 
              type="number" 
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
              className="w-full bg-background border border-foreground/20 rounded-xl pl-8 pr-4 py-3 text-foreground font-medium focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground/80 mb-2">設定停損股價 (Stop)</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/50">$</span>
            <input 
              type="number" 
              value={stopLossPrice}
              onChange={(e) => setStopLossPrice(Number(e.target.value))}
              className={`w-full bg-background border rounded-xl pl-8 pr-4 py-3 text-foreground font-medium focus:outline-none transition-all ${isValid ? 'border-foreground/20 focus:border-indigo-500 focus:ring-indigo-500' : 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'}`}
            />
          </div>
          {!isValid && <p className="text-xs text-rose-500 mt-2">停損價必須低於買進價！</p>}
        </div>
      </div>

      <div className="bg-background/60 p-6 rounded-xl border border-foreground/10">
        <h4 className="text-sm font-bold text-foreground/60 mb-4 uppercase tracking-wider">計算結果</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center">
            <p className="text-xs text-foreground/70 mb-1">本次最大容忍虧損 (2%)</p>
            <p className="text-xl font-bold text-rose-400">{formatCurrency(riskAmount)}</p>
          </div>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
            <p className="text-xs text-foreground/70 mb-1">每股潛在虧損</p>
            <p className="text-xl font-bold text-amber-400">{isValid ? formatCurrency(riskPerShare) : '-'}</p>
          </div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <p className="text-xs text-foreground/70 mb-1">建議最多買進數量</p>
            <p className="text-2xl font-black text-emerald-400">{isValid ? `${maxShares} 股` : '-'}</p>
          </div>
        </div>

        {isValid && (
          <div className="mt-6 text-sm text-foreground/80 flex items-start gap-2">
            <span className="text-indigo-400">💡</span>
            <p>
              在這筆交易中，您最多只能買進 <strong>{maxShares}</strong> 股，總共需投入 <strong>{formatCurrency(totalInvestment)}</strong>。<br/>
              如果股價真的不幸跌到 {formatCurrency(stopLossPrice)} 被迫停損，您只會剛好賠掉 {formatCurrency(riskAmount)}，完美將傷害控制在本金的 2% 以內！
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

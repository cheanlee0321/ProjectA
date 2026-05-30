"use client";

import { useState, useMemo } from 'react';

export default function RealEstateCalculator() {
  const [propertyPrice, setPropertyPrice] = useState<number>(10000000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(2.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [monthlyRent, setMonthlyRent] = useState<number>(35000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(5000); // 包含管理費、地價稅、房屋稅、保險等分攤

  // Calculations
  const results = useMemo(() => {
    const downPayment = propertyPrice * (downPaymentPercent / 100);
    const loanAmount = propertyPrice - downPayment;
    
    // Monthly mortgage payment formula: M = P[r(1+r)^n/((1+r)^n-1)]
    const r = interestRate / 100 / 12;
    const n = loanTermYears * 12;
    const monthlyMortgage = r > 0 ? loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;

    // Cash flows
    const monthlyNetIncome = monthlyRent - monthlyExpenses; // NOI (Net Operating Income) monthly
    const annualNOI = monthlyNetIncome * 12;
    
    const monthlyCashFlow = monthlyNetIncome - monthlyMortgage;
    const annualCashFlow = monthlyCashFlow * 12;

    // Rates
    const capRate = propertyPrice > 0 ? (annualNOI / propertyPrice) * 100 : 0;
    const cashOnCashReturn = downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;

    return {
      downPayment,
      loanAmount,
      monthlyMortgage,
      monthlyCashFlow,
      annualCashFlow,
      capRate,
      cashOnCashReturn,
      annualNOI
    };
  }, [propertyPrice, downPaymentPercent, interestRate, loanTermYears, monthlyRent, monthlyExpenses]);

  return (
    <div className="bg-background/80 rounded-2xl p-6 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span className="text-3xl">🧮</span>
        <h3 className="text-xl font-bold text-cyan-400">房地產現金收益率 (Cash-on-Cash) 與槓桿計算機</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
        
        {/* Inputs */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">房屋總價 (NTD)</label>
              <span className="text-sm font-bold text-cyan-300">{(propertyPrice).toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="1000000" 
              max="50000000" 
              step="500000"
              value={propertyPrice} 
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">頭期款成數 (%)</label>
              <span className="text-sm font-bold text-cyan-300">{downPaymentPercent}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              step="5"
              value={downPaymentPercent} 
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">房貸利率 (%)</label>
              <span className="text-sm font-bold text-cyan-300">{interestRate}%</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              step="0.1"
              value={interestRate} 
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">預期月租金 (NTD)</label>
              <span className="text-sm font-bold text-cyan-300">{(monthlyRent).toLocaleString()}</span>
            </div>
            <input 
              type="range" 
              min="5000" 
              max="150000" 
              step="1000"
              value={monthlyRent} 
              onChange={(e) => setMonthlyRent(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-foreground/80">每月雜支估算 (NTD)</label>
              <span className="text-sm font-bold text-cyan-300">{(monthlyExpenses).toLocaleString()}</span>
            </div>
            <p className="text-xs text-foreground/50 leading-tight">含管理費、房屋稅、地價稅、修繕費用的每月分攤</p>
            <input 
              type="range" 
              min="0" 
              max="30000" 
              step="500"
              value={monthlyExpenses} 
              onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
              className="w-full accent-cyan-500 h-2 bg-background/50 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Results */}
        <div className="bg-cyan-950/20 rounded-xl p-5 border border-cyan-500/10 flex flex-col justify-center space-y-5">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-background/40 rounded-lg">
              <p className="text-xs text-foreground/60 mb-1">準備頭期款本金</p>
              <p className="text-lg font-bold text-foreground">{(results.downPayment).toLocaleString()} <span className="text-xs font-normal">元</span></p>
            </div>
            <div className="p-3 bg-background/40 rounded-lg">
              <p className="text-xs text-foreground/60 mb-1">向銀行借款 (槓桿)</p>
              <p className="text-lg font-bold text-foreground">{(results.loanAmount).toLocaleString()} <span className="text-xs font-normal">元</span></p>
            </div>
          </div>

          <div className="p-4 bg-background/60 rounded-lg border border-cyan-500/20">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-bold text-foreground">每月淨現金流</p>
              <p className={`text-xl font-black ${results.monthlyCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {results.monthlyCashFlow > 0 ? '+' : ''}{(Math.round(results.monthlyCashFlow)).toLocaleString()} <span className="text-sm font-normal">元/月</span>
              </p>
            </div>
            <div className="text-xs text-foreground/60 flex justify-between">
              <span>(租金 - 雜支 - 房貸)</span>
              <span>({monthlyRent} - {monthlyExpenses} - {Math.round(results.monthlyMortgage)})</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-background/40 rounded-lg text-center flex flex-col justify-center border-b-2 border-teal-500/30">
              <p className="text-xs text-foreground/60 mb-1">表面租金投報率 (Cap Rate)</p>
              <p className="text-2xl font-black text-teal-400">{results.capRate.toFixed(2)}%</p>
              <p className="text-[10px] text-foreground/50 mt-1">只看全額房價，不考慮槓桿</p>
            </div>
            <div className="p-4 bg-cyan-500/10 rounded-lg text-center flex flex-col justify-center border-b-2 border-cyan-400">
              <p className="text-xs text-foreground/60 mb-1">真實現金收益率 (CoC)</p>
              <p className="text-3xl font-black text-cyan-400">{results.cashOnCashReturn.toFixed(2)}%</p>
              <p className="text-[10px] text-foreground/50 mt-1">槓桿放大了你的本金投報率</p>
            </div>
          </div>

        </div>

      </div>
      
      <div className="mt-6 p-4 rounded-xl bg-cyan-900/10 border border-cyan-500/20">
        <p className="text-sm text-foreground/80 leading-relaxed">
          <span className="font-bold text-cyan-400">💡 槓桿的魔力：</span>
          試著將「頭期款成數」設為 100%（全現金買房），你會發現現金收益率就等於表面的 Cap Rate。但當你把頭期款降到 20%（開 5 倍槓桿），只要租金能負擔房貸，你的真實現金收益率通常會被<strong>顯著放大</strong>。這就是為什麼有錢人總是喜歡跟銀行借錢買房的原因。
        </p>
      </div>
    </div>
  );
}

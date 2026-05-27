"use client";

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { getDCFHistoricalAverages } from '@/app/actions/dcf';

type Assumptions = {
  revGrowth1to5: number;
  revGrowth6to10: number;
  opMargin: number;
  taxRate: number;
  wacc: number;
  terminalMethod: 'perpetual' | 'exitMultiple';
  perpetualGrowth: number;
  terminalPE: number;
  sharesOutstanding: number;
  netDebt: number;
};

export default function ClientDCFCalculator() {
  const [ticker, setTicker] = useState('');
  const [market, setMarket] = useState<'US' | 'TW' | 'TWO'>('US');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [companyInfo, setCompanyInfo] = useState<{name: string, price: number, currentRevenue: number, currency: string} | null>(null);

  const [assumptions, setAssumptions] = useState<Assumptions>({
    revGrowth1to5: 10, // 10%
    revGrowth6to10: 5,  // 5%
    opMargin: 20,       // 20%
    taxRate: 20,        // 20%
    wacc: 10,           // 10%
    terminalMethod: 'perpetual',
    perpetualGrowth: 2.5, // 2.5%
    terminalPE: 15,     // 15x
    sharesOutstanding: 1000000,
    netDebt: 0
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim()) return;

    setLoading(true);
    setError('');

    let finalTicker = ticker.trim().toUpperCase();
    if (market === 'TW' && !finalTicker.endsWith('.TW')) finalTicker += '.TW';
    if (market === 'TWO' && !finalTicker.endsWith('.TWO')) finalTicker += '.TWO';

    try {
      const res = await getDCFHistoricalAverages(finalTicker);
      if (res.error || !res.data) {
        setError(res.error || '發生未知錯誤');
      } else {
        const { data } = res;
        setCompanyInfo({
          name: data.name,
          price: data.currentPrice,
          currentRevenue: data.currentRevenue,
          currency: data.currency
        });

        setAssumptions({
          ...assumptions,
          revGrowth1to5: Math.max(0, parseFloat((data.avgRevGrowth * 100).toFixed(1))),
          revGrowth6to10: Math.max(0, parseFloat((data.avgRevGrowth * 50).toFixed(1))), // Halved for later years
          opMargin: parseFloat((data.avgOpMargin * 100).toFixed(1)),
          taxRate: parseFloat((data.avgTaxRate * 100).toFixed(1)),
          terminalPE: data.trailingPE ? parseFloat(data.trailingPE.toFixed(1)) : 15,
          sharesOutstanding: data.sharesOutstanding || 1000000,
          netDebt: data.netDebt || 0
        });
      }
    } catch (err) {
      setError('獲取資料時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, key: keyof Assumptions) => {
    setAssumptions(prev => ({ ...prev, [key]: parseFloat(e.target.value) }));
  };

  // Calculations
  const projections = useMemo(() => {
    if (!companyInfo) return [];
    
    const results = [];
    let currentRev = companyInfo.currentRevenue;

    for (let i = 1; i <= 10; i++) {
      const growthRate = i <= 5 ? assumptions.revGrowth1to5 : assumptions.revGrowth6to10;
      currentRev = currentRev * (1 + growthRate / 100);
      
      const ebit = currentRev * (assumptions.opMargin / 100);
      const nopat = ebit * (1 - assumptions.taxRate / 100);
      // NOPAT approximation of FCF
      const fcf = nopat; 
      
      const discountFactor = Math.pow(1 + assumptions.wacc / 100, i);
      const pvFcf = fcf / discountFactor;

      results.push({
        year: i,
        revenue: currentRev,
        growth: growthRate,
        ebit,
        fcf,
        discountFactor,
        pvFcf
      });
    }
    return results;
  }, [assumptions, companyInfo]);

  const valuation = useMemo(() => {
    if (projections.length === 0) return null;

    const sumPvFcf = projections.reduce((sum, p) => sum + p.pvFcf, 0);
    const terminalYearFcf = projections[9].fcf;
    
    let terminalValue = 0;
    if (assumptions.terminalMethod === 'perpetual') {
      terminalValue = (terminalYearFcf * (1 + assumptions.perpetualGrowth / 100)) / ((assumptions.wacc / 100) - (assumptions.perpetualGrowth / 100));
    } else {
      terminalValue = terminalYearFcf * assumptions.terminalPE;
    }
    
    // Prevent negative terminal value if WACC <= Perpetual Growth (only for perpetual)
    let validTerminalValue = terminalValue;
    if (assumptions.terminalMethod === 'perpetual' && assumptions.wacc <= assumptions.perpetualGrowth) {
      validTerminalValue = 0;
    }
    
    const pvTerminalValue = validTerminalValue / Math.pow(1 + assumptions.wacc / 100, 10);
    
    const enterpriseValue = sumPvFcf + pvTerminalValue;
    const equityValue = enterpriseValue - assumptions.netDebt;
    const intrinsicValue = assumptions.sharesOutstanding > 0 ? equityValue / assumptions.sharesOutstanding : 0;
    
    const marginOfSafety = companyInfo && companyInfo.price > 0 
      ? ((intrinsicValue - companyInfo.price) / companyInfo.price) * 100 
      : 0;

    return {
      sumPvFcf,
      terminalValue: validTerminalValue,
      pvTerminalValue,
      enterpriseValue,
      equityValue,
      intrinsicValue,
      marginOfSafety
    };
  }, [projections, assumptions, companyInfo]);

  const formatNumber = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(2) + ' B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + ' M';
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const formatCurrency = (num: number) => {
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Left Panel: Inputs & Assumptions */}
      <div className="xl:w-1/3 flex flex-col gap-6">
        
        {/* Search Box */}
        <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10 shadow-sm backdrop-blur-md">
          <h2 className="text-xl font-bold mb-4">目標公司</h2>
          
          <div className="flex items-center gap-2 mb-4">
            <button 
              type="button"
              onClick={() => setMarket('US')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${market === 'US' ? 'bg-blue-500 text-white shadow-md' : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'}`}
            >
              美股
            </button>
            <button 
              type="button"
              onClick={() => setMarket('TW')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${market === 'TW' ? 'bg-blue-500 text-white shadow-md' : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'}`}
            >
              台股上市
            </button>
            <button 
              type="button"
              onClick={() => setMarket('TWO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${market === 'TWO' ? 'bg-blue-500 text-white shadow-md' : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'}`}
            >
              台股上櫃
            </button>
          </div>

          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-foreground/40 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder={market === 'US' ? '輸入代號 (例: AAPL)' : '輸入代號 (例: 2330)'}
              className="block w-full pl-12 pr-24 py-4 bg-background/50 border border-foreground/10 rounded-2xl text-foreground placeholder-foreground/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute inset-y-1.5 right-1.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-xl font-medium transition-all"
            >
              {loading ? '載入中...' : '載入'}
            </button>
          </form>
          {error && <p className="text-danger text-sm mt-3">{error}</p>}
          
          {companyInfo && (
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <h3 className="font-bold text-lg">{companyInfo.name}</h3>
              <p className="text-sm text-foreground/60 mt-1">
                目前股價: {companyInfo.currency} {formatCurrency(companyInfo.price)}
              </p>
              <p className="text-sm text-foreground/60 mt-1">
                基準營收 (TTM): {formatNumber(companyInfo.currentRevenue)}
              </p>
            </div>
          )}
        </div>

        {/* Assumptions */}
        <div className="p-6 rounded-3xl bg-foreground/5 border border-foreground/10 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">參數假設</h2>
            <div className="text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/20">
              FCF 以 NOPAT 近似
            </div>
          </div>

          <div className="space-y-6">
            {/* Slider Components */}
            {[
              { label: '營收成長率 (第 1-5 年)', key: 'revGrowth1to5', min: -20, max: 50, step: 0.5, unit: '%' },
              { label: '營收成長率 (第 6-10 年)', key: 'revGrowth6to10', min: -20, max: 50, step: 0.5, unit: '%' },
              { label: '目標營業利益率', key: 'opMargin', min: -10, max: 60, step: 0.5, unit: '%' },
              { label: '有效稅率', key: 'taxRate', min: 0, max: 40, step: 0.5, unit: '%' },
              { label: '折現率 (WACC)', key: 'wacc', min: 2, max: 20, step: 0.1, unit: '%' },
            ].map((param) => (
              <div key={param.key}>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-foreground/80">{param.label}</label>
                  <span className="text-sm font-bold bg-background/50 px-2 py-1 rounded-md border border-foreground/10 min-w-[4rem] text-center">
                    {assumptions[param.key as keyof Assumptions]}{param.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={assumptions[param.key as keyof Assumptions]}
                  onChange={(e) => handleSliderChange(e, param.key as keyof Assumptions)}
                  className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            ))}

            <div className="pt-4 border-t border-foreground/10">
              <label className="text-sm font-medium text-foreground/80 block mb-3">終值算法 (Terminal Value Method)</label>
              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => setAssumptions({ ...assumptions, terminalMethod: 'perpetual' })}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${assumptions.terminalMethod === 'perpetual' ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent border-foreground/20 text-foreground/60 hover:bg-foreground/5'}`}
                >
                  永續成長 (Perpetual Growth)
                </button>
                <button 
                  onClick={() => setAssumptions({ ...assumptions, terminalMethod: 'exitMultiple' })}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${assumptions.terminalMethod === 'exitMultiple' ? 'bg-blue-500 text-white border-blue-500' : 'bg-transparent border-foreground/20 text-foreground/60 hover:bg-foreground/5'}`}
                >
                  出場倍數 (Exit Multiple)
                </button>
              </div>

              {assumptions.terminalMethod === 'perpetual' ? (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-foreground/80">永續成長率</label>
                    <span className="text-sm font-bold bg-background/50 px-2 py-1 rounded-md border border-foreground/10 min-w-[4rem] text-center">
                      {assumptions.perpetualGrowth}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0" max="5" step="0.1"
                    value={assumptions.perpetualGrowth}
                    onChange={(e) => handleSliderChange(e, 'perpetualGrowth')}
                    className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-foreground/80">目標本益比 (Terminal PE)</label>
                    <span className="text-sm font-bold bg-background/50 px-2 py-1 rounded-md border border-foreground/10 min-w-[4rem] text-center">
                      {assumptions.terminalPE}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5" max="50" step="1"
                    value={assumptions.terminalPE}
                    onChange={(e) => handleSliderChange(e, 'terminalPE')}
                    className="w-full h-2 bg-foreground/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-foreground/10">
              <label className="text-sm font-medium text-foreground/80 block mb-2">在外流通股數</label>
              <input
                type="number"
                value={assumptions.sharesOutstanding}
                onChange={(e) => setAssumptions({ ...assumptions, sharesOutstanding: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-background/50 border border-foreground/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground/80 block mb-2">淨負債 (Net Debt)</label>
              <input
                type="number"
                value={assumptions.netDebt}
                onChange={(e) => setAssumptions({ ...assumptions, netDebt: Number(e.target.value) })}
                className="w-full px-4 py-2 bg-background/50 border border-foreground/10 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

          </div>
        </div>
      </div>

      {/* Right Panel: Spreadsheet & Results */}
      <div className="xl:w-2/3 flex flex-col gap-6">
        
        {/* Valuation Summary Card */}
        {valuation && (
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative overflow-hidden backdrop-blur-md">
            <div className="absolute top-0 right-0 p-32 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none -mr-16 -mt-16"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
              <div>
                <h3 className="text-foreground/60 text-lg font-medium mb-1">每股內在價值</h3>
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold text-white drop-shadow-md">
                    {companyInfo?.currency} {formatCurrency(valuation.intrinsicValue)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className={`px-6 py-3 rounded-2xl border backdrop-blur-sm ${
                  valuation.marginOfSafety > 0 
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.2)]'
                }`}>
                  <div className="text-xs uppercase tracking-wider mb-1 opacity-80 text-right">安全邊際</div>
                  <div className="text-2xl font-bold">
                    {valuation.marginOfSafety > 0 ? '+' : ''}{valuation.marginOfSafety.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10 relative z-10">
              <div>
                <div className="text-xs text-foreground/50 mb-1">10年現金流現值</div>
                <div className="font-semibold">{formatNumber(valuation.sumPvFcf)}</div>
              </div>
              <div>
                <div className="text-xs text-foreground/50 mb-1">終值現值 (PV of TV)</div>
                <div className="font-semibold">{formatNumber(valuation.pvTerminalValue)}</div>
              </div>
              <div>
                <div className="text-xs text-foreground/50 mb-1">企業總價值 (EV)</div>
                <div className="font-semibold text-blue-300">{formatNumber(valuation.enterpriseValue)}</div>
              </div>
              <div>
                <div className="text-xs text-foreground/50 mb-1">股權價值 (Equity)</div>
                <div className="font-semibold text-indigo-300">{formatNumber(valuation.equityValue)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Spreadsheet View */}
        <div className="flex-1 p-6 rounded-3xl bg-foreground/5 border border-foreground/10 shadow-sm overflow-x-auto backdrop-blur-md">
          <h2 className="text-xl font-bold mb-6">十年現金流預估 (Projections)</h2>
          
          {!companyInfo ? (
            <div className="h-64 flex items-center justify-center text-foreground/40 border-2 border-dashed border-foreground/10 rounded-2xl">
              請先搜尋目標公司以載入試算表
            </div>
          ) : (
            <div className="min-w-[800px]">
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="text-foreground/50 border-b border-foreground/10">
                    <th className="text-left py-3 px-2 font-medium">年度</th>
                    {projections.map(p => <th key={p.year} className="py-3 px-2 font-medium">Year {p.year}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  <tr className="hover:bg-foreground/5 transition-colors">
                    <td className="text-left py-3 px-2 font-medium text-foreground/80">營收 (Revenue)</td>
                    {projections.map(p => <td key={p.year} className="py-3 px-2">{formatNumber(p.revenue)}</td>)}
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors">
                    <td className="text-left py-3 px-2 font-medium text-foreground/60 text-xs">成長率</td>
                    {projections.map(p => <td key={p.year} className="py-3 px-2 text-xs text-foreground/60">{p.growth}%</td>)}
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors">
                    <td className="text-left py-3 px-2 font-medium text-foreground/80">營業利益 (EBIT)</td>
                    {projections.map(p => <td key={p.year} className="py-3 px-2">{formatNumber(p.ebit)}</td>)}
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors bg-blue-500/5">
                    <td className="text-left py-3 px-2 font-semibold text-blue-400">自由現金流 (FCF)*</td>
                    {projections.map(p => <td key={p.year} className="py-3 px-2 font-semibold text-blue-400">{formatNumber(p.fcf)}</td>)}
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors">
                    <td className="text-left py-3 px-2 font-medium text-foreground/60 text-xs">折現係數</td>
                    {projections.map(p => <td key={p.year} className="py-3 px-2 text-xs text-foreground/60">{p.discountFactor.toFixed(3)}</td>)}
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors bg-indigo-500/5">
                    <td className="text-left py-3 px-2 font-semibold text-indigo-400">折現現值 (PV of FCF)</td>
                    {projections.map(p => <td key={p.year} className="py-3 px-2 font-semibold text-indigo-400">{formatNumber(p.pvFcf)}</td>)}
                  </tr>
                </tbody>
              </table>
              <div className="mt-6 space-y-4 text-xs text-foreground/50 bg-foreground/5 p-5 rounded-xl">
                <div>
                  <h4 className="font-bold text-foreground/70 mb-1 text-sm">💡 關於終值 (Terminal Value) 算法的差異</h4>
                  <p className="mb-2">終值佔據了 DCF 估值中極大的一部分（通常超過 50%），代表企業在預測期（第 10 年）之後所能創造的所有未來價值。我們提供兩種市場主流的推估方式：</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-3">
                    <div className="bg-background/50 p-3 rounded-lg border border-foreground/10">
                      <span className="font-semibold text-blue-400 block mb-1">1. 永續成長 (Perpetual Growth)</span>
                      <p className="mb-2">假設企業在第 10 年之後，會以一個低於長期經濟成長率的固定的速度永遠成長下去。此法純粹基於企業長期的現金流創造能力，不受短期市場情緒影響。</p>
                      <code className="block bg-foreground/10 p-2 rounded text-[11px] text-foreground/80 font-mono">
                        TV = Year_10_FCF × (1 + g) / (WACC - g)
                      </code>
                      <p className="mt-1 text-foreground/40">g = 永續成長率, WACC = 折現率</p>
                    </div>
                    
                    <div className="bg-background/50 p-3 rounded-lg border border-foreground/10">
                      <span className="font-semibold text-blue-400 block mb-1">2. 出場倍數 (Exit Multiple)</span>
                      <p className="mb-2">假設在第 10 年底將這家公司賣掉，而賣出價格是當時市場願意給予的本益比（PE Ratio）。此方法較貼近投資銀行或併購市場的實務估值習慣。</p>
                      <code className="block bg-foreground/10 p-2 rounded text-[11px] text-foreground/80 font-mono">
                        TV = Year_10_FCF (近似淨利) × 目標本益比 (PE)
                      </code>
                      <p className="mt-1 text-foreground/40">PE = 您設定的 Terminal PE</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-foreground/10">
                  <h4 className="font-bold text-foreground/70 mb-1 text-sm">* 關於 FCF 估值簡化邏輯</h4>
                  <p>本模型假設資本支出 (CapEx) 與折舊攤銷 (D&A) 大致抵銷，且營運資金變動為零。因此使用<strong>稅後營業利益 (NOPAT)</strong> 來近似自由現金流 (FCF)。<br/>
                  公式：<code className="bg-foreground/10 px-1 py-0.5 rounded ml-1">FCF ≈ NOPAT = Revenue × Operating Margin × (1 - Tax Rate)</code></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

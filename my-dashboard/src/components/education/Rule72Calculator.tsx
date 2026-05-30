"use client";

import { useState } from 'react';

export default function Rule72Calculator() {
  const [rate, setRate] = useState(8);
  const [mode, setMode] = useState<'rate' | 'years'>('rate');
  const [years, setYears] = useState(9);

  const doublingYears = rate > 0 ? (72 / rate) : 0;
  const requiredRate = years > 0 ? (72 / years) : 0;

  const presets = [
    { label: '活存', rate: 0.5, years: 144, emoji: '🏦', color: 'text-slate-400' },
    { label: '定存', rate: 1.5, years: 48, emoji: '📋', color: 'text-blue-400' },
    { label: '公債', rate: 4, years: 18, emoji: '📜', color: 'text-emerald-400' },
    { label: '大盤ETF', rate: 8, years: 9, emoji: '📈', color: 'text-purple-400' },
    { label: '成長股', rate: 12, years: 6, emoji: '🚀', color: 'text-amber-400' },
  ];

  return (
    <div className="mt-6 p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 shadow-sm">
      <h3 className="text-xl font-bold text-purple-400 mb-2 flex items-center gap-2">
        <span className="text-2xl">🧮</span> 72 法則速算器
      </h3>
      <p className="text-sm text-foreground/70 mb-5">
        <strong>72 法則：</strong>用 72 除以年化報酬率，就能快速估算你的資產「翻倍」所需年數。這是投資人最常用的心算技巧。
      </p>

      {/* Mode Toggle */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setMode('rate')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === 'rate'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
              : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
          }`}
        >
          輸入報酬率 → 算翻倍年數
        </button>
        <button
          onClick={() => setMode('years')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            mode === 'years'
              ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
              : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'
          }`}
        >
          輸入目標年數 → 算需要報酬率
        </button>
      </div>

      {/* Calculator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {mode === 'rate' ? (
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2">
                年化報酬率 (%)
              </label>
              <input
                type="range"
                min={0.5}
                max={20}
                step={0.5}
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-foreground/50 mt-1">
                <span>0.5%</span>
                <span className="text-lg font-black text-purple-400">{rate}%</span>
                <span>20%</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-foreground/80 mb-2">
                希望幾年翻倍？
              </label>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
              <div className="flex justify-between text-xs text-foreground/50 mt-1">
                <span>1 年</span>
                <span className="text-lg font-black text-purple-400">{years} 年</span>
                <span>50 年</span>
              </div>
            </div>
          )}

          {/* Result */}
          <div className="p-5 rounded-xl bg-background/60 border border-purple-500/30 text-center">
            {mode === 'rate' ? (
              <>
                <p className="text-sm text-foreground/60 mb-1">72 ÷ {rate} =</p>
                <p className="text-4xl font-black text-purple-400">
                  {doublingYears.toFixed(1)} <span className="text-lg font-bold">年</span>
                </p>
                <p className="text-xs text-foreground/50 mt-2">你的資產每 {doublingYears.toFixed(1)} 年翻一倍</p>
              </>
            ) : (
              <>
                <p className="text-sm text-foreground/60 mb-1">72 ÷ {years} =</p>
                <p className="text-4xl font-black text-purple-400">
                  {requiredRate.toFixed(1)}<span className="text-lg font-bold">%</span>
                </p>
                <p className="text-xs text-foreground/50 mt-2">你需要年化 {requiredRate.toFixed(1)}% 的報酬率</p>
              </>
            )}
          </div>
        </div>

        {/* Presets Table */}
        <div>
          <p className="text-sm font-bold text-foreground/80 mb-3">常見投資工具的翻倍速度</p>
          <div className="space-y-2">
            {presets.map((p) => (
              <div
                key={p.label}
                className="flex items-center justify-between p-3 rounded-xl bg-background/40 border border-foreground/5 hover:border-purple-500/30 transition-colors cursor-pointer"
                onClick={() => { setMode('rate'); setRate(p.rate); }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{p.emoji}</span>
                  <div>
                    <p className={`font-bold text-sm ${p.color}`}>{p.label}</p>
                    <p className="text-xs text-foreground/50">年化 {p.rate}%</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">{p.years} 年</p>
                  <p className="text-xs text-foreground/50">翻倍</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

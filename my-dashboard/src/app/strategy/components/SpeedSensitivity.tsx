'use client';

import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface SpeedData {
  metadata: { yellow: number; red: number };
  results: any[];
}

type StrategyMode = 'qqq_100' | 'mix_50_50' | 'tqqq_100';
type MetricType = 'cagr' | 'maxDD' | 'calmar' | 'totalReturn';

export function SpeedSensitivity() {
  const [data, setData] = useState<SpeedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<StrategyMode>('mix_50_50');
  const [metric, setMetric] = useState<MetricType>('cagr');

  useEffect(() => {
    fetch('/data/speed_sensitivity.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching speed sensitivity data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-96 flex items-center justify-center">載入速度敏感度資料中...</div>;
  }

  if (!data || !data.results) {
    return <div className="h-96 flex items-center justify-center">無速度敏感度資料</div>;
  }

  // Find min/max values for color scale
  const values = data.results.map(d => d[mode][metric]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  // Map value to color
  const getColor = (val: number) => {
    // Normalize between 0 and 1
    const t = (val - minVal) / (maxVal - minVal || 1);
    
    // For Max Drawdown, higher (closer to 0) is better (green), lower (closer to -1) is worse (red)
    let hue;
    if (metric === 'maxDD') {
      hue = 0 + (t * 120);
    } else {
      hue = 0 + (t * 120); 
    }
    
    return `hsl(${hue}, 80%, 40%)`;
  };

  // Convert data for ScatterChart
  const scatterData = data.results.map(d => ({
    x: d.sell_months,
    y: d.buy_months,
    z: d[mode][metric], // The value
    tooltipData: d[mode]
  }));

  // Map non-linear ticks to visually linear positions by creating a custom scale
  // But scatter chart with type="category" is easier for discrete grids.
  // Actually, since we only have specific discrete values, using a categorical axis ensures evenly spaced grid.

  const tickValues = [1, 2, 3, 4, 6, 8, 10, 12, 15, 18, 24];

  const formatTooltipValue = (val: number, name: string) => {
    if (name === 'cagr' || name === 'maxDD') return `${(val * 100).toFixed(2)}%`;
    if (name === 'totalReturn') return `${val.toFixed(0)}%`;
    if (name === 'calmar') return val.toFixed(2);
    return val;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      if (!data.tooltipData) return null; // Hide tooltip for the star marker

      return (
        <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl shadow-xl">
          <p className="text-white font-bold mb-2">買入: {data.y} 個月 / 賣出: {data.x} 個月</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-400">CAGR: {(data.tooltipData.cagr * 100).toFixed(2)}%</p>
            <p className={data.tooltipData.maxDD < -0.8 ? "text-rose-400" : "text-amber-400"}>Max DD: {(data.tooltipData.maxDD * 100).toFixed(2)}%</p>
            <p className="text-blue-400">Calmar Ratio: {data.tooltipData.calmar.toFixed(2)}</p>
            <p className="text-violet-400">Total Return: {data.tooltipData.totalReturn.toFixed(0)}%</p>
          </div>
          {data.x === 10 && data.y === 10 && (
            <div className="mt-2 text-xs font-bold text-amber-400 bg-amber-400/10 p-1 px-2 rounded inline-block">
              ★ 目前設定值 (對稱基準)
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Calculate Top 5 by CAGR
  const sortedByCAGR = [...data.results].sort((a, b) => b[mode].cagr - a[mode].cagr).slice(0, 5);

  return (
    <div className="mb-12 p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-slate-700/50 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <span className="mr-2">⏱️</span> 實驗 B：分批速度熱力圖
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select 
            className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={mode}
            onChange={(e) => setMode(e.target.value as StrategyMode)}
          >
            <option value="qqq_100">策略 100% QQQ</option>
            <option value="mix_50_50">策略 50% QQQ / 50% TQQQ (推薦)</option>
            <option value="tqqq_100">策略 100% TQQQ</option>
          </select>
          
          <select 
            className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricType)}
          >
            <option value="cagr">觀察指標：CAGR (排名依據)</option>
            <option value="maxDD">觀察指標：最大回撤</option>
            <option value="calmar">觀察指標：Calmar Ratio</option>
            <option value="totalReturn">觀察指標：總報酬</option>
          </select>
        </div>
      </div>

      <div className="text-slate-300 text-sm mb-6 space-y-2">
        <p>此實驗測試了在固定閾值 (0.30/0.40) 下，對「買入月數」與「賣出月數」進行二維全面掃描 (121 種組合)。</p>
        <p className="flex items-center gap-2">
          <span>顏色越綠代表該指標表現越好，越紅代表越差。</span>
          <span className="inline-block w-4 h-4 bg-[hsl(120,80%,40%)] rounded-sm"></span>優
          <span className="inline-block w-4 h-4 bg-[hsl(60,80%,40%)] rounded-sm"></span>中
          <span className="inline-block w-4 h-4 bg-[hsl(0,80%,40%)] rounded-sm"></span>劣
        </p>
      </div>

      <div className="h-[500px] w-full bg-slate-950/50 rounded-xl p-4 border border-slate-800 relative mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis 
              type="category" 
              dataKey="x" 
              name="Sell Months" 
              allowDuplicatedCategory={false}
              ticks={tickValues}
              stroke="#94a3b8"
              label={{ value: '賣出分批月數 (Sell Months)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 14 }}
            />
            <YAxis 
              type="category" 
              dataKey="y" 
              name="Buy Months" 
              allowDuplicatedCategory={false}
              ticks={tickValues}
              stroke="#94a3b8"
              label={{ value: '買入分批月數 (Buy Months)', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 14 }}
            />
            {/* ZAxis domain sets the bubble size range. */}
            <ZAxis type="number" dataKey="z" range={[400, 400]} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            
            <Scatter data={scatterData} shape="square">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.z)} opacity={0.85} />
              ))}
            </Scatter>

            {/* Reference markers for the currently used speeds (10, 10) */}
            <ReferenceLine x={10} stroke="#f59e0b" strokeDasharray="3 3" opacity={0.5} />
            <ReferenceLine y={10} stroke="#f59e0b" strokeDasharray="3 3" opacity={0.5} />
            
            <Scatter 
              data={[{x: 10, y: 10, z: 0}]} 
              shape={(props: any) => (
                <svg x={props.cx - 10} y={props.cy - 10} width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <h4 className="text-lg font-bold text-white mb-4">🏆 最佳參數排行榜 (基於 CAGR)</h4>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-left border-collapse whitespace-nowrap bg-slate-950/50 rounded-xl overflow-hidden border border-slate-800">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900">
              <th className="py-3 px-4 font-semibold text-slate-300">排名</th>
              <th className="py-3 px-4 font-semibold text-slate-300 text-center border-l border-slate-800">買入時間</th>
              <th className="py-3 px-4 font-semibold text-slate-300 text-center border-l border-slate-800">賣出時間</th>
              <th className="py-3 px-4 font-semibold text-slate-300 text-right border-l border-slate-800">CAGR</th>
              <th className="py-3 px-4 font-semibold text-slate-300 text-right border-l border-slate-800">Max DD</th>
              <th className="py-3 px-4 font-semibold text-slate-300 text-right border-l border-slate-800">Calmar</th>
            </tr>
          </thead>
          <tbody>
            {sortedByCAGR.map((row, idx) => {
              const isCurrent = row.buy_months === 10 && row.sell_months === 10;
              return (
                <tr key={`top-${idx}`} className={`border-b border-slate-800 hover:bg-slate-800/50 text-sm ${isCurrent ? 'bg-amber-900/20' : ''}`}>
                  <td className="py-3 px-4 font-medium text-slate-300 flex items-center gap-2">
                    {idx === 0 && <span className="text-yellow-400">🥇 Top 1</span>}
                    {idx === 1 && <span className="text-gray-400">🥈 Top 2</span>}
                    {idx === 2 && <span className="text-amber-600">🥉 Top 3</span>}
                    {idx > 2 && <span className="text-slate-400">Top {idx + 1}</span>}
                    {isCurrent && <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded">目前設定</span>}
                  </td>
                  <td className="py-3 px-4 text-center border-l border-slate-800 text-emerald-400/80">分 {row.buy_months} 個月</td>
                  <td className="py-3 px-4 text-center border-l border-slate-800 text-rose-400/80">分 {row.sell_months} 個月</td>
                  <td className="py-3 px-4 text-right border-l border-slate-800 text-emerald-400 font-bold">{(row[mode].cagr * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-right border-l border-slate-800 text-rose-400">{(row[mode].maxDD * 100).toFixed(2)}%</td>
                  <td className="py-3 px-4 text-right border-l border-slate-800 text-blue-400">{row[mode].calmar.toFixed(2)}</td>
                </tr>
              );
            })}
            
            {/* Find the baseline 10/10 if it's not in top 5 */}
            {!sortedByCAGR.find(r => r.buy_months === 10 && r.sell_months === 10) && data.results.filter(s => s.buy_months === 10 && s.sell_months === 10).map((s, idx) => (
              <tr key={`sym-baseline`} className="border-t-2 border-slate-700 bg-slate-900/80 text-sm">
                <td className="py-3 px-4 font-bold text-slate-500">
                  <span className="ml-2 text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">未進前 5 名的目前設定</span>
                </td>
                <td className="py-3 px-4 text-center border-l border-slate-800 text-slate-400">分 {s.buy_months} 個月</td>
                <td className="py-3 px-4 text-center border-l border-slate-800 text-slate-400">分 {s.sell_months} 個月</td>
                <td className="py-3 px-4 text-right border-l border-slate-800 text-emerald-400/50">{(s[mode].cagr * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-right border-l border-slate-800 text-rose-400/50">{(s[mode].maxDD * 100).toFixed(2)}%</td>
                <td className="py-3 px-4 text-right border-l border-slate-800 text-blue-400/50">{s[mode].calmar.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-5 bg-slate-800/50 rounded-xl border border-slate-700">
        <h4 className="text-lg font-bold text-white mb-3">🔬 分析結論</h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
          <li><strong>買入節奏的寬容度：</strong> 從熱力圖 Y 軸可看出，無論買入速度是極快 (1-3個月) 或是極慢 (15-24個月)，對最終績效的影響較小，綠色區塊的分佈較廣。</li>
          <li><strong>賣出節奏的致命性：</strong> 從熱力圖 X 軸可看出，賣出速度過慢 (大於 12 個月) 會有顯著的績效懲罰與回撤加深（顏色偏紅）。在遭遇空頭確認時，拖泥帶水會造成巨大的傷害。</li>
          <li><strong>最佳化甜蜜點：</strong> 排行榜顯示，最佳的非對稱配置通常落在「賣出較快 (2~6個月) 搭配買入適中 (6~15個月)」，這類組合能以非對稱的風險偏好度過市場牛熊轉換，取得最高的絕對報酬。</li>
        </ul>
      </div>
    </div>
  );
}

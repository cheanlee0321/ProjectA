'use client';

import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface HeatmapData {
  yellow: number;
  red: number;
  qqq_100: { cagr: number; maxDD: number; totalReturn: number; calmar: number };
  mix_50_50: { cagr: number; maxDD: number; totalReturn: number; calmar: number };
  tqqq_100: { cagr: number; maxDD: number; totalReturn: number; calmar: number };
}

type StrategyMode = 'qqq_100' | 'mix_50_50' | 'tqqq_100';
type MetricType = 'cagr' | 'maxDD' | 'calmar' | 'totalReturn';

export function ThresholdHeatmap() {
  const [data, setData] = useState<HeatmapData[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<StrategyMode>('mix_50_50');
  const [metric, setMetric] = useState<MetricType>('cagr');

  useEffect(() => {
    fetch('/data/threshold_sensitivity.json?v=' + new Date().getTime())
      .then(res => res.json())
      .then(json => {
        setData(json.results);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching threshold sensitivity data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-96 flex items-center justify-center">載入熱力圖資料中...</div>;
  }

  if (data.length === 0) {
    return <div className="h-96 flex items-center justify-center">無熱力圖資料</div>;
  }

  // Find min/max values for color scale
  const values = data.map(d => d[mode][metric]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  // Map value to color
  const getColor = (val: number) => {
    // Normalize between 0 and 1
    const t = (val - minVal) / (maxVal - minVal || 1);
    
    // For Max Drawdown, higher (closer to 0) is better (green), lower (closer to -1) is worse (red)
    // For others, higher is better (green), lower is worse (red)
    let hue;
    if (metric === 'maxDD') {
      hue = 0 + (t * 120); // 0 is red, 120 is green
    } else {
      hue = 0 + (t * 120); 
    }
    
    return `hsl(${hue}, 80%, 40%)`;
  };

  // Convert data for ScatterChart
  const scatterData = data.map(d => ({
    x: d.red,
    y: d.yellow,
    z: d[mode][metric], // The value
    tooltipData: d[mode]
  }));

  const formatTick = (val: number) => val.toFixed(2);
  
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
          <p className="text-white font-bold mb-2">黃燈: {data.y.toFixed(2)} / 紅燈: {data.x.toFixed(2)}</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-400">CAGR: {(data.tooltipData.cagr * 100).toFixed(2)}%</p>
            <p className={data.tooltipData.maxDD < -0.8 ? "text-rose-400" : "text-amber-400"}>Max DD: {(data.tooltipData.maxDD * 100).toFixed(2)}%</p>
            <p className="text-blue-400">Calmar Ratio: {data.tooltipData.calmar.toFixed(2)}</p>
            <p className="text-violet-400">Total Return: {data.tooltipData.totalReturn.toFixed(0)}%</p>
          </div>
          {data.x === 0.4 && data.y === 0.3 && (
            <div className="mt-2 text-xs font-bold text-amber-400 bg-amber-400/10 p-1 px-2 rounded inline-block">
              ★ 目前設定值
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const metricLabels = {
    cagr: 'CAGR 年化報酬',
    maxDD: 'Max Drawdown 最大回撤',
    calmar: 'Calmar Ratio 風險調整後報酬',
    totalReturn: 'Total Return 總報酬'
  };

  return (
    <div className="mb-12 p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-slate-700/50 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h3 className="text-2xl font-bold text-white flex items-center">
          <span className="mr-2">🎛️</span> 實驗 A：閾值敏感度熱力圖
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
            <option value="cagr">觀察指標：CAGR</option>
            <option value="maxDD">觀察指標：最大回撤</option>
            <option value="calmar">觀察指標：Calmar Ratio</option>
            <option value="totalReturn">觀察指標：總報酬</option>
          </select>
        </div>
      </div>

      <div className="text-slate-300 text-sm mb-6 space-y-2">
        <p>此圖掃描了黃燈從 0.20 到 0.40，紅燈從 0.25 到 0.55 的所有合理組合（紅燈 &gt; 黃燈）。</p>
        <p className="flex items-center gap-2">
          <span>顏色越綠代表該指標表現越好，越紅代表越差。</span>
          <span className="inline-block w-4 h-4 bg-[hsl(120,80%,40%)] rounded-sm"></span>優
          <span className="inline-block w-4 h-4 bg-[hsl(60,80%,40%)] rounded-sm"></span>中
          <span className="inline-block w-4 h-4 bg-[hsl(0,80%,40%)] rounded-sm"></span>劣
        </p>
      </div>

      <div className="h-[500px] w-full bg-slate-950/50 rounded-xl p-4 border border-slate-800 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Red Threshold" 
              domain={[0.24, 0.56]} 
              tickCount={17}
              tickFormatter={formatTick}
              stroke="#94a3b8"
              label={{ value: '紅燈閾值 (Red Threshold)', position: 'insideBottom', offset: -10, fill: '#94a3b8', fontSize: 14 }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Yellow Threshold" 
              domain={[0.18, 0.42]} 
              tickCount={13}
              tickFormatter={formatTick}
              stroke="#94a3b8"
              label={{ value: '黃燈閾值 (Yellow Threshold)', angle: -90, position: 'insideLeft', offset: 10, fill: '#94a3b8', fontSize: 14 }}
            />
            {/* ZAxis domain sets the bubble size range. Since we want a heatmap grid, we set a fixed range */}
            <ZAxis type="number" dataKey="z" range={[400, 400]} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} isAnimationActive={false} />
            
            <Scatter data={scatterData} shape="square">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.z)} opacity={0.85} />
              ))}
            </Scatter>

            {/* Reference markers for the currently used thresholds (0.3, 0.4) */}
            <ReferenceLine x={0.4} stroke="#f59e0b" strokeDasharray="3 3" opacity={0.5} />
            <ReferenceLine y={0.3} stroke="#f59e0b" strokeDasharray="3 3" opacity={0.5} />
            
            <Scatter 
              data={[{x: 0.4, y: 0.3, z: 0}]} 
              shape={(props: any) => (
                <svg x={props.cx - 10} y={props.cy - 10} width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 p-5 bg-slate-800/50 rounded-xl border border-slate-700">
        <h4 className="text-lg font-bold text-white mb-3">🔬 分析結論 (已套用磁滯效應更新)</h4>
        
        <div className="mb-5 p-4 bg-emerald-900/30 border border-emerald-500/30 rounded-lg">
          <p className="text-sm text-emerald-400 font-bold mb-1 flex items-center">
            <span className="text-lg mr-2">🏆</span> 綜合最佳化甜蜜點 (考量報酬與風險)：
          </p>
          <p className="text-base text-slate-200 mt-2">
            黃燈閾值 <strong className="text-amber-400 mx-1">0.24</strong> / 紅燈閾值 <strong className="text-amber-400 mx-1">0.41</strong>
          </p>
          <p className="text-sm text-slate-400 mt-1">
            (50/50 組合 CAGR: 32.48%, MaxDD: -64.21%, Calmar: 0.51)
          </p>
          <p className="text-xs text-slate-500 mt-2">
            * 註：追求純最高報酬點為 黃燈 0.24 / 紅燈 0.43 (CAGR 34.39%)，但最大回撤高達 -78.86%，風險過高故不作推薦。
          </p>
        </div>

        <ul className="list-disc list-inside space-y-2 text-sm text-slate-300">
          <li><strong>紅燈的極限不變：</strong> 紅燈設定在 0.40 ~ 0.45 之間依然能發揮極佳的避險效果。這證明了判斷市場過熱的標準具有長期的有效性。但若紅燈設得太高 (&gt;0.48)，會太晚警報而遭遇較大回撤。</li>
          <li><strong>黃燈甜蜜點下移：</strong> 加入磁滯效應（前一個是紅燈就不買）後，數據顯示將黃燈閾值適度調低至 0.24 ~ 0.28，能讓「確認落底」的標準變得更嚴格，進一步榨出更高的超額報酬。</li>
          <li><strong>非單一孤島：</strong> 熱力圖顯示，優秀的績效並非只存在於單一點位，而是在一個廣泛的「高原區間」內皆有效。這證明了策略具備良好的<strong>穩健性 (Robustness)</strong>，而非參數過擬合 (Overfitting)。</li>
        </ul>
      </div>
    </div>
  );
}

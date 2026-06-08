'use client';

import React, { useState, useEffect } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface PlateauSpeedData {
  buySpeed: number;
  sellSpeed: number;
  cagr: number;
  maxDD: number;
  calmar: number;
}

type MetricType = 'cagr' | 'maxDD' | 'calmar';

export function PlateauSpeedSensitivity() {
  const [data, setData] = useState<PlateauSpeedData[]>([]);
  const [loading, setLoading] = useState(true);
  const [metric, setMetric] = useState<MetricType>('cagr');

  useEffect(() => {
    fetch('/data/plateau_speed_sweep.json?v=' + new Date().getTime())
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching plateau speed sensitivity data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="h-96 flex items-center justify-center text-sky-200">載入熱力圖資料中...</div>;
  }

  if (!data || data.length === 0) {
    return <div className="h-96 flex items-center justify-center text-sky-200">無熱力圖資料</div>;
  }

  // Find min/max values for color scale
  const values = data.map(d => d[metric]);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);

  // Map value to color
  const getColor = (val: number) => {
    // Normalize between 0 and 1
    const t = (val - minVal) / (maxVal - minVal || 1);

    // For Max Drawdown, higher (closer to 0) is better (green), lower (closer to -100) is worse (red)
    let hue = 0 + (t * 120);
    return `hsl(${hue}, 80%, 40%)`;
  };

  // Convert data for ScatterChart
  const scatterData = data.map(d => ({
    x: d.sellSpeed,
    y: d.buySpeed,
    z: d[metric], // The value
    tooltipData: d
  }));

  const tickValues = [1, 2, 3, 4, 6, 8, 10, 12, 18, 24];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const pData = payload[0].payload;

      if (!pData.tooltipData) return null; // Hide tooltip for the star marker

      return (
        <div className="bg-sky-950 border border-sky-800 p-4 rounded-xl shadow-xl z-50">
          <p className="text-white font-bold mb-2">買入: {pData.y} 個月 / 賣出: {pData.x} 個月</p>
          <div className="space-y-1 text-sm">
            <p className="text-emerald-400">CAGR: {pData.tooltipData.cagr.toFixed(2)}%</p>
            <p className={pData.tooltipData.maxDD < -85 ? "text-rose-400" : "text-amber-400"}>Max DD: {pData.tooltipData.maxDD.toFixed(2)}%</p>
            <p className="text-blue-400">Calmar Ratio: {pData.tooltipData.calmar.toFixed(2)}</p>
          </div>
          {pData.x === 10 && pData.y === 10 && (
            <div className="mt-2 text-xs font-bold text-sky-200 bg-sky-800/50 p-1 px-2 rounded inline-block">
              ★ 壓力測試設定值
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8 mb-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h4 className="text-lg font-bold text-sky-300 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
          高原區參數 (0.34) 買賣速度熱力圖
        </h4>

        <div className="flex gap-4">
          <select
            className="bg-sky-950 border border-sky-800 text-sky-200 text-sm rounded-lg focus:ring-sky-500 focus:border-sky-500 block p-2"
            value={metric}
            onChange={(e) => setMetric(e.target.value as MetricType)}
          >
            <option value="cagr">觀察指標：CAGR</option>
            <option value="maxDD">觀察指標：最大回撤</option>
            <option value="calmar">觀察指標：Calmar Ratio</option>
          </select>
        </div>
      </div>

      <div className="text-sky-200/70 text-sm mb-4 space-y-1">
        <p>此圖表基於<strong>實驗 A：閾值敏感度熱力圖</strong>，選擇高原區頂端的固定閾值 0.34 / 0.41 與 50% QQQ / 50% TQQQ，掃描各種買入/賣出分批速度。</p>
        <p className="flex items-center gap-2">
          <span>顏色越綠代表該指標表現越好，越紅代表越差。</span>
          <span className="inline-block w-3 h-3 bg-[hsl(120,80%,40%)] rounded-sm"></span>優
          <span className="inline-block w-3 h-3 bg-[hsl(60,80%,40%)] rounded-sm"></span>中
          <span className="inline-block w-3 h-3 bg-[hsl(0,80%,40%)] rounded-sm"></span>劣
        </p>
      </div>

      <div className="h-[400px] w-full bg-sky-950/20 rounded-xl p-4 border border-sky-900/50 relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0c4a6e" opacity={0.5} />
            <XAxis
              type="category"
              dataKey="x"
              name="Sell Months"
              allowDuplicatedCategory={false}
              ticks={tickValues}
              stroke="#7dd3fc"
              label={{ value: '賣出分批月數 (Sell Months)', position: 'insideBottom', offset: -10, fill: '#7dd3fc', fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="y"
              name="Buy Months"
              allowDuplicatedCategory={false}
              ticks={tickValues}
              stroke="#7dd3fc"
              label={{ value: '買入分批月數 (Buy Months)', angle: -90, position: 'insideLeft', offset: 10, fill: '#7dd3fc', fontSize: 12 }}
            />
            <ZAxis type="number" dataKey="z" range={[350, 350]} />

            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} isAnimationActive={false} />

            <Scatter data={scatterData} shape="square">
              {scatterData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.z)} opacity={0.85} />
              ))}
            </Scatter>

            <ReferenceLine x={10} stroke="#38bdf8" strokeDasharray="3 3" opacity={0.5} />
            <ReferenceLine y={10} stroke="#38bdf8" strokeDasharray="3 3" opacity={0.5} />

            <Scatter
              data={[{ x: 10, y: 10, z: 0 }]}
              shape={(props: any) => (
                <svg x={props.cx - 8} y={props.cy - 8} width="16" height="16" viewBox="0 0 24 24" fill="#38bdf8">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              )}
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 p-5 rounded-xl bg-sky-900/10 border border-sky-500/20 text-sm text-sky-200/90 space-y-3 leading-relaxed">
        <h5 className="font-bold text-sky-300 flex items-center gap-2 text-base">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          熱力圖深度解析
        </h5>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-rose-400">慢速買入是活命的關鍵：</strong>
            從 Y 軸（買入月數）可以清楚看到，只要買入速度太快（小於 6 個月，例如一把 All-in 或分 2、3 個月買完），因為在達康泡沫半山腰接飛刀接得太快，最大回撤 (Max DD) 都會非常慘烈（超過 -90%），在圖表下方呈現一片紅色死區。
          </li>
          <li>
            <strong className="text-emerald-400">安全區塊集中在右上方：</strong>
            當買入速度放慢到 10 ~ 24 個月時（圖表上方），即使我們在 0.34 這個過早的參數進場，只要分批夠慢，都能將回撤強行控制在 -60% ~ -80% 的可承受範圍內，並且依然保有 28% ~ 32% 的驚人年化報酬。
          </li>
          <li>
            <strong className="text-amber-400">★ 壓力測試座標的意義：</strong>
            我們剛剛選用的 (10個月買 / 10個月賣) 正好座落於這個安全的梯度帶邊緣，這證明了即使未來的市場沒有跌破完美的 0.24，只要我們搭配足夠長的「分批買入」時間，策略就擁有極高的容錯率。
          </li>
        </ul>
      </div>
    </div>
  );
}

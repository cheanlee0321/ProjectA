"use client";

import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip } from 'recharts';

type LightStatus = 'red' | 'yellow' | 'green' | 'loading';

interface IndicatorCardProps {
  title: string;
  description: string;
  currentValue: string | number;
  statusText: string;
  status: LightStatus;
  history?: { date: string; value: number }[];
}

export default function IndicatorCard({
  title,
  description,
  currentValue,
  statusText,
  status,
  history
}: IndicatorCardProps) {
  
  const getStatusColor = () => {
    switch (status) {
      case 'red': return 'bg-danger shadow-[0_0_15px_rgba(255,64,129,0.8)] animate-pulse-danger';
      case 'yellow': return 'bg-warning shadow-[0_0_15px_rgba(255,215,64,0.6)]';
      case 'green': return 'bg-safe shadow-[0_0_15px_rgba(0,230,118,0.5)]';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'red': return 'text-danger';
      case 'yellow': return 'text-warning';
      case 'green': return 'text-safe';
      default: return 'text-gray-400';
    }
  };

  const getLineColor = () => {
    switch (status) {
      case 'red': return '#FF4081';
      case 'yellow': return '#FFD740';
      case 'green': return '#00E676';
      default: return '#9CA3AF';
    }
  };

  // 確定有沒有足夠的歷史資料來畫圖
  const hasHistory = history && history.length > 1;

  // 計算圖表 Y 軸的上下限範圍，讓圖表不會貼齊頂部或底部
  const minVal = hasHistory ? Math.min(...history.map(h => h.value)) : 0;
  const maxVal = hasHistory ? Math.max(...history.map(h => h.value)) : 0;
  const padding = (maxVal - minVal) * 0.1;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] hover:border-foreground/20 duration-300 relative overflow-hidden group">
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 relative z-20">
          <h3 className="text-lg font-semibold text-foreground/90">{title}</h3>
          <div className="w-5 h-5 rounded-full border border-foreground/20 text-foreground/50 flex items-center justify-center text-xs cursor-help">
            i
            {/* Tooltip */}
            <div className="absolute left-0 top-6 w-64 p-3 bg-background/90 border border-foreground/10 rounded-lg text-sm text-foreground/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl">
              {description}
            </div>
          </div>
        </div>
        
        {/* Status Light */}
        <div className={`w-4 h-4 rounded-full ${getStatusColor()}`}></div>
      </div>

      {/* Middle Section */}
      <div className="flex flex-col gap-1 mb-2 z-10">
        <div className="text-4xl font-bold tracking-tight">{currentValue}</div>
        <div className={`text-sm font-medium ${getStatusTextColor()}`}>{statusText}</div>
      </div>

      {/* Bottom Section (Sparkline) */}
      <div className="h-16 w-full mt-auto relative -mx-2 opacity-80 group-hover:opacity-100 transition-opacity z-10">
        {hasHistory ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <XAxis dataKey="date" hide />
              <YAxis domain={[minVal - padding, maxVal + padding]} hide />
              <Tooltip 
                contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                itemStyle={{ color: getLineColor(), fontWeight: 'bold' }}
                labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                formatter={(value: any) => [value, '數值']}
                labelFormatter={(label: any) => {
                  if (!label) return '日期: 未知';
                  const parts = label.split('-');
                  return parts.length >= 2 ? `日期: ${parts[0]}.${parts[1]}` : `日期: ${label}`;
                }}
                cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '3 3' }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={getLineColor()} 
                strokeWidth={2.5} 
                dot={false}
                activeDot={{ r: 4, fill: getLineColor(), stroke: '#fff', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full border-b border-dashed border-foreground/20 flex items-end ml-2 pb-1">
            <span className="text-xs text-foreground/30">暫無歷史走勢</span>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis, XAxis, Tooltip, ComposedChart, CartesianGrid, Legend } from 'recharts';

type LightStatus = 'red' | 'yellow' | 'green' | 'neutral' | 'loading';

interface IndicatorCardProps {
  title: string;
  description: string;
  value: string | number;
  statusText?: string;
  status: LightStatus;
  history?: { date: string; value: number }[];
  spyHistory?: { date: string; value: number }[];
  criteria?: {
    red: string;
    yellow: string;
    green: string;
  };
}

export default function IndicatorCard({
  title,
  description,
  value,
  statusText,
  status,
  history,
  spyHistory,
  criteria
}: IndicatorCardProps) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'1Y' | '3Y' | '5Y' | 'MAX'>('MAX');
  const [showSpy, setShowSpy] = useState(false);

  const getStatusColor = () => {
    switch (status) {
      case 'red': return 'bg-danger shadow-[0_0_15px_rgba(255,64,129,0.8)] animate-pulse-danger';
      case 'yellow': return 'bg-warning shadow-[0_0_15px_rgba(255,215,64,0.6)]';
      case 'green': return 'bg-safe shadow-[0_0_15px_rgba(0,230,118,0.5)]';
      case 'neutral': return 'bg-gray-400 shadow-[0_0_15px_rgba(156,163,175,0.5)]';
      default: return 'bg-gray-500';
    }
  };

  const getStatusTextColor = () => {
    switch (status) {
      case 'red': return 'text-danger';
      case 'yellow': return 'text-warning';
      case 'green': return 'text-safe';
      case 'neutral': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getLineColor = () => {
    switch (status) {
      case 'red': return '#FF4081';
      case 'yellow': return '#FFD740';
      case 'green': return '#00E676';
      case 'neutral': return '#9CA3AF';
      default: return '#9CA3AF';
    }
  };

  // 確定有沒有足夠的歷史資料來畫圖
  const hasHistory = history && history.length > 1;

  // Sparkline 計算 Y 軸的上下限範圍
  const minVal = hasHistory ? Math.min(...history!.map(h => h.value)) : 0;
  const maxVal = hasHistory ? Math.max(...history!.map(h => h.value)) : 0;
  const padding = (maxVal - minVal) * 0.1;

  // Modal 邏輯
  const filterDataByTimeRange = (data: {date: string, value: number}[] | undefined, range: '1Y' | '3Y' | '5Y' | 'MAX') => {
    if (!data || data.length === 0) return [];
    if (range === 'MAX') return data;
    const now = new Date();
    const years = range === '1Y' ? 1 : range === '3Y' ? 3 : 5;
    const cutoff = new Date(now.setFullYear(now.getFullYear() - years));
    return data.filter(d => new Date(d.date) >= cutoff);
  };

  const filteredHistory = filterDataByTimeRange(history, timeRange);

  const mergedData = useMemo(() => {
    if (!filteredHistory || filteredHistory.length === 0) return [];
    if (!showSpy || !spyHistory) return filteredHistory.map(h => ({ ...h, indicatorValue: h.value }));
    
    const spyMap = new Map();
    spyHistory.forEach(s => spyMap.set(s.date, s.value));
    
    return filteredHistory.map(h => {
      let sv = spyMap.get(h.date);
      if (sv === undefined) {
         // find closest within 7 days
         const hTime = new Date(h.date).getTime();
         let closestDay = null;
         let minDiff = Infinity;
         for (const [sDate, sVal] of spyMap.entries()) {
           const diff = Math.abs(new Date(sDate).getTime() - hTime);
           if (diff < minDiff && diff <= 7 * 24 * 60 * 60 * 1000) {
              minDiff = diff;
              closestDay = sVal;
           }
         }
         sv = closestDay !== null ? closestDay : null;
      }
      return {
        date: h.date,
        indicatorValue: h.value,
        spyValue: sv
      };
    });
  }, [filteredHistory, showSpy, spyHistory]);

  const modalMinVal = mergedData.length > 0 ? Math.min(...mergedData.map(d => d.indicatorValue)) : 0;
  const modalMaxVal = mergedData.length > 0 ? Math.max(...mergedData.map(d => d.indicatorValue)) : 0;
  const modalPadding = (modalMaxVal - modalMinVal) * 0.1;
  
  const spyMinVal = (showSpy && mergedData.length > 0) ? Math.min(...mergedData.map(d => (d as any).spyValue || Infinity)) : 0;
  const spyMaxVal = (showSpy && mergedData.length > 0) ? Math.max(...mergedData.map(d => (d as any).spyValue || -Infinity)) : 0;
  const spyPadding = (spyMaxVal - spyMinVal) * 0.1;

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="glass-panel rounded-2xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] hover:border-foreground/30 duration-300 relative overflow-hidden group cursor-pointer"
      >
        
        {/* Top Section */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 relative z-20">
            <h3 className="text-lg font-semibold text-foreground/90">{title}</h3>
            <div className="w-5 h-5 rounded-full border border-foreground/20 text-foreground/50 flex items-center justify-center text-xs cursor-help">
              i
              {/* Tooltip */}
              <div className="absolute left-0 top-6 w-64 p-3 bg-background/90 border border-foreground/10 rounded-lg text-sm text-foreground/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-xl pointer-events-none">
                {description}
              </div>
            </div>
          </div>
          
          {/* Status Light */}
          <div className={`w-4 h-4 rounded-full ${getStatusColor()}`}></div>
        </div>

        {/* Middle Section */}
        <div className="flex flex-col gap-1 mb-2 z-10">
          <div className="text-4xl font-bold tracking-tight">{value}</div>
          {statusText && <div className={`text-sm font-medium ${getStatusTextColor()}`}>{statusText}</div>}
        </div>

        {/* Bottom Section (Sparkline) */}
        <div className="h-16 w-full mt-auto relative -mx-2 opacity-80 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
          {hasHistory ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="date" hide />
                <YAxis domain={[minVal - padding, maxVal + padding]} hide />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: getLineColor(), fontWeight: 'bold' }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}
                  formatter={(value: any) => [typeof value === 'number' ? value.toFixed(2) : value, '數值']}
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

        {/* Criteria Section */}
        {criteria && (
          <div className="flex items-center justify-between text-[10.5px] sm:text-xs text-foreground/60 mt-4 pt-3 border-t border-foreground/10 z-10">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-danger shadow-[0_0_5px_rgba(255,64,129,0.5)]"></span> {criteria.red}</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-warning shadow-[0_0_5px_rgba(255,215,64,0.5)]"></span> {criteria.yellow}</div>
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-safe shadow-[0_0_5px_rgba(0,230,118,0.5)]"></span> {criteria.green}</div>
          </div>
        )}
      </div>

      {/* Detailed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-foreground/5 border border-foreground/10 shadow-2xl rounded-3xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-6 md:p-8 flex justify-between items-start border-b border-foreground/10 bg-background/50">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-4 h-4 rounded-full ${getStatusColor()}`}></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-3xl font-black">{value}</span>
                  {statusText && <span className={`text-lg font-bold px-3 py-1 rounded-full bg-foreground/5 ${getStatusTextColor()}`}>{statusText}</span>}
                </div>
                <p className="text-foreground/60 mt-4 max-w-3xl leading-relaxed">{description}</p>
                
                {criteria && (
                  <div className="flex gap-4 mt-4 text-sm text-foreground/70 bg-foreground/5 p-3 rounded-xl inline-flex">
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger"></span> 紅燈: {criteria.red}</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warning"></span> 黃燈: {criteria.yellow}</div>
                    <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-safe"></span> 綠燈: {criteria.green}</div>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-foreground/50 hover:text-foreground"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Controls */}
            <div className="px-6 md:px-8 py-4 flex flex-wrap justify-between items-center gap-4 bg-background/30">
              <div className="flex gap-2">
                {['1Y', '3Y', '5Y', 'MAX'].map(t => (
                  <button
                    key={t}
                    onClick={() => setTimeRange(t as any)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${timeRange === t ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-foreground/5 text-foreground/60 hover:bg-foreground/10'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              
              {spyHistory && spyHistory.length > 0 && (
                <button
                  onClick={() => setShowSpy(!showSpy)}
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${showSpy ? 'border-amber-500/50 bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/20' : 'border-foreground/10 bg-foreground/5 text-foreground/60 hover:bg-foreground/10'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${showSpy ? 'bg-amber-500' : 'bg-foreground/30'}`}></div>
                  疊加 S&P 500 (SPY) 對比
                </button>
              )}
            </div>

            {/* Modal Chart */}
            <div className="flex-1 p-6 md:p-8 min-h-[300px]">
              {mergedData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={mergedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="rgba(255,255,255,0.2)" 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                      tickFormatter={(val) => val.split('-').slice(0, 2).join('-')}
                      minTickGap={30}
                    />
                    <YAxis 
                      yAxisId="left" 
                      domain={[modalMinVal - modalPadding, modalMaxVal + modalPadding]} 
                      stroke="rgba(255,255,255,0.2)" 
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} 
                      tickFormatter={(val) => val.toFixed(1)}
                      width={60}
                    />
                    {showSpy && (
                      <YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        domain={[spyMinVal - spyPadding, spyMaxVal + spyPadding]} 
                        stroke="rgba(245,158,11,0.5)" 
                        tick={{ fill: 'rgba(245,158,11,0.8)', fontSize: 12 }}
                        tickFormatter={(val) => `$${val.toFixed(0)}`}
                        width={60}
                      />
                    )}
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(15,23,42,0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px', boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)' }}
                      itemStyle={{ fontWeight: 'bold' }}
                      labelStyle={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px', fontSize: '13px' }}
                      formatter={(value: any, name: any) => {
                        if (typeof value === 'number') {
                          // 台股融資餘額通常是很大的數字（例如億），小數點後兩位
                          // 如果是 S&P 500 (SPY)，通常是百位數，保留小數點後兩位
                          return [value.toFixed(2), name];
                        }
                        return [value, name];
                      }}
                    />
                    <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    <Line 
                      yAxisId="left"
                      name={title}
                      type="monotone" 
                      dataKey="indicatorValue" 
                      stroke={getLineColor()} 
                      strokeWidth={3} 
                      dot={false}
                      activeDot={{ r: 6, fill: getLineColor(), stroke: '#fff', strokeWidth: 2 }}
                      isAnimationActive={true}
                      animationDuration={500}
                      animationEasing="ease-out"
                    />
                    {showSpy && (
                      <Line 
                        yAxisId="right"
                        name="S&P 500 (SPY)"
                        type="monotone" 
                        dataKey="spyValue" 
                        stroke="#F59E0B" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        dot={false}
                        activeDot={{ r: 4, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
                        connectNulls={true}
                        isAnimationActive={true}
                        animationDuration={500}
                        animationEasing="ease-out"
                      />
                    )}
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-foreground/30 text-lg">
                  暫無足夠歷史資料
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

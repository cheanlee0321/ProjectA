'use client';

import { useState, useMemo } from 'react';
import { analyzeTechnicalIndicators, calculateFullMACDSeries, calculateFullRSISeries } from '@/lib/technical';
import { ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ReferenceLine } from 'recharts';
import AiTechnicalReport from './AiTechnicalReport';

export default function TechnicalAnalysis({ ticker, geminiApiKey, geminiModel, historicalPrices = [] }: { ticker: string, geminiApiKey: string | null, geminiModel: string | null, historicalPrices?: any[] }) {
  const [showMACD, setShowMACD] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('6M');

  const prices = historicalPrices.map(p => p.close);
  const tech = analyzeTechnicalIndicators(prices);
  
  // Prepare full chart data
  const fullMacdSeries = calculateFullMACDSeries(prices);
  const fullRsiSeries = calculateFullRSISeries(prices);
  
  const fullChartData = useMemo(() => {
    return historicalPrices.map((p, i) => {
      const macdItem = fullMacdSeries[i];
      const rsiItem = fullRsiSeries[i];
      return {
        date: p.date,
        close: p.close,
        macd: macdItem ? macdItem.MACD : null,
        signal: macdItem ? macdItem.signal : null,
        histogram: macdItem ? macdItem.histogram : null,
        rsi: rsiItem,
        timestamp: new Date(p.date).getTime(),
      };
    });
  }, [historicalPrices, fullMacdSeries, fullRsiSeries]);

  // Filter chart data based on selected time range
  const displayChartData = useMemo(() => {
    if (timeRange === 'ALL' || fullChartData.length === 0) return fullChartData;
    
    const latestDate = fullChartData[fullChartData.length - 1].timestamp;
    let cutoffTime = latestDate;
    
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (timeRange === '1M') cutoffTime = latestDate - (30 * ONE_DAY);
    else if (timeRange === '3M') cutoffTime = latestDate - (90 * ONE_DAY);
    else if (timeRange === '6M') cutoffTime = latestDate - (180 * ONE_DAY);
    else if (timeRange === '1Y') cutoffTime = latestDate - (365 * ONE_DAY);
    
    return fullChartData.filter(d => d.timestamp >= cutoffTime);
  }, [fullChartData, timeRange]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <span>📈</span> 技術面分析 (RSI & MACD)
          </h3>
          <span className="text-sm text-foreground/40 border border-foreground/10 px-3 py-1 rounded-full">
            Data Source: Yahoo Finance
          </span>
        </div>
        
        {/* Indicators Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`flex flex-col p-6 rounded-2xl border border-foreground/10 shadow-lg ${tech.rsiStatus.includes('超買') ? 'bg-danger/10 border-danger/20' : tech.rsiStatus.includes('超賣') ? 'bg-safe/10 border-safe/20' : 'bg-foreground/5'}`}>
            <h4 className="text-lg font-medium text-foreground/70 mb-2">RSI (14天)</h4>
            <div className="text-4xl font-bold font-mono mb-2">{tech.rsi ? tech.rsi.toFixed(2) : '-'}</div>
            <div className={`font-semibold mb-6 ${tech.rsiStatus.includes('超買') ? 'text-danger' : tech.rsiStatus.includes('超賣') ? 'text-safe' : 'text-foreground/50'}`}>
              {tech.rsiStatus}
            </div>
            <div className="text-xs text-foreground/60 border-t border-foreground/10 pt-4 mt-auto leading-relaxed">
              <span className="font-bold">計算方式：</span> 評估過去 14 天內收盤價上漲幅度與下跌幅度的比例。
              數值介於 0~100，通常大於 70 視為「超買」(過熱可能拉回)，小於 30 視為「超賣」(過冷可能反彈)。
            </div>
          </div>
          
          <div className={`flex flex-col p-6 rounded-2xl border border-foreground/10 shadow-lg ${tech.macdStatus.includes('黃金') ? 'bg-safe/10 border-safe/20' : tech.macdStatus.includes('死亡') ? 'bg-danger/10 border-danger/20' : 'bg-foreground/5'}`}>
            <h4 className="text-lg font-medium text-foreground/70 mb-2">MACD (12, 26, 9)</h4>
            <div className="text-4xl font-bold font-mono mb-2">
              {tech.macd && tech.macd.MACD !== undefined ? tech.macd.MACD.toFixed(3) : '-'}
            </div>
            <div className={`font-semibold mb-6 ${tech.macdStatus.includes('黃金') ? 'text-safe' : tech.macdStatus.includes('死亡') ? 'text-danger' : 'text-foreground/50'}`}>
              {tech.macdStatus}
            </div>
            <div className="text-xs text-foreground/60 border-t border-foreground/10 pt-4 mt-auto leading-relaxed">
              <span className="font-bold">計算方式：</span> 透過 12 天與 26 天指數移動平均線 (EMA) 的差值作為快線 (MACD)，再取 9 天的 EMA 作為慢線 (Signal)。
              當快線向上突破慢線時為「黃金交叉」(看漲)；向下穿越則為「死亡交叉」(看跌)。
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-foreground/5 p-6 md:p-8 rounded-2xl border border-foreground/10 shadow-lg mt-8">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
            <h4 className="text-xl font-bold text-foreground">歷史股價走勢與指標</h4>
            
            <div className="flex flex-wrap items-center gap-4">
              {/* Time Range Buttons */}
              <div className="flex items-center bg-foreground/10 p-1 rounded-xl shadow-sm border border-foreground/5">
                {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      timeRange === range 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                    }`}
                  >
                    {range === '1M' ? '1個月' : range === '3M' ? '3個月' : range === '6M' ? '半年' : range === '1Y' ? '1年' : '全部'}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label className="flex items-center space-x-2 cursor-pointer p-2 px-3 bg-foreground/10 rounded-xl hover:bg-foreground/20 transition-all shadow-sm border border-foreground/5">
                  <input 
                    type="checkbox" 
                    checked={showMACD} 
                    onChange={() => setShowMACD(!showMACD)}
                    className="w-4 h-4 rounded border-gray-400 text-rose-500 focus:ring-rose-500 accent-rose-500 cursor-pointer"
                  />
                  <span className="font-medium text-foreground/80 text-sm">MACD</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer p-2 px-3 bg-foreground/10 rounded-xl hover:bg-foreground/20 transition-all shadow-sm border border-foreground/5">
                  <input 
                    type="checkbox" 
                    checked={showRSI} 
                    onChange={() => setShowRSI(!showRSI)}
                    className="w-4 h-4 rounded border-gray-400 text-emerald-500 focus:ring-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                  <span className="font-medium text-foreground/80 text-sm">RSI</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="h-[450px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={displayChartData} margin={{ top: 20, right: (showMACD || showRSI) ? 20 : 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--foreground)" strokeOpacity={0.1} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="var(--foreground)" 
                  strokeOpacity={0.6} 
                  tick={{ fontSize: 12 }} 
                  minTickGap={30}
                />
                
                <YAxis 
                  yAxisId="price" 
                  orientation="left" 
                  stroke="var(--foreground)" 
                  strokeOpacity={0.8} 
                  domain={['auto', 'auto']}
                  tickFormatter={(val) => `$${val}`}
                />
                
                {showMACD && (
                  <YAxis 
                    yAxisId="macd" 
                    orientation="right" 
                    stroke="#ec4899" 
                    strokeOpacity={0.8} 
                    domain={['auto', 'auto']}
                    tick={{ fontSize: 12 }}
                  />
                )}

                {showRSI && (
                  <YAxis 
                    yAxisId="rsi" 
                    orientation="right" 
                    stroke="#10b981" 
                    strokeOpacity={0.8} 
                    domain={[0, 100]}
                    tick={{ fontSize: 12 }}
                  />
                )}
                
                {showRSI && <ReferenceLine y={70} yAxisId="rsi" stroke="#ef4444" strokeOpacity={0.4} strokeDasharray="3 3" />}
                {showRSI && <ReferenceLine y={30} yAxisId="rsi" stroke="#10b981" strokeOpacity={0.4} strokeDasharray="3 3" />}
                
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)' }}
                  itemStyle={{ fontSize: '13px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                <Line 
                  yAxisId="price" 
                  type="monotone" 
                  dataKey="close" 
                  name="收盤價" 
                  stroke="#6366f1" 
                  strokeWidth={2} 
                  dot={false}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#818cf8' }} 
                />
                
                {showMACD && (
                  <>
                    <Bar yAxisId="macd" dataKey="histogram" name="MACD 柱狀圖" fill="#ec4899" opacity={0.3} />
                    <Line yAxisId="macd" type="monotone" dataKey="macd" name="MACD 線" stroke="#ec4899" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                    <Line yAxisId="macd" type="monotone" dataKey="signal" name="訊號線" stroke="#f59e0b" strokeWidth={2} dot={false} strokeDasharray="4 4" activeDot={{ r: 4 }} />
                  </>
                )}

                {showRSI && (
                  <Line yAxisId="rsi" type="monotone" dataKey="rsi" name="RSI" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* AI Technical Report */}
        <AiTechnicalReport 
          ticker={ticker}
          geminiApiKey={geminiApiKey}
          geminiModel={geminiModel}
          historicalPrices={historicalPrices}
        />
      </div>
    </div>
  );
}

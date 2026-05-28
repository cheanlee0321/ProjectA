"use client";

import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from 'recharts';
import { Activity } from 'lucide-react';

interface PriceData {
  date: string;
  close: number;
}

interface PriceChartProps {
  data: PriceData[];
  ticker: string;
}

export default function PriceChart({ data, ticker }: PriceChartProps) {
  const [range, setRange] = useState<'1y' | '3y'>('1y');

  const fullSortedData = useMemo(() => {
    // 確保資料是按照日期遞增排序
    return [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data]);

  const chartData = useMemo(() => {
    if (range === '3y') return fullSortedData;

    // 預設 1 年
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return fullSortedData.filter(d => new Date(d.date) >= oneYearAgo);
  }, [fullSortedData, range]);

  const { isUpTrend, minPrice, maxPrice } = useMemo(() => {
    if (!chartData || chartData.length === 0 || !fullSortedData || fullSortedData.length === 0) {
      return { isUpTrend: true, minPrice: 0, maxPrice: 0 };
    }

    // 計算 Y 軸的最大與最小值，讓圖表不會因為從 0 開始而顯得扁平
    const prices = chartData.map(d => d.close);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);

    // 增加一點 buffer 讓圖表上下有空間
    const buffer = (maxP - minP) * 0.1;

    // 計算趨勢 (季線 MA60 與年線 MA240)
    const latestPrice = fullSortedData[fullSortedData.length - 1].close;

    let MA60 = 0;
    if (fullSortedData.length >= 60) {
      const last60 = fullSortedData.slice(-60);
      MA60 = last60.reduce((sum, item) => sum + item.close, 0) / 60;
    }

    let MA240 = 0;
    if (fullSortedData.length >= 240) {
      const last240 = fullSortedData.slice(-240);
      MA240 = last240.reduce((sum, item) => sum + item.close, 0) / 240;
    }

    // 只要最新收盤價大於季線或年線，就視為上漲 (資料不足 60 天則用首尾比對)
    const trendUp = fullSortedData.length >= 60
      ? (latestPrice > MA60 || latestPrice > MA240)
      : (latestPrice >= fullSortedData[0].close);

    return {
      isUpTrend: trendUp,
      minPrice: Math.max(0, minP - buffer),
      maxPrice: maxP + buffer
    };
  }, [chartData, fullSortedData]);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  // 根據趨勢決定顏色: 上漲(翠綠), 下跌(玫瑰紅)
  const themeColor = isUpTrend ? '#10b981' : '#f43f5e';

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6 border-b border-foreground/10 pb-4">
        <h3 className="text-2xl font-bold text-foreground flex items-center">
          <Activity className="w-6 h-6 mr-3 text-foreground/70" />
          {ticker} 歷史股價走勢
        </h3>
        <div className="flex bg-foreground/5 p-1 rounded-lg">
          <button
            onClick={() => setRange('1y')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${range === '1y' ? 'bg-background shadow text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
          >
            1 年
          </button>
          <button
            onClick={() => setRange('3y')}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${range === '3y' ? 'bg-background shadow text-foreground' : 'text-foreground/60 hover:text-foreground'}`}
          >
            3 年
          </button>
        </div>
      </div>

      <div className="bg-background/40 border border-foreground/10 rounded-3xl p-4 md:p-6 shadow-lg backdrop-blur-sm">
        <div className="h-[450px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={themeColor} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={themeColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--foreground)" strokeOpacity={0.1} vertical={false} />

              <XAxis
                dataKey="date"
                stroke="var(--foreground)"
                strokeOpacity={0.5}
                tick={{ fill: 'var(--foreground)', opacity: 0.7 }}
                tickFormatter={(val) => {
                  // 只顯示 YYYY-MM
                  const date = new Date(val);
                  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                }}
                minTickGap={30}
              />

              <YAxis
                stroke="var(--foreground)"
                strokeOpacity={0.5}
                tick={{ fill: 'var(--foreground)', opacity: 0.7 }}
                domain={[minPrice, maxPrice]}
                tickFormatter={(val) => val.toFixed(2)}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--glass-border)',
                  color: 'var(--foreground)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
                itemStyle={{ color: themeColor, fontWeight: 'bold' }}
                labelStyle={{ color: 'var(--foreground)', opacity: 0.7, marginBottom: '4px' }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, '收盤價']}
              />

              <Area
                type="monotone"
                dataKey="close"
                stroke={themeColor}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorPrice)"
                activeDot={{ r: 6, strokeWidth: 0, fill: themeColor }}
              />

              <Brush
                dataKey="date"
                height={40}
                stroke="var(--foreground)"
                fill="var(--background)"
                tickFormatter={(val) => {
                  const date = new Date(val);
                  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                }}
                style={{
                  opacity: 0.7
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 text-center flex flex-col items-center justify-center gap-2">
          <div className="text-sm text-foreground/50 flex items-center justify-center gap-2">
            <span>拖曳下方時間軸可縮放查看特定區間</span>
            <div className={`w-3 h-3 rounded-full ${isUpTrend ? 'bg-emerald-500' : 'bg-rose-500'} opacity-70`}></div>
            <span>目前趨勢: {isUpTrend ? '上漲' : '下跌'}</span>
          </div>
          <div className="text-xs text-foreground/40">
            最新收盤價大於 60 日均線(季線) 或 240 日均線(年線) 即視為上漲
          </div>
        </div>
      </div>
    </div>
  );
}

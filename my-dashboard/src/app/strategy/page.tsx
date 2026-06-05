'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface StrategyData {
  month: string;
  finraToM0?: number;
  sp500ToM0?: number;
  qqqToM0?: number;
  tqqqToM0?: number;
  cape?: number;
}

export default function StrategyPage() {
  const [data, setData] = useState<StrategyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRanges, setTimeRanges] = useState<Record<string, number | 'Max'>>({
    chart1: 20,
    chart2: 20,
    chart3: 20,
    chart4: 20
  });
  const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/data/strategy_data.json')
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching strategy data:', err);
        setLoading(false);
      });
  }, []);

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    if (dataKey) {
      setHiddenLines(prev => ({ ...prev, [dataKey]: !prev[dataKey] }));
    }
  };

  const formatYAxis = (tickItem: any) => {
    if (typeof tickItem === 'number') return tickItem.toFixed(4);
    return tickItem;
  };

  const formatTooltip = (value: any) => {
    if (typeof value === 'number') return [value.toFixed(4)];
    return [value];
  };

  const getFilteredData = (chartId: string) => {
    const range = timeRanges[chartId];
    if (range === 'Max' || data.length === 0) return data;
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - (range as number));
    const cutoffString = `${cutoffDate.getFullYear()}-${String(cutoffDate.getMonth() + 1).padStart(2, '0')}`;
    return data.filter(d => d.month >= cutoffString);
  };

  const ranges: (number | 'Max')[] = [1, 3, 5, 10, 20, 50, 'Max'];

  const latestFinraValue = data.length > 0 ? data[data.length - 1].finraToM0 : null;
  let finraStatus = 'green';
  let finraStatusText = '常規水準 (< 0.30)';

  if (latestFinraValue !== null && latestFinraValue !== undefined) {
    if (latestFinraValue > 0.40) {
      finraStatus = 'red';
      finraStatusText = '極限槓桿 (> 0.40)';
    } else if (latestFinraValue >= 0.30) {
      finraStatus = 'yellow';
      finraStatusText = '槓桿偏高 (0.30-0.40)';
    }
  }

  const getChartConfig = (chartId: string) => {
    const fData = getFilteredData(chartId);
    const finraValues = fData.map(d => d.finraToM0).filter(v => v !== undefined) as number[];
    let fMin = 0;
    let fMax = 1;
    if (finraValues.length > 0) {
      fMin = Math.floor(Math.min(...finraValues) * 20) / 20;
      fMax = Math.ceil(Math.max(...finraValues) * 20) / 20;
      if (fMin >= fMax) fMax = fMin + 0.05;
    }
    const getOffset = (threshold: number) => {
      if (fMax === fMin) return 0;
      const p = (fMax - threshold) / (fMax - fMin);
      return Math.max(0, Math.min(1, p));
    };
    return { filteredData: fData, finraMin: fMin, finraMax: fMax, offRed: getOffset(0.40), offYellow: getOffset(0.30) };
  };

  const StatusChip = ({ status, text }: { status: string, text: string }) => {
    if (status === 'red') {
      return (
        <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></span>
          <span className="text-rose-400 font-bold text-sm leading-none">{text}</span>
        </div>
      );
    } else if (status === 'yellow') {
      return (
        <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
          <span className="text-yellow-400 font-bold text-sm leading-none">{text}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
        <span className="text-emerald-500 font-bold text-sm leading-none">{text}</span>
      </div>
    );
  };

  const renderTimeSelector = (chartId: string) => (
    <div className="flex bg-foreground/5 p-1 rounded-full border border-foreground/10 overflow-x-auto hide-scrollbar w-fit ml-auto">
      {ranges.map(range => (
        <button
          key={range}
          onClick={() => setTimeRanges(prev => ({ ...prev, [chartId]: range }))}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${timeRanges[chartId] === range
            ? 'bg-violet-500 text-white shadow-md shadow-violet-500/25'
            : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
            }`}
        >
          {range === 'Max' ? 'Max' : `${range}年`}
        </button>
      ))}
    </div>
  );

  const chart1Config = getChartConfig('chart1');
  const chart2Config = getChartConfig('chart2');
  const chart3Config = getChartConfig('chart3');
  const chart4Config = getChartConfig('chart4');

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-violet-400 hover:text-violet-300 transition-colors mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回首頁
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 flex items-center">
            <span className="text-4xl mr-3">🎯</span> 投資策略
          </h1>
          <p className="text-foreground/60 text-lg max-w-3xl">
            此頁面統整了融資餘額與各大指數相對於實體流通貨幣的比值。
            透過與流通貨幣的對比，我們能評估資產價格是否由市場流動性擴張所推動，或是反映了真實的價值增長。
          </p>
        </div>

        {/* --- CHARTS SECTION (MOVED TO TOP) --- */}
        {loading ? (
          <div className="flex items-center justify-center h-64 mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-12 mb-16">

            {/* Chart 1: FINRA vs SP500 */}
            <div className="p-6 md:p-10 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-2xl hover:border-foreground/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-blue-400 flex items-center flex-wrap gap-4">
                  <div className="flex items-center">
                    <span className="mr-3">📈</span> FINRA vs S&P 500
                  </div>
                  <StatusChip status={finraStatus} text={finraStatusText} />
                </h2>
                {renderTimeSelector('chart1')}
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart1Config.filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="finraColor1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={0} stopColor="#F43F5E" stopOpacity={1} />
                        <stop offset={chart1Config.offRed} stopColor="#F43F5E" stopOpacity={1} />
                        <stop offset={chart1Config.offRed} stopColor="#FACC15" stopOpacity={1} />
                        <stop offset={chart1Config.offYellow} stopColor="#FACC15" stopOpacity={1} />
                        <stop offset={chart1Config.offYellow} stopColor="#10B981" stopOpacity={1} />
                        <stop offset={1} stopColor="#10B981" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.3} vertical={false} />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickMargin={15} minTickGap={40} axisLine={{ stroke: '#4B5563' }} />
                    <YAxis yAxisId="left" hide={hiddenLines['finraToM0']} domain={[chart1Config.finraMin, chart1Config.finraMax]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                    <YAxis yAxisId="right" hide={hiddenLines['sp500ToM0']} orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                    <Tooltip formatter={formatTooltip} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ fontWeight: 500 }} />
                    <Legend onClick={handleLegendClick} wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }} iconType="circle" />
                    <Line yAxisId="left" hide={hiddenLines['finraToM0']} type="monotone" dataKey="finraToM0" name="FINRA / 流通貨幣" stroke="url(#finraColor1)" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                    <Line yAxisId="right" hide={hiddenLines['sp500ToM0']} type="monotone" dataKey="sp500ToM0" name="S&P 500 / 流通貨幣" stroke="#3B82F6" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: FINRA vs QQQ */}
            <div className="p-6 md:p-10 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-2xl hover:border-foreground/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-emerald-400 flex items-center flex-wrap gap-4">
                  <div className="flex items-center">
                    <span className="mr-3">📈</span> FINRA vs QQQ
                  </div>
                  <StatusChip status={finraStatus} text={finraStatusText} />
                </h2>
                {renderTimeSelector('chart2')}
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart2Config.filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="finraColor2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={0} stopColor="#F43F5E" stopOpacity={1} />
                        <stop offset={chart2Config.offRed} stopColor="#F43F5E" stopOpacity={1} />
                        <stop offset={chart2Config.offRed} stopColor="#FACC15" stopOpacity={1} />
                        <stop offset={chart2Config.offYellow} stopColor="#FACC15" stopOpacity={1} />
                        <stop offset={chart2Config.offYellow} stopColor="#10B981" stopOpacity={1} />
                        <stop offset={1} stopColor="#10B981" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.3} vertical={false} />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickMargin={15} minTickGap={40} axisLine={{ stroke: '#4B5563' }} />
                    <YAxis yAxisId="left" hide={hiddenLines['finraToM0']} domain={[chart2Config.finraMin, chart2Config.finraMax]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                    <YAxis yAxisId="right" hide={hiddenLines['qqqToM0']} orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                    <Tooltip formatter={formatTooltip} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ fontWeight: 500 }} />
                    <Legend onClick={handleLegendClick} wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }} iconType="circle" />
                    <Line yAxisId="left" hide={hiddenLines['finraToM0']} type="monotone" dataKey="finraToM0" name="FINRA / 流通貨幣" stroke="url(#finraColor2)" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                    <Line yAxisId="right" hide={hiddenLines['qqqToM0']} type="monotone" dataKey="qqqToM0" name="QQQ / 流通貨幣" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: FINRA vs TQQQ */}
            <div className="p-6 md:p-10 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-2xl hover:border-foreground/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-amber-400 flex items-center flex-wrap gap-4">
                  <div className="flex items-center">
                    <span className="mr-3">📈</span> FINRA vs TQQQ
                  </div>
                  <StatusChip status={finraStatus} text={finraStatusText} />
                </h2>
                {renderTimeSelector('chart3')}
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart3Config.filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="finraColor3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={0} stopColor="#F43F5E" stopOpacity={1} />
                        <stop offset={chart3Config.offRed} stopColor="#F43F5E" stopOpacity={1} />
                        <stop offset={chart3Config.offRed} stopColor="#FACC15" stopOpacity={1} />
                        <stop offset={chart3Config.offYellow} stopColor="#FACC15" stopOpacity={1} />
                        <stop offset={chart3Config.offYellow} stopColor="#10B981" stopOpacity={1} />
                        <stop offset={1} stopColor="#10B981" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.3} vertical={false} />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickMargin={15} minTickGap={40} axisLine={{ stroke: '#4B5563' }} />
                    <YAxis yAxisId="left" hide={hiddenLines['finraToM0']} domain={[chart3Config.finraMin, chart3Config.finraMax]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                    <YAxis yAxisId="right" hide={hiddenLines['tqqqToM0']} orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                    <Tooltip formatter={formatTooltip} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ fontWeight: 500 }} />
                    <Legend onClick={handleLegendClick} wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }} iconType="circle" />
                    <Line yAxisId="left" hide={hiddenLines['finraToM0']} type="monotone" dataKey="finraToM0" name="FINRA / 流通貨幣" stroke="url(#finraColor3)" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                    <Line yAxisId="right" hide={hiddenLines['tqqqToM0']} type="monotone" dataKey="tqqqToM0" name="TQQQ / 流通貨幣" stroke="#F59E0B" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: FINRA vs CAPE */}
            <div className="p-6 md:p-10 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-2xl hover:border-foreground/20 transition-all duration-300">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-xl md:text-2xl font-bold text-fuchsia-400 flex items-center flex-wrap gap-4">
                  <div className="flex items-center">
                    <span className="mr-3">📈</span> FINRA vs 席勒本益比 (CAPE)
                  </div>
                  <StatusChip status={finraStatus} text={finraStatusText} />
                </h2>
                {renderTimeSelector('chart4')}
              </div>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chart4Config.filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                      <linearGradient id="finraColor4" x1="0" y1="0" x2="0" y2="1">
                        <stop offset={0} stopColor="#F43F5E" stopOpacity={1} />
                        <stop offset={chart4Config.offRed} stopColor="#F43F5E" stopOpacity={1} />
                        <stop offset={chart4Config.offRed} stopColor="#FACC15" stopOpacity={1} />
                        <stop offset={chart4Config.offYellow} stopColor="#FACC15" stopOpacity={1} />
                        <stop offset={chart4Config.offYellow} stopColor="#10B981" stopOpacity={1} />
                        <stop offset={1} stopColor="#10B981" stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.3} vertical={false} />
                    <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickMargin={15} minTickGap={40} axisLine={{ stroke: '#4B5563' }} />
                    <YAxis yAxisId="left" hide={hiddenLines['finraToM0']} domain={[chart4Config.finraMin, chart4Config.finraMax]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                    <YAxis yAxisId="right" hide={hiddenLines['cape']} orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                    <Tooltip formatter={formatTooltip} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ fontWeight: 500 }} />
                    <Legend onClick={handleLegendClick} wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }} iconType="circle" />
                    <Line yAxisId="left" hide={hiddenLines['finraToM0']} type="monotone" dataKey="finraToM0" name="FINRA / 流通貨幣" stroke="url(#finraColor4)" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                    <Line yAxisId="right" hide={hiddenLines['cape']} type="monotone" dataKey="cape" name="席勒本益比 (CAPE)" stroke="#D946EF" strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* --- STRATEGY GUIDE & RESULTS SECTION (MOVED TO BOTTOM) --- */}
        <div className="flex flex-col gap-8">
          <div className="p-6 md:p-8 rounded-3xl bg-violet-500/10 border border-violet-500/20 shadow-lg">
            <h3 className="text-2xl font-bold text-violet-300 mb-4 flex items-center">
              <span className="mr-2">💡</span> 實戰操作指南與回測回顧
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/80">
              <div>
                <h4 className="text-lg font-semibold text-emerald-400 mb-2">🟢 綠燈區間 (比值 &lt; 0.3)</h4>
                <p className="mb-4"><strong>常態佈局：</strong>當市場去槓桿完成，將資金分為 10 份，連續 10 個月分批買入 <strong>50% QQQ / 50% TQQQ</strong>（或 100% TQQQ）。此時散戶槓桿低，是開啟多頭循環的絕佳時機。</p>

                <h4 className="text-lg font-semibold text-rose-400 mb-2">🔴 紅燈區間 (比值 &gt; 0.4)</h4>
                <p><strong>警戒防守：</strong>立刻中斷任何買進計畫，開始將手中所有槓桿與指數部位分 10 個月平均賣出。代表市場槓桿推升到極限，隨時可能發生去槓桿踐踏。</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-amber-400 mb-2">⚡ 策略優缺點與歷史數據</h4>
                <ul className="list-disc list-inside space-y-2 mb-4 text-sm">
                  <li><strong>優點：</strong>極佳的下檔保護。回測顯示，這套策略即便在 100% TQQQ 的測試下，能將最大回撤從 79.2% 降至 35.9%，避開如 2022 年的劇烈股災。</li>
                  <li><strong>缺點：</strong>融資餘額數據具落後性（月底結算），且可能產生假突破導致頻繁切換買賣計畫。</li>
                </ul>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">🛡️ 推薦輔助指標</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>NFCI & VIX：</strong>補足短期避險的即時指標，若資金環境緊縮或恐慌飆升，即使沒亮紅燈也應減碼。</li>
                  <li><strong>Sahm Rule (薩姆規則)：</strong>確認實質性衰退是否開始。若與高融資紅燈同時出現，殺傷力極大。</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 shadow-lg">
            <h3 className="text-2xl font-bold text-blue-300 mb-6 flex items-center">
              <span className="mr-2">📊</span> 歷史回測實驗結果 (NASDAQ 100: QQQ / TQQQ, 2010年2月 - 2026年4月)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-foreground/80 border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-blue-500/20">
                    <th className="py-3 px-4 font-semibold text-blue-400">策略情境</th>
                    <th className="py-3 px-4 font-semibold text-blue-400">初始資金</th>
                    <th className="py-3 px-4 font-semibold text-blue-400">最終資產</th>
                    <th className="py-3 px-4 font-semibold text-blue-400">總報酬率</th>
                    <th className="py-3 px-4 font-semibold text-rose-400">最大回撤 (Max Drawdown)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">1. 無腦 All-in QQQ (buy & hold) (基準)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4">$1,491,823</td>
                    <td className="py-3 px-4 text-emerald-400">1391.82%</td>
                    <td className="py-3 px-4 text-rose-400">33.07%</td>
                  </tr>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">2. 無腦 All-in TQQQ</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4 text-amber-400">$27,325,976</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">27225.98%</td>
                    <td className="py-3 px-4 text-rose-500 font-bold">79.20% (極高風險)</td>
                  </tr>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">3. 策略指標 (50% QQQ / 50% TQQQ)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4">$2,646,187</td>
                    <td className="py-3 px-4 text-emerald-400">2546.19%</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">26.03% (最安全)</td>
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">4. 策略指標 (100% TQQQ)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">$7,064,232</td>
                    <td className="py-3 px-4 text-emerald-400">6964.23%</td>
                    <td className="py-3 px-4 text-amber-400">35.94%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-foreground/60 leading-relaxed">
              * 備註：<strong>回測期間為 2010 年 2 月至 2026 年 4 月 (受限於槓桿 ETF 上市時間，期間涵蓋多次重大牛熊循環)。</strong>回測以 $100,000 初始資金，綠燈區間分 10 個月等距買入，紅燈區間分 10 個月等距賣出。指標策略成功避開了單純持有 TQQQ 所面臨的接近 80% 毀滅性崩盤，以接近大盤 (QQQ) 的風險承受度，換取了數倍的超額報酬。
            </p>
          </div>

          <div className="mb-8 p-6 md:p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 shadow-lg">
            <h3 className="text-2xl font-bold text-emerald-300 mb-6 flex items-center">
              <span className="mr-2">📊</span> 歷史回測實驗結果 (S&P 500: SPY / UPRO, 2010年2月 - 2026年4月)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-foreground/80 border-collapse whitespace-nowrap">
                <thead>
                  <tr className="border-b border-emerald-500/20">
                    <th className="py-3 px-4 font-semibold text-emerald-400">策略情境</th>
                    <th className="py-3 px-4 font-semibold text-emerald-400">初始資金</th>
                    <th className="py-3 px-4 font-semibold text-emerald-400">最終資產</th>
                    <th className="py-3 px-4 font-semibold text-emerald-400">總報酬率</th>
                    <th className="py-3 px-4 font-semibold text-rose-400">最大回撤 (Max Drawdown)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">1. 無腦 All-in SPY (buy & hold) (基準)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4">$669,205</td>
                    <td className="py-3 px-4 text-emerald-400">569.21%</td>
                    <td className="py-3 px-4 text-rose-400">24.80%</td>
                  </tr>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">2. 無腦 All-in UPRO</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4 text-amber-400">$6,950,871</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">6850.87%</td>
                    <td className="py-3 px-4 text-rose-500 font-bold">62.76% (高風險)</td>
                  </tr>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">3. 策略指標 (50% SPY / 50% UPRO)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4">$1,510,425</td>
                    <td className="py-3 px-4 text-emerald-400">1410.43%</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">34.96%</td>
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">4. 策略指標 (100% UPRO)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">$3,694,658</td>
                    <td className="py-3 px-4 text-emerald-400">3594.66%</td>
                    <td className="py-3 px-4 text-amber-400">47.06%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-foreground/60 leading-relaxed">
              * 備註：<strong>回測期間為 2010 年 2 月至 2026 年 4 月。</strong>S&P 500 的波動度低於那斯達克。策略 50% SPY / 50% UPRO 的風險 (34.96%) 大致等同於單買大盤 QQQ 的風險 (33%)，卻帶來了 14 倍的報酬。
            </p>
          </div>

          <div className="p-6 md:p-8 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-lg">
            <h3 className="text-2xl font-bold text-rose-400 mb-6 flex items-center">
              <span className="mr-2">⚠️</span> 絕對不建議買 TQQQ 或 UPRO 的 4 種極端環境
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/80 text-sm">
              <div className="bg-background/40 p-5 rounded-2xl border border-rose-500/10">
                <h4 className="text-lg font-bold text-rose-300 mb-2">1. 實質性經濟衰退 (如薩姆規則觸發)</h4>
                <p>當企業獲利衰退、失業率飆升時，股市會有長達半年的熊市。TQQQ 作為 3 倍槓桿，若大盤跌 33%，其淨值幾乎歸零。即使不歸零，只要跌掉 90%，您需要上漲 1000% 才能回本，時間成本極度不划算。</p>
              </div>
              <div className="bg-background/40 p-5 rounded-2xl border border-rose-500/10">
                <h4 className="text-lg font-bold text-rose-300 mb-2">2. 資金流動性暴力抽乾 (暴力升息/縮表)</h4>
                <p>科技股估值高度依賴低利率與充裕資金。當央行暴力升息時，大盤會呈現溫水煮青蛙的階梯式下跌。這正是 FINRA 亮紅燈的時刻！逢低攤平 TQQQ 最終極易在底部斷頭。</p>
              </div>
              <div className="bg-background/40 p-5 rounded-2xl border border-rose-500/10">
                <h4 className="text-lg font-bold text-rose-300 mb-2">3. 高波動的橫盤震盪 (波動耗損)</h4>
                <p>若市場每天上下 3% 劇烈震盪，TQQQ 會遭遇「波動耗損 (Volatility Decay)」。即便大盤最終沒跌，TQQQ 也會憑空蒸發淨值。此時持有 TQQQ 幾乎等於每天被扣血。請觀察 VIX 是否居高不下。</p>
              </div>
              <div className="bg-background/40 p-5 rounded-2xl border border-rose-500/10">
                <h4 className="text-lg font-bold text-rose-300 mb-2">4. 殖利率曲線「剛解除倒掛」瞬間</h4>
                <p>當 10 年期與 2 年期公債曲線倒掛很久後，突然因緊急降息而「急劇轉正」時，往往是主跌段的開始。市場恐慌情緒達到最高點，此時接刀 TQQQ 形同自殺。</p>
              </div>
            </div>
            <p className="mt-6 text-center text-rose-200 font-medium bg-rose-950/40 py-3 px-4 rounded-xl border border-rose-500/20 shadow-inner">
              💡 鐵則：TQQQ 是「順風局的王者」，一旦進入上述四種逆風局的任何一種，寧可空手也絕對不要妄想抄底或凹單！這也是紅燈時強制撤除槓桿的原因。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

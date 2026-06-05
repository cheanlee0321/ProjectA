'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts';

interface StrategyData {
  month: string;
  finraToM0?: number;
  sp500ToM0?: number;
  qqqToM0?: number;
  tqqqToM0?: number;
  uproToM0?: number;
  cape?: number;
  tips?: number;
}

interface ChartConfig {
  filteredData: StrategyData[];
  finraMin: number;
  finraMax: number;
  offRed: number;
  offYellow: number;
}

// Static chart definitions (outside component for referential stability)
const chartDefs = [
  { id: 'chart1', title: 'FINRA vs S&P 500',  titleColor: 'text-blue-400',    rightKey: 'sp500ToM0', rightName: 'S&P 500 / 流通貨幣',      rightColor: '#3B82F6', formatRight: true },
  { id: 'chart6', title: 'FINRA vs UPRO',      titleColor: 'text-sky-400',     rightKey: 'uproToM0', rightName: 'UPRO / 流通貨幣',           rightColor: '#38BDF8', formatRight: true },
  { id: 'chart2', title: 'FINRA vs QQQ',       titleColor: 'text-emerald-400', rightKey: 'qqqToM0',  rightName: 'QQQ / 流通貨幣',            rightColor: '#10B981', formatRight: true },
  { id: 'chart3', title: 'FINRA vs TQQQ',      titleColor: 'text-amber-400',   rightKey: 'tqqqToM0', rightName: 'TQQQ / 流通貨幣',           rightColor: '#F59E0B', formatRight: true },
  { id: 'chart4', title: 'FINRA vs 席勒本益比 (CAPE)',                titleColor: 'text-fuchsia-400', rightKey: 'cape', rightName: '席勒本益比 (CAPE)',         rightColor: '#D946EF', formatRight: false },
  { id: 'chart5', title: 'FINRA vs 10年期公債實質利率 (TIPS Yield)', titleColor: 'text-teal-400',    rightKey: 'tips', rightName: '10年期公債實質利率 (%)', rightColor: '#2DD4BF', formatRight: false },
] as const;

const defaultTimeRanges: Record<string, number | 'Max'> = Object.fromEntries(
  chartDefs.map(d => [d.id, 20])
);

const rangeOptions: (number | 'Max')[] = [1, 3, 5, 10, 20, 50, 'Max'];

export default function StrategyPage() {
  const [data, setData] = useState<StrategyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRanges, setTimeRanges] = useState<Record<string, number | 'Max'>>(defaultTimeRanges);
  const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/data/strategy_data.json')
      .then(res => res.json())
      .then(json => { setData(json); setLoading(false); })
      .catch(err => { console.error('Error fetching strategy data:', err); setLoading(false); });
  }, []);

  // --- Handlers ---
  const makeHandleLegendClick = (chartId: string) => (e: any) => {
    const { dataKey } = e;
    if (dataKey) {
      const key = `${chartId}_${dataKey}`;
      setHiddenLines(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const isHidden = (chartId: string, dataKey: string) => !!hiddenLines[`${chartId}_${dataKey}`];

  // --- Formatters ---
  const formatYAxis = (tickItem: any) => {
    if (typeof tickItem === 'number') return tickItem.toFixed(4);
    return tickItem;
  };

  const formatTooltip = (value: any, name: any) => {
    if (typeof value !== 'number') return [value];
    const n = String(name ?? '');
    if (n.includes('CAPE') || n.includes('席勒')) return [value.toFixed(1)];
    if (n.includes('實質利率') || n.includes('TIPS') || n.includes('%')) return [`${value.toFixed(2)}%`];
    return [value.toFixed(4)];
  };

  const formatTooltipLabel = (label: any) => {
    const s = String(label ?? '');
    if (!s || !s.includes('-')) return s;
    const [year, month] = s.split('-');
    return `${year} 年 ${parseInt(month)} 月`;
  };

  // --- Memoized chart configs (#16: avoid recomputing all 6 on every render) ---
  const chartConfigs = useMemo(() => {
    const computeConfig = (chartId: string): ChartConfig => {
      const range = timeRanges[chartId];
      let fData = data;
      if (range !== 'Max' && data.length > 0) {
        const cutoffDate = new Date();
        cutoffDate.setFullYear(cutoffDate.getFullYear() - (range as number));
        const cutoffString = `${cutoffDate.getFullYear()}-${String(cutoffDate.getMonth() + 1).padStart(2, '0')}`;
        fData = data.filter(d => d.month >= cutoffString);
      }
      const finraValues = fData.map(d => d.finraToM0).filter(v => v !== undefined) as number[];
      let fMin = 0, fMax = 1;
      if (finraValues.length > 0) {
        fMin = Math.floor(Math.min(...finraValues) * 20) / 20;
        fMax = Math.ceil(Math.max(...finraValues) * 20) / 20;
        if (fMin >= fMax) fMax = fMin + 0.05;
      }
      const getOffset = (threshold: number) => {
        if (fMax === fMin) return 0;
        return Math.max(0, Math.min(1, (fMax - threshold) / (fMax - fMin)));
      };
      return { filteredData: fData, finraMin: fMin, finraMax: fMax, offRed: getOffset(0.40), offYellow: getOffset(0.30) };
    };
    return Object.fromEntries(chartDefs.map(d => [d.id, computeConfig(d.id)])) as Record<string, ChartConfig>;
  }, [data, timeRanges]);

  // --- Status computation ---
  const latestFinraValue = data.length > 0 ? data[data.length - 1].finraToM0 ?? null : null;
  let finraStatus = 'green';
  let finraStatusText = '常規水準 (< 0.30)';
  let actionText = '🟢 常態佈局：分批買入槓桿 ETF';

  if (latestFinraValue !== null) {
    if (latestFinraValue > 0.40) {
      finraStatus = 'red';
      finraStatusText = '極限槓桿 (> 0.40)';
      actionText = '🔴 警戒防守：分批賣出槓桿部位，轉入短期公債';
    } else if (latestFinraValue >= 0.30) {
      finraStatus = 'yellow';
      finraStatusText = '槓桿偏高 (0.30-0.40)';
      actionText = '🟡 觀望調整：停止加碼槓桿 ETF，持續買入 1 倍指數';
    }
  }

  let distanceText = '';
  if (latestFinraValue !== null) {
    if (latestFinraValue < 0.30) {
      distanceText = `距離黃燈 (0.30) 還有 ${((0.30 - latestFinraValue) / latestFinraValue * 100).toFixed(1)}% 空間`;
    } else if (latestFinraValue < 0.40) {
      distanceText = `距離紅燈 (0.40) 還有 ${((0.40 - latestFinraValue) / latestFinraValue * 100).toFixed(1)}% 空間`;
    } else {
      distanceText = `已超過紅燈閾值 ${((latestFinraValue - 0.40) / 0.40 * 100).toFixed(1)}%`;
    }
  }

  const lastUpdateMonth = data.length > 0 ? data[data.length - 1].month : null;
  const formatUpdateTime = (m: string | null) => {
    if (!m) return 'N/A';
    const [year, month] = m.split('-');
    return `${year} 年 ${parseInt(month)} 月`;
  };

  // --- Sub-components ---
  const StatusChip = ({ status, text }: { status: string; text: string }) => {
    const styles = {
      red:    { bg: 'bg-rose-500/10 border-rose-500/20',    dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse', txt: 'text-rose-400' },
      yellow: { bg: 'bg-yellow-400/10 border-yellow-400/20', dot: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]',            txt: 'text-yellow-400' },
      green:  { bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]',          txt: 'text-emerald-500' },
    };
    const s = styles[status as keyof typeof styles] ?? styles.green;
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${s.bg}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span>
        <span className={`${s.txt} font-bold text-sm leading-none`}>{text}</span>
      </div>
    );
  };

  const renderTimeSelector = (chartId: string) => (
    <div className="flex bg-foreground/5 p-1 rounded-full border border-foreground/10 overflow-x-auto hide-scrollbar w-fit ml-auto">
      {rangeOptions.map(range => (
        <button
          key={range}
          onClick={() => setTimeRanges(prev => ({ ...prev, [chartId]: range }))}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
            timeRanges[chartId] === range
              ? 'bg-violet-500 text-white shadow-md shadow-violet-500/25'
              : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
          }`}
        >
          {range === 'Max' ? 'Max' : `${range}年`}
        </button>
      ))}
    </div>
  );

  // --- Status color classes ---
  const statusClasses = {
    red:    { bg: 'bg-rose-500/10 border-rose-500/20',      glow: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]',    text: 'text-rose-400' },
    yellow: { bg: 'bg-yellow-400/10 border-yellow-400/20',    glow: 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.6)]', text: 'text-yellow-400' },
    green:  { bg: 'bg-emerald-500/10 border-emerald-500/20',  glow: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]', text: 'text-emerald-400' },
  };
  const sc = statusClasses[finraStatus as keyof typeof statusClasses] ?? statusClasses.green;

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
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

        {/* ========== SUMMARY CARD (#10) ========== */}
        {!loading && latestFinraValue !== null && (
          <div className={`mb-10 p-6 md:p-8 rounded-3xl border backdrop-blur-xl shadow-2xl ${sc.bg}`}>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-5">
                <div className={`w-5 h-5 rounded-full ${sc.glow} ${finraStatus === 'red' ? 'animate-pulse' : ''}`}></div>
                <div>
                  <p className="text-foreground/50 text-sm font-medium mb-1">FINRA / 流通貨幣 目前比值</p>
                  <p className={`text-4xl font-black tracking-tight ${sc.text}`}>{latestFinraValue.toFixed(4)}</p>
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-lg font-bold ${sc.text} mb-1`}>{finraStatusText}</p>
                <p className="text-foreground/60 text-sm">{distanceText}</p>
              </div>
              <div className="bg-background/30 rounded-2xl px-5 py-3 border border-foreground/5 max-w-sm">
                <p className="text-sm font-semibold text-foreground/80">{actionText}</p>
              </div>
            </div>
            {/* Last update (#13) */}
            <div className="mt-4 pt-3 border-t border-foreground/5 flex items-center gap-2 text-xs text-foreground/40">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              資料更新至：{formatUpdateTime(lastUpdateMonth)}
            </div>
          </div>
        )}

        {/* ========== CHARTS (#15: Refactored to map over chartDefs) ========== */}
        {loading ? (
          <div className="flex items-center justify-center h-64 mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-12 mb-16">
            {chartDefs.map((chart) => {
              const config = chartConfigs[chart.id];
              if (!config) return null;
              const gradientId = `finraGrad_${chart.id}`;
              return (
                <div key={chart.id} className="p-6 md:p-10 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-2xl hover:border-foreground/20 transition-all duration-300">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <h2 className={`text-xl md:text-2xl font-bold ${chart.titleColor} flex items-center flex-wrap gap-4`}>
                      <div className="flex items-center">
                        <span className="mr-3">📈</span> {chart.title}
                      </div>
                      <StatusChip status={finraStatus} text={finraStatusText} />
                    </h2>
                    {renderTimeSelector(chart.id)}
                  </div>
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={config.filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset={0} stopColor="#F43F5E" stopOpacity={1} />
                            <stop offset={config.offRed} stopColor="#F43F5E" stopOpacity={1} />
                            <stop offset={config.offRed} stopColor="#FACC15" stopOpacity={1} />
                            <stop offset={config.offYellow} stopColor="#FACC15" stopOpacity={1} />
                            <stop offset={config.offYellow} stopColor="#10B981" stopOpacity={1} />
                            <stop offset={1} stopColor="#10B981" stopOpacity={1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4B5563" opacity={0.3} vertical={false} />
                        <XAxis dataKey="month" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickMargin={15} minTickGap={40} axisLine={{ stroke: '#4B5563' }} />
                        <YAxis yAxisId="left" hide={isHidden(chart.id, 'finraToM0')} domain={[config.finraMin, config.finraMax]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                        <YAxis yAxisId="right" hide={isHidden(chart.id, chart.rightKey)} orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={chart.formatRight ? formatYAxis : undefined} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
                        <ReferenceLine yAxisId="left" y={0.30} stroke="#FACC15" strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.7} label={{ value: '0.30 黃燈', fill: '#FACC15', fontSize: 11, position: 'insideTopLeft' }} />
                        <ReferenceLine yAxisId="left" y={0.40} stroke="#F43F5E" strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.7} label={{ value: '0.40 紅燈', fill: '#F43F5E', fontSize: 11, position: 'insideTopLeft' }} />
                        <Tooltip formatter={formatTooltip} labelFormatter={formatTooltipLabel} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ fontWeight: 500 }} />
                        <Legend onClick={makeHandleLegendClick(chart.id)} wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }} iconType="circle" />
                        <Line yAxisId="left" hide={isHidden(chart.id, 'finraToM0')} type="monotone" dataKey="finraToM0" name="FINRA / 流通貨幣" stroke={`url(#${gradientId})`} strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                        <Line yAxisId="right" hide={isHidden(chart.id, chart.rightKey)} type="monotone" dataKey={chart.rightKey} name={chart.rightName} stroke={chart.rightColor} strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========== STRATEGY GUIDE ========== */}
        <div className="flex flex-col gap-8">
          <div className="p-6 md:p-8 rounded-3xl bg-violet-500/10 border border-violet-500/20 shadow-lg">
            <h3 className="text-2xl font-bold text-violet-300 mb-4 flex items-center">
              <span className="mr-2">💡</span> 實戰操作指南與回測回顧
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-foreground/80">
              <div>
                <h4 className="text-lg font-semibold text-emerald-400 mb-2">🟢 綠燈區間 (比值 &lt; 0.3)</h4>
                <p><strong>常態佈局：</strong>當市場去槓桿完成，將資金分為 10 份，連續 10 個月分批買入 <strong>50% QQQ / 50% TQQQ</strong>（或 100% TQQQ）。此時散戶槓桿低，是開啟多頭循環的絕佳時機。</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-amber-400 mb-2">🟡 黃燈區間 (比值 0.3 - 0.4)</h4>
                <p><strong>觀望調整：</strong>停止加碼槓桿 ETF (TQQQ/UPRO)，但<strong>持續買入 1 倍指數 (QQQ/SPY)</strong>。市場槓桿升高但尚未極端，此階段應降低風險敞口，用 1 倍指數維持市場曝險即可。已持有的槓桿部位不需急於賣出。</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-rose-400 mb-2">🔴 紅燈區間 (比值 &gt; 0.4)</h4>
                <p><strong>警戒防守：</strong>立刻中斷任何買進計畫，開始將手中所有槓桿與指數部位分 10 個月平均賣出。<strong>賣出後的資金轉入短期美國公債 ETF (如 SHV、BIL、SGOV)</strong>，在等待期間仍可賺取無風險利息收入。</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/80">
              <div>
                <h4 className="text-lg font-semibold text-amber-400 mb-2">⚡ 策略優缺點與歷史數據</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>優點：</strong>極佳的下檔保護。回測顯示，這套策略即便在 100% TQQQ 的測試下，能將最大回撤從 79.2% 降至 35.9%，避開如 2022 年的劇烈股災。</li>
                  <li><strong>缺點：</strong>融資餘額數據具落後性（月底結算），且可能產生假突破導致頻繁切換買賣計畫。</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-blue-400 mb-2">🛡️ 推薦輔助指標</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>NFCI & VIX：</strong>補足短期避險的即時指標，若資金環境緊縮或恐慌飆升，即使沒亮紅燈也應減碼。</li>
                  <li><strong>Sahm Rule (薩姆規則)：</strong>確認實質性衰退是否開始。若與高融資紅燈同時出現，殺傷力極大。</li>
                  <li><strong>紅燈資金停泊：</strong>推薦 <strong>SHV</strong> (iShares 短期公債)、<strong>BIL</strong> (SPDR 1-3月公債) 或 <strong>SGOV</strong> (iShares 0-3月公債)，年化利率約 4-5%，流動性極高且幾乎無波動。</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ========== BACKTEST: QQQ/TQQQ ========== */}
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
                    <th className="py-3 px-4 font-semibold text-blue-400">年化報酬 (CAGR)</th>
                    <th className="py-3 px-4 font-semibold text-rose-400">最大回撤</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">1. 無腦 All-in QQQ (buy & hold)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4">$1,491,823</td>
                    <td className="py-3 px-4 text-emerald-400">1391.82%</td>
                    <td className="py-3 px-4 text-emerald-400">18.2%</td>
                    <td className="py-3 px-4 text-rose-400">33.07%</td>
                  </tr>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">2. 無腦 All-in TQQQ</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4 text-amber-400">$27,325,976</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">27225.98%</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">41.5%</td>
                    <td className="py-3 px-4 text-rose-500 font-bold">79.20% (極高風險)</td>
                  </tr>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">3. 策略指標 (50% QQQ / 50% TQQQ)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4">$2,646,187</td>
                    <td className="py-3 px-4 text-emerald-400">2546.19%</td>
                    <td className="py-3 px-4 text-emerald-400">22.5%</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">26.03% (最安全)</td>
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">4. 策略指標 (100% TQQQ)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">$7,064,232</td>
                    <td className="py-3 px-4 text-emerald-400">6964.23%</td>
                    <td className="py-3 px-4 text-emerald-400">30.1%</td>
                    <td className="py-3 px-4 text-amber-400">35.94%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-foreground/60 leading-relaxed">
              * 備註：<strong>回測期間為 2010 年 2 月至 2026 年 4 月 (約 16.2 年，涵蓋多次重大牛熊循環)。</strong>回測以 $100,000 初始資金，綠燈區間分 10 個月等距買入，紅燈區間分 10 個月等距賣出。指標策略成功避開了單純持有 TQQQ 所面臨的接近 80% 毀滅性崩盤，以接近大盤 (QQQ) 的風險承受度，換取了數倍的超額報酬。
            </p>
          </div>

          {/* ========== BACKTEST: SPY/UPRO ========== */}
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
                    <th className="py-3 px-4 font-semibold text-emerald-400">年化報酬 (CAGR)</th>
                    <th className="py-3 px-4 font-semibold text-rose-400">最大回撤</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">1. 無腦 All-in SPY (buy & hold)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4">$669,205</td>
                    <td className="py-3 px-4 text-emerald-400">569.21%</td>
                    <td className="py-3 px-4 text-emerald-400">12.5%</td>
                    <td className="py-3 px-4 text-rose-400">24.80%</td>
                  </tr>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">2. 無腦 All-in UPRO</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4 text-amber-400">$6,950,871</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">6850.87%</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">30.0%</td>
                    <td className="py-3 px-4 text-rose-500 font-bold">62.76% (高風險)</td>
                  </tr>
                  <tr className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">3. 策略指標 (50% SPY / 50% UPRO)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4">$1,510,425</td>
                    <td className="py-3 px-4 text-emerald-400">1410.43%</td>
                    <td className="py-3 px-4 text-emerald-400">18.3%</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">34.96%</td>
                  </tr>
                  <tr className="hover:bg-foreground/5 transition-colors">
                    <td className="py-3 px-4 font-medium">4. 策略指標 (100% UPRO)</td>
                    <td className="py-3 px-4">$100,000</td>
                    <td className="py-3 px-4 text-emerald-400 font-bold">$3,694,658</td>
                    <td className="py-3 px-4 text-emerald-400">3594.66%</td>
                    <td className="py-3 px-4 text-emerald-400">25.0%</td>
                    <td className="py-3 px-4 text-amber-400">47.06%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-foreground/60 leading-relaxed">
              * 備註：<strong>回測期間為 2010 年 2 月至 2026 年 4 月 (約 16.2 年)。</strong>S&P 500 的波動度低於那斯達克。策略 50% SPY / 50% UPRO 的風險 (34.96%) 大致等同於單買大盤 QQQ 的風險 (33%)，卻帶來了 14 倍的報酬。
            </p>
          </div>

          {/* ========== RISK WARNINGS ========== */}
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

          {/* ========== STRATEGY LIMITATIONS & CONCERNS ========== */}
          <div className="p-6 md:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-lg">
            <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center">
              <span className="mr-2">⏳</span> 策略何時可能失效？(指標盲區與未來隱憂)
            </h3>
            <div className="space-y-6 text-foreground/80 text-sm">
              <p className="text-base font-medium text-amber-200 mb-4">
                雖然底層的「人性貪婪與恐懼循環」不變，但「開槓桿的工具」與「總經環境」正在發生劇變。我們必須認知到：<strong>紅燈代表絕對危險，但綠燈不代表絕對安全。</strong>此策略未來可能會遇到以下 4 大挑戰：
              </p>
              
              <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
                <h4 className="text-lg font-bold text-amber-300 mb-2">1. 投機工具轉移 (影子槓桿與衍生品)</h4>
                <p>FINRA 僅統計「傳統券商的保證金借款 (Margin Debt)」。但在現代金融市場，最瘋狂的投機往往發生在統計之外：散戶大量轉向 <strong>0DTE (末日選擇權)</strong> 或加密貨幣高倍數合約；而機構則使用投行提供的<strong>總收益交換 (Total Return Swaps，如 Archegos 爆倉事件)</strong>。這些自帶極高槓桿的工具完全不會計入 FINRA 數據。這可能導致市場已處於巨大泡沫邊緣，但 FINRA 比值看起來卻依然健康 (綠燈)，產生「假安全」的錯覺。</p>
              </div>

              <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
                <h4 className="text-lg font-bold text-amber-300 mb-2">2. 閾值失效：紅燈可能「永遠亮不起來」</h4>
                <p>過去十幾年的零利率時代 (ZIRP) 借款成本極低，散戶容易將融資推升至 0.4 (紅燈)。但若未來進入「長期高利率 (Higher for Longer)」環境，券商融資利率可能高達 8%~12%。因為借錢太貴，市場可能永遠無法將融資餘額推升到 0.4。這會導致股市因其他因素崩盤時，指標仍停在「綠燈」，失去高檔避險的作用。高利率時代可能需要手動下調紅燈閾值 (例如降至 0.35)。</p>
              </div>

              <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
                <h4 className="text-lg font-bold text-amber-300 mb-2">3. 流通貨幣 (M0) 的定義局限</h4>
                <p>策略使用 M0 作為分母來消除印鈔幻覺，但 M0 只是基礎貨幣 (實體紙鈔加準備金)。在量化寬鬆 (QE) 與銀行體系複雜化的今天，有時 M2 (廣義貨幣供應量) 甚至全球央行流動性指標更能代表「在金融市場流竄的熱錢」。如果 M0 因為聯準會的技術性操作 (如準備金規定改變) 而產生劇烈波動，可能會讓分母失真，導致比值出現假訊號。</p>
              </div>

              <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
                <h4 className="text-lg font-bold text-amber-300 mb-2">4. 資金成本侵蝕：槓桿 ETF 的內建吸血鬼</h4>
                <p>3 倍槓桿 ETF (如 TQQQ) 是向銀行借入 2 份資金來操作。當無風險利率來到 5% 時，TQQQ 每年光是「付利息」就會內扣約 10% ~ 12% 的淨值！如果未來大盤只溫和上漲 4%，TQQQ 反而會因為利息與波動耗損而虧錢，導致策略效率大減。</p>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-500/20">
                <h4 className="text-xl font-bold text-amber-300 mb-4 flex items-center">
                  <span className="mr-2">💡</span> 面對未來盲區的「策略進化建議」
                </h4>
                <ul className="list-decimal list-inside space-y-3 text-sm">
                  <li><strong>多重指標交叉驗證：</strong>不要單靠 FINRA 指標。請隨時搭配 Dashboard 上的 <strong>薩姆規則 (Sahm Rule)</strong> 確認實體衰退，並監控 <strong>VIX 與 NFCI (金融條件指數)</strong> 以防範突發的流動性枯竭。</li>
                  <li><strong>加入「實質利率」作為雙重濾網：</strong>將 <strong>10 年期公債實質利率 (TIPS Yield)</strong> 納入考量。若實質利率突破 2% (資金極度昂貴)，即使 FINRA 仍是綠燈，也不該重壓 3 倍槓桿。</li>
                  <li><strong>降檔位 (降低槓桿倍數)：</strong>在高利率環境下，不要執著於 3 倍的 TQQQ 或 UPRO，改用 <strong>2 倍槓桿</strong> 的 QLD 或 SSO。2 倍槓桿內部借貸成本只有 1 份，耗損大幅減少，長期績效往往反超 3 倍槓桿。</li>
                  <li><strong>從「長抱」轉為「波段操作」：</strong>在低利率時代您可以「綠燈買入後安心抱 3 年」；但在高利率時代市場容錯率極低，應縮短操作週期。只要獲利達到設定的滿足點，就主動將槓桿 ETF 降轉回 1 倍的原型指數鎖住利潤。</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

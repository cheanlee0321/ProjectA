import { ChartDefinition } from '../types';

export const chartDefs: readonly ChartDefinition[] = [
  { id: 'chart1', title: 'FINRA vs S&P 500', titleColor: 'text-blue-400', rightKey: 'sp500ToM0', rightName: 'S&P 500 / 流通貨幣', rightColor: '#3B82F6', formatRight: true },
  { id: 'chart6', title: 'FINRA vs UPRO', titleColor: 'text-sky-400', rightKey: 'uproToM0', rightName: 'UPRO / 流通貨幣', rightColor: '#38BDF8', formatRight: true },
  { id: 'chart2', title: 'FINRA vs QQQ', titleColor: 'text-emerald-400', rightKey: 'qqqToM0', rightName: 'QQQ / 流通貨幣', rightColor: '#10B981', formatRight: true },
  { id: 'chart3', title: 'FINRA vs TQQQ', titleColor: 'text-amber-400', rightKey: 'tqqqToM0', rightName: 'TQQQ / 流通貨幣', rightColor: '#F59E0B', formatRight: true },
  { id: 'chart4', title: 'FINRA vs 席勒本益比 (CAPE)', titleColor: 'text-fuchsia-400', rightKey: 'cape', rightName: '席勒本益比 (CAPE)', rightColor: '#D946EF', formatRight: false },
  { id: 'chart5', title: 'FINRA vs 10年期公債實質利率 (TIPS Yield)', titleColor: 'text-teal-400', rightKey: 'tips', rightName: '10年期公債實質利率 (%)', rightColor: '#2DD4BF', formatRight: false },
  { id: 'chart8', title: 'FINRA vs 動態閾值 (5年滾動 Z-Score)', titleColor: 'text-rose-400', leftKey: 'finraToM0', leftName: 'FINRA / 流通貨幣', rightKey: 'finraToM0_upperBand', rightName: '動態警示線 (Z-Score = +1.5)', rightColor: '#F43F5E', rightYAxisId: 'left', rightDasharray: '4 4', extraLineKey: 'finraToM0_lowerBand', extraLineName: '動態抄底線 (Z-Score = -1.5)', extraLineColor: '#10B981', extraLineDasharray: '4 4', formatRight: true },
  { id: 'chart9', title: '解法 A：淨流動性 + 5年滾動 Z-Score 通道', titleColor: 'text-indigo-400', leftKey: 'finraToNetLiq', leftName: 'FINRA / 淨流動性', rightKey: 'finraToNetLiq_upperBand', rightName: '警示線 (Z-Score = +1.5)', rightColor: '#F43F5E', rightYAxisId: 'left', rightDasharray: '4 4', extraLineKey: 'finraToNetLiq_lowerBand', extraLineName: '抄底線 (Z-Score = -1.5)', extraLineColor: '#10B981', extraLineDasharray: '4 4', formatRight: true },
  { id: 'chart10', title: '解法 B：流通貨幣 + 10年歷史百分位通道', titleColor: 'text-amber-400', leftKey: 'finraToM0', leftName: 'FINRA / 流通貨幣', rightKey: 'finraToM0_p95_10y', rightName: '警示線 (前 5% 歷史高點)', rightColor: '#F43F5E', rightYAxisId: 'left', rightDasharray: '4 4', extraLineKey: 'finraToM0_p05_10y', extraLineName: '抄底線 (後 5% 歷史低點)', extraLineColor: '#10B981', extraLineDasharray: '4 4', formatRight: true },
];

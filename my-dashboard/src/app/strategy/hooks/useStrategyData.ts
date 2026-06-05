import { useState, useEffect, useMemo } from 'react';
import { StrategyData, ChartConfig } from '../types';
import { chartDefs } from '../data/chartDefs';

export type FinraStatus = 'green' | 'yellow' | 'red';

export function useStrategyData() {
  const [data, setData] = useState<StrategyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const defaultTimeRanges: Record<string, number | 'Max'> = Object.fromEntries(
    chartDefs.map(d => [d.id, 20])
  );
  const [timeRanges, setTimeRanges] = useState<Record<string, number | 'Max'>>(defaultTimeRanges);

  useEffect(() => {
    fetch('/data/strategy_data.json')
      .then(res => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching strategy data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
      const cDef = chartDefs.find(d => d.id === chartId);
      const leftKey = cDef?.leftKey || 'finraToM0';
      const finraValues = fData.map(d => d[leftKey as keyof StrategyData] as number).filter(v => v !== undefined);
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
      const tYellow = cDef?.thresholdYellow || 0.30;
      const tRed = cDef?.thresholdRed || 0.40;
      return { filteredData: fData, finraMin: fMin, finraMax: fMax, offRed: getOffset(tRed), offYellow: getOffset(tYellow) };
    };
    return Object.fromEntries(chartDefs.map(d => [d.id, computeConfig(d.id)])) as Record<string, ChartConfig>;
  }, [data, timeRanges]);

  const latestFinraValue = data.length > 0 ? data[data.length - 1].finraToM0 ?? null : null;
  const lastUpdateMonth = data.length > 0 ? data[data.length - 1].month : null;

  let finraStatus: FinraStatus = 'green';
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

  const handleTimeRangeChange = (chartId: string, range: number | 'Max') => {
    setTimeRanges(prev => ({ ...prev, [chartId]: range }));
  };

  return {
    data,
    loading,
    error,
    timeRanges,
    handleTimeRangeChange,
    chartConfigs,
    latestFinraValue,
    lastUpdateMonth,
    finraStatus,
    finraStatusText,
    actionText,
    distanceText,
  };
}

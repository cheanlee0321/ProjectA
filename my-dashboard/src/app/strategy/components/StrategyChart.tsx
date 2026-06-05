import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  TooltipProps
} from 'recharts';
import { ChartDefinition, ChartConfig } from '../types';
import { FinraStatus } from '../hooks/useStrategyData';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface StrategyChartProps {
  chartDef: ChartDefinition;
  config: ChartConfig;
  finraStatus: FinraStatus;
  finraStatusText: string;
  timeRange: number | 'Max';
  onTimeRangeChange: (chartId: string, range: number | 'Max') => void;
}

const rangeOptions: (number | 'Max')[] = [1, 3, 5, 10, 20, 50, 'Max'];

export function StrategyChart({
  chartDef,
  config,
  finraStatus,
  finraStatusText,
  timeRange,
  onTimeRangeChange
}: StrategyChartProps) {
  const [hiddenLines, setHiddenLines] = useState<Record<string, boolean>>({});

  const handleLegendClick = (e: any) => {
    const { dataKey } = e;
    if (dataKey) {
      const key = `${chartDef.id}_${dataKey}`;
      setHiddenLines(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const isHidden = (dataKey: string) => !!hiddenLines[`${chartDef.id}_${dataKey}`];

  const formatYAxis = (tickItem: number | string) => {
    if (typeof tickItem === 'number') return tickItem.toFixed(4);
    return tickItem;
  };

  const formatTooltip = (value: ValueType | undefined, name: NameType | undefined): [string, string] => {
    if (typeof value !== 'number') return [String(value ?? ''), String(name ?? '')];
    const n = String(name ?? '');
    if (n.includes('CAPE') || n.includes('席勒')) return [value.toFixed(1), n];
    if (n.includes('實質利率') || n.includes('TIPS') || n.includes('%')) return [`${value.toFixed(2)}%`, n];
    return [value.toFixed(4), n];
  };

  const formatTooltipLabel = (label: any) => {
    const s = String(label ?? '');
    if (!s || !s.includes('-')) return s;
    const [year, month] = s.split('-');
    return `${year} 年 ${parseInt(month, 10)} 月`;
  };

  const gradientId = `finraGrad_${chartDef.id}`;
  const leftKey = chartDef.leftKey || 'finraToM0';
  const leftName = chartDef.leftName || 'FINRA / 流通貨幣';
  const tYellow = chartDef.thresholdYellow || 0.30;
  const tRed = chartDef.thresholdRed || 0.40;

  const StatusChip = ({ status, text }: { status: FinraStatus; text: string }) => {
    const styles = {
      red: { bg: 'bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse', txt: 'text-rose-400' },
      yellow: { bg: 'bg-yellow-400/10 border-yellow-400/20', dot: 'bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]', txt: 'text-yellow-400' },
      green: { bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]', txt: 'text-emerald-500' },
    };
    const s = styles[status] ?? styles.green;
    return (
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${s.bg}`}>
        <span className={`w-2.5 h-2.5 rounded-full ${s.dot}`}></span>
        <span className={`${s.txt} font-bold text-sm leading-none`}>{text}</span>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-10 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 shadow-2xl hover:border-foreground/20 transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className={`text-xl md:text-2xl font-bold ${chartDef.titleColor} flex items-center flex-wrap gap-4`}>
          <div className="flex items-center">
            <span className="mr-3">📈</span> {chartDef.title}
          </div>
          <StatusChip status={finraStatus} text={finraStatusText} />
        </h2>
        <div className="flex bg-foreground/5 p-1 rounded-full border border-foreground/10 overflow-x-auto hide-scrollbar w-fit ml-auto">
          {rangeOptions.map(range => (
            <button
              key={range}
              onClick={() => onTimeRangeChange(chartDef.id, range)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${timeRange === range
                ? 'bg-violet-500 text-white shadow-md shadow-violet-500/25'
                : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5'
                }`}
            >
              {range === 'Max' ? 'Max' : `${range}年`}
            </button>
          ))}
        </div>
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
            <YAxis yAxisId="left" hide={isHidden(leftKey)} domain={[config.finraMin, config.finraMax]} stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={formatYAxis} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
            {(!chartDef.rightYAxisId || chartDef.rightYAxisId === 'right') && (
              <YAxis yAxisId="right" hide={isHidden(chartDef.rightKey)} orientation="right" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} tickFormatter={chartDef.formatRight ? formatYAxis : undefined} axisLine={{ stroke: '#4B5563' }} tickMargin={10} width={80} />
            )}
            <ReferenceLine yAxisId="left" y={tYellow} stroke="#FACC15" strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.7} label={{ value: `${tYellow} 黃燈`, fill: '#FACC15', fontSize: 11, position: 'insideTopLeft' }} />
            <ReferenceLine yAxisId="left" y={tRed} stroke="#F43F5E" strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.7} label={{ value: `${tRed} 紅燈`, fill: '#F43F5E', fontSize: 11, position: 'insideTopLeft' }} />
            <Tooltip formatter={formatTooltip} labelFormatter={formatTooltipLabel} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.95)', borderColor: '#334155', borderRadius: '12px' }} itemStyle={{ fontWeight: 500 }} />
            <Legend onClick={handleLegendClick} wrapperStyle={{ paddingTop: '20px', cursor: 'pointer' }} iconType="circle" />
            <Line yAxisId="left" hide={isHidden(leftKey)} type="monotone" dataKey={leftKey} name={leftName} stroke={`url(#${gradientId})`} strokeWidth={3} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
            <Line yAxisId={chartDef.rightYAxisId || 'right'} hide={isHidden(chartDef.rightKey)} type="monotone" dataKey={chartDef.rightKey} name={chartDef.rightName} stroke={chartDef.rightColor} strokeWidth={3} strokeDasharray={chartDef.rightDasharray} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
            {chartDef.extraLineKey && (
              <Line yAxisId="left" hide={isHidden(chartDef.extraLineKey)} type="monotone" dataKey={chartDef.extraLineKey} name={chartDef.extraLineName} stroke={chartDef.extraLineColor} strokeWidth={3} strokeDasharray={chartDef.extraLineDasharray} dot={false} activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }} />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

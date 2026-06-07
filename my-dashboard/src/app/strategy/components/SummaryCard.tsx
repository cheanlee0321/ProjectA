import { FinraStatus } from '../hooks/useStrategyData';

interface SummaryCardProps {
  latestFinraValue: number;
  finraStatus: FinraStatus;
  finraStatusText: string;
  distanceText: string;
  actionText: string;
  lastUpdateMonth: string | null;
}

const statusClasses = {
  red: { bg: 'bg-rose-500/10 border-rose-500/20', glow: 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]', text: 'text-rose-400' },
  yellow: { bg: 'bg-yellow-400/10 border-yellow-400/20', glow: 'bg-yellow-400 shadow-[0_0_12px_rgba(250,204,21,0.6)]', text: 'text-yellow-400' },
  green: { bg: 'bg-emerald-500/10 border-emerald-500/20', glow: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]', text: 'text-emerald-400' },
};

const formatUpdateTime = (m: string | null) => {
  if (!m) return 'N/A';
  const [year, month] = m.split('-');
  return `${year} 年 ${parseInt(month)} 月`;
};

export function SummaryCard({
  latestFinraValue,
  finraStatus,
  finraStatusText,
  distanceText,
  actionText,
  lastUpdateMonth
}: SummaryCardProps) {
  const sc = statusClasses[finraStatus] ?? statusClasses.green;

  return (
    <div className={`mb-10 p-6 md:p-8 rounded-3xl border backdrop-blur-xl shadow-2xl ${sc.bg}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className={`w-5 h-5 rounded-full ${sc.glow} ${finraStatus === 'red' ? 'animate-pulse' : ''}`}></div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-foreground/50 text-sm font-medium">FINRA / 流通貨幣 目前比值</p>
              <span className="inline-block px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 text-[10px] sm:text-xs font-bold border border-violet-500/30">
                主燈號
              </span>
            </div>
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
      <div className="mt-4 pt-3 border-t border-foreground/5 flex items-center gap-2 text-xs text-foreground/40">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        資料更新至：{formatUpdateTime(lastUpdateMonth)}
      </div>
    </div>
  );
}

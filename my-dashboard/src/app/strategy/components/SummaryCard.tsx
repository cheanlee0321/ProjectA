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

      {/* Macro & Veto Filters Tips */}
      <div className="mt-8 pt-6 border-t border-foreground/10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background/40 p-4 rounded-xl border border-foreground/5 shadow-inner">
          <div className="text-xs font-bold text-sky-400 mb-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            雙重確認建議 (操作濾網)
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed">
            建議當 FINRA / M0 亮紅燈且 CAPE &gt; 30 時再執行清倉賣出，以減少洗盤。但若 FINRA / M0 突破極端值 (大於 0.45)，則無視估值強制清倉。
          </div>
        </div>
        <div className="bg-background/40 p-4 rounded-xl border border-foreground/5 shadow-inner">
          <div className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            10年期公債實質利率
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed">
            作為真實借貸成本的參考。當實質利率過高時，高估值的風險資產將面臨嚴重的流動性壓力。
          </div>
        </div>
        <div className="bg-background/40 p-4 rounded-xl border border-foreground/5 shadow-inner">
          <div className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            薩姆規則 (Sahm Rule)
          </div>
          <div className="text-sm text-foreground/80 leading-relaxed">
            作為總體經濟是否已經步入實質衰退的確認指標。當其觸發時，通常代表硬著陸風險急遽升高。
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-foreground/5 flex items-center justify-between text-xs text-foreground/40">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          資料更新至：{formatUpdateTime(lastUpdateMonth)}
        </div>
      </div>
    </div>
  );
}

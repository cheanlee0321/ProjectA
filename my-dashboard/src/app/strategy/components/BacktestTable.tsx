import { BacktestTableData } from '../types';

interface BacktestTableProps {
  data: BacktestTableData;
}

export function BacktestTable({ data }: BacktestTableProps) {
  return (
    <div className={`mb-12 p-6 md:p-8 rounded-3xl ${data.bgColor} border ${data.borderColor} shadow-lg`}>
      <h3 className={`text-2xl font-bold ${data.titleColor} mb-6 flex items-center`}>
        <span className="mr-2">{data.titleIcon}</span> {data.title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-foreground/80 border-collapse whitespace-nowrap">
          <caption className="sr-only">{data.title}</caption>
          <thead>
            <tr className={`border-b ${data.borderColor}`}>
              <th className={`py-3 px-4 font-semibold ${data.titleColor}`}>策略情境</th>
              <th className={`py-3 px-4 font-semibold ${data.titleColor}`}>初始資金</th>
              <th className={`py-3 px-4 font-semibold ${data.titleColor}`}>最終資產</th>
              <th className={`py-3 px-4 font-semibold ${data.titleColor}`}>總報酬率</th>
              <th className={`py-3 px-4 font-semibold ${data.titleColor}`}>年化報酬 (CAGR)</th>
              <th className="py-3 px-4 font-semibold text-rose-400">最大回撤</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, idx) => (
              <tr key={idx} className={`border-b transition-colors ${
                row.isRecommended ? 'bg-amber-500/10 border-amber-500/30 shadow-[inset_0_0_12px_rgba(245,158,11,0.1)]' : 'border-foreground/5 hover:bg-foreground/5'
              }`}>
                <td className="py-3 px-4 font-medium flex items-center gap-2">
                  {row.scenario}
                  {row.isRecommended && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">⭐ 推薦</span>}
                </td>
                <td className="py-3 px-4">{row.initial}</td>
                <td className={`py-3 px-4 ${row.finalColor ?? ''}`}>{row.final}</td>
                <td className={`py-3 px-4 ${row.totalReturnColor} ${row.totalReturnBold ? 'font-bold' : ''}`}>{row.totalReturn}</td>
                <td className={`py-3 px-4 ${row.cagrColor} ${row.cagrBold ? 'font-bold' : ''}`}>{row.cagr}</td>
                <td className={`py-3 px-4 ${row.maxDrawdownColor} ${row.maxDrawdownBold ? 'font-bold' : ''}`}>{row.maxDrawdown}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-foreground/60 leading-relaxed whitespace-pre-wrap">
        {data.note}
      </p>
      {data.conclusion && (
        <div className="mt-6 p-4 rounded-xl bg-background/40 border border-foreground/10 text-center shadow-sm">
          <p className="text-base font-bold text-foreground/90">
            {data.conclusion}
          </p>
        </div>
      )}
    </div>
  );
}

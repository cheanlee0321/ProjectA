import { delayedSimulationData } from '../data/staticData';

export function DelayedSimulation() {
  const data = delayedSimulationData;

  return (
    <div id="guide-delayed-simulation" className={`mb-12 p-6 md:p-8 rounded-3xl ${data.bgColor} border ${data.borderColor} shadow-lg scroll-mt-24`}>
      <h3 className={`text-2xl font-bold ${data.titleColor} mb-6 flex items-center`}>
        <span className="mr-2">{data.titleIcon}</span> {data.title}
      </h3>
      <div className="space-y-6 text-foreground/80 text-sm">
        <p className={`text-base font-medium text-indigo-200`}>
          {data.description}
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap bg-background/40 rounded-xl overflow-hidden">
            <caption className="sr-only">{data.title}</caption>
            <thead>
              <tr className="border-b border-indigo-500/20 bg-indigo-500/5">
                <th className="py-3 px-4 font-semibold text-indigo-300">策略情境</th>
                <th className="py-3 px-4 font-semibold text-indigo-300 text-center border-l border-indigo-500/20">理想狀態 (0個月延遲)</th>
                <th className="py-3 px-4 font-semibold text-indigo-300 text-center border-l border-indigo-500/20">貼近現實 (1個月延遲)</th>
                <th className="py-3 px-4 font-semibold text-indigo-300 text-center border-l border-indigo-500/20">極端延遲 (2個月延遲)</th>
              </tr>
              <tr className="border-b border-indigo-500/20 bg-indigo-500/5 text-xs">
                <th className="py-2 px-4 text-indigo-400"></th>
                <th className="py-2 px-4 text-emerald-400/80 text-center border-l border-indigo-500/20">總報酬 / 最大回撤</th>
                <th className="py-2 px-4 text-emerald-400/80 text-center border-l border-indigo-500/20">總報酬 / 最大回撤</th>
                <th className="py-2 px-4 text-emerald-400/80 text-center border-l border-indigo-500/20">總報酬 / 最大回撤</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row, idx) => (
                <tr key={idx} className={`border-b border-foreground/5 hover:bg-foreground/5 text-sm ${row.isItalic ? 'bg-background/60' : ''}`}>
                  <td className={`py-3 px-4 font-medium ${row.isItalic ? 'text-foreground/60 italic' : 'text-foreground/80'}`}>{row.scenario}</td>
                  <td className="py-3 px-4 text-center border-l border-indigo-500/20">
                    <span className={`${row.delay0.totalReturnColor || ''} ${row.delay0.isBold ? 'font-bold' : ''}`}>{row.delay0.totalReturn}</span> / <span className={`${row.delay0.maxDrawdownColor || ''} ${row.delay0.isBold ? 'font-bold' : ''}`}>{row.delay0.maxDrawdown}</span>
                  </td>
                  <td className="py-3 px-4 text-center border-l border-indigo-500/20">
                    <span className={`${row.delay1.totalReturnColor || ''} ${row.delay1.isBold ? 'font-bold' : ''}`}>{row.delay1.totalReturn}</span> / <span className={`${row.delay1.maxDrawdownColor || ''} ${row.delay1.isBold ? 'font-bold' : ''}`}>{row.delay1.maxDrawdown}</span>
                  </td>
                  <td className="py-3 px-4 text-center border-l border-indigo-500/20">
                    <span className={`${row.delay2.totalReturnColor || ''} ${row.delay2.isBold ? 'font-bold' : ''}`}>{row.delay2.totalReturn}</span> / <span className={`${row.delay2.maxDrawdownColor || ''} ${row.delay2.isBold ? 'font-bold' : ''}`}>{row.delay2.maxDrawdown}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-indigo-950/30 p-5 rounded-2xl border border-indigo-500/10">
          <h4 className="text-lg font-bold text-indigo-300 mb-2">{data.conclusionTitle}</h4>
          <ul className="list-disc list-inside space-y-2">
            {data.conclusionItems.map((item, idx) => {
              const colonIndex = item.indexOf('：');
              if (colonIndex !== -1) {
                return (
                  <li key={idx}>
                    <strong>{item.substring(0, colonIndex + 1)}</strong>
                    {item.substring(colonIndex + 1)}
                  </li>
                );
              }
              return <li key={idx}>{item}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

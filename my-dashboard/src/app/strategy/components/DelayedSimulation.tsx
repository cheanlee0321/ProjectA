export function DelayedSimulation() {
  return (
    <div className="mb-12 p-6 md:p-8 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 shadow-lg">
      <h3 className="text-2xl font-bold text-indigo-400 mb-6 flex items-center">
        <span className="mr-2">⏱️</span> 真實世界模擬：數據落後 (延遲交易) 的影響
      </h3>
      <div className="space-y-6 text-foreground/80 text-sm">
        <p className="text-base font-medium text-indigo-200">
          FINRA 的融資餘額數據約有 3~4 週的公布落後。為了模擬最真實的交易情境，我們強制將交易執行時間點延遲 1 個月與 2 個月進行壓力測試 (以 100% TQQQ 為例)。
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap bg-background/40 rounded-xl overflow-hidden">
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
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm bg-background/60">
                <td className="py-3 px-4 font-medium text-foreground/60 italic">無腦 All-in QQQ (Buy & Hold)</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70">1113%</span> / <span className="text-rose-400/70">32.58%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70">1113%</span> / <span className="text-rose-400/70">32.58%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70">1113%</span> / <span className="text-rose-400/70">32.58%</span></td>
              </tr>
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm bg-background/60">
                <td className="py-3 px-4 font-medium text-foreground/60 italic">無腦 All-in TQQQ</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70 font-bold">8684%</span> / <span className="text-rose-500/70">79.08%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70 font-bold">8684%</span> / <span className="text-rose-500/70">79.08%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70 font-bold">8684%</span> / <span className="text-rose-500/70">79.08%</span></td>
              </tr>
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm">
                <td className="py-3 px-4 font-medium text-foreground/80">策略 100% QQQ</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">477%</span> / <span className="text-rose-400">11.15%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">430%</span> / <span className="text-rose-400">11.15%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">395%</span> / <span className="text-rose-400">11.15%</span></td>
              </tr>
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm">
                <td className="py-3 px-4 font-medium text-foreground/80">50% QQQ / 50% TQQQ</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400 font-bold">2546%</span> / <span className="text-amber-400">26.03%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">2096%</span> / <span className="text-amber-400">25.88%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">1815%</span> / <span className="text-amber-400">25.79%</span></td>
              </tr>
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm">
                <td className="py-3 px-4 font-medium text-foreground/80">100% TQQQ</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400 font-bold">6964%</span> / <span className="text-amber-400">35.94%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400 font-bold">5445%</span> / <span className="text-amber-400">35.94%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400 font-bold">4522%</span> / <span className="text-amber-400">35.94%</span></td>
              </tr>
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm bg-background/60">
                <td className="py-3 px-4 font-medium text-foreground/60 italic">無腦 All-in SPY (Buy & Hold)</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70">569%</span> / <span className="text-rose-400/70">24.80%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70">569%</span> / <span className="text-rose-400/70">24.80%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70">569%</span> / <span className="text-rose-400/70">24.80%</span></td>
              </tr>
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm bg-background/60">
                <td className="py-3 px-4 font-medium text-foreground/60 italic">無腦 All-in UPRO</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70 font-bold">6850%</span> / <span className="text-rose-500/70">62.76%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70 font-bold">6850%</span> / <span className="text-rose-500/70">62.76%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20 text-foreground/60"><span className="text-emerald-400/70 font-bold">6850%</span> / <span className="text-rose-500/70">62.76%</span></td>
              </tr>
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm">
                <td className="py-3 px-4 font-medium text-foreground/80">策略 100% SPY</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">301%</span> / <span className="text-rose-400">17.06%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">280%</span> / <span className="text-rose-400">17.06%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">266%</span> / <span className="text-rose-400">17.06%</span></td>
              </tr>
              <tr className="border-b border-foreground/5 hover:bg-foreground/5 text-sm">
                <td className="py-3 px-4 font-medium text-foreground/80">50% SPY / 50% UPRO</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">1381%</span> / <span className="text-amber-400">34.87%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">1215%</span> / <span className="text-amber-400">34.74%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">1115%</span> / <span className="text-amber-400">34.68%</span></td>
              </tr>
              <tr className="hover:bg-foreground/5 text-sm">
                <td className="py-3 px-4 font-medium text-foreground/80">100% UPRO</td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">3512%</span> / <span className="text-amber-400">47.06%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">2993%</span> / <span className="text-amber-400">47.06%</span></td>
                <td className="py-3 px-4 text-center border-l border-indigo-500/20"><span className="text-emerald-400">2686%</span> / <span className="text-amber-400">47.06%</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-indigo-950/30 p-5 rounded-2xl border border-indigo-500/10">
          <h4 className="text-lg font-bold text-indigo-300 mb-2">深度數據解讀：保命機制依然 100% 有效</h4>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>暴利會縮水：</strong>晚 1~2 個月進出場，會錯失 V 型反轉最甜美的初升段，或多吃一點初跌段的傷害，導致總報酬下降約 20%~30%。</li>
            <li><strong>防禦力毫髮無傷：</strong>即使晚了 2 個月才發現警報並撤退，最大回撤依然穩穩控制在 35.94%！因為真正的崩盤 (如 2008、2022) 都是長達一年以上的凌遲。只要能躲過主跌段，就能避開 80% 的毀滅性打擊。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useStrategyData } from './hooks/useStrategyData';
import { SummaryCard } from './components/SummaryCard';
import { StrategyChart } from './components/StrategyChart';
import { LiquidityExplanation } from './components/LiquidityExplanation';
import { StrategyGuide } from './components/StrategyGuide';
import { BacktestTable } from './components/BacktestTable';
import { RiskWarnings } from './components/RiskWarnings';
import { StrategyLimitations } from './components/StrategyLimitations';
import { MacroAssumptions } from './components/MacroAssumptions';
import { DelayedSimulation } from './components/DelayedSimulation';
import { UnsuitableEtfWarning } from './components/UnsuitableEtfWarning';
import { ThresholdHeatmap } from './components/ThresholdHeatmap';
import { SpeedSensitivity } from './components/SpeedSensitivity';
import { qqqBacktestData, spyBacktestData, qqqBacktestData2010, spyBacktestData2010 } from './data/staticData';
import { chartDefs } from './data/chartDefs';

export default function StrategyPage() {
  const {
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
  } = useStrategyData();

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
          <div className="text-foreground/70 text-lg max-w-4xl space-y-4 leading-relaxed">
            <p>
              本策略的核心邏輯是將「FINRA 融資餘額」以「實體流通貨幣（或淨流動性）M0」進行標準化。將散戶的投機槓桿，
              以實體流動性進行標準化，從而消除「印鈔幻覺」，藉此作為市場狂熱程度的客觀參考指標。
              它本質上是一種流動性調整後的情緒指標 (Liquidity-Adjusted Sentiment Indicator)，
              類似於機構投資者使用的「信用脈衝」或「淨流動性驅動因子」。
              透過與底層流動性的對比，我們能評估資產價格究竟是反映了真實的價值增長，還是由過度的借貸擴張所推動。
            </p>
            <p>
              策略的基礎假設在於：當投機風氣狂熱、槓桿水位過高時，市場蘊含的崩潰風險最大；反之，當投機風氣低迷時，長期佈局的風險則相對較低。
              我們依據此燈號指標進行擇時操作，在相對安全時買入並持有槓桿部位，並透過「1 倍原型 ETF」與「3 倍槓桿 ETF」的資金比例調配，打造符合自身風險承受度與報酬期望的最佳投資組合。
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="sticky top-0 z-50 mb-10 py-3 bg-background/90 backdrop-blur-xl border-b border-white/5 flex overflow-x-auto hide-scrollbar gap-6 md:gap-8 -mx-6 px-6 md:mx-0 md:px-0">
          <a href="#summary" className="text-sm font-bold text-foreground/70 hover:text-white whitespace-nowrap transition-colors">📊 信號總覽</a>
          <a href="#charts" className="text-sm font-bold text-foreground/70 hover:text-white whitespace-nowrap transition-colors">📈 圖表分析</a>
          <a href="#liquidity-explanation" className="text-sm font-bold text-foreground/70 hover:text-white whitespace-nowrap transition-colors">🏦 流動性指標</a>
          <a href="#guide-rules" className="text-sm font-bold text-foreground/70 hover:text-white whitespace-nowrap transition-colors">💡 操作指南</a>
          <a href="#backtests" className="text-sm font-bold text-foreground/70 hover:text-white whitespace-nowrap transition-colors">🧪 歷史回測</a>
          <a href="#risks" className="text-sm font-bold text-foreground/70 hover:text-white whitespace-nowrap transition-colors">⚠️ 風險與假設</a>
          <a href="#advanced" className="text-sm font-bold text-foreground/70 hover:text-white whitespace-nowrap transition-colors">🔬 進階實驗</a>
        </div>

        {error && (
          <div className="mb-10 p-6 rounded-3xl bg-rose-500/10 border border-rose-500/20 shadow-lg text-center">
            <p className="text-rose-400 font-semibold mb-2">發生錯誤，無法載入策略數據</p>
            <p className="text-rose-400/60 text-sm">{error}</p>
          </div>
        )}

        {/* SUMMARY CARD */}
        <div id="summary" className="scroll-mt-24">
          {!loading && !error && latestFinraValue !== null && (
            <SummaryCard
              latestFinraValue={latestFinraValue}
              finraStatus={finraStatus}
              finraStatusText={finraStatusText}
              distanceText={distanceText}
              actionText={actionText}
              lastUpdateMonth={lastUpdateMonth}
            />
          )}
        </div>

        {/* CHARTS */}
        {loading ? (
          <div className="flex items-center justify-center h-64 mb-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div>
          </div>
        ) : !error && (
          <div id="charts" className="w-full flex flex-col gap-12 mb-16 scroll-mt-24">
            {chartDefs.map((chart) => {
              const config = chartConfigs[chart.id];
              if (!config) return null;
              return (
                <StrategyChart
                  key={chart.id}
                  chartDef={chart}
                  config={config}
                  finraStatus={finraStatus}
                  finraStatusText={finraStatusText}
                  timeRange={timeRanges[chart.id]}
                  onTimeRangeChange={handleTimeRangeChange}
                />
              );
            })}
          </div>
        )}

        {/* STATIC CONTENT BLOCKS */}
        <LiquidityExplanation />
        <StrategyGuide />

        <div id="backtests" className="scroll-mt-24">
          <BacktestTable data={qqqBacktestData} />
          <BacktestTable data={spyBacktestData} />
          <BacktestTable data={qqqBacktestData2010} />
          <BacktestTable data={spyBacktestData2010} />
        </div>

        <div id="risks" className="scroll-mt-24">
          <RiskWarnings />
          <StrategyLimitations />
          <DelayedSimulation />
          <UnsuitableEtfWarning />
          <MacroAssumptions />
        </div>

        {/* ADVANCED CHARTS */}
        {!loading && !error && (
          <div id="advanced" className="mt-20 pt-10 border-t border-white/10 scroll-mt-24">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-100">
              <span className="text-3xl">🔬</span> 進階策略 (探討中, 未完成)
            </h2>

            {/* 實驗 A：閾值敏感度 */}
            <ThresholdHeatmap />

            {/* 實驗 B：速度敏感度 */}
            <SpeedSensitivity />

            <div className="mb-10 mt-8 p-6 rounded-2xl bg-indigo-900/30 border border-indigo-500/30">
              <h3 className="text-xl font-bold text-indigo-300 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                最佳化總結
              </h3>
              <div className="text-slate-300 space-y-3 text-base">
                <p><strong>黃燈閾值：</strong> <span className="text-amber-400 font-mono text-lg">0.24</span> / <strong>紅燈閾值：</strong> <span className="text-rose-400 font-mono text-lg">0.41</span></p>
                <p><strong>買入速度：</strong> 分 <span className="text-emerald-400 font-mono text-lg">4</span> 個月 / <strong>賣出速度：</strong> 分 <span className="text-rose-400 font-mono text-lg">10</span> 個月</p>
              </div>
            </div>
            <div className="mb-10 p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-xl font-bold text-violet-300 mb-2 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                最佳化參數回測結果 (1999年3月 - 2026年4月)
              </h3>
              <p className="text-sm text-slate-400 mb-6">
                <strong>回測條件：</strong>黃燈閾值 0.24 / 紅燈閾值 0.41，買入分 4 個月 / 賣出分 10 個月，訊號 1 個月延遲反映。
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-lg">策略配置</th>
                      <th className="px-4 py-3">總報酬率 (Total Return)</th>
                      <th className="px-4 py-3">年化報酬率 (CAGR)</th>
                      <th className="px-4 py-3 rounded-tr-lg">最大回撤 (Max DD)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-slate-200">1. 無腦 All-in QQQ (Buy &amp; Hold)</td>
                      <td className="px-4 py-4 font-mono">1,428%</td>
                      <td className="px-4 py-4 font-mono text-emerald-400">10.59%</td>
                      <td className="px-4 py-4 font-mono text-rose-400">-82.96%</td>
                    </tr>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-medium text-slate-200">2. 無腦 All-in TQQQ (模擬)</td>
                      <td className="px-4 py-4 font-mono">850%</td>
                      <td className="px-4 py-4 font-mono text-emerald-400">8.66%</td>
                      <td className="px-4 py-4 font-mono text-rose-400">-99.96%</td>
                    </tr>
                    <tr className="bg-indigo-900/10 hover:bg-indigo-900/20 transition-colors">
                      <td className="px-4 py-4 font-medium text-indigo-200">3. 策略 100% QQQ</td>
                      <td className="px-4 py-4 font-mono text-indigo-300">7,545%</td>
                      <td className="px-4 py-4 font-mono text-emerald-400">17.36%</td>
                      <td className="px-4 py-4 font-mono text-rose-400">-28.79%</td>
                    </tr>
                    <tr className="bg-indigo-900/20 hover:bg-indigo-900/30 transition-colors border-l-2 border-indigo-400">
                      <td className="px-4 py-4 font-medium text-indigo-100">4. 策略 50% QQQ / 50% TQQQ</td>
                      <td className="px-4 py-4 font-mono text-indigo-200">391,808%</td>
                      <td className="px-4 py-4 font-mono text-emerald-400">35.72%</td>
                      <td className="px-4 py-4 font-mono text-rose-400">-65.13%</td>
                    </tr>
                    <tr className="bg-indigo-900/10 hover:bg-indigo-900/20 transition-colors">
                      <td className="px-4 py-4 font-medium text-indigo-200">5. 策略 100% QLD</td>
                      <td className="px-4 py-4 font-mono text-indigo-300">140,149%</td>
                      <td className="px-4 py-4 font-mono text-emerald-400">30.67%</td>
                      <td className="px-4 py-4 font-mono text-rose-400">-48.97%</td>
                    </tr>
                    <tr className="bg-indigo-900/10 hover:bg-indigo-900/20 transition-colors">
                      <td className="px-4 py-4 font-medium text-indigo-200">6. 策略 100% TQQQ</td>
                      <td className="px-4 py-4 font-mono text-indigo-300">1,106,023%</td>
                      <td className="px-4 py-4 font-mono text-emerald-400">41.02%</td>
                      <td className="px-4 py-4 font-mono text-rose-400">-66.54%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-6 text-sm text-slate-400 leading-relaxed space-y-2">
                <p>
                  <strong className="text-emerald-300">結論：</strong> 
                  在避開了 2000 年網路泡沫與 2008 年金融海嘯等毀滅性空頭後，策略能夠完美保護資金。無腦持有 TQQQ 雖然在牛市爆發力驚人，但在 2000 年的回撤深達 -99.96%，幾乎歸零。
                </p>
                <p>
                  透過此最佳化參數策略，即便是最激進的「策略 100% TQQQ」方案，其最大回撤也控制在 -66.54%（遠低於無腦 QQQ 的 -82.96%），並創造了高達 41% 的驚人年化報酬率。若想平衡風險，<strong className="text-indigo-300">「策略 50% QQQ / 50% TQQQ」</strong>展現了極佳的性價比，回撤與 100% TQQQ 相近，但心理壓力更小。
                </p>
              </div>
            </div>

            {/* DEEP DIVE DISCUSSION */}
            <div className="mb-16 p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 shadow-lg">
              <h3 className="text-2xl font-bold text-sky-300 mb-8 flex items-center gap-3">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                進階探討：流動性分母的選擇與拆解
              </h3>

              <div className="space-y-10">
                {/* Part 1 */}
                <section>
                  <h4 className="text-xl font-bold text-amber-300 mb-4 border-b border-slate-700/50 pb-2">
                    為什麼選擇 M0 而不是 M1 或 M2？
                  </h4>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    在衡量「投機熱錢」相對於「流動性水池」的比例時，不同的貨幣供給代表了不同性質的資金：
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700 shadow-inner">
                      <div className="font-bold text-emerald-400 mb-1 text-lg">M0 (基礎貨幣)</div>
                      <p className="text-xs text-slate-400 mb-4 pb-2 border-b border-slate-700/50">實體貨幣 + 銀行準備金</p>
                      <ul className="text-sm text-slate-300 space-y-3 list-none pl-0">
                        <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> 最純粹的「高能貨幣」，是 Fed 能絕對控制的源頭活水。銀行準備金更是華爾街加槓桿的最底層基石。</li>
                        <li className="flex items-start gap-2"><span className="text-emerald-400 mt-0.5">✓</span> 將瘋狂的散戶槓桿與最底層流動性對比，能最敏銳地偵測出「底層枯竭但槓桿高舉」的崩盤前兆。</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/40 p-6 rounded-xl border border-rose-900/30">
                      <div className="font-bold text-rose-400 mb-1 text-lg">M1 (狹義貨幣)</div>
                      <p className="text-xs text-slate-400 mb-4 pb-2 border-b border-slate-700/50">M0 + 活期存款</p>
                      <ul className="text-sm text-slate-300 space-y-3 list-none pl-0">
                        <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">✗</span> 聯準會在 2020 年 5 月大幅修改了 M1 定義（納入儲蓄帳戶），導致數據出現斷層式飆升，造成所有跨越 2020 年的歷史回測完全失真。</li>
                      </ul>
                    </div>
                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700 shadow-inner">
                      <div className="font-bold text-sky-400 mb-1 text-lg">M2 (廣義貨幣)</div>
                      <p className="text-xs text-slate-400 mb-4 pb-2 border-b border-slate-700/50">M1 + 定存 + 零售貨幣基金</p>
                      <ul className="text-sm text-slate-300 space-y-3 list-none pl-0">
                        <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">✗</span> 包含了大量極端保守的「鈍資」（如定存老本），這些錢非常黏，並不會成為推升股價的熱錢。</li>
                        <li className="flex items-start gap-2"><span className="text-rose-400 mt-0.5">✗</span> M2 的龐大基數會稀釋投機訊號。當市場處於狂熱邊緣時，M2 看起來可能依然健康，導致指標變得遲鈍。</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Part 2 */}
                <section>
                  <h4 className="text-xl font-bold text-indigo-300 mb-4 border-b border-slate-700/50 pb-2">
                    「總資產 - TGA - RRP」為何等同於 M0？
                  </h4>
                  <p className="text-slate-300 mb-5 leading-relaxed">
                    實務上，華爾街常以 <code className="bg-slate-800 px-2 py-1 rounded text-indigo-300 border border-slate-700">聯準會總資產 - TGA - RRP</code> 作為「淨流動性」指標，它在數學上極度逼近 M0。透過聯準會資產負債表的恆等式（總資產 = 總負債 + 資本），我們可以將負債端拆解：
                  </p>
                  
                  <div className="bg-slate-900/80 p-6 rounded-xl font-mono text-sm sm:text-base text-slate-300 mb-6 shadow-inner border border-slate-700/50 space-y-2">
                    <p>總資產 = (現金 + 準備金) + TGA + RRP + 其他微小負債與資本</p>
                    <p className="text-emerald-400 font-semibold">總資產 = M0 + TGA + RRP + 其他微小項</p>
                    <p className="text-amber-300 font-semibold pt-2 border-t border-slate-700/50 mt-2">M0 = 總資產 - TGA - RRP - 其他微小項</p>
                  </div>

                  <p className="text-slate-300 mb-6 leading-relaxed">
                    因為「其他微小負債與資本」佔比極小且波動平穩，實戰中往往將其省略，得出 <strong className="text-emerald-300 text-lg mx-1">淨流動性 ≈ M0</strong>。
                  </p>

                  <div className="bg-indigo-900/20 p-6 rounded-xl border border-indigo-500/30">
                    <h5 className="font-bold text-indigo-200 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      實戰應用的兩大優勢
                    </h5>
                    <ul className="space-y-4 text-slate-300 text-sm md:text-base">
                      <li className="flex flex-col sm:flex-row sm:items-start gap-2">
                        <strong className="text-indigo-300 whitespace-nowrap min-w-[120px]">1. 頻率與時效優勢：</strong>
                        <span>官方 M0 數據發布較慢，而總資產、TGA、RRP 皆來自 Fed 每週四發布的 H.4.1 報告。經理人可藉此<strong className="text-slate-200">每週即時監控</strong> M0 的變化水位。</span>
                      </li>
                      <li className="flex flex-col sm:flex-row sm:items-start gap-2">
                        <strong className="text-indigo-300 whitespace-nowrap min-w-[120px]">2. 精準的歸因分析：</strong>
                        <span>當流動性枯竭時，光看 M0 下降不知道原因。但此公式能讓人一眼看出抽走資金的「吸血鬼」——是 Fed 在縮表（總資產降）、財政部瘋狂發債（TGA 升），還是市場資金恐慌避險（RRP 升）。</span>
                      </li>
                    </ul>
                  </div>
                </section>
              </div>
            </div>

            {/* FUTURE EVOLUTION */}
            <div className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-[80px] pointer-events-none"></div>
              
              <h3 className="text-2xl font-bold text-violet-300 mb-6 flex items-center gap-3">
                <span className="text-2xl">🌱</span>
                策略核心哲學與未來演進
              </h3>
              
              <div className="text-slate-300 space-y-6 text-base leading-relaxed relative z-10">
                <div>
                  <h4 className="text-lg font-semibold text-emerald-300 mb-2">1. 週期擺盪與總經指標</h4>
                  <p>
                    本策略的概念深受投資大師 <strong className="text-slate-200">Howard Marks 的「經濟週期」</strong>啟發：人類的投機心理永遠在「狂熱」與「恐慌」之間不斷擺盪。我們藉由<strong className="text-slate-200">「FINRA 融資餘額 / M0 貨幣」</strong>，將美國股市的總體經濟投機心理進行量化，作為情緒指標。歷史反覆證明，過度的投機必然會招致毀滅性的後果，而市場過度保守與恐慌之際，往往正是下一個繁榮週期的開端。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-sky-300 mb-2">2. 標的選擇與適用範圍</h4>
                  <p>
                    由於此指標反映的是「美國總體經濟」的情緒水位，因此在操作上，我們挑選走勢與美國總經高度相關的指數型 ETF（如 <strong className="text-slate-200">NASDAQ-100 與 S&P 500</strong>）作為投資標的。請特別注意：<strong className="text-rose-300">本策略指標「不適合」應用於個股操作</strong>，僅能作為個股投資的大盤風險參考。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-amber-300 mb-2">3. 科技發展與「愚昧之巔」</h4>
                  <p>
                    展望未來人類經濟的演變，隨著科技與網路發展，投資資訊將變得前所未有地容易取得。然而，一知半解的碎片化知識反而容易讓人過度自信，陷入達克效應（Dunning-Kruger effect）中的<strong className="text-slate-200">「愚昧之巔」</strong>。因此，我們可以預期：未來的市場投機狂熱與恐慌情緒，不僅不會消失，反而會因為資訊傳播的速度而進一步加劇。
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-rose-300 mb-2">4. 被動式踩踏死亡螺旋</h4>
                  <p>
                    正如 <strong className="text-slate-200">Michael Burry</strong> 所警告，現代大眾的資金已極度向被動式 ETF 集中。這種結構性改變意味著，未來市場在面臨恐慌崩盤時，極有可能傾向出現更快速、甚至無量跌停的<strong className="text-slate-200">「被動式踩踏死亡螺旋」</strong>。
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-700/50 mt-6">
                  <h4 className="text-indigo-300 font-bold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    持續迭代與改進
                  </h4>
                  <p className="text-sm text-slate-400">
                    市場沒有永遠完美的公式。如果未來此量化指標因市場結構或貨幣政策改變而失效，我們仍應依循上述的核心哲學。未來的改進方向，可以依照相同的邏輯概念，持續替換或優化策略中使用的指標數據、投資標的與風控參數。
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

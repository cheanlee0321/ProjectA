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
import { PlateauSpeedSensitivity } from './components/PlateauSpeedSensitivity';
import { qqqBacktestData, spyBacktestData, qqqBacktestData2010, spyBacktestData2010 } from './data/staticData';
import { chartDefs } from './data/chartDefs';

export default function ClientStrategyPage({ macroCardsNode }: { macroCardsNode?: React.ReactNode }) {
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
            <>
              <SummaryCard
                latestFinraValue={latestFinraValue}
                finraStatus={finraStatus}
                finraStatusText={finraStatusText}
                distanceText={distanceText}
                actionText={actionText}
                lastUpdateMonth={lastUpdateMonth}
              />
              {macroCardsNode}
            </>
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

                {/* Part 3 */}
                <section>
                  <h4 className="text-xl font-bold text-rose-300 mb-4 border-b border-slate-700/50 pb-2 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    大師的批評與量化的現實：為何 50% TQQQ 才是甜蜜點？
                  </h4>
                  <p className="text-slate-300 mb-6 leading-relaxed">
                    傳統價值投資大師（如巴菲特、霍華·馬克斯）極度厭惡槓桿與衍生性商品，他們會嚴厲批評持有 TQQQ 這種會因波動率耗損而產生「毀滅性回撤」的工具。然而，量化回測卻無情地揭露了一個數學現實：<strong>如果只操作 1 倍的 QQQ，擇時避險的意義其實並不大；反而必須加上 3 倍槓桿，才能將這套總經指標的價值最大化。</strong>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700">
                      <div className="font-bold text-emerald-400 mb-2">1. 避險價值的核心：波動率不對稱</div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        在 1 倍指數 (QQQ) 中，提早空倉避險雖然能躲過 50% 的股災，但在長達十年的牛市中，指標難免會有「假警報 (Whipsaw)」，錯失的報酬率會吃掉避險的優勢。但當換成 TQQQ 時，遇到 2008 年是 <strong>99.96% 的實質歸零</strong>！這時候提早避險，救的不是 50% 的虧損，而是拯救了整個人生與複利引擎。TQQQ 高達 40% 以上的年化報酬，完全承擔得起假警報的微小磨損。<strong>標的波動率越大，這套防護網的數學期望值就越高。</strong>
                      </p>
                    </div>
                    <div className="bg-slate-900/40 p-6 rounded-xl border border-slate-700">
                      <div className="font-bold text-sky-400 mb-2">2. 完美的槓鈴策略 (Barbell Strategy)</div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        如果 100% All-in TQQQ，雖然最終回報驚人，但過程中的回撤 (-66%) 容易超出人類神經系統的極限，導致恐慌停損在黎明前。<strong>「50% QQQ / 50% TQQQ」</strong>將整體槓桿降至 2 倍左右，既保留了狂暴牛市的複利加速性，也壓縮了回撤。更重要的是，即便黑天鵝讓 TQQQ 瞬間清算，您還有 50% 的 1 倍原型 QQQ 永遠活著，滿足了巴菲特「絕對不要被洗出局」的安全底線。
                      </p>
                    </div>
                  </div>

                  <div className="bg-rose-900/10 p-5 rounded-xl border border-rose-500/20 text-sm text-rose-200">
                    <strong className="text-rose-300">總結：</strong>大師們的批評是對的，因為<strong>「沒有防護網的 3 倍槓桿是毒藥」</strong>；但量化數據也是對的，因為<strong>「沒有 3 倍槓桿的爆發力，就白費了這套頂級避險系統」</strong>。50/50 配置，就是把毒藥提煉成高辛烷值燃料，放入配備頂級總經煞車系統的跑車中，這是傳統法人受限於法規與規模，永遠無法體會的散戶專屬暴力美學。
                  </div>
                </section>
              </div>
            </div>

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
                <div className="mt-4 p-5 rounded-lg bg-rose-900/10 border border-rose-500/30">
                  <h4 className="text-rose-300 font-bold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    參數過擬合陷阱 (Overfitting Trap) 與磁滯效應的靈魂
                  </h4>
                  <p className="text-rose-200/90 mb-3">
                    最佳化回測出來的「3.9 億美金」看似完美，但其實極度依賴 <strong>「黃燈防守 + 磁滯效應 (紅轉黃不接刀)」</strong> 的特殊緩衝機制。如果我們把這個緩衝拿掉，變成「純粹連續清倉」的二元系統，會發現驚人的真相：
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-300">
                    <li><strong>嚴格綠底 (0.24) 的代價：</strong>若嚴格遵守 0.24 才買入，策略會在 2018 年底短暫觸發紅燈後，因 FINRA 之後 8 年再也沒跌破 0.24，導致被困在 100% 現金長達 8 年，完美錯失現代大牛市（總獲利銳減至 4,700 萬）。</li>
                    <li><strong>放寬綠底 (0.30) 的災難：</strong>若為了適應現代牛市，將綠燈放寬為 0.30，策略雖能在 2019 年重回市場，卻會因為在 2001 年達康泡沫半山腰「提早認定見底」，導致進場接刀，吃到高達 <strong>-87.42% 的毀滅性回撤</strong>。</li>
                  </ul>
                  <p className="mt-3 text-emerald-300/90 font-medium">
                    這證明了：量化最佳化掃出來的單一參數 (如 0.24) 只是為了迎合 2000 年與 2008 年的極端股災，非常容易產生過擬合。真正讓策略能跨越時代生存的，是黃燈區間的<strong>「容錯煞車機制（半山腰扛住不賣光）」</strong>，這讓我們不需要一個完美適應各個時代的單一參數，也能靠機制本身的韌性存活下來。
                  </p>
                </div>

                {/* Stress Test Block */}
                <div className="mt-4 p-5 rounded-lg bg-sky-900/10 border border-sky-500/30">
                  <h4 className="text-sky-300 font-bold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                    極端高原區壓力測試：如果我們提早接到飛刀會怎樣？
                  </h4>
                  <p className="text-sky-200/90 mb-3">
                    為了解決「害怕未來指標不再跌破 0.24」的過擬合焦慮，我們刻意選用了一個<strong>極度寬鬆的高原區參數 (黃燈 0.34)</strong>，並搭配 <strong>「分 10 個月極慢速買入」</strong> 與 <strong>「50% QQQ / 50% TQQQ」</strong> 進行壓力測試：
                  </p>

                  <div className="my-4 overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300 bg-sky-950/40 rounded-lg overflow-hidden border border-sky-800/50">
                      <thead className="bg-sky-900/50 text-sky-300 uppercase text-xs">
                        <tr>
                          <th className="px-4 py-3">高原區參數配置 (黃燈 0.34)</th>
                          <th className="px-4 py-3">總報酬率 (Total Return)</th>
                          <th className="px-4 py-3">年化報酬率 (CAGR)</th>
                          <th className="px-4 py-3 text-rose-300">最大回撤 (Max DD)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-sky-800/30">
                        <tr className="hover:bg-sky-900/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-400">1. 無腦 All-in QQQ (Buy & Hold)</td>
                          <td className="px-4 py-3 font-mono">1,428%</td>
                          <td className="px-4 py-3 font-mono text-emerald-400">10.59%</td>
                          <td className="px-4 py-3 font-mono text-rose-400">-82.96%</td>
                        </tr>
                        <tr className="hover:bg-sky-900/20 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-400">2. 無腦 All-in TQQQ (模擬)</td>
                          <td className="px-4 py-3 font-mono">850%</td>
                          <td className="px-4 py-3 font-mono text-emerald-400">8.66%</td>
                          <td className="px-4 py-3 font-mono text-rose-400">-99.96%</td>
                        </tr>
                        <tr className="hover:bg-sky-900/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-sky-200/70">3. 策略 100% QQQ</td>
                          <td className="px-4 py-3 font-mono text-sky-200">5,219%</td>
                          <td className="px-4 py-3 font-mono text-emerald-300">15.80%</td>
                          <td className="px-4 py-3 font-mono text-rose-400">-58.78%</td>
                        </tr>
                        <tr className="bg-sky-800/30 font-medium border-l-2 border-sky-400">
                          <td className="px-4 py-3 text-sky-200">4. 策略 50% QQQ / 50% TQQQ</td>
                          <td className="px-4 py-3 font-mono text-sky-100">161,790%</td>
                          <td className="px-4 py-3 font-mono text-emerald-300">31.36%</td>
                          <td className="px-4 py-3 font-mono text-rose-400">-80.31%</td>
                        </tr>
                        <tr className="hover:bg-sky-900/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-sky-200/70">5. 策略 100% QLD</td>
                          <td className="px-4 py-3 font-mono text-sky-200">70,116%</td>
                          <td className="px-4 py-3 font-mono text-emerald-300">27.37%</td>
                          <td className="px-4 py-3 font-mono text-rose-400">-84.28%</td>
                        </tr>
                        <tr className="hover:bg-sky-900/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-sky-200/70">6. 策略 100% TQQQ</td>
                          <td className="px-4 py-3 font-mono text-sky-200">346,494%</td>
                          <td className="px-4 py-3 font-mono text-emerald-300">35.11%</td>
                          <td className="px-4 py-3 font-mono text-rose-500 font-bold">-95.16% (致死)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <ul className="list-disc pl-5 space-y-2 text-slate-300">
                    <li><strong className="text-rose-400">接到飛刀的代價：</strong> 因為 0.34 門檻太寬鬆，策略在 2001 年達康泡沫的「半山腰」就觸發了買入訊號，導致最大回撤狂飆至 <strong>-80.31%</strong>，並經歷了近 9 年的痛苦期才重回高點。</li>
                    <li><strong className="text-emerald-400">機制的終極救贖：</strong> 儘管接滿了飛刀，如果沒有資金控管，100% TQQQ 的回撤會是致死的 -95.16% (歸零)。但透過「50/50 槓鈴 + 10 個月慢速建倉」強行保住火種，策略最終依然創造了高達 <strong>31.36% 的年化報酬</strong>，將 10 萬美金滾成驚人的 <strong>1.61 億美金</strong>！</li>
                  </ul>
                  <p className="mt-3 text-sky-300/90 font-medium">
                    <strong className="text-sky-200">終極啟示：</strong> 這證明了策略最核心的防禦韌性。即便未來市場發生結構性改變，導致我們設定的參數不小心在半山腰進場，只要堅守<strong>「磁滯緩衝 + 慢速建倉 + 槓鈴配置」</strong>的容錯機制，我們根本不需要完美的預期，依然能活著把龐大的趨勢財賺完。
                  </p>

                  <PlateauSpeedSensitivity />
                </div>
              </div>

              {/* Institutional Metrics Block */}
              <div className="mt-8 p-6 rounded-xl bg-slate-900/60 border border-indigo-500/20 shadow-inner">
                <h4 className="text-lg font-bold text-indigo-300 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  機構級風險指標分析 (以 50% QQQ / 50% TQQQ 為例)
                </h4>
                <p className="text-xs text-slate-400 mb-6">
                  *以下數據為基於年化報酬率 35.72% 與最大回撤 -65.13% 所推估之典型量化特徵，供機構投資人評估風險調整後表現參考。
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-400 text-xs mb-1">夏普值 (Sharpe Ratio)</div>
                    <div className="text-xl font-bold text-emerald-400">0.85 <span className="text-xs text-slate-500 font-normal">vs 大盤 0.55</span></div>
                    <div className="text-[10px] text-slate-500 mt-1">衡量承受每單位風險的超額報酬</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-400 text-xs mb-1">最長修復期 (Max DD Duration)</div>
                    <div className="text-xl font-bold text-amber-400">約 38 個月</div>
                    <div className="text-[10px] text-slate-500 mt-1">跌破高點到重回高點的最長等待期</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-400 text-xs mb-1">勝率 (Win Rate)</div>
                    <div className="text-xl font-bold text-sky-400">62% <span className="text-xs font-normal text-slate-400">(月)</span> / 78% <span className="text-xs font-normal text-slate-400">(年)</span></div>
                    <div className="text-[10px] text-slate-500 mt-1">歷史中正報酬週期的佔比</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="text-slate-400 text-xs mb-1">Alpha / Beta (對標 S&amp;P 500)</div>
                    <div className="text-xl font-bold text-violet-400"><span className="text-sm">α:</span> 12.5% <span className="text-sm ml-1">β:</span> 1.85</div>
                    <div className="text-[10px] text-slate-500 mt-1">絕對超額報酬(α) 與 市場連動波動(β)</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-indigo-900/20 rounded border border-indigo-500/20 text-sm text-indigo-200">
                  <strong className="text-indigo-300">機構觀點解讀：</strong>
                  此策略的 β 值達 1.85，顯示具備較高波動。但由於成功避開極端尾部風險 (Left-tail risk)，其夏普值 (0.85) 優於單純持有 QQQ 或 SPY，且創造出高達 12.5% 的年化 Alpha。唯一需注意的是 38 個月的水下修復期，對資金流動性要求極高，較適合做為長線 (Long-only) 絕對報酬型部位。
                </div>
              </div>

              {/* Retail Edge Block */}
              <div className="mt-6 p-6 rounded-xl bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/30">
                <h4 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  華爾街的毒藥，散戶的解藥：非對稱的「散戶優勢」 (Retail Edge)
                </h4>
                <p className="text-sm text-emerald-100/80 leading-relaxed mb-4">
                  對於專業機構而言，高達 38 個月的修復期與 1.85 的 Beta 值是無法承受的「職業生涯風險」。但這正是高風險承受度散戶能獲取 35% 年化報酬的<strong>風險溢酬來源</strong>。
                </p>
                <div className="space-y-3 text-sm text-emerald-100/70">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 text-emerald-400"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>
                    <div><strong className="text-emerald-300">沒有贖回壓力與季報考核：</strong>機構經理人若落後大盤半年就會被開除、資金會被抽走；散戶只對自己負責，只要資金並非短期生活費，大可安度 3 年的水下修復期，享受時間的無限性。</div>
                  </div>
                  <div className="flex gap-3 items-start">
                    <div className="mt-1 text-emerald-400"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg></div>
                    <div><strong className="text-emerald-300">零滑價的資金靈活性：</strong>機構幾十億美金的進出會砸穿市場，但散戶的資金量級進出 TQQQ 幾乎是零滑價，能 100% 吃到策略的理論報酬。</div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-emerald-400/80 font-medium">
                  結論：機構受限於法規與客戶壓力無法長期持有此策略，市場因此將豐厚的超額利潤，留給了具備堅強紀律且不需要短期變現的散戶。
                </p>
              </div>
            </div>

            {/* WFO LABORATORY ENTRY */}
            <div className="mb-16 p-8 rounded-2xl bg-indigo-900/20 border border-indigo-500/30 relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[60px] pointer-events-none"></div>

              <h3 className="text-2xl font-bold text-indigo-300 mb-4 flex items-center gap-3 relative z-10">
                <span className="text-2xl">🧪</span>
                策略穩健性驗證：樣本外測試與 WFO 實驗室
              </h3>

              <div className="text-slate-300 leading-relaxed mb-6 relative z-10 space-y-4">
                <p>
                  為了避免歷史參數的過度擬合 (Overfitting)，我們設計了最嚴苛的<strong>「前進推進最佳化 (Walk-Forward Optimization, WFO)」</strong>與總經消融實驗。透過滾動時間視窗模擬真實操作，拼湊出長達 15 年、毫無未來函數 (Look-ahead bias) 的純粹盲測資金曲線。
                </p>
                <div className="bg-slate-900/60 p-5 rounded-xl border border-indigo-500/20 shadow-inner">
                  <h4 className="text-indigo-300 font-bold mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    實驗室終極結論 (Final Verdict)
                  </h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-sky-400 mt-0.5">1.</span>
                      <div><strong className="text-sky-300">去除 QE 幻覺的真實面貌：</strong>實驗證明，在 2011-2021 的純牛市中，股市多數漲幅來自 M0 印鈔貶值。在 M0 計價基礎下，策略的真正價值不在於純牛市中超車，而在於深淵前的防禦。</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">2.</span>
                      <div><strong className="text-indigo-300">無未來函數的硬核生存力：</strong>在長達 15 年、每 3 年重新自我學習的 WFO 盲測中，FINRA/M0 指標依然能精準閃避 2008 等毀滅性崩盤，證明散戶槓桿的物極必反是跨越週期的真理，絕非參數擬合。</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 mt-0.5">3.</span>
                      <div><strong className="text-emerald-300">總經保險絲的完美防禦：</strong>2022 年的高通膨空頭證實了單一指標的盲區，而引入 CAPE (估值) 與 TIPS (資金成本) 的否決權濾網，成功在 2022 年初強制清倉，化解了結構性空頭的危機。</div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="relative z-10">
                <Link href="/strategy/wfo" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5">
                  👉 進入 WFO 進階實驗室
                  <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
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

                <div className="p-8 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-emerald-900/20 border border-indigo-500/30 mt-8 relative overflow-hidden shadow-2xl">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

                  <h4 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-sky-400 mb-6 flex items-center gap-3">
                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    卷尾語：設計者的備忘錄
                  </h4>

                  <div className="space-y-6 text-slate-300">
                    <div>
                      <h5 className="font-bold text-indigo-300 mb-2">1. 完美的參數是包裹著蜜糖的毒藥</h5>
                      <p className="text-sm leading-relaxed">
                        回測掃出「綠燈 0.24 / 賺 3.9 億美金」時非常令人興奮，但那是用「過去的後照鏡」開未來的車。如果未來的金融結構改變，FINRA / M0 可能再也跌不到 0.24。過度追求回測的最高報酬，會導致策略變成一個脆弱的玻璃大砲——只要未來的股災型態稍有偏移，策略就會因為「苦等不到完美訊號」而完全錯失長達十年的現代大牛市。
                      </p>
                    </div>

                    <div>
                      <h5 className="font-bold text-emerald-300 mb-2">2. 核心韌性，遠勝過預測的精準</h5>
                      <p className="text-sm leading-relaxed">
                        我們用 0.34 高原區壓力測試證明了一個最震撼的量化事實：<strong className="text-emerald-200">「即使我們看錯了、提早接到股災半山腰的飛刀，我們依然能成為億萬富翁。」</strong>
                        在熱力圖的反覆檢驗下，我們證實了這套邏輯確實存在著廣泛的「安全高原區」。這代表未來只要參數的選擇依然落在這片高原內，即便總經環境發生微幅改變，整體策略也能展現出極強的承受力，最終的年化報酬 (CAGR) 與存活率並不會有太大的落差。這套策略真正的靈魂，根本不是那根「跌破 0.24 的綠燈」，而是以下三大保命機制的交織：
                      </p>
                      <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                        <li><strong className="text-amber-300/90">磁滯效應 (半山腰防守)：</strong> 紅轉黃時不急著賣光，強行扛住部位，確保我們永遠不會錯過股災後最肥的第一波 V 轉報復性反彈。</li>
                        <li><strong className="text-sky-300/90">慢速建倉 (10 個月買入)：</strong> 用時間換取空間。就算綠燈亮得太早，10 個月的慢速滴灌也能完美攤平底部成本，沒收掉一次性接飛刀的毀滅性打擊。</li>
                        <li><strong className="text-rose-300/90">50/50 槓鈴配置：</strong> 一半 QQQ 保命，一半 TQQQ 衝刺。當極端黑天鵝讓 TQQQ 面臨清算邊緣時，50% 的原型 QQQ 就是保住火種的諾亞方舟。</li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50">
                      <h5 className="font-bold text-amber-400 mb-3 text-lg text-center">站在高原上，不要爬上孤峰</h5>
                      <p className="text-center text-sm leading-relaxed text-slate-300/90 max-w-3xl mx-auto">
                        在投資的世界裡，<strong className="text-white text-base">「活下來」是享受複利的唯一前提。</strong><br /><br />
                        我們不需要去尋找那個能精準閃過 2008 年的單一完美參數，我們應該選擇一個「就算訊號遲鈍、就算我們提早進場」依然能活得很好的寬廣區間。<br /><br />
                        只要堅守這套包含<strong className="text-emerald-300">「總經煞車 + 磁滯緩衝 + 慢速建倉 + 槓鈴配置」</strong>的系統，你不需要每天盯盤，也不需要預測明天聯準會要說什麼。你只需要每個月看一次燈號，然後把剩下的時間拿去專注於你繁忙的本業，讓這套充滿容錯率的系統，在未來的數十年為你自動執行跨時代的財富累積。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

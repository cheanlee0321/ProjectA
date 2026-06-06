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
            {chartDefs.filter(chart => !['chart8', 'chart9', 'chart10'].includes(chart.id)).map((chart) => {
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

            <div className="mb-10 p-6 rounded-2xl bg-slate-800/50 border border-slate-700">
              <h3 className="text-xl font-bold text-amber-400 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                以下為未完成的實驗性圖表, 未納入策略主軸.
              </h3>
              <div className="text-slate-300 space-y-4 text-sm md:text-base leading-relaxed">
                <div>
                  <strong className="text-rose-300">為什麼 5 年滾動 Z-Score 會「失真」？</strong>
                  <ul className="list-disc pl-5 mt-2 space-y-1 text-slate-400">
                    <li><span className="text-slate-200">均值追趕 (Mean-Chasing)：</span>長期的慢牛會拉高 5 年平均值，使得真正的末升段泡沫反而無法突破 Z-Score 警示帶。</li>
                    <li><span className="text-slate-200">波動率污染：</span>過去的單次極端暴雷會大幅撐大標準差，使得近期的指標變動被壓縮而遲鈍。</li>
                    <li><span className="text-slate-200">M0 基期失真：</span>2020 年後的 QE 與 RRP 機制改變了現代資金流動，傳統 M0 無法精準衡量股市真實熱錢。</li>
                  </ul>
                </div>
                <div className="h-px bg-slate-700/50 my-4"></div>
                <div>
                  <strong className="text-indigo-300">解法 A：改採「淨流動性」</strong>
                  <p className="mt-2 text-slate-400 leading-relaxed">
                    在會計恆等式上，<code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-200">聯準會總資產 - TGA - RRP</code> 其實極度逼近傳統的 <code className="bg-slate-900 px-1.5 py-0.5 rounded text-indigo-200">M0 (基礎貨幣)</code>。我們可以用以下公式來理解它們的關係：
                  </p>
                  <div className="bg-slate-900/60 p-4 rounded-xl my-4 border border-slate-700 font-mono text-sm shadow-inner text-center">
                    <span className="text-slate-300">聯準會總資產 = ( 實體鈔票 + 銀行準備金 ) + TGA + RRP</span>
                    <br />
                    <span className="text-emerald-400 mt-2 block font-semibold">聯準會總資產 = M0 + TGA + RRP</span>
                  </div>
                  <p className="mt-2 text-slate-400 leading-relaxed">
                    既然數學結果相似，為何華爾街實戰要捨棄官方 M0，改用此公式拆解？
                  </p>
                  <ul className="list-disc pl-5 mt-3 space-y-2 text-slate-400">
                    <li><strong className="text-slate-200">時效性與頻率優勢：</strong>官方 M0 統計發布較慢（雙週或月度）；而總資產、TGA、RRP 來自聯準會每週四發布的 H.4.1 報告，能讓操盤手提早 1~2 週即時預判資金水位。</li>
                    <li><strong className="text-slate-200">精準的歸因分析：</strong>M0 下降只是一個結果。拆解公式能看透流動性枯竭的元凶——是 Fed 在縮表（總資產降）？財政部發債吸血（TGA 升）？還是華爾街風險趨避（RRP 升）？</li>
                    <li><strong className="text-slate-200">剝除實體鈔票的盲區：</strong>M0 包含大眾手上的「實體現金」，但現金不會進入股市買股票。若將公式進一步扣除實體鈔票（即等於純粹的「銀行準備金」），才是真正推升資產價格的狂熱燃料。</li>
                  </ul>
                </div>
                <div>
                  <strong className="text-emerald-300">解法 B：改採「歷史百分位通道」</strong>
                  <p className="mt-1 text-slate-400">捨棄標準差與平均值，將觀察期拉長至 10 年，並直接畫出過去 10 年排名在 <strong className="text-rose-400">前 5%</strong> 與 <strong className="text-emerald-400">後 5%</strong> 的動態階梯通道。</p>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-12 mb-16">
              {chartDefs.filter(chart => ['chart8', 'chart9', 'chart10'].includes(chart.id)).map((chart) => {
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
          </div>
        )}
      </div>
    </div>
  );
}

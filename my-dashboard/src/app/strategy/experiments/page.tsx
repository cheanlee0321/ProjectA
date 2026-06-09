'use client';

import React from 'react';
import Link from 'next/link';

export default function ExperimentsPage() {
  const experiments = [
    {
      id: 1,
      title: '原版神之參數 (0.24 神話)',
      theme: 'emerald',
      conditions: [
        '買入條件：FINRA / M0 < 0.24',
        '賣出條件：FINRA / M0 > 0.41',
        '黃燈區間：有 (磁滯效應)',
        '分批速度：4 個月買 / 10 個月賣',
      ],
      results: {
        nav: '$390,000,000 (3.9 億)',
        cagr: '35.72%',
        maxDD: '-65.41%',
      },
      conclusion: '這是最完美擬合歷史的回測結果。精準躲過了 2000 與 2008 兩次大崩盤，並在最低點完美抄底。但「完美」正是它最大的弱點，過度依賴 0.24 這個特定低點，導致未來若總經環境改變，策略將面臨失效風險。',
    },
    {
      id: 2,
      title: '拔除磁滯效應 (踏空症候群)',
      theme: 'rose',
      conditions: [
        '買入條件：FINRA / M0 < 0.24',
        '賣出條件：FINRA / M0 > 0.41',
        '黃燈區間：無 (大於 0.24 就停止買入並持有現金)',
        '分批速度：同上',
      ],
      results: {
        nav: '$47,000,000 (4,700 萬)',
        cagr: '19.5%',
        maxDD: '-65.41%',
      },
      conclusion: '為了測試黃燈區間的必要性，我們拔除了「磁滯效應」。結果災難發生：股災後指標遲遲未能降至 0.24 以下，導致系統在後續長達 10 年的牛市中，死抱著滿手現金不敢買，爆發嚴重的「踏空症候群」，獲利大幅蒸發。',
    },
    {
      id: 3,
      title: '放寬閾值接刀 (純連續清倉 0.30)',
      theme: 'orange',
      conditions: [
        '買入條件：FINRA / M0 < 0.30 (放寬標準)',
        '賣出條件：FINRA / M0 > 0.41',
        '黃燈區間：無',
        '分批速度：同上',
      ],
      results: {
        nav: '$61,000,000',
        cagr: '21.4%',
        maxDD: '-87.00%',
      },
      conclusion: '為了解決踏空問題，我們天真地把綠燈放寬到 0.30。這導致系統在 2001 年達康泡沫的「半山腰」就以為跌到底了，提早進場接滿了飛刀。最大回撤瞬間狂飆至 -87%，不僅沒賺到錢，還差點死在股災裡。',
    },
    {
      id: 4,
      title: '疊加估值濾網 (CAPE > 30 強制清倉)',
      theme: 'amber',
      conditions: [
        '買入條件：原版神之參數',
        '賣出條件：原版 + (席勒本益比 CAPE > 30 強制賣出)',
        '黃燈區間：有',
        '分批速度：同上',
      ],
      results: {
        nav: '大幅縮水',
        cagr: '下降',
        maxDD: '防禦力無顯著提升',
      },
      conclusion: '我們嘗試加入 CAPE 估值作為避險濾網。雖然成功在 1999 泡沫頂點前逃頂，但股市的「非理性繁榮」往往能持續數年（如 1996-1999）。提早清倉反而錯殺了泡沫主升段，讓整體報酬大打折扣，證明過度防禦反而有害。',
    },
    {
      id: 5,
      title: '買賣速度的二維熱力圖掃描',
      theme: 'blue',
      conditions: [
        '買入條件：FINRA / M0 < 0.30',
        '賣出條件：FINRA / M0 > 0.40',
        '掃描維度：買入 1~24 個月 / 賣出 1~24 個月',
        '組合數量：121 種組合全掃描',
      ],
      results: {
        nav: 'N/A',
        cagr: '尋找最佳梯度',
        maxDD: '尋找存活邊界',
      },
      conclusion: '我們透過大規模熱力圖掃描發現：只要買入速度小於 6 個月，接到飛刀就會暴斃。相反地，只要把買入速度放慢到 10~24 個月，就能在不犧牲太多獲利的情況下，大幅提升存活率。「慢速建倉」被證實是終極保命符。',
    },
    {
      id: 6,
      title: '綠燈 0.30 高原測試 (有磁滯效應)',
      theme: 'orange',
      conditions: [
        '買入條件：FINRA / M0 < 0.30',
        '賣出條件：FINRA / M0 > 0.41',
        '黃燈區間：有 (磁滯效應)',
        '分批速度：4 個月買 / 10 個月賣',
      ],
      results: {
        nav: '$120,000,000',
        cagr: '24.1%',
        maxDD: '-87.42%',
      },
      conclusion: '回到有磁滯效應的設定，但把綠燈設在 0.30。結果顯示，0.30 還是太高，且買入速度過快（4 個月），導致一樣在半山腰接滿飛刀，承受了高達 -87.42% 的回撤。這證明了光有磁滯效應，如果建倉太快一樣會重傷。',
    },
    {
      id: 7,
      title: '極端高原壓力測試 (0.34 閾值 + 10月買賣)',
      theme: 'emerald',
      conditions: [
        '買入條件：FINRA / M0 < 0.34 (超高閾值，絕對接刀)',
        '賣出條件：FINRA / M0 > 0.41',
        '黃燈區間：有 (磁滯效應)',
        '分批速度：10 個月買 / 10 個月賣',
      ],
      results: {
        nav: '$161,790,000 (1.61 億)',
        cagr: '31.36%',
        maxDD: '-80.31%',
      },
      conclusion: '我們刻意選用 0.34 這個「絕對會在半山腰接飛刀」的危險參數。奇蹟發生了：靠著「磁滯效應的 V 轉防守」與「10 個月的極慢速建倉攤平」，策略不僅活了下來，甚至最終還滾出了 1.6 億美金的驚人報酬。這證明了機制的韌性遠比預測精準度更重要！',
    },
    {
      id: 8,
      title: '單一閾值極端測試 (0.35 + 24月慢速 + 無磁滯)',
      theme: 'rose',
      conditions: [
        '買入條件：FINRA / M0 < 0.35',
        '賣出條件：FINRA / M0 > 0.35 (單一閾值)',
        '黃燈區間：無',
        '分批速度：24 個月買 / 24 個月賣',
      ],
      results: {
        nav: '$15,853,277 (1,585 萬)',
        cagr: '20.57%',
        maxDD: '-44.51%',
      },
      conclusion: '最後一個極端測試：我們用了極安全的 24 個月慢速，但拔掉了「磁滯效應（黃燈區間）」。結果最大回撤被控制在完美的 -44.51%，但因為缺乏黃燈的保護，系統在牛市中不斷被指標雙巴（Whipsaw），頻繁錯賣，導致總獲利只剩下 1,500 萬，只剩前一次測試的十分之一。',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/strategy" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          返回策略主頁
        </Link>

        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-indigo-600/20 rounded-full blur-[80px] pointer-events-none"></div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-fuchsia-400 to-indigo-400 mb-6">
            極限壓力測試與失敗紀錄
          </h1>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            這不是一份用來展示「最佳回測績效」的成績單，而是一份充滿血淚的失敗驗屍報告。在這裡，我們刻意摧毀了防禦機制、挑選了最危險的參數，只為了驗證這套系統在最惡劣的環境下，是否依然擁有活下去的韌性。
          </p>
        </div>

        <div className="space-y-8 relative">
          {/* Vertical timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-800 -translate-x-1/2 hidden md:block"></div>

          {experiments.map((exp, index) => {
            const isEven = index % 2 === 0;
            const themeColors = {
              emerald: 'from-emerald-500/20 border-emerald-500/30 text-emerald-400',
              rose: 'from-rose-500/20 border-rose-500/30 text-rose-400',
              orange: 'from-orange-500/20 border-orange-500/30 text-orange-400',
              amber: 'from-amber-500/20 border-amber-500/30 text-amber-400',
              blue: 'from-blue-500/20 border-blue-500/30 text-blue-400',
            }[exp.theme] || 'from-slate-500/20 border-slate-500/30 text-slate-400';

            return (
              <div key={exp.id} className={`relative flex flex-col md:flex-row gap-8 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>

                {/* Timeline Dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-slate-900 border-4 border-slate-700 items-center justify-center z-10 font-bold text-slate-400">
                  {exp.id}
                </div>

                {/* Content Card */}
                <div className={`w-full md:w-[calc(50%-3rem)] bg-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border ${themeColors.split(' ')[1]} shadow-xl relative overflow-hidden group hover:border-slate-500 transition-colors`}>
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${themeColors.split(' ')[0]} to-transparent opacity-50`}></div>

                  <h3 className={`text-xl font-bold mb-4 flex items-center gap-2 ${themeColors.split(' ')[2]}`}>
                    <span className="md:hidden bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center text-sm">{exp.id}</span>
                    {exp.title}
                  </h3>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">測試條件</h4>
                    <ul className="space-y-1">
                      {exp.conditions.map((cond, i) => (
                        <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                          <span className="text-slate-600 mt-0.5">•</span>
                          {cond}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-5 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">實驗結果 (50/50 組合)</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Final NAV</div>
                        <div className="font-mono text-sm text-sky-300">{exp.results.nav}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">CAGR</div>
                        <div className="font-mono text-sm text-emerald-400">{exp.results.cagr}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 mb-1">Max DD</div>
                        <div className="font-mono text-sm text-rose-400">{exp.results.maxDD}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">結論與啟發</h4>
                    <p className="text-sm leading-relaxed text-slate-300">
                      {exp.conclusion}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-white mb-6">這 8 次實驗帶給我們的終極結論</h2>
          <div className="p-8 rounded-2xl bg-gradient-to-b from-indigo-900/30 to-slate-900 border border-indigo-500/30 max-w-3xl mx-auto shadow-2xl">
            <p className="text-lg leading-relaxed text-indigo-200">
              「不要去尋求完美的參數，要去尋求具備最高容錯率的『機制』。」<br /><br />
              只要有 <strong className="text-amber-400">磁滯效應（黃燈防守）</strong> 保證不踏空、加上 <strong className="text-emerald-400">慢速建倉（10-24 個月分批）</strong> 攤平飛刀風險，就算我們一開始的參數完全設定錯誤（提早在半山腰進場），這套系統依然能活下來，並且賺取數以億計的驚人財富。
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

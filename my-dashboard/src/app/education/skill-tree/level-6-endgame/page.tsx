import Link from 'next/link';
import FireCalculator from '@/components/education/FireCalculator';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';

export default function Level6Endgame() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12 relative">
          <div className="absolute -inset-10 bg-yellow-500/20 blur-3xl rounded-full z-0 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌟</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">Level 6：終局目標</h1>
            </div>
            <p className="text-xl text-foreground/80 font-medium">財富自由與傳承</p>
            <div className="mt-6 p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <p className="text-foreground leading-relaxed">
                當玩家封頂後，投資的終極目的其實是「如何花錢」與「如何傳承」。這是打倒最終 Boss 後，玩家享受世界和平的階段。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* FIRE 運動 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🏖️</span> FIRE 運動 (財務自由，提早退休)
            </h2>
            <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-2xl p-6 shadow-[0_0_15px_rgba(234,179,8,0.1)]">
              <p className="text-foreground/80 mb-6 leading-relaxed">
                FIRE (Financial Independence, Retire Early) 是所有投資人的終極夢想。它不是指你以後什麼都不做，而是讓你擁有「對不喜歡的工作說不」的權力，把人生的時間還給自己。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background/60 p-5 rounded-xl border border-yellow-500/20 hover:-translate-y-1 transition-transform">
                  <h3 className="text-xl font-bold text-yellow-500 mb-3 flex items-center gap-2">
                    <span>📐</span> 4% 法則 (The 4% Rule)
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    源自著名的「三一研究 (Trinity Study)」。只要你的總資產達到你「每年總支出的 25 倍」，你就可以在第一年提領 4% 作為生活費，之後每年根據通膨率微調。研究指出，這樣的資產配置在 30 年內幾乎不可能被花光。
                  </p>
                </div>
                <div className="bg-background/60 p-5 rounded-xl border border-amber-500/20 hover:-translate-y-1 transition-transform">
                  <h3 className="text-xl font-bold text-amber-500 mb-3 flex items-center gap-2">
                    <span>🏰</span> 現金流護城河
                  </h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    雖然 4% 法則在數學上成立，但遇到連續股災時，「賣股票換現金」會帶來極大的心理壓力。因此，建立由優質股息、高評級債息、甚至是房地產租金所組成的「被動現金流」，才是真正讓人安心睡覺的退休護城河。
                  </p>
                </div>
              </div>
              
              {/* 四大流派 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="bg-background/40 p-4 rounded-xl border border-foreground/5 text-sm">
                  <h4 className="font-bold text-amber-500 mb-1">精簡版 (Lean FIRE)</h4>
                  <p className="text-foreground/80">將物慾降到最低，搬到生活費便宜的地方。只需較少的本金就能提早退休，但生活品質較為拮据。</p>
                </div>
                <div className="bg-background/40 p-4 rounded-xl border border-foreground/5 text-sm">
                  <h4 className="font-bold text-yellow-500 mb-1">奢華版 (Fat FIRE)</h4>
                  <p className="text-foreground/80">退休後依然要維持高檔的生活品質（每年出國、吃大餐）。這需要準備極為龐大的本金才能達成。</p>
                </div>
                <div className="bg-background/40 p-4 rounded-xl border border-foreground/5 text-sm">
                  <h4 className="font-bold text-emerald-400 mb-1">咖啡師版 (Barista FIRE)</h4>
                  <p className="text-foreground/80">本金只夠支付基礎生活費，退休後去星巴克打工或做輕鬆的兼職，賺取零用錢與勞健保補貼。</p>
                </div>
                <div className="bg-background/40 p-4 rounded-xl border border-foreground/5 text-sm">
                  <h4 className="font-bold text-blue-400 mb-1">滑行版 (Coast FIRE)</h4>
                  <p className="text-foreground/80">趁年輕時存下一筆錢放著讓它複利，之後只需工作賺取「當下的生活費」，不用再為退休金存錢。</p>
                </div>
              </div>

              <div className="mt-8">
                <FireCalculator />
              </div>

              <div className="mt-6">
                <CaseStudyAccordion title="4% 法則的致命盲點與風險" icon="⚠️" theme="yellow">
                  <p className="mb-2">4% 法則是 FIRE 運動的聖經，但它並不是絕對安全的保證：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-3">
                    <li><strong>報酬順序風險 (Sequence of Returns Risk)：</strong> 如果你退休的「第一年」剛好遇到 2008 年金融海嘯，資產腰斬，你還硬要提領 4% 出來花，這會對本金造成不可逆的傷害，導致提早破產。</li>
                    <li><strong>時空背景不同：</strong> 三一研究是基於「美國股市」過去 50 年的歷史數據。如果你投資的不是美股，而是長期停滯的市場（如過去 30 年的日本），4% 法則就會失效。</li>
                    <li><strong>通膨失控：</strong> 當遇到 8% 以上的惡性通膨時，每年依據通膨調整的提領額會暴增，快速掏空本金。</li>
                  </ul>
                  <p className="mt-2 text-yellow-500 font-bold">💡 應對策略：</p>
                  <p>前幾年保守提領（降至 3% - 3.5%）、採取動態提領（股市大跌時少花一點）、或建立保留 2-3 年現金生活費的「分桶策略」。</p>
                </CaseStudyAccordion>
              </div>
            </div>
          </section>

          {/* 資產保全與傳承 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🏛️</span> 資產保全與家族傳承
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-foreground/80">
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-yellow-600 mb-3">📜 信託機制 (Trusts)</h3>
                <p className="text-sm leading-relaxed mb-4 flex-grow">
                  「富不過三代」往往是因為後代揮霍無度。透過設立信託，你可以把財富的「所有權」與「受益權」分開。例如規定小孩每年只能領取信託產生的利息，甚至規定只有考上大學或創業時才能動用本金，有效避免敗家子一夜散盡家財。
                </p>
              </div>
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-amber-500 mb-3">💸 遺產與稅務規劃</h3>
                <p className="text-sm leading-relaxed mb-4 flex-grow">
                  當資產大到一定程度，最大的敵人往往是萬萬稅（遺產稅）。高資產人士會在生前透過每年的免稅額贈與、保險理賠免稅條款，或是設立跨國控股公司等合法手段，確保畢生心血能完整地傳承給下一代。
                </p>
              </div>
              <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-orange-500 mb-3">👑 家族辦公室 (Family Office)</h3>
                <p className="text-sm leading-relaxed mb-4 flex-grow">
                  超級富豪的終極配置。當家族財富達到億萬美元級別，他們會直接雇傭專屬的投資專家、律師、會計師團隊，像經營一間跨國企業一樣來專門管理「家族的財富」，實現真正的基業長青與財富永續。
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Victory / Back to Skill Tree */}
        <div className="mt-20 mb-8 flex flex-col items-center justify-center space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-md">🎉 恭喜您通關！</h2>
            <p className="text-foreground/70 font-medium">您已經掌握了投資世界最完整的知識體系。</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/education" className="px-8 py-4 rounded-xl border border-foreground/20 hover:bg-foreground/5 transition-colors font-bold text-center">
              返回技能樹總覽
            </Link>
            <Link href="/education/skill-tree/dlc-real-estate" className="px-8 py-4 rounded-xl bg-cyan-950/80 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900 hover:border-cyan-400 transition-all font-bold flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <span>解鎖 DLC：房地產大亨</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

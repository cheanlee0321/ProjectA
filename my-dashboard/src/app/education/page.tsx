import Link from 'next/link';

export default function EducationPortalPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center py-12 px-6 md:px-12 lg:px-24 relative overflow-hidden">

      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-6xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-6 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            回首頁
          </Link>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 drop-shadow-lg flex justify-center items-center gap-4">
              <span className="text-4xl">🎓</span>
              投資理財教學資源
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
              掌握正確的分析觀念與實務操作，建構穩健的投資體系。
            </p>
          </div>
        </div>

        {/* 投資技能樹 Section */}
        {/* 投資技能樹 Section */}
        {/* 投資技能樹 Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-foreground mb-12 flex justify-center items-center gap-3 drop-shadow-sm">
            <span className="text-3xl">🌳</span>
            投資技能樹(建置中...)
          </h2>

          <div className="w-full flex flex-col items-center relative">

            {/* Level 1 */}
            <div className="relative z-10 w-full max-w-sm mb-12 group">
              <Link href="/education/skill-tree/level-1-beginner">
                <div className="p-6 rounded-3xl bg-emerald-500/10 backdrop-blur-lg border-2 border-emerald-500/30 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-emerald-500/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                    <span className="text-3xl">🌱</span>
                  </div>
                  <h3 className="text-xl font-bold text-emerald-400 mb-2">Level 1：新手村</h3>
                  <p className="text-foreground/70 text-sm">投資與投機、財務防禦、時間魔法、自我認知</p>
                </div>
              </Link>
              {/* Arrow down */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-emerald-500/50 to-blue-500/50"></div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-blue-500/50"></div>
            </div>

            {/* Level 2 Wrapper (Main + Tooling Side) */}
            <div className="relative z-10 w-full max-w-4xl mb-16 flex flex-col md:flex-row justify-center items-center md:items-stretch gap-8">

              {/* Tooling (Side Branch Placeholder for alignment) */}
              <div className="hidden md:block w-1/3"></div>

              {/* Main Level 2 */}
              <div className="w-full max-w-sm relative group">
                <Link href="/education/skill-tree/level-2-basic">
                  <div className="h-full p-6 rounded-3xl bg-blue-500/10 backdrop-blur-lg border-2 border-blue-500/30 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-blue-500/20 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                      <span className="text-3xl">🛡️</span>
                    </div>
                    <h3 className="text-xl font-bold text-blue-400 mb-2">Level 2：基礎裝備</h3>
                    <p className="text-foreground/70 text-sm">資產類別、市場運作、被動投資學 (ETF)</p>
                  </div>
                </Link>
                {/* Horizontal line to Tooling on desktop */}
                <div className="absolute top-1/2 left-full w-12 h-1 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 hidden md:block z-[-1]"></div>

                {/* Vertical line down to Level 3 bus */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-blue-500/50 hidden md:block"></div>
                {/* Mobile fallback straight line */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-1 h-16 bg-gradient-to-b from-blue-500/50 to-amber-500/50 md:hidden"></div>
              </div>

              {/* Tooling Side Branch */}
              <div className="w-full max-w-sm md:w-1/3 relative group">
                <a href="https://stockinvestoriq.com/" target="_blank" rel="noopener noreferrer" className="block h-full">
                  <div className="h-full p-4 rounded-3xl bg-cyan-500/10 backdrop-blur-lg border-2 border-cyan-500/30 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:border-solid">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-2">
                      <span className="text-2xl">⚔️</span>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-1">實戰工具</h3>
                    <p className="text-foreground/70 text-xs">StockInvestorIQ<br />篩選股票神兵利器</p>
                    <div className="mt-2 text-cyan-300/80 text-[10px] flex items-center gap-1">
                      <span>前往外部工具</span>
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Level 3 */}
            <div className="relative z-10 w-full max-w-5xl mb-16 flex flex-col md:flex-row gap-6 lg:gap-8 justify-center">

              {/* Branch A: Fundamental */}
              <div className="w-full md:w-1/3 max-w-sm mx-auto relative group">
                {/* Horizontal bus line to the right */}
                <div className="absolute -top-8 left-1/2 -right-3 lg:-right-4 h-1 bg-gradient-to-r from-amber-500/50 to-blue-500/50 hidden md:block"></div>
                {/* Connecting line down from horizontal bus on desktop */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-amber-500/50 hidden md:block"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-amber-500/50 hidden md:block z-20"></div>

                <Link href="/education/skill-tree/level-3-fundamental">
                  <div className="h-full p-5 rounded-3xl bg-amber-500/10 backdrop-blur-lg border-2 border-amber-500/30 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-amber-500/20 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                    <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center mb-3">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-lg font-bold text-amber-400 mb-2">Level 3 (A)<br />基本面分析</h3>
                    <p className="text-foreground/70 text-xs">財報解讀、護城河、估值模型、總經</p>
                  </div>
                </Link>
                {/* Branch joining line down */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-amber-500/50 hidden md:block"></div>
                {/* Horizontal line to the right to join L4 */}
                <div className="absolute -bottom-8 left-1/2 -right-3 lg:-right-4 h-1 bg-gradient-to-r from-amber-500/50 to-indigo-500/50 hidden md:block"></div>
                {/* Mobile fallback straight line */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-amber-500/50 md:hidden"></div>
              </div>

              {/* Branch B: Technical */}
              <div className="w-full md:w-1/3 max-w-sm mx-auto relative group">
                {/* Horizontal bus line across */}
                <div className="absolute -top-8 -left-3 lg:-left-4 -right-3 lg:-right-4 h-1 bg-blue-500/50 hidden md:block"></div>
                {/* Connecting line down from horizontal bus on desktop */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-purple-500/50 hidden md:block"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-purple-500/50 hidden md:block z-20"></div>

                <Link href="/education/skill-tree/level-3-technical">
                  <div className="h-full p-5 rounded-3xl bg-purple-500/10 backdrop-blur-lg border-2 border-purple-500/30 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-purple-500/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                    <div className="w-14 h-14 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                      <span className="text-2xl">📈</span>
                    </div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">Level 3 (B)<br />技術面分析</h3>
                    <p className="text-foreground/70 text-xs">價格行為、技術指標、價量關係</p>
                  </div>
                </Link>
                {/* Branch joining line down */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-purple-500/50 hidden md:block"></div>
                {/* Horizontal line across to join L4 */}
                <div className="absolute -bottom-8 -left-3 lg:-left-4 -right-3 lg:-right-4 h-1 bg-indigo-500/50 hidden md:block"></div>
                {/* Joint arrow down to L4 */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-indigo-500/50 hidden md:block"></div>
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-indigo-500/50 hidden md:block"></div>
                {/* Mobile fallback straight line */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-purple-500/50 md:hidden"></div>
              </div>

              {/* Branch C: Chips */}
              <div className="w-full md:w-1/3 max-w-sm mx-auto relative group">
                {/* Horizontal bus line to the left */}
                <div className="absolute -top-8 -left-3 lg:-left-4 right-1/2 h-1 bg-gradient-to-r from-blue-500/50 to-rose-500/50 hidden md:block"></div>
                {/* Connecting line down from horizontal bus on desktop */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-rose-500/50 hidden md:block"></div>
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-rose-500/50 hidden md:block z-20"></div>

                <Link href="/education/skill-tree/level-3-chips">
                  <div className="h-full p-5 rounded-3xl bg-rose-500/10 backdrop-blur-lg border-2 border-rose-500/30 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-rose-500/20 hover:shadow-[0_0_30px_rgba(244,63,94,0.3)]">
                    <div className="w-14 h-14 rounded-full bg-rose-500/20 flex items-center justify-center mb-3">
                      <span className="text-2xl">🕵️</span>
                    </div>
                    <h3 className="text-lg font-bold text-rose-400 mb-2">Level 3 (C)<br />籌碼面分析</h3>
                    <p className="text-foreground/70 text-xs">法人買賣超、融資券、主力進出</p>
                  </div>
                </Link>
                {/* Branch joining line down */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-rose-500/50 hidden md:block"></div>
                {/* Horizontal line to the left to join L4 */}
                <div className="absolute -bottom-8 -left-3 lg:-left-4 right-1/2 h-1 bg-gradient-to-r from-indigo-500/50 to-rose-500/50 hidden md:block"></div>
                {/* Mobile fallback straight line */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-rose-500/50 md:hidden"></div>
              </div>
            </div>

            {/* Level 4 */}
            <div className="relative z-10 w-full max-w-sm mb-12 group mt-8 md:mt-0">
              <Link href="/education/skill-tree/level-4-advanced">
                <div className="p-6 rounded-3xl bg-indigo-500/10 backdrop-blur-lg border-2 border-indigo-500/30 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-indigo-500/20 hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                  <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
                    <span className="text-3xl">🧠</span>
                  </div>
                  <h3 className="text-xl font-bold text-indigo-400 mb-2">Level 4：高階戰術</h3>
                  <p className="text-foreground/70 text-sm">資產配置 (MPT)、資金控管、行為財務學</p>
                </div>
              </Link>
              {/* Arrow down */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-indigo-500/50 to-slate-500/50"></div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-slate-500/50"></div>
            </div>

            {/* Level 5 */}
            <div className="relative z-10 w-full max-w-sm mb-12 group">
              <Link href="/education/skill-tree/level-5-pro">
                <div className="p-6 rounded-3xl bg-slate-800/40 backdrop-blur-lg border-2 border-slate-600/50 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-slate-700/50 hover:shadow-[0_0_30px_rgba(148,163,184,0.3)]">
                  <div className="w-16 h-16 rounded-full bg-slate-600/20 flex items-center justify-center mb-4 border border-slate-500/30">
                    <span className="text-3xl">💼</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-300 mb-2">Level 5：專業領域</h3>
                  <p className="text-foreground/70 text-sm">衍生性商品、量化交易、另類投資</p>
                </div>
              </Link>
              {/* Arrow down */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-slate-500/50 to-yellow-500/50"></div>
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-yellow-500/50"></div>
            </div>

            {/* Level 6 (Endgame) & DLC */}
            <div className="relative z-10 w-full max-w-3xl flex flex-col sm:flex-row justify-center items-center sm:items-end gap-8 mt-4">

              {/* Level 6 */}
              <div className="w-full max-w-sm group order-2 sm:order-1 relative">
                <div className="absolute -inset-4 bg-yellow-500/10 blur-2xl rounded-full z-0 group-hover:bg-yellow-500/20 transition-all duration-500"></div>
                <Link href="/education/skill-tree/level-6-endgame" className="relative z-10 block">
                  <div className="p-8 rounded-3xl bg-gradient-to-b from-yellow-900/40 to-background backdrop-blur-lg border-2 border-yellow-500/50 flex flex-col items-center justify-center text-center transition-all duration-500 hover:scale-105 hover:border-yellow-400 hover:shadow-[0_0_40px_rgba(234,179,8,0.4)]">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300/30 to-amber-600/30 flex items-center justify-center mb-4 border border-yellow-400/50 animate-pulse">
                      <span className="text-4xl">👑</span>
                    </div>
                    <h3 className="text-2xl font-black bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent mb-2">Level 6：終局目標</h3>
                    <p className="text-yellow-100/80 text-sm font-medium">財富自由 (FIRE)、資產保全、家族傳承</p>
                  </div>
                </Link>
              </div>

              {/* DLC */}
              <div className="w-full max-w-[240px] group order-1 sm:order-2 self-center sm:self-stretch">
                <Link href="/education/skill-tree/dlc-real-estate" className="block h-full">
                  <div className="h-full p-4 rounded-3xl bg-cyan-950/40 backdrop-blur-lg border-2 border-cyan-700/50 border-dashed flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 hover:bg-cyan-900/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:border-solid relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-cyan-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">DLC</div>
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-3 mt-2">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <h3 className="text-lg font-bold text-cyan-400 mb-1">房地產大亨</h3>
                    <p className="text-cyan-200/60 text-xs">REITs、槓桿房貸、租金流</p>
                  </div>
                </Link>
              </div>

            </div>

          </div>
        </section>

        {/* 投資理財教學文章 Section */}
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3 drop-shadow-sm">
            <span className="text-3xl">📚</span>
            投資理財教學文章
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Balance Sheet */}
            <Link href="/education/balance-sheet" className="group">
              <div className="h-full relative p-6 rounded-2xl bg-foreground/5 backdrop-blur-lg border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/10 hover:shadow-[0_10px_20px_-10px_rgba(225,29,72,0.3)]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center mr-4 border border-rose-500/30 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">資產負債表分析</h3>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed">檢視企業資產品質與負債結構，掌握公司真實財務體質。</p>
              </div>
            </Link>

            {/* Income Statement */}
            <Link href="/education/income-statement" className="group">
              <div className="h-full relative p-6 rounded-2xl bg-foreground/5 backdrop-blur-lg border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/10 hover:shadow-[0_10px_20px_-10px_rgba(245,158,11,0.3)]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mr-4 border border-amber-500/30 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">損益表分析</h3>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed">拆解營收、毛利與淨利，評估企業核心業務的獲利能力。</p>
              </div>
            </Link>

            {/* Cash Flow */}
            <Link href="/education/cash-flow" className="group">
              <div className="h-full relative p-6 rounded-2xl bg-foreground/5 backdrop-blur-lg border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/10 hover:shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mr-4 border border-emerald-500/30 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">現金流量表分析</h3>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed">追蹤企業真實金流進出，避開帳面獲利但缺乏現金的陷阱。</p>
              </div>
            </Link>

          {/* DCF */}
            <Link href="/education/dcf" className="group">
              <div className="h-full relative p-6 rounded-2xl bg-foreground/5 backdrop-blur-lg border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/10 hover:shadow-[0_10px_20px_-10px_rgba(79,70,229,0.3)]">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mr-4 border border-indigo-500/30 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📈</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">DCF 教學</h3>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed">深入了解現金流折現模型，計算企業內在價值與合理買點。</p>
              </div>
            </Link>

            {/* Howard Marks Memos */}
            <Link href="/education/howard-marks-memos" className="group sm:col-span-2 lg:col-span-3">
              <div className="h-full relative p-6 rounded-2xl bg-amber-900/10 backdrop-blur-lg border border-amber-500/20 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:bg-amber-900/20 hover:shadow-[0_10px_30px_-10px_rgba(245,158,11,0.3)]">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl pointer-events-none">H</div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center mr-4 border border-amber-600/30 group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📜</span>
                  </div>
                  <h3 className="text-xl font-bold text-amber-500">跟著 Howard Marks 走過歷史: The Memo</h3>
                </div>
                <p className="text-foreground/60 text-sm leading-relaxed max-w-3xl">收錄橡樹資本創辦人霍華．馬克斯從 1990 年至今的經典備忘錄。如同線上小說般，一頁一頁走過大師的思維歷程，學習洞察市場週期與投資心理學。</p>
              </div>
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
}

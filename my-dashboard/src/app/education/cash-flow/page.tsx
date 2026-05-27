import Link from 'next/link';

export default function CashFlowPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-emerald-500 hover:text-emerald-400 transition-colors mb-6 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            回首頁
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mr-6 border border-emerald-500/30">
              <span className="text-3xl">💰</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">現金流量表分析</h1>
          </div>
          <p className="text-xl text-foreground/60 mt-4 max-w-4xl">
            點擊下方主題卡片，前往專文教學，深入了解企業真實的金流進出，避開帳面獲利的陷阱。
          </p>
        </div>

        {/* External Links Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <a href="https://rich01.com/what-cash-flow-statement/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-emerald-400 transition-colors">1. 一分鐘看懂現金流量表</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    認識營業、投資與籌資現金流三大板塊，掌握企業現金的真實來龍去脈。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-emerald-500 font-medium group-hover:text-emerald-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 2 */}
          <a href="https://rich01.com/what-is-depreciation-amortization/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-emerald-400 transition-colors">2. 折舊與攤銷是什麼？</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    了解非現金支出如何影響淨利，以及為什麼在計算現金流時必須將它們加回。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-emerald-500 font-medium group-hover:text-emerald-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 3 */}
          <a href="https://rich01.com/what-is-capital-expenditure/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-emerald-400 transition-colors">3. 資本支出 (CapEx)</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    企業為了維持或擴大營運所購買的長期資產，看出公司對未來發展的企圖心。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-emerald-500 font-medium group-hover:text-emerald-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 4 */}
          <a href="https://rich01.com/4150-4/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-emerald-400 transition-colors">4. 自由現金流 (FCF)</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    投資人最在乎的指標！公司在扣除必要支出後，真正可以自由運用的現金。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-emerald-500 font-medium group-hover:text-emerald-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 5 */}
          <a href="https://rich01.com/blog-pos-24/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-emerald-400 transition-colors">5. 如何判斷倒閉風險？</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    獲利不等於有錢！學會用現金流指標判斷公司是否面臨「黑字破產」的危機。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-emerald-500 font-medium group-hover:text-emerald-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

        </div>
      </div>
    </main>
  );
}

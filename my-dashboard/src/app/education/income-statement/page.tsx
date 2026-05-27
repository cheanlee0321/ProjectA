import Link from 'next/link';

export default function IncomeStatementPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors mb-6 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            回首頁
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mr-6 border border-amber-500/30">
              <span className="text-3xl">📊</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">損益表分析</h1>
          </div>
          <p className="text-xl text-foreground/60 mt-4">
            點擊下方主題卡片，前往專文教學，深入了解損益表的各項細節與獲利指標。
          </p>
        </div>

        {/* External Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <a href="https://rich01.com/what-is-income-statement/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors">1. 一分鐘看懂損益表</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    了解企業的獲利全貌，一次看懂營收、毛利、營業利益與淨利的差異。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 2 */}
          <a href="https://rich01.com/1-revenue/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors">2. 營業收入 (Revenue)</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    公司的第一道現金流水口，分析營收成長動能與認列方式。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 3 */}
          <a href="https://rich01.com/cost-of-revenue/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors">3. 營業成本 (Cost of Revenue)</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    產品製造與服務提供的直接花費，解析影響毛利率的關鍵要素。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 4 */}
          <a href="https://rich01.com/income-statement-interest-expense-0/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-amber-400 transition-colors">4. 利息費用 (Interest Expense)</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    企業借錢的代價，評估財務槓桿風險與償債能力的必看指標。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
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

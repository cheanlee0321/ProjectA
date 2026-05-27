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

        </div>
      </div>
    </main>
  );
}

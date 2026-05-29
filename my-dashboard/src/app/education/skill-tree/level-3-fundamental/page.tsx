import Link from 'next/link';

export default function Level3Fundamental() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-amber-400 mb-4">Level 3 分支 A：基本面分析</h1>
          <p className="text-xl text-foreground/80">企業調查員</p>
          <div className="mt-6 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-foreground leading-relaxed">
              主動選股玩家的必經之路。從財報看透企業體質，評估內在價值。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">財報解讀</h2>
            <p className="text-foreground/80">損益表（看賺錢能力）、資產負債表（看體質健康）、現金流量表（看真實存活率）。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">企業護城河</h2>
            <p className="text-foreground/80">品牌優勢、轉換成本、網絡效應、成本優勢。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">估值模型</h2>
            <p className="text-foreground/80">本益比（P/E）、股價淨值比（P/B）、現金流折現模型（DCF）。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">總體經濟</h2>
            <p className="text-foreground/80">利率、通貨膨脹、GDP、央行政策對市場的影響。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function Level2Basic() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-blue-400 mb-4">Level 2：基礎裝備</h1>
          <p className="text-xl text-foreground/80">市場認知與被動流派</p>
          <div className="mt-6 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-foreground leading-relaxed">
              了解遊戲規則與可用的武器。對於不想花太多時間盯盤的玩家，點滿這區的「被動投資」就能獲得很好的長期被動收益。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">資產類別認識</h2>
            <p className="text-foreground/80">股票、債券、外匯、房地產、大宗商品、加密貨幣的特性與風險。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">市場運作機制</h2>
            <p className="text-foreground/80">了解交易所、券商、買賣報價、手續費與滑價。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">被動投資學（懶人神技）</h2>
            <p className="text-foreground/80">指數化投資概念、ETF（指數股票型基金）的運作原理與挑選原則。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

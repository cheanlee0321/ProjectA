import Link from 'next/link';

export default function Level1Beginner() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-400 mb-4">Level 1：新手村</h1>
          <p className="text-xl text-foreground/80">核心心法與財務基底</p>
          <div className="mt-6 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-foreground leading-relaxed">
              在這個階段，重點不是「賺多少錢」，而是「不亂虧錢」並建立正確的防禦觀念。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">投資 vs. 投機（起點技能）</h2>
            <ul className="list-disc pl-6 space-y-2 text-foreground/80">
              <li><strong>投資：</strong> 買入並持有能持續產生現金流或具備長期成長價值的資產（如好公司的股票），關注的是「資產本身的價值」。</li>
              <li><strong>投機：</strong> 預測價格的短期波動來賺取價差，關注的是「下一個人願意出多少錢買」。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">個人財務防禦</h2>
            <p className="text-foreground/80">記帳習慣、建立緊急預備金（至少 6 個月生活費）、債務管理（理清壞債與好債）。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">時間魔法</h2>
            <p className="text-foreground/80">理解「複利效應」（Compound Interest）與「貨幣時間價值」。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">自我認知</h2>
            <p className="text-foreground/80">風險承受度評估（你是保守型、穩健型還是積極型玩家？）。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

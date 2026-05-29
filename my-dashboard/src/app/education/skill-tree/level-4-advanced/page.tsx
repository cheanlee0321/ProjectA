import Link from 'next/link';

export default function Level4Advanced() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-400 mb-4">Level 4：高階戰術</h1>
          <p className="text-xl text-foreground/80">資金與心智控管</p>
          <div className="mt-6 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-foreground leading-relaxed">
              到了這個級別，技術已經不是決勝關鍵，「風險管理」與「克服人性」才是長期存活的秘密。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">資產配置（Asset Allocation）</h2>
            <p className="text-foreground/80">現代投資組合理論（MPT），如何透過股債配置或多元資產來降低整體波動率。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">資金控管</h2>
            <p className="text-foreground/80">凱利公式（Kelly Criterion）、單筆交易的最大虧損控制（例如不超過總資金 2%）、停損與停利的紀律。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">行為財務學</h2>
            <p className="text-foreground/80">認知並克服人性偏誤（如：損失厭惡、沉沒成本謬誤、過度自信、群眾心理）。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

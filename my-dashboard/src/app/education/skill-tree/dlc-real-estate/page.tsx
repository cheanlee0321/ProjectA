import Link from 'next/link';

export default function DLCRealEstate() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-bold tracking-wider uppercase">DLC 擴充包</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-400 mb-4">房地產大亨</h1>
          <p className="text-xl text-foreground/80">特定職業支線</p>
          <div className="mt-6 p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-foreground leading-relaxed">
              跳脫股市，轉向實體資產與特許金融商品。學習運用槓桿與租金收益建立強大的被動現金流。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">REITs (不動產投資信託)</h2>
            <p className="text-foreground/80">讓小資金也能參與商辦、購物中心收租的證券化商品操作。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">槓桿操作與房貸策略</h2>
            <p className="text-foreground/80">了解寬限期、理財型房貸、利率環境對房地產槓桿的影響。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">現金流租金計算</h2>
            <p className="text-foreground/80">租金投報率 (Cap Rate) 估算、維護成本、空租期風險評估。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

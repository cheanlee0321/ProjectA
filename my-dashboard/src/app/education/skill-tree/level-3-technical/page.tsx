import Link from 'next/link';

export default function Level3Technical() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-purple-400 mb-4">Level 3 分支 B：技術面分析</h1>
          <p className="text-xl text-foreground/80">市場心理學家</p>
          <div className="mt-6 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-foreground leading-relaxed">
              透過價格與成交量洞悉市場情緒與籌碼動向。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">價格行為</h2>
            <p className="text-foreground/80">K線圖（陰陽燭）、支撐與壓力線、趨勢通道。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">技術指標</h2>
            <p className="text-foreground/80">移動平均線（MA）、相對強弱指標（RSI）、MACD。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">價量關係</h2>
            <p className="text-foreground/80">價格與成交量的配合，判斷籌碼動向與市場情緒。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

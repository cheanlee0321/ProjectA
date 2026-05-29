import Link from 'next/link';

export default function Level3Chips() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-rose-400 hover:text-rose-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-rose-400 mb-4">Level 3 分支 C：籌碼面分析</h1>
          <p className="text-xl text-foreground/80">市場追蹤者</p>
          <div className="mt-6 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-foreground leading-relaxed">
              掌握資金流向，就能知道誰在影響價格。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">三大法人買賣超</h2>
            <p className="text-foreground/80">追蹤外資、投信、自營商的動向，了解大資金的布局與市場方向。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">融資融券餘額</h2>
            <p className="text-foreground/80">解讀散戶信心指標與潛在的軋空、殺多行情。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">主力券商進出追蹤</h2>
            <p className="text-foreground/80">透過分點券商資料，尋找特定主力的佈局足跡（俗稱：抓大戶）。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">內部人持股異動</h2>
            <p className="text-foreground/80">觀察董監事與大股東的持股增減，判斷公司高層對未來營運的信心。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

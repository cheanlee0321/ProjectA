import Link from 'next/link';

export default function DCFModelPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-8 py-6 border-b border-foreground/10 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">互動式DCF模型</h1>
        </div>
      </header>

      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="p-8 rounded-3xl bg-foreground/5 border border-foreground/10 shadow-sm">
            <h2 className="text-xl font-bold mb-4">模型建置中...</h2>
            <p className="text-foreground/60">
              這裡將提供互動式自由現金流折現（DCF）模型，讓您可以調整營收成長率、利潤率及折現率等參數，動態計算企業的內在價值。
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

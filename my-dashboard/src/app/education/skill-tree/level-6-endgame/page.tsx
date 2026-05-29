import Link from 'next/link';

export default function Level6Endgame() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-yellow-400 hover:text-yellow-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12 relative">
          <div className="absolute -inset-10 bg-yellow-500/20 blur-3xl rounded-full z-0 pointer-events-none"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🌟</span>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent">Level 6：終局目標</h1>
            </div>
            <p className="text-xl text-foreground/80 font-medium">財富自由與傳承</p>
            <div className="mt-6 p-6 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <p className="text-foreground leading-relaxed">
                當玩家封頂後，投資的終極目的其實是「如何花錢」與「如何傳承」。這是打倒最終 Boss 後，玩家享受世界和平的階段。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">FIRE 運動 (提早退休)</h2>
            <p className="text-foreground/80 mb-2"><strong>4% 法則 (Safe Withdrawal Rate)：</strong> 如何評估您的投資組合是否能安全支撐每年的提領。</p>
            <p className="text-foreground/80"><strong>現金流護城河：</strong> 建立足以涵蓋生活費的穩定股息與債息收入。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">資產保全與傳承</h2>
            <p className="text-foreground/80 mb-2"><strong>信託概念：</strong> 如何利用信託機制保護資產、避免紛爭與揮霍。</p>
            <p className="text-foreground/80 mb-2"><strong>遺產稅務規劃：</strong> 跨代傳承時的合法節稅與稅務準備策略。</p>
            <p className="text-foreground/80"><strong>家族財富管理：</strong> 建立家族辦公室概念，實現真正的財富永續。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';

export default function Level5Pro() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-slate-300 hover:text-slate-100 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-300 drop-shadow-md mb-4">Level 5：專業領域</h1>
          <p className="text-xl text-foreground/80">封頂玩家的擴充包</p>
          <div className="mt-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <p className="text-foreground leading-relaxed">
              專業投資人（如避險基金經理、量化交易員）會涉獵的複雜領域。一般散戶不一定要點擊這些技能，但了解它們有助於看懂市場的全貌。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">衍生性金融商品</h2>
            <p className="text-foreground/80">期貨（Futures）、選擇權（Options）、權證的避險與槓桿策略。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">量化交易與程式碼</h2>
            <p className="text-foreground/80">演算法交易、回測系統建立、使用 Python 進行資料抓取與模型分析。</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">另類投資</h2>
            <p className="text-foreground/80">私募股權（PE）、創投（VC）、對沖基金策略（如多空套利）。</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">稅務與法規套利</h2>
            <p className="text-foreground/80">跨國稅務規劃、利用法規差異進行的合法套利。</p>
          </section>
        </div>
      </div>
    </main>
  );
}

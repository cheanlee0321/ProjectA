import Link from 'next/link';

export default function BalanceSheetPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-rose-400 hover:text-rose-300 transition-colors mb-6 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            回首頁
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mr-6 border border-rose-500/30">
              <span className="text-3xl">⚖️</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">資產負債表分析</h1>
          </div>
          <p className="text-xl text-foreground/60 mt-4">
            點擊下方主題卡片，前往專文教學，深入了解資產負債表的各項細節。
          </p>
        </div>

        {/* External Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1 */}
          <a href="https://rich01.com/what-is-balance-sheet-4/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-rose-400 transition-colors">1. 一分鐘看懂資產負債表</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    了解「資產 = 負債 + 股東權益」的基礎概念，看懂企業的財務快照。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-rose-500 font-medium group-hover:text-rose-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 2 */}
          <a href="https://rich01.com/what-is-intangible-assets/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-rose-400 transition-colors">2. 無形資產是什麼？</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    解析專利、商標與商譽的秘密，以及投資人必須留意的「商譽減損」地雷。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-rose-500 font-medium group-hover:text-rose-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 3 */}
          <a href="https://rich01.com/what-is-additional-paid-in-capital/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-rose-400 transition-colors">3. 資本公積是什麼？</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    白話解釋「不用靠做生意賺來的錢」，並破解企業吃老本配息的假象。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-rose-500 font-medium group-hover:text-rose-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

          {/* Card 4 */}
          <a href="https://rich01.com/what-is-retained-earnings/" target="_blank" rel="noopener noreferrer" className="group">
            <div className="h-full relative p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.3)]">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-rose-400 transition-colors">4. 保留盈餘是什麼？</h3>
                  <p className="text-foreground/60 text-base leading-relaxed">
                    看懂企業長期獲利與再投資能力的關鍵，了解公司如何運用存下來的資金。
                  </p>
                </div>
                <div className="mt-6 flex items-center text-rose-500 font-medium group-hover:text-rose-400 transition-colors">
                  <span>閱讀文章</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>

        </div>
      </div>
    </main>
  );
}

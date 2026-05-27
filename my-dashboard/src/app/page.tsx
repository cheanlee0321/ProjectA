import Link from 'next/link';

export default function PortalPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6 md:p-12 lg:p-24 relative overflow-hidden">
      
      {/* Background Orbs for Glassmorphism effect */}
      <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 drop-shadow-lg">
            投資決策中心
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            全方位掌握市場動態與個股價值，請選擇您要前往的分析模組。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          
          {/* Dashboard Card */}
          <Link href="/dashboard" className="group">
            <div className="h-full relative p-8 md:p-12 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)]">
              {/* Inner Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mb-8 border border-indigo-500/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl">📊</span>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">風險指標儀表板</h2>
                  <p className="text-foreground/60 text-lg leading-relaxed">
                    監控總體經濟、市場結構、流動性與情緒指標。即時串接資料，預判大盤泡沫與風險。
                  </p>
                </div>
                <div className="mt-8 flex items-center text-indigo-400 font-medium group-hover:text-indigo-300 transition-colors">
                  <span>進入儀表板</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Fundamental Analysis Card */}
          <Link href="/fundamental" className="group">
            <div className="h-full relative p-8 md:p-12 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(225,29,72,0.3)]">
              {/* Inner Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/20 flex items-center justify-center mb-8 border border-rose-500/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl">🏢</span>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-1">個股基本面分析</h2>
                  <p className="text-rose-400/80 text-sm font-medium mb-4">註: 基本面一週更新一次</p>
                  <p className="text-foreground/60 text-lg leading-relaxed">
                    深度解析美台股的財務報表、獲利能力與成長潛力，發掘具備長期護城河的標的。
                  </p>
                </div>
                <div className="mt-8 flex items-center text-rose-400 font-medium group-hover:text-rose-300 transition-colors">
                  <span>開始分析</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Watchlist Card */}
          <Link href="/watchlist" className="group">
            <div className="h-full relative p-8 md:p-12 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]">
              {/* Inner Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-8 border border-amber-500/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl">⭐</span>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">我的追蹤清單</h2>
                  <p className="text-foreground/60 text-lg leading-relaxed">
                    將您感興趣的個股加入清單，在此集中管理並即時查看最新報價與漲跌幅狀態。
                  </p>
                </div>
                <div className="mt-8 flex items-center text-amber-500 font-medium group-hover:text-amber-400 transition-colors">
                  <span>查看清單</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Report Library Card */}
          <Link href="/reports" className="group">
            <div className="h-full relative p-8 md:p-12 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]">
              {/* Inner Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-8 border border-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h2 className="text-3xl font-bold text-foreground mb-4">投資報告圖書館</h2>
                  <p className="text-foreground/60 text-lg leading-relaxed">
                    上傳、解析並集中管理您的投資研究報告，支援純文字與 Word 格式，讓您隨時隨地回顧重要分析。
                  </p>
                </div>
                <div className="mt-8 flex items-center text-emerald-500 font-medium group-hover:text-emerald-400 transition-colors">
                  <span>進入圖書館</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

        </div>



        {/* Footer / Contact Info & Disclaimer */}
        <div className="mt-24 text-center flex flex-col items-center">
          <div className="text-foreground/40 text-sm font-medium mb-8">
            <p className="mb-1">聯絡資訊</p>
            <a href="mailto:projectanalyzer0321@gmail.com" className="text-indigo-400/80 hover:text-indigo-300 transition-colors">
              projectanalyzer0321@gmail.com
            </a>
          </div>
          
          <div className="max-w-4xl text-xs text-foreground/30 leading-relaxed text-justify md:text-center">
            免責聲明： 投資決策中心所提供的財務數據與工具，純屬資訊交流與教育培訓之目的。我們並非投資顧問、證券經紀商或投資公司，且本文（或本平台）中的任何內容均不構成投資建議或推薦。所有資訊均依第三方來源之「現狀」提供，不保證其準確性、完整性或即時性。投資伴隨風險，包括可能損失本金。在做出任何投資決策之前，請務必自行進行徹底的盡職調查。投資決策中心對因使用此處資訊而導致的任何損失概不負責。
          </div>
        </div>
      </div>
    </main>
  );
}

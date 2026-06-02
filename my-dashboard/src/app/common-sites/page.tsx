import Link from 'next/link';

export default function CommonSitesPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-teal-500 hover:text-teal-400 font-medium inline-flex items-center mb-6 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首頁
        </Link>
        <h1 className="text-4xl font-extrabold text-foreground mb-4 flex items-center gap-3">
          <span className="text-teal-500">🔗</span> 常用網站
        </h1>
        <p className="text-foreground/60 text-lg">
          精選投資必備網站，提供篩選器、總經數據、與財報分析等實用連結。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <a href="https://www.interactivebrokers.com/" target="_blank" rel="noopener noreferrer" className="group">
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2">Interactive Brokers</h3>
            <p className="text-foreground/60 text-sm flex-grow">全球領先的券商平台，提供全方位的投資與交易服務。</p>
            <div className="mt-4 flex items-center text-teal-500 font-medium group-hover:text-teal-400 transition-colors">
              <span>前往網站</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </a>
        
        <a href="https://stockinvestoriq.com/" target="_blank" rel="noopener noreferrer" className="group">
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2">StockInvestorIQ</h3>
            <p className="text-foreground/60 text-sm flex-grow">強大的美股篩選工具，尋找符合條件的投資標的。</p>
            <div className="mt-4 flex items-center text-teal-500 font-medium group-hover:text-teal-400 transition-colors">
              <span>前往網站</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </a>
        
        <a href="https://simplywall.st/dashboard" target="_blank" rel="noopener noreferrer" className="group">
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2">Simply Wall St</h3>
            <p className="text-foreground/60 text-sm flex-grow">以視覺化圖表呈現個股基本面與估值分析。</p>
            <div className="mt-4 flex items-center text-teal-500 font-medium group-hover:text-teal-400 transition-colors">
              <span>前往網站</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </a>

        <a href="https://www.futunn.com/hk" target="_blank" rel="noopener noreferrer" className="group">
          <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors h-full flex flex-col">
            <h3 className="text-xl font-bold mb-2">富途牛牛 (Futu)</h3>
            <p className="text-foreground/60 text-sm flex-grow">提供即時行情、交易與活躍的投資者社群。</p>
            <div className="mt-4 flex items-center text-teal-500 font-medium group-hover:text-teal-400 transition-colors">
              <span>前往網站</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}

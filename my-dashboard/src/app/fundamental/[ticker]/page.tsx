import { fetchFullFundamentalData } from '@/lib/fundamental';
import ClientFundamentalView from '@/components/fundamental/ClientFundamentalView';
import Link from 'next/link';
import { getUserApiKeys } from '@/lib/keys';

export default async function FundamentalDetailPage({ params }: { params: { ticker: string } }) {
  // Await the params object itself in Next.js 15 before destructuring
  const resolvedParams = await params;
  const ticker = resolvedParams.ticker.toUpperCase();
  const keys = await getUserApiKeys();
  
  const isTaiwan = ticker.endsWith('.TW') || ticker.endsWith('.TWO');
  if ((isTaiwan && !keys.finmind) || (!isTaiwan && !keys.fmp)) {
    return (
      <main className="min-h-screen bg-background p-6 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="relative z-10 text-center glass-panel p-12 rounded-3xl max-w-lg">
          <div className="text-5xl mb-6">🔑</div>
          <h1 className="text-3xl font-bold mb-4 text-foreground">缺少 API 金鑰</h1>
          <p className="text-foreground/60 mb-8 leading-relaxed">
            查詢 {isTaiwan ? '台灣' : '美國'} 股票基本面需要使用 {isTaiwan ? 'Finmind Token' : 'FMP (Financial Modeling Prep) API Key'}。
            <br/><br/>
            系統未偵測到您的專屬金鑰，也無法使用預設金鑰。請前往設定頁面填寫。
          </p>
          <Link href="/settings" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-medium transition-colors inline-block shadow-lg shadow-blue-500/20">
            前往設定金鑰
          </Link>
          <div className="mt-6">
            <Link href="/fundamental" className="text-sm text-foreground/40 hover:text-foreground/60 transition-colors">
              返回搜尋
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const data = await fetchFullFundamentalData(ticker, keys.fmp, keys.finmind);

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 lg:p-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-7xl mx-auto relative">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/fundamental" className="text-foreground/50 hover:text-foreground transition-colors flex items-center group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回搜尋
          </Link>
        </div>

        {data && data.profile ? (
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-foreground/10 pb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground mb-2 flex items-center gap-4 flex-wrap">
                {data.profile.companyName}
                <span className="text-2xl font-medium text-foreground/50 px-4 py-1 border border-foreground/10 rounded-full bg-foreground/5">
                  {ticker}
                </span>
                {data.fetchDate && (
                  <span className="text-sm font-normal text-foreground/40 ml-4 md:ml-6 tracking-wide whitespace-nowrap self-end pb-2">
                    (資料取得日期: {data.fetchDate})
                  </span>
                )}
              </h1>
              <div className="text-foreground/60 text-lg flex items-center gap-4 mt-4">
                <span>{data.profile.exchangeShortName}</span>
                <span>•</span>
                <span>{data.profile.industry}</span>
                <span>•</span>
                <span className="text-foreground/80">{data.profile.currency}</span>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 text-right">
              <div className="text-5xl font-bold text-foreground mb-2">
                ${data.profile.price?.toFixed(2) || '0.00'}
              </div>
              <div className={`text-xl font-medium flex items-center justify-end ${data.profile.changes > 0 ? 'text-safe' : 'text-danger'}`}>
                {data.profile.changes > 0 ? '▲' : '▼'} {Math.abs(data.profile.changes || 0).toFixed(2)} 
              </div>
            </div>
          </div>
        ) : (
          <div className="text-foreground text-center mt-20">
            <h1 className="text-4xl font-bold mb-4">找不到代號 {ticker} 的資料</h1>
            <p className="text-foreground/50">這可能是因為代號錯誤，或是 API 暫時無法取得該股票數據。</p>
          </div>
        )}

        {data && <ClientFundamentalView data={data} />}
      </div>
    </main>
  );
}

import { fetchFullFundamentalData } from '@/lib/fundamental';
import ClientFundamentalView from '@/components/fundamental/ClientFundamentalView';
import Link from 'next/link';

export default async function FundamentalDetailPage({ params }: { params: { ticker: string } }) {
  // Await the params object itself in Next.js 15 before destructuring
  const resolvedParams = await params;
  const ticker = resolvedParams.ticker.toUpperCase();
  const data = await fetchFullFundamentalData(ticker);

  return (
    <main className="min-h-screen bg-[#050505] p-6 md:p-12 lg:p-24 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-7xl mx-auto relative">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/fundamental" className="text-white/50 hover:text-white transition-colors flex items-center group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回搜尋
          </Link>
        </div>

        {data && data.profile ? (
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-4">
                {data.profile.companyName}
                <span className="text-2xl font-medium text-white/50 px-4 py-1 border border-white/10 rounded-full bg-white/5">
                  {ticker}
                </span>
              </h1>
              <div className="text-white/60 text-lg flex items-center gap-4 mt-4">
                <span>{data.profile.exchangeShortName}</span>
                <span>•</span>
                <span>{data.profile.industry}</span>
                <span>•</span>
                <span className="text-white/80">{data.profile.currency}</span>
              </div>
            </div>
            
            <div className="mt-6 md:mt-0 text-right">
              <div className="text-5xl font-bold text-white mb-2">
                ${data.profile.price?.toFixed(2) || '0.00'}
              </div>
              <div className={`text-xl font-medium flex items-center justify-end ${data.profile.changes > 0 ? 'text-green-400' : 'text-rose-400'}`}>
                {data.profile.changes > 0 ? '▲' : '▼'} {Math.abs(data.profile.changes || 0).toFixed(2)} 
              </div>
            </div>
          </div>
        ) : (
          <div className="text-white text-center mt-20">
            <h1 className="text-4xl font-bold mb-4">找不到代號 {ticker} 的資料</h1>
            <p className="text-white/50">這可能是因為代號錯誤，或是 API 暫時無法取得該股票數據。</p>
          </div>
        )}

        {data && <ClientFundamentalView data={data} />}
      </div>
    </main>
  );
}

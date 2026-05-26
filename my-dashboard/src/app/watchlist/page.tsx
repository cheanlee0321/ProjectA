export const dynamic = 'force-dynamic';
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import yahooFinance from 'yahoo-finance2'

export default async function WatchlistPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-4">請先登入</h1>
        <p className="text-foreground/60 mb-8">登入後即可管理您的專屬股票追蹤清單。</p>
        <Link href="/" className="px-6 py-3 rounded-full font-bold transition-all shadow-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20">
          返回首頁
        </Link>
      </div>
    )
  }

  const { data: watchlistData } = await supabase
    .from('watchlists')
    .select('symbols')
    .eq('user_id', user.id)
    .single()

  const rawSymbols = watchlistData?.symbols || []
  
  let quotes: any[] = []
  if (rawSymbols.length > 0) {
    try {
      const symbolsToFetch = rawSymbols.map((item: any) => item.symbol)
      const res = await yahooFinance.quote(symbolsToFetch)
      quotes = Array.isArray(res) ? res : [res]
    } catch (err) {
      console.error('Failed to fetch quotes:', err)
    }
  }

  const enhancedList = rawSymbols.map((item: any) => {
    const quote = quotes.find((q: any) => q.symbol === item.symbol)
    return {
      ...item,
      price: quote?.regularMarketPrice || null,
      change: quote?.regularMarketChange || null,
      changePercent: quote?.regularMarketChangePercent || null,
      name: quote?.shortName || quote?.longName || item.symbol
    }
  })

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -left-1/4 w-3/4 h-[600px] bg-rose-500/5 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>

      <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center mb-12 z-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter flex items-center">
            <span className="text-5xl mr-4">⭐</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-rose-500">
              我的追蹤清單
            </span>
          </h1>
          <p className="text-foreground/60 text-lg font-medium tracking-wide">
            管理您感興趣的股票。即時報價由 Yahoo Finance 提供。
          </p>
        </div>
        <Link href="/" className="px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/25 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 flex items-center whitespace-nowrap">
          ← 返回首頁
        </Link>
      </div>

      <div className="w-full max-w-5xl z-10">
        {enhancedList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-foreground/5 border border-foreground/10 rounded-3xl text-center px-6">
            <div className="text-6xl mb-6 opacity-50">👀</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">清單空空如也</h2>
            <p className="text-foreground/60 text-lg max-w-md mx-auto leading-relaxed mb-8">
              您目前沒有追蹤任何股票。<br/>請前往「個股基本面分析」搜尋您關注的股票，並點擊右上角加入追蹤清單。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enhancedList.map((stock: any) => {
              const isUp = stock.changePercent && stock.changePercent > 0;
              const isDown = stock.changePercent && stock.changePercent < 0;
              
              return (
                <Link href={`/fundamental/${stock.symbol}`} key={stock.symbol} className="group relative bg-foreground/5 border border-foreground/10 p-6 rounded-3xl hover:bg-foreground/10 hover:border-foreground/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden flex flex-col justify-between">
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-indigo-400 transition-colors">{stock.symbol}</h3>
                      <p className="text-sm text-foreground/50 truncate max-w-[150px]">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black font-mono tracking-tighter">
                        {stock.price !== null ? stock.price.toFixed(2) : '-'}
                      </div>
                      <div className={`text-lg font-semibold flex items-center justify-end ${isUp ? 'text-emerald-400' : isDown ? 'text-rose-400' : 'text-foreground/40'}`}>
                        {isUp && '▲ '}
                        {isDown && '▼ '}
                        {stock.changePercent !== null ? Math.abs(stock.changePercent).toFixed(2) + '%' : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-foreground/40 font-medium">
                    <span>加入於 {stock.addedAt}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

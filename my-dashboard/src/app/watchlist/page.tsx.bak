export const dynamic = 'force-dynamic';
import { getUserWatchlist, toggleWatchlist } from '@/app/actions/watchlist'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import YahooFinance from 'yahoo-finance2'

const yahooFinance = new YahooFinance();

export const revalidate = 60 // Revalidate quotes every 60 seconds

export default async function WatchlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const watchlist = await getUserWatchlist()
  
  let quotes: any[] = []
  if (watchlist.length > 0) {
    try {
      const symbols = watchlist.map(w => w.symbol)
      const res = await yahooFinance.quote(symbols)
      quotes = Array.isArray(res) ? res : [res]
    } catch (e) {
      console.error('Error fetching watchlist quotes:', e)
    }
  }

  const data = watchlist.map(item => {
    // Yahoo Finance sometimes returns symbols with different suffixes (e.g. .TW vs .TWO), so we match smartly
    const exactMatch = quotes.find(q => q.symbol === item.symbol)
    const fuzzyMatch = !exactMatch ? quotes.find(q => q.symbol.split('.')[0] === item.symbol.split('.')[0]) : null
    const quote = exactMatch || fuzzyMatch

    return {
      symbol: item.symbol,
      addedAt: new Date(item.created_at).toLocaleDateString('zh-TW'),
      price: quote?.regularMarketPrice || null,
      change: quote?.regularMarketChange || null,
      changePercent: quote?.regularMarketChangePercent || null,
      name: quote?.shortName || quote?.longName || item.symbol
    }
  })

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 lg:p-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-7xl mx-auto relative">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
              <span className="text-5xl">‚≠?/span> ?ëÁ?ËøΩËπ§Ê∏ÖÂñÆ
            </h1>
            <p className="text-foreground/60 mt-4 text-lg">
              ÁÆ°Á??®Ê??àË∂£?ÑËÇ°Á•®„ÄÇÂç≥?ÇÂ†±?πÁî± Yahoo Finance ?ê‰???            </p>
          </div>
          <Link href="/" className="text-foreground/50 hover:text-foreground transition-colors flex items-center group bg-foreground/5 px-4 py-2 rounded-full border border-foreground/10 hover:border-foreground/20">
            ËøîÂ?È¶ñÈ?
          </Link>
        </div>

        {data.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center justify-center border border-dashed border-foreground/20">
            <div className="text-6xl mb-6 opacity-50">?î≠</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Ê∏ÖÂñÆÁ©∫Á©∫Â¶Ç‰?</h2>
            <p className="text-foreground/60 mb-8 max-w-md">
              ?®È?Ê≤íÊ?ËøΩËπ§‰ªª‰??°Á•®?ÇÂ?ÂæÄ?åÂÄãËÇ°?∫Êú¨?¢Â??ê„ÄçÊ?Â∞ãÊÇ®?âË?Ë∂???°Á•®Ôºå‰∏¶ÈªûÊ??üÊ??†ÂÖ•ËøΩËπ§?ßÔ?
            </p>
            <Link href="/fundamental" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1">
              ?ãÂ??úÂ??°Á•®
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {data.map(stock => {
              const isUp = stock.change !== null && stock.change >= 0;
              const isDown = stock.change !== null && stock.change < 0;
              
              return (
                <Link href={`/fundamental/${stock.symbol}`} key={stock.symbol}>
                  <div className="glass-panel p-6 rounded-2xl h-full flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-foreground/20 border border-foreground/10 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-foreground/5 to-transparent rounded-bl-[100px] -z-10 group-hover:scale-110 transition-transform"></div>
                    
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">{stock.symbol}</h2>
                        {/* Interactive remove button inside Link requires e.preventDefault, which we skip here for simplicity. 
                            Users can remove it by entering the detail page. */}
                      </div>
                      <p className="text-foreground/50 text-sm truncate font-medium mb-6" title={stock.name}>
                        {stock.name}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-foreground">
                          {stock.price !== null ? stock.price.toFixed(2) : '-'}
                        </div>
                        <div className={`text-lg font-semibold flex items-center ${isUp ? 'text-safe' : isDown ? 'text-danger' : 'text-foreground/40'}`}>
                          {isUp && '??}
                          {isDown && '??}
                          {stock.changePercent !== null ? Math.abs(stock.changePercent).toFixed(2) + '%' : ''}
                        </div>
                      </div>
                      <div className="mt-4 text-xs text-foreground/30 flex justify-between items-center border-t border-foreground/10 pt-4">
                        <span>?†ÂÖ•??{stock.addedAt}</span>
                        <span className="flex items-center text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          ?ÜÊ? <span className="text-lg leading-none ml-1">??/span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}


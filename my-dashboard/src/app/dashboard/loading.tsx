export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 -left-1/4 w-3/4 h-[600px] bg-rose-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 -right-1/4 w-3/4 h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" style={{animationDelay: '2s'}}></div>

      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-16 z-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            風險指標儀表板
          </h1>
          <p className="text-foreground/60 text-lg md:text-xl font-medium tracking-wide max-w-2xl leading-relaxed">
            綜合 15 項總經、市場結構與關鍵情緒指標，偵測系統性泡沫與修正風險。
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 rounded-full bg-foreground/5 w-32 h-12 animate-pulse"></div>
          <div className="px-6 py-3 rounded-full bg-rose-500/10 w-32 h-12 animate-pulse"></div>
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col gap-12 z-10">
        
        {/* Loading Message */}
        <div className="w-full flex flex-col items-center justify-center min-h-[400px] bg-foreground/5 border border-foreground/10 rounded-3xl p-8 backdrop-blur-md">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6"></div>
          <h2 className="text-2xl font-bold text-foreground mb-2">正在載入市場指標資料...</h2>
          <p className="text-foreground/60">正在為您即時抓取各項總經與市場數據，請稍候</p>
        </div>

      </div>
    </main>
  );
}

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
        
        {/* Top Section: AI Summary Skeleton */}
        <div className="w-full">
          <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 relative z-10 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-[300px] animate-pulse">
            <div className="text-4xl mb-4 animate-bounce">✨</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Gemini AI 正在分析中...</h2>
            <p className="text-foreground/60 text-sm">請稍候，正在綜合各項指標為您生成市場摘要</p>
          </div>
        </div>

        {/* Indicators Grid Skeleton */}
        <div className="space-y-12">
          
          {/* Section 1 Skeleton */}
          <div>
            <div className="flex items-center mb-8 border-b border-foreground/10 pb-4">
              <div className="w-12 h-12 bg-foreground/10 rounded-2xl mr-4 animate-pulse"></div>
              <div className="w-48 h-8 bg-foreground/10 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-foreground/5 border border-foreground/10 rounded-3xl p-6 h-[250px] animate-pulse flex flex-col">
                  <div className="w-3/4 h-6 bg-foreground/10 rounded mb-4"></div>
                  <div className="flex flex-col h-[80px] justify-center items-center gap-2 mb-6">
                    <div className="text-xl font-bold tracking-tight text-foreground/40">Loading data ...</div>
                  </div>
                  <div className="w-full h-1 bg-foreground/10 rounded-full mb-6"></div>
                  <div className="w-full h-12 bg-foreground/10 rounded mt-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 Skeleton */}
          <div>
            <div className="flex items-center mb-8 border-b border-foreground/10 pb-4">
              <div className="w-12 h-12 bg-foreground/10 rounded-2xl mr-4 animate-pulse"></div>
              <div className="w-48 h-8 bg-foreground/10 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-foreground/5 border border-foreground/10 rounded-3xl p-6 h-[250px] animate-pulse flex flex-col">
                  <div className="w-3/4 h-6 bg-foreground/10 rounded mb-4"></div>
                  <div className="flex flex-col h-[80px] justify-center items-center gap-2 mb-6">
                    <div className="text-xl font-bold tracking-tight text-foreground/40">Loading data ...</div>
                  </div>
                  <div className="w-full h-1 bg-foreground/10 rounded-full mb-6"></div>
                  <div className="w-full h-12 bg-foreground/10 rounded mt-auto"></div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}

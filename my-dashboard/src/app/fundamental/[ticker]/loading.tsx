export default function Loading() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-12 lg:p-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-7xl mx-auto relative">
        <div className="mb-8 flex items-center justify-between">
          <div className="w-24 h-6 bg-foreground/10 rounded animate-pulse"></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-foreground/10 pb-8">
          <div className="w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-12 md:h-16 w-64 bg-foreground/10 rounded-xl animate-pulse"></div>
              <div className="h-8 w-24 bg-foreground/10 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <div className="h-5 w-32 bg-foreground/10 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-foreground/10 rounded animate-pulse"></div>
              <div className="h-5 w-20 bg-foreground/10 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="mt-6 md:mt-0 text-right w-full md:w-auto flex flex-col items-end">
            <div className="h-12 w-32 bg-foreground/10 rounded-xl mb-2 animate-pulse"></div>
            <div className="h-6 w-24 bg-foreground/10 rounded animate-pulse"></div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mb-6 shadow-[0_0_15px_rgba(225,29,72,0.5)]"></div>
            <h2 className="text-xl font-medium text-foreground animate-pulse">正在載入基本面數據與分析模型...</h2>
            <p className="text-foreground/50 mt-2 text-sm">這可能需要幾秒鐘的時間</p>
          </div>
        </div>
        
        {/* Placeholder for tabs and content */}
        <div className="mt-12 w-full h-12 bg-foreground/5 rounded-lg animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-foreground/5 rounded-2xl animate-pulse col-span-1 md:col-span-2"></div>
          <div className="h-64 bg-foreground/5 rounded-2xl animate-pulse col-span-1"></div>
        </div>
      </div>
    </main>
  );
}

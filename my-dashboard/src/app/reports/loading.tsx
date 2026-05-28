export default function ReportsLoading() {
  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* 骨架屏頂部：標題與按鈕區塊 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-3">
            <div className="w-64 h-10 bg-foreground/5 rounded-xl animate-pulse"></div>
            <div className="w-96 h-5 bg-foreground/5 rounded-lg animate-pulse"></div>
          </div>
          <div className="w-32 h-12 bg-foreground/5 rounded-xl animate-pulse"></div>
        </div>

        {/* 骨架屏工具列：搜尋與篩選 */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 h-12 bg-foreground/5 rounded-xl animate-pulse"></div>
          <div className="w-full md:w-48 h-12 bg-foreground/5 rounded-xl animate-pulse"></div>
        </div>

        {/* 骨架屏網格：報告卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-3xl p-6 h-64 flex flex-col animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="w-16 h-8 bg-foreground/10 rounded-lg"></div>
                <div className="w-24 h-6 bg-foreground/10 rounded-md"></div>
              </div>
              <div className="w-3/4 h-8 bg-foreground/10 rounded-lg mb-3"></div>
              <div className="w-full h-4 bg-foreground/10 rounded-md mb-2"></div>
              <div className="w-5/6 h-4 bg-foreground/10 rounded-md mt-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

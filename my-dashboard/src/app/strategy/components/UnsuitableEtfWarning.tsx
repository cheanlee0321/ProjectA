export function UnsuitableEtfWarning() {
  return (
    <div className="mb-12 p-6 md:p-8 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg">
      <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
        <span className="mr-2">🛡️</span> 核心反思：為何此策略「絕對不適用」於 1 倍原型 ETF？
      </h3>
      <div className="space-y-6 text-foreground/80 text-sm">
        <p className="text-base font-medium text-cyan-200">
          如果我們將此紅綠燈策略套用在 1 倍大盤 (100% SPY) 上，即使是零延遲的完美操作，總報酬也僅有 301.91%，遠遠落後於無腦 Buy & Hold SPY 的 569.21%！為什麼防禦策略反而成了絆腳石？
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-background/40 p-5 rounded-2xl border border-cyan-500/10">
            <h4 className="text-lg font-bold text-cyan-300 mb-2">1. 致命的拖累報酬 (Cash Drag)</h4>
            <p>當指標進入紅黃燈時，資金會轉為現金閒置。對於 1 倍大盤來說，股市長期是向上的，為了躲避短期波動而持有現金，會讓您錯失無可挽回的「長期複利」。錯過上漲比躲過下跌更傷。</p>
          </div>

          <div className="bg-background/40 p-5 rounded-2xl border border-cyan-500/10">
            <h4 className="text-lg font-bold text-cyan-300 mb-2">2. 防禦力溢出 (大材小用)</h4>
            <p>1 倍的 SPY 遇到空頭，頂多就是回撤 20%~30%，只要死抱不放，幾年內一定會創歷史新高。為了躲這點下跌而頻繁拔插頭進出場，反而是因小失大。</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-center">
          <p className="text-cyan-100 font-medium">
            <strong>🎯 最終結論：</strong>這個 FINRA 紅綠燈策略，是專門為「能放大數倍獲利、但也可能跌掉 80% 導致無法翻身」的<strong>槓桿 ETF (如 TQQQ / UPRO / SSO)</strong> 量身打造的避彈衣。如果您只想投資 100% SPY，最好的策略就是「關掉儀表板，無腦定期定額抱到退休」！
          </p>
        </div>
      </div>
    </div>
  );
}

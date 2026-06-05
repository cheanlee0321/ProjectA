export function UnsuitableEtfWarning() {
  return (
    <div className="mb-12 p-6 md:p-8 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 shadow-lg">
      <h3 className="text-2xl font-bold text-cyan-400 mb-6 flex items-center">
        <span className="mr-2">⚖️</span> 核心反思：1 倍原型 ETF 到底需不需要策略？
      </h3>
      <div className="space-y-6 text-foreground/80 text-sm">
        <p className="text-base font-medium text-cyan-200">
          當我們回顧 2010~2026 年的大牛市時，策略套用在 1 倍大盤上會造成嚴重的「現金拖累」，績效遠不如無腦 Buy & Hold。但當我們把時間拉長到涵蓋 2000 年與 2008 年的 27 年完整週期時，策略績效卻反過來輾壓了 Buy & Hold (QQQ 4819% vs 1428%)！這巨大的反差揭示了什麼？
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-background/40 p-5 rounded-2xl border border-cyan-500/10">
            <h4 className="text-lg font-bold text-cyan-300 mb-2">1. 躲過致命深淵的威力</h4>
            <p>在史詩級熊市中 (如 2000 年 NASDAQ 暴跌近 80%)，「少賠」的威力遠大於「多賺」。策略只要能帶領 1 倍大盤躲過一次致命的長期深淵，高檔停利變現省下來的本金，就能在下一個牛市起點創造難以想像的超額複利。</p>
          </div>

          <div className="bg-background/40 p-5 rounded-2xl border border-cyan-500/10 flex flex-col justify-between">
            <div>
              <h4 className="text-lg font-bold text-cyan-300 mb-2">2. 太平盛世的現金拖累 (Cash Drag)</h4>
              <p>反之，如果在沒有結構性崩盤的黃金年代 (如 2010-2021 年)，股市長期穩健向上。此時如果為了躲避 20% 等級的短期波動而頻繁轉為現金，反而會讓你錯失無可挽回的「長期複利」，此時防禦策略就成了絆腳石。</p>
            </div>
            <div className="mt-4 p-3 bg-cyan-900/30 rounded-xl border border-cyan-500/20 text-xs text-cyan-200">
              <strong className="block mb-1 text-sm text-cyan-300">📊 2010~2026 太平盛世回測對比：</strong>
              <ul className="space-y-1">
                <li>• 無腦 Buy & Hold QQQ：總報酬 <span className="text-emerald-400 font-bold">1391%</span></li>
                <li>• 策略套用 100% QQQ：總報酬僅 <span className="text-rose-400 font-bold">477%</span> (嚴重拖累)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-center">
          <p className="text-cyan-100 font-medium">
            <strong>🎯 最終結論：</strong>如果您對未來十年的總經環境極度樂觀 (認為不再有史詩級崩盤)，那麼投資 1 倍大盤最好的方式就是「關掉儀表板，無腦抱到退休」。但如果您相信如 2000 年或 2008 年這種「腰斬再腰斬」的系統性危機終將重演，那麼這套 FINRA 紅綠燈策略即使套用在 1 倍大盤上，也能為您帶來數倍的長線超額利潤！
          </p>
        </div>
      </div>
    </div>
  );
}

export function LiquidityExplanation() {
  return (
    <div id="liquidity-explanation" className="mb-12 p-6 md:p-8 rounded-3xl bg-blue-500/10 border border-blue-500/20 shadow-lg scroll-mt-24">
      <h3 className="text-2xl font-bold text-blue-300 mb-4 flex items-center">
        <span className="mr-2">🏦</span> 流動性指標：為什麼選擇 M0 作為分母？
      </h3>
      <p className="text-foreground/70 mb-6 leading-relaxed">
        在探討市場資金水位時，我們常聽到 M0、M1、M2 等名詞。為了精準衡量「虛擬信用槓桿」相對於「真實底層資金」的背離程度，本策略選擇使用 <strong>M0 (實體流通貨幣)</strong> 進行標準化。以下為各層級資金的本質差異：
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700">
          <h4 className="text-lg font-bold text-emerald-400 mb-2">M0 (貨幣基數)</h4>
          <p className="text-sm text-slate-300 mb-3">最底層、最原始的「真金白銀」。</p>
          <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
            <li>實體紙鈔與硬幣</li>
            <li>商業銀行在央行的準備金</li>
            <li><strong className="text-emerald-300">本策略使用的分母</strong></li>
          </ul>
        </div>
        
        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700">
          <h4 className="text-lg font-bold text-blue-400 mb-2">M1 (狹義貨幣)</h4>
          <p className="text-sm text-slate-300 mb-3">隨時可以動用、具有極高流動性的資金。</p>
          <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
            <li>包含 M0 所有項目</li>
            <li>活期存款 (支票帳戶等)</li>
            <li>開始產生銀行的「信用創造」</li>
          </ul>
        </div>

        <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-700">
          <h4 className="text-lg font-bold text-amber-400 mb-2">M2 (廣義貨幣)</h4>
          <p className="text-sm text-slate-300 mb-3">社會上整體的「潛在購買力」總和。</p>
          <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
            <li>包含 M1 所有項目</li>
            <li>儲蓄存款、小額定存</li>
            <li>零售貨幣市場基金 (MMF)</li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-900/20 p-5 rounded-2xl border border-blue-500/20">
        <h4 className="text-lg font-bold text-blue-300 mb-3 flex items-center">
          <span className="mr-2">🎯</span> 核心邏輯：為何不用 M2 而是 M0？
        </h4>
        <p className="text-foreground/80 text-sm leading-relaxed mb-3">
          如果使用 M2 當作分母，我們衡量的是「在社會整體財富中，有多少比例被拿去借錢炒股」，這是一個不錯的散戶情緒指標。但 M2 本身已經包含了大量的「信用擴張」（借貸衍生出來的錢）。
        </p>
        <p className="text-foreground/80 text-sm leading-relaxed">
          使用 <strong>M0（或淨流動性）</strong> 的邏輯更為強大與敏銳。M0 是金融體系的「絕對地基」，沒有經過任何槓桿膨脹。當 <strong>FINRA 融資餘額 / M0</strong> 飆高時，代表投資人「借錢買股的速度，遠遠超過了央行印鈔放水的速度」。這意味著市場的推動力已經從「資金氾濫」轉變為「純粹的投機信用擴張」，此時市場極度脆弱，隨時面臨連環追繳的去槓桿崩盤風險。
        </p>
      </div>
    </div>
  );
}

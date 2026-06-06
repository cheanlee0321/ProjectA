export function StrategyLimitations() {
  return (
    <div className="mb-12 p-6 md:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/20 shadow-lg">
      <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center">
        <span className="mr-2">⏳</span> 策略何時可能失效？(指標盲區與未來隱憂)
      </h3>
      <div className="space-y-6 text-foreground/80 text-sm">
        <p className="text-base font-medium text-amber-200 mb-4">
          雖然底層的「人性貪婪與恐懼循環」不變，但「開槓桿的工具」與「總經環境」正在發生劇變。我們必須認知到：<strong>紅燈代表絕對危險，但綠燈不代表絕對安全。</strong>此策略未來可能會遇到以下 6 大挑戰與限制：
        </p>

        <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
          <h4 className="text-lg font-bold text-amber-300 mb-2">1. 投機工具轉移 (0DTE 的隱形超級槓桿)</h4>
          <div className="space-y-3">
            <p>FINRA 僅統計「傳統券商的保證金借款 (Margin Debt)」。但在現代金融市場，最瘋狂的投機往往發生在統計之外：散戶大量轉向 <strong>0DTE (末日選擇權)</strong> 或加密貨幣高倍數合約；而機構則使用投行提供的<strong>總收益交換 (Total Return Swaps，如 Archegos 爆倉事件)</strong>。這會對指標產生兩種極端的盲區：</p>
            <ul className="list-disc pl-5 space-y-1 text-amber-100/80">
              <li><strong className="text-rose-400">當 FINRA 亮紅燈時 (雙重風險)：</strong>代表傳統現貨槓桿已極度擁擠，若再加上 0DTE 隱藏在表外的衍生性曝險，系統總槓桿將遠超歷史紀錄。一旦選擇權造市商被迫拋售避險 (Gamma Unwind)，將引發「選擇權踩踏現貨，現貨引爆融資斷頭」的死亡螺旋，下跌會比過去更為暴烈。</li>
              <li><strong className="text-emerald-400">當 FINRA 亮綠燈時 (最大隱患)：</strong>若投機資金完全棄用傳統融資，全面轉向 0DTE，可能導致 FINRA 數據長期處於低檔 (假綠燈)。這時指標將無法防禦由選擇權引爆的流動性危機，產生「假安全」的錯覺。</li>
            </ul>
          </div>
        </div>

        <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
          <h4 className="text-lg font-bold text-amber-300 mb-2">2. 閾值失效：紅燈可能「永遠亮不起來」</h4>
          <p>過去十幾年的零利率時代 (ZIRP) 借款成本極低，散戶容易將融資推升至 0.4 (紅燈)。但若未來進入「長期高利率 (Higher for Longer)」環境，券商融資利率可能高達 8%~12%。因為借錢太貴，市場可能永遠無法將融資餘額推升到 0.4。這會導致股市因其他因素崩盤時，指標仍停在「綠燈」，失去高檔避險的作用。高利率時代可能需要手動下調紅燈閾值 (例如降至 0.35)。</p>
        </div>

        <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
          <h4 className="text-lg font-bold text-amber-300 mb-2">3. 流通貨幣 (M0) 的定義局限</h4>
          <p>策略使用 M0 作為分母來消除印鈔幻覺，但 M0 只是基礎貨幣 (實體紙鈔加準備金)。在量化寬鬆 (QE) 與銀行體系複雜化的今天，有時 M2 (廣義貨幣供應量) 甚至全球央行流動性指標更能代表「在金融市場流竄的熱錢」。如果 M0 因為聯準會的技術性操作 (如準備金規定改變) 而產生劇烈波動，可能會讓分母失真，導致比值出現假訊號。</p>
        </div>

        <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
          <h4 className="text-lg font-bold text-amber-300 mb-2">4. 資金成本侵蝕：槓桿 ETF 的內建吸血鬼</h4>
          <p>3 倍槓桿 ETF (如 TQQQ) 是向銀行借入 2 份資金來操作。當無風險利率來到 5% 時，TQQQ 每年光是「付利息」就會內扣約 10% ~ 12% 的淨值！如果未來大盤只溫和上漲 4%，TQQQ 反而會因為利息與波動耗損而虧錢，導致策略效率大減。</p>
        </div>

        <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
          <h4 className="text-lg font-bold text-amber-300 mb-2">5. 被動投資泡沫 (ETF Bubble) 與流動性黑洞</h4>
          <p>正如電影《大賣空》主角 Michael Burry 所警告的，現代大眾的資金已經極度向被動式 ETF 集中。這破壞了市場的「價格發現」機制（Price Discovery）。當資金湧入時，ETF 被迫無腦買入成分股，推升指數；但當趨勢反轉（例如 FINRA 亮紅燈後的拋售潮），ETF 的結構會強迫進行無差別的成分股拋售。這將在未來導致市場瞬間失去流動性，引發比過去（如 2000 年或 2008 年）更快速、更無量跌停的「被動式踩踏死亡螺旋」。</p>
        </div>

        <div className="bg-background/40 p-5 rounded-2xl border border-amber-500/10">
          <h4 className="text-lg font-bold text-amber-300 mb-2">6. 策略容量極限與觀測者效應 (散戶的專屬特權)</h4>
          <p>任何量化策略都有其「容量極限」。如果這個紅綠燈策略被華爾街巨頭或數十萬散戶帶著百億資金同時使用，將會產生致命的觀測者效應：大量資金在綠燈時的融資買入本身就會推升 FINRA 數據（讓紅燈提早亮起），而在紅燈時的集體拋售則會引發嚴重的流動性踩踏與滑價，甚至成為引爆崩盤的「自我實現預言」。<strong className="text-emerald-400">但這正是散戶的最大優勢：</strong>因為資金體量小，散戶可以靈活進出，不受流動性與策略容量的限制。這是一個華爾街大鱷無法使用，專屬於靈活散戶的「特權策略」。</p>
        </div>

        <div className="mt-8 pt-6 border-t border-amber-500/20">
          <h4 className="text-xl font-bold text-amber-300 mb-4 flex items-center">
            <span className="mr-2">💡</span> 面對未來盲區的「策略進化建議」
          </h4>
          <ul className="list-decimal list-inside space-y-3 text-sm">
            <li><strong>多重指標交叉驗證：</strong>不要單靠 FINRA 指標。請隨時搭配 <strong>薩姆規則 (Sahm Rule)</strong> 確認實體衰退，並監控 <strong>VIX 與 NFCI (金融條件指數)</strong> 以防範突發的流動性枯竭。</li>
            <li><strong>加入「實質利率」作為雙重濾網：</strong>將 <strong>10 年期公債實質利率 (TIPS Yield)</strong> 納入考量。若實質利率突破 2% (資金極度昂貴)，即使 FINRA 仍是綠燈，也不該重壓 3 倍槓桿。</li>
            <li><strong>降檔位 (降低槓桿倍數)：</strong>在高利率環境下，不要執著於 3 倍的 TQQQ 或 UPRO，改用 <strong>2 倍槓桿</strong> 的 QLD 或 SSO。2 倍槓桿內部借貸成本只有 1 份，耗損大幅減少，長期績效往往反超 3 倍槓桿。</li>
            <li><strong>從「長抱」轉為「波段操作」：</strong>低利率時代您可以「綠燈買入後安心抱 3 年」；但在高利率時代市場容錯率極低，應縮短操作週期。只要獲利達到設定的滿足點，就主動將槓桿 ETF 降轉回 1 倍的原型指數鎖住利潤。</li>
            <li><strong>改用「動態 Z-Score」取代固定閾值：</strong>高利率環境會壓抑融資絕對值，未來可能難以觸及 0.4 的紅燈標準。建議改為計算 FINRA/M0 比值是否超過過去 5 年移動平均線的 +2 個標準差 (Z-Score &gt; 2)，無論利率高低皆能精準警示異常飆升。</li>
            <li><strong>升級流動性分母 (Fed Net Liquidity)：</strong>考慮將分母的 M0 替換成華爾街更關注的「淨流動性」(聯準會總資產 - TGA - RRP)。這會比單純的 M0 更即時、更精準地反映出真正在推升美股的熱錢水位。</li>
            <li><strong>不對等的進出場速度：</strong>股市中「上漲是階梯，下跌是電梯」。建議將「分 10 個月買賣」調整為非對稱模式：買入時分批慢買；但賣出時一旦亮紅燈，立刻先砍 40% ~ 50% 轉入短債 (SHV)，剩下的再分批賣出，以提早鎖定利潤防禦閃崩。</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

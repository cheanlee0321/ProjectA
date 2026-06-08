export function StrategyGuide() {
  return (
    <div className="flex flex-col gap-8">
      <div id="guide-rules" className="mb-12 p-6 md:p-8 rounded-3xl bg-violet-500/10 border border-violet-500/20 shadow-lg scroll-mt-24">
        <h3 className="text-2xl font-bold text-violet-300 mb-4 flex items-center">
          <span className="mr-2">💡</span> 紅黃綠燈操作規則
        </h3>
        <p className="text-foreground/70 text-sm mb-6 bg-violet-900/20 p-4 rounded-xl border border-violet-500/20">
          ⚠️ <strong>客製化提醒：</strong>以下定義的紅黃綠燈閾值 (0.30 與 0.40) 以及「分 10 個月買賣」的規則，皆為作者個人的偏好與歷史回測實驗設定，並非絕對真理。可以根據自身的風險承受度與對當下總經環境的判斷，自行微調這些參數。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-foreground/80">
          <div>
            <h4 className="text-lg font-semibold text-emerald-400 mb-2">🟢 綠燈區間 (比值 &lt; 0.3)</h4>
            <p><strong>常態佈局：</strong>當市場去槓桿完成，將資金分為 10 份，連續 10 個月分批買入 <strong>50% QQQ / 50% TQQQ</strong>（或 100% TQQQ）。此時散戶槓桿低，是開啟多頭循環的絕佳時機。</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-amber-400 mb-2">🟡 黃燈區間 (比值 0.3 - 0.4)</h4>
            <p className="mb-3"><strong>觀望調整：</strong>停止加碼槓桿 ETF (TQQQ/UPRO)，但<strong>持續買入 1 倍指數 (QQQ/SPY)</strong>。市場槓桿升高但尚未極端，此階段應降低風險敞口，用 1 倍指數維持市場曝險即可。已持有的槓桿部位不需急於賣出。</p>
            <div className="p-3 bg-amber-900/20 rounded-lg border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-2">
              <p><span className="mr-1">🔍</span> <strong>回測程式行為解密：</strong></p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>在推薦的「50/50 混搭」：</strong>若處於綠燈，每個月會將手邊閒置現金的 10% 拆成一半（5% 買槓桿、5% 買原型）；一旦進入黃燈，<strong>若前一個燈號是綠燈（市場正在升溫）</strong>，程式會踩剎車降檔，將這 10% 現金全部改為買入 1 倍原型指數。但<strong>若前一個燈號是紅燈（市場剛從崩盤中降溫）</strong>，為了避免過早接到掉下來的刀子，黃燈期間將直接執行 <code>pass</code>，暫停買進和紅燈的賣出，直到燈號降回綠燈才開始重新加碼。</li>
                <li><strong>在「100% 槓桿 (如純 TQQQ)」：</strong>由於目標配比中沒有 1 倍指數，進入黃燈時程式會直接執行 <code>pass</code>（暫停一切買進），保留手中閒置現金，直到燈號轉為綠燈才繼續加碼，或轉為紅燈才開始拋售。</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-rose-400 mb-2">🔴 紅燈區間 (比值 &gt; 0.4)</h4>
            <p><strong>警戒防守：</strong>立刻中斷任何買進計畫，開始將手中所有槓桿與指數部位分 10 個月平均賣出。<strong>賣出後的資金轉入短期美國公債 ETF (如 SHV、BIL、SGOV)</strong>，在等待期間仍可賺取無風險利息收入。若在賣出期間降為黃燈，則停止賣出。</p>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/80">
          <div>
            <h4 className="text-lg font-semibold text-amber-400 mb-2">⚡ 策略優缺點與歷史數據</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>優點：</strong>極佳的下檔保護。27 年回測顯示，無腦持有模擬 TQQQ 會面臨 99.96% 的實質歸零；而推薦的 50% QQQ / 50% TQQQ 混搭策略，將最大回撤控制在 71.60%，同時創造了 98,914% 的驚人報酬。</li>
              <li><strong>缺點：</strong>融資餘額數據具落後性（月底結算），且可能產生假突破導致頻繁切換買賣計畫。</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-blue-400 mb-2">🛡️ 推薦輔助指標</h4>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li><strong>NFCI & VIX：</strong>補足短期避險的即時指標，若資金環境緊縮或恐慌飆升，即使沒亮紅燈也應減碼。</li>
              <li><strong>Sahm Rule (薩姆規則)：</strong>確認實質性衰退是否開始。若與高融資紅燈同時出現，殺傷力極大。</li>
              <li><strong>紅燈資金停泊：</strong>推薦 <strong>SHV</strong> (iShares 短期公債)、<strong>BIL</strong> (SPDR 1-3月公債) 或 <strong>SGOV</strong> (iShares 0-3月公債)，年化利率約 4-5%，流動性極高且幾乎無波動。</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="guide-backtest-design" className="mb-12 p-6 md:p-8 rounded-3xl bg-violet-500/10 border border-violet-500/20 shadow-lg scroll-mt-24">
        <h3 className="text-2xl font-bold text-violet-300 mb-4 flex items-center">
          <span className="mr-2">📖</span> 回測實驗設計說明
        </h3>
        <div className="space-y-4 text-foreground/80 text-sm">
          <p>為了驗證這個紅綠燈策略的真實效果，我們將其分別套用在兩大美股指數 (QQQ 與 SPY) 以及它們對應的槓桿 ETF 上。這 5 個回測實驗分別代表以下意義：</p>
          <ul className="list-decimal list-inside space-y-3 ml-2">
            <li><strong className="text-violet-200 text-base">無腦 All-in (基準)：</strong>不看指標，買了就睡的對照組。用來驗證策略到底有沒有贏過單純抱住大盤。</li>
            <li><strong className="text-violet-200 text-base">無腦 All-in 槓桿：</strong>不看指標，買槓桿承受毀滅性風險的對照組。證明如果不搭配避險策略，槓桿 ETF 在 2022 等股災中有多危險。</li>
            <li><strong className="text-violet-200 text-base">策略指標 (100% 原型)：</strong>在涵蓋 2000 年與 2008 年崩盤的 27 年長週期中，策略成功避開了致命深淵，反而大幅勝出 Buy & Hold (QQQ: 4055% vs 1428%)。但在 2010~2026 的純牛市子區間中，頻繁進出場會造成現金拖累。此對照組用於展示長短週期的差異。</li>
            <li>
              <strong className="text-violet-200 text-base">策略指標 (50% 混搭)：</strong>最安全、高 CP 值的核心策略。用趨近大盤的風險，換取數倍的報酬率。
              <div className="mt-2 mb-1 p-3 bg-violet-900/20 border border-violet-500/20 rounded-lg text-sm text-violet-200/80 leading-relaxed ml-5">
                <span className="mr-1">💡</span> <strong>實務操作技巧：</strong>50% 的 1 倍 ETF 加上 50% 的 3 倍 ETF，總和恰好等於 2 倍曝險。實務上，您可以直接買入 <strong>100% QLD</strong> (對應 QQQ+TQQQ) 或 <strong>100% SSO</strong> (對應 SPY+UPRO) 來達到相同的曝險效果。直接持有 2 倍槓桿 ETF 不僅省去自行調配比例的麻煩，更能有效降低 3 倍槓桿內部昂貴的摩擦耗損與借貸成本。
              </div>
            </li>
            <li><strong className="text-violet-200 text-base">策略指標 (100% 槓桿)：</strong>高風險偏好者的純血爆發策略。在承受合理波動的前提下，將資產極大化。</li>
          </ul>

          <div className="mt-6 p-5 rounded-2xl bg-amber-950/30 border border-amber-500/20">
            <h4 className="text-lg font-bold text-amber-300 mb-2 flex items-center">
              <span className="mr-2">🚨</span> 回測期間的嚴重選擇偏誤 (Survivorship Bias) 說明
            </h4>
            <div className="space-y-2 text-amber-200/90 leading-relaxed">
              <p>
                本回測期間已擴展至 <strong>1999 年 3 月至 2026 年 4 月</strong> (透過模擬 3x ETF 補足 2010 年前的數據不足)。這 27 年涵蓋了 2000 年科技泡沫破裂 (NASDAQ 跌 78%) 與 2008 年金融海嘯。
              </p>
              <p>
                儘管策略成功避開了這兩次史詩級崩盤，但請注意，2010 年之後的 16 年幾乎完美覆蓋了人類金融史上最大的一次「央行放水多頭市場」(零利率 ZIRP + 狂暴 QE)。未來的宏觀環境若進入「長期高利率」或「停滯性通膨」，此回測的驚人報酬率可能無法再次複製，請對市場保持敬畏之心。
              </p>
            </div>
          </div>

          <div className="mt-6 p-5 rounded-2xl bg-violet-950/30 border border-violet-500/20">
            <h4 className="text-lg font-bold text-violet-300 mb-3 flex items-center">
              <span className="mr-2">💡</span> SPY 和 QQQ 的差別是什麼？
            </h4>
            <div className="space-y-3">
              <p>
                <strong className="text-violet-200">S&P 500 (SPY / UPRO)：</strong>代表美國全市場前 500 大企業，產業分散，<strong>波動與風險相對較低</strong>。搭配策略時，推薦的 50% SPY / 50% UPRO 混搭模式最大回撤為 49.86%，與無腦持有 1 倍 SPY 的 55.19% 相近甚至更低，卻帶來了 186 倍的最終資產。如果您傾向穩健，SPY 家族是好選擇。
              </p>
              <p>
                <strong className="text-violet-200">NASDAQ 100 (QQQ / TQQQ)：</strong>高度集中於科技巨頭，<strong>攻擊力極強但波動更大</strong>。在套用相同策略下，TQQQ 的報酬率遠超 UPRO，但也需要承受更劇烈的震盪。這也是為什麼我們特別推薦使用「50% QQQ + 50% TQQQ」的混搭模式來平衡風險。
              </p>
            </div>
          </div>
          <div className="mt-6 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
            <h4 className="text-lg font-bold text-emerald-300 mb-3 flex items-center">
              <span className="mr-2">🌍</span> 台灣散戶的 IBKR 稅務優勢 (無短期資本利得稅)
            </h4>
            <div className="space-y-3">
              <p>
                <strong className="text-emerald-200">免除美國資本利得稅：</strong> 作為填寫 W-8BEN 表格的台灣稅務居民（NRA 非居民外籍人士），在 IBKR 上買賣美股所賺取的價差是<strong>完全免除美國資本利得稅</strong>的，且<strong>沒有美國稅法中「短期交易 (Short-Term Capital Gains)」的高額懲罰稅率</strong>。
              </p>
              <p>
                這意味著本策略所建議的「分批買賣」與「波段操作」，在美國端不會產生額外的資本利得稅負擔。這使得台灣散戶在執行此類趨勢擇時策略時，相較於美國當地居民，具備得天獨厚的交易成本優勢。
              </p>
              <p className="text-emerald-200/70 text-xs">
                *註解：雖然美國端免稅，但獲利仍須依法計入台灣的「海外所得最低稅負制」。不過其申報與課稅免稅額門檻（目前為新台幣 750 萬元）相對寬鬆，一般散戶實務上極少會因一般的波段交易而被課到稅。且美股配發的「股息」仍會被預扣 30% 股息稅，但本策略主要獲利來源為價差而非股息。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

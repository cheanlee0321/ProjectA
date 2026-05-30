import Link from 'next/link';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';

export default function Level5Pro() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-slate-300 hover:text-slate-100 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-300 drop-shadow-md mb-4">Level 5：專業領域</h1>
          <p className="text-xl text-foreground/80">封頂玩家的擴充包</p>
          <div className="mt-6 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <p className="text-foreground leading-relaxed">
              專業投資人（如避險基金經理、量化交易員）會涉獵的複雜領域。一般散戶不一定要點擊這些技能，但了解它們有助於看懂市場的全貌。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* 衍生性金融商品 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">⚔️</span> 衍生性金融商品 (Derivatives)
            </h2>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-sm text-foreground/80">
              <p className="mb-6 leading-relaxed">
                衍生性商品的價值「衍生」自其他基礎資產（如股票、指數、黃金）。它們自帶極高的槓桿，原本發明是為了解決商業上的「避險」需求，如今卻成了專業玩家放大獲利的雙刃劍。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background/40 p-5 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-slate-300 mb-2">📜 期貨 (Futures)</h3>
                  <p className="text-sm leading-relaxed">
                    買賣雙方約定在「未來的某個時間點」，以「約定的價格」交易商品。保證金制度讓你只需拿出一小筆錢就能控制龐大資產。方向看錯時，會面臨被強制平倉（斷頭）甚至追繳保證金的風險。
                  </p>
                </div>
                <div className="bg-background/40 p-5 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-slate-300 mb-2">🎟️ 選擇權 (Options)</h3>
                  <p className="text-sm leading-relaxed">
                    <strong>「買方」就像付訂金買房：</strong>付 10 萬訂金 (權利金)，換取 3 個月內用 1000 萬買房的權利。房價大漲你賺翻；房價暴跌你大不了不要了，最多只賠 10 萬訂金（風險有限，獲利無限）。
                    <br/><br/>
                    <strong>「賣方」就像開保險公司：</strong>先收保費 (權利金)，但遇到極端災難時，要承擔理論上「無限大」的賠償風險。
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <CaseStudyAccordion title="高槓桿的絞肉機：期貨結算日大屠殺" icon="🩸" theme="slate">
                  <p className="mb-2">期貨與選擇權帶有極高的槓桿，一旦方向看錯，虧損不是算「百分比」，而是直接「破產還倒欠錢」：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-2">
                    <li><strong>保證金制度的雙刃劍：</strong> 假設你用 10 萬塊的保證金，買了一口價值 100 萬的期貨合約（10倍槓桿）。只要標的物下跌 10%，你的 10 萬塊本金就瞬間歸零。</li>
                    <li><strong>強制平倉 (斷頭)：</strong> 當虧損超過維持保證金時，如果你沒有立刻補錢進去，券商為了自保，會直接在市場上「市價砍倉」。這會引發連鎖反應，導致市場出現更劇烈的暴跌。</li>
                    <li><strong>結算日效應：</strong> 每個月的期貨結算日（例如台股的台指期結算），主力外資為了讓自己在期貨市場上的佈局賺錢，會刻意在現貨市場（股票）大量砸盤或拉抬，這天經常會出現不合常理的劇烈震盪，俗稱「大屠殺」。</li>
                  </ul>
                  <p className="mt-2 text-rose-400 font-bold">💡 實戰金句：</p>
                  <p>「別碰你看不懂的衍生性商品。」巴菲特曾說過：衍生性商品是大規模毀滅性金融武器。</p>
                </CaseStudyAccordion>

                <CaseStudyAccordion title="史詩級黑天鵝：2020 年原油期貨跌至「負油價」" icon="🛢️" theme="rose">
                  <p className="mb-2">這是金融史上最不可思議的一天，完美展示了期貨「實物交割」與「流動性枯竭」的終極風險：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-2">
                    <li><strong>事件背景：</strong> 2020 年 4 月，因疫情爆發導致全球封城，石油需求瞬間歸零。但產油國還在不斷產油，導致所有儲油槽與油輪全部爆滿。</li>
                    <li><strong>交割日恐慌：</strong> 5 月份 WTI 原油期貨合約即將在 4 月 21 日到期。對於那些純粹在金融市場上炒作、手上根本沒有儲油槽的投機客（多頭）來說，如果不在到期前把合約平倉（賣掉），他們就會被迫「真的去提領幾萬桶原油」。</li>
                    <li><strong>負油價誕生：</strong> 因為沒人有地方放石油，多頭投機客為了避免違約被罰天價違約金，開始不計代價瘋狂拋售合約。最終在 4 月 20 日，期貨價格跌破 0 元，最低來到 <strong>-37.63 美元/桶</strong>。</li>
                    <li><strong>這代表什麼？</strong> 意思是：「我不但不用付錢買原油，只要你願意把這些原油搬走，我還倒貼你 37 美元！」那些以為「油價跌到 0 就不會再跌」而進場抄底的散戶，瞬間破產並背上巨額債務。</li>
                  </ul>
                  <p className="mt-2 text-rose-400 font-bold">💡 實戰金句：</p>
                  <p>「在衍生品市場，永遠不要說『不可能』。流動性枯竭時，市場可以長時間維持極度不理性的狀態，久到足以讓你破產。」</p>
                </CaseStudyAccordion>
              </div>
            </div>
          </section>

          {/* 量化交易 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🤖</span> 量化交易與程式碼 (Quant Trading)
            </h2>
            <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-sm text-foreground/80">
              <p className="mb-6 leading-relaxed">
                將人類的主觀情緒與弱點完全剔除，把交易策略寫成嚴密的數學公式與程式碼，交由電腦 24 小時無情地執行。這是目前華爾街最主流的軍備競賽。
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4 p-4 bg-background/30 rounded-xl hover:bg-background/50 transition-colors">
                  <span className="text-2xl shrink-0">🐍</span>
                  <div>
                    <h4 className="font-bold text-slate-300">程式回測與大數據 (Python/R)</h4>
                    <p className="text-sm text-foreground/70 mt-1">利用程式語言抓取過去幾十年的海量歷史數據，來驗證你的交易策略在過去是否真的能賺錢。量化操盤手不靠感覺，只相信統計學上的期望值。</p>
                  </div>
                </li>
                <li className="flex gap-4 p-4 bg-background/30 rounded-xl hover:bg-background/50 transition-colors">
                  <span className="text-2xl shrink-0">⚡</span>
                  <div>
                    <h4 className="font-bold text-slate-300">高頻交易 (HFT)</h4>
                    <p className="text-sm text-foreground/70 mt-1">在微秒（百萬分之一秒）之間進行無數次交易，利用極微小的價格落差進行無風險套利。這需要頂級的伺服器與架設在交易所旁邊的光纖網路，一般散戶絕對無法參與。</p>
                  </div>
                </li>
              </ul>
              <div className="mt-6">
                <CaseStudyAccordion title="量化神話：年化報酬 66% 的大獎章基金 (Medallion Fund)" icon="🏆" theme="slate">
                  <p className="mb-2">提到量化交易，就不能不提文藝復興科技公司 (Renaissance Technologies) 旗下最神秘的「大獎章基金」。這是華爾街史上最賺錢的印鈔機：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-2">
                    <li><strong>創辦人是數學家：</strong> 創辦人吉姆·西蒙斯 (Jim Simons) 不是金融出身，而是世界級的幾何學家、前國防部密碼破譯員。他的團隊裡全是天文學家、物理學家和統計學家，幾乎不招募華爾街的金融人員。</li>
                    <li><strong>瘋狂的績效：</strong> 在 1988 年至 2018 年的 30 年間，大獎章基金的平均<strong>年化報酬率高達 66%</strong>（扣除高昂管理費後仍有 39%），徹底碾壓巴菲特與索羅斯。</li>
                    <li><strong>策略黑盒子：</strong> 他們的演算法從不公開，完全不看公司財報或基本面。而是透過抓取海量數據（連天氣、推特發文都能當作參數），在幾千種資產中尋找肉眼無法察覺的微小數學相關性，進行極高頻的套利。</li>
                    <li><strong>不對外開放：</strong> 這個基金只對公司內部員工開放，外部投資人就算有幾百億美金也買不到。</li>
                  </ul>
                  <p className="mt-2 text-slate-300 font-bold">💡 實戰結論：</p>
                  <p>「別跟機器人拼刺刀。」當你在螢幕前猶豫要不要停損時，華爾街的超級電腦已經在 0.001 秒內完成了上萬次交易。散戶要贏，靠的不是比速度或比聰明，而是利用機器人不具備的優勢：<strong>「長期的耐心與不需面臨贖回壓力的時間」</strong>。</p>
                </CaseStudyAccordion>
              </div>
            </div>
          </section>

          {/* 另類投資 */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
                  <span className="text-3xl">🦄</span> 另類投資 (Alternative)
                </h2>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-sm h-full hover:-translate-y-1 transition-transform">
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    跳脫傳統的股票與債券市場，追求與大盤連動性較低的絕對報酬。通常對資金門檻的要求極高。
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                    <li><strong>創投 (VC) 與私募股權 (PE)：</strong>在公司尚未上市前就先入股。風險極高（90%新創會倒閉），但如果投中下一個 Facebook 或 OpenAI，報酬率往往是百倍起跳。</li>
                    <li><strong>避險基金 (Hedge Funds)：</strong>不受一般共同基金法規限制，能隨意使用高槓桿、賣空等複雜策略，目標是不論牛熊市都要賺錢。</li>
                  </ul>
                </div>
              </div>

              {/* 稅務與法規套利 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
                  <span className="text-3xl">⚖️</span> 稅務與法規套利
                </h2>
                <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-sm h-full hover:-translate-y-1 transition-transform">
                  <p className="text-sm text-foreground/80 leading-relaxed mb-4">
                    「省下的 1 塊錢，就是扎扎實實賺到的 1 塊錢。」專業機構的獲利，有很大一部分來自於對規則的透徹理解。
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm text-foreground/80">
                    <li><strong>稅損收割 (Tax-Loss Harvesting)：</strong>在年底前故意賣出帳面上虧損的股票來抵銷獲利的稅金，節稅後再把股票買回來。</li>
                    <li><strong>跨國套利：</strong>利用不同國家的稅率差異、避稅天堂（如開曼群島），或是不同交易所之間的法規差異來進行合法套利。</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Next Level Button (Endgame) */}
        <div className="mt-16 mb-8 flex justify-center">
          <Link href="/education/skill-tree/level-6-endgame" className="group relative inline-flex items-center justify-center px-10 py-5 font-black text-yellow-950 transition-all duration-500 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 rounded-2xl hover:scale-105 hover:shadow-[0_0_40px_rgba(234,179,8,0.6)]">
            <span className="flex items-center gap-3 text-xl">
              👑 前往最終章：Level 6 終局目標
              <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            {/* Sparkle effects */}
            <div className="absolute inset-0 rounded-2xl border-2 border-yellow-300/50 animate-pulse"></div>
          </Link>
        </div>
      </div>
    </main>
  );
}

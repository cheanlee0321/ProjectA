import Link from 'next/link';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';

export default function Level3Technical() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-purple-400 mb-4">Level 3 分支 B：技術面分析</h1>
          <p className="text-xl text-foreground/80">市場心理學家</p>
          <div className="mt-6 p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <p className="text-foreground leading-relaxed">
              透過價格與成交量洞悉市場情緒與籌碼動向。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">價格行為 (Price Action)</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                「價格包容一切。」技術分析的核心假設是：所有基本面、消息面與市場情緒，最終都會反映在真實的交易價格上。而「價格行為」就是教你如何直接看懂市場留下的足跡。
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* K線圖 */}
                <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🕯️</span>
                    <h3 className="text-xl font-bold text-purple-400">K線圖 (陰陽燭)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <p className="leading-relaxed">一根 K 線記錄了特定時間內（如一天）的四個重要價格：<strong>開盤、最高、最低、收盤。</strong></p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong className="text-rose-500">紅K線 (陽線)：</strong>收盤 &gt; 開盤，代表買方獲勝。</li>
                      <li><strong className="text-emerald-500">綠K線 (陰線)：</strong>收盤 &lt; 開盤，代表賣方獲勝。（註：美股顏色通常相反）</li>
                      <li><strong>影線 (Shadow)：</strong>實體上下的細線。上影線長代表「漲上去被砸下來」(賣壓重)；下影線長代表「跌下去被買上來」(買盤強)。</li>
                    </ul>
                  </div>
                </div>

                {/* 支撐與壓力 */}
                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🧱</span>
                    <h3 className="text-xl font-bold text-indigo-400">支撐與壓力線</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <p className="leading-relaxed">市場是有記憶的，某些特定價格會形成心理關卡：</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong className="text-indigo-400">支撐線 (地板)：</strong>價格跌到這裡就跌不下去，因為買方覺得「夠便宜了」湧入護盤。</li>
                      <li><strong className="text-indigo-400">壓力線 (天花板)：</strong>價格漲到這裡就上不去，因為被套牢的人急著「解套」或獲利了結，形成賣壓。</li>
                    </ul>
                    <div className="bg-background/50 p-3 rounded-xl border border-foreground/5 mt-auto">
                      <p><span className="font-bold text-emerald-400">💡 突破法則：</span>壓力一旦被長紅K線用力突破，原來的「天花板」就會變成未來的「地板」（支撐）。</p>
                    </div>
                  </div>
                </div>

                {/* 趨勢通道 */}
                <div className="p-6 rounded-2xl bg-fuchsia-500/5 border border-fuchsia-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📈</span>
                    <h3 className="text-xl font-bold text-fuchsia-400">趨勢通道 (Trend Channels)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <p className="leading-relaxed">將走勢圖上的「高點與高點」連線，以及「低點與低點」連線，就能畫出行進的軌道。</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>上升趨勢：</strong>低點越來越高 (Higher Lows)，買方力量強勢，順勢做多。</li>
                      <li><strong>下降趨勢：</strong>高點越來越低 (Lower Highs)，賣方主導市場，不要輕易接刀子。</li>
                      <li><strong>盤整 (區間震盪)：</strong>在兩條水平線之間來回彈跳，沒有明確方向。</li>
                    </ul>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-3">
                  <CaseStudyAccordion title="技術分析的死穴：假突破 (False Breakout) 與雙巴盤整" icon="🪤" theme="purple">
                    <p className="mb-2">很多新手學了「突破壓力線就買進」的教科書理論，結果一買就套在最高點，這就是常遇到的「假突破」：</p>
                    <ul className="list-disc pl-5 space-y-2 mb-2">
                      <li><strong>場景：</strong> 股價盤整了半年，今天突然帶量突破前高壓力線。散戶看到突破訊號，紛紛興奮追價買入。</li>
                      <li><strong>真相：</strong> 這其實是主力刻意拉抬製造出的「誘多訊號」。當散戶瘋狂買進時，主力趁機把手上的大量籌碼倒貨給散戶。</li>
                      <li><strong>結果：</strong> 隔天股價直接一根大黑 K 跌回盤整區間內，甚至跌破支撐線，形成「假突破、真破底」。所有追高的散戶全數套牢。</li>
                    </ul>
                    <p className="mt-2 text-rose-400 font-bold">💡 實戰應對：</p>
                    <p>永遠不要百分之百相信突破訊號。在進場追高時，一定要嚴格設定「停損點」（例如：只要跌回原來的壓力線之下，就代表突破失敗，必須立刻認賠殺出）。</p>
                  </CaseStudyAccordion>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">技術指標 (Technical Indicators)</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                如果 K 線是市場留下的足跡，那技術指標就是透過數學公式幫你過濾雜訊的「輔助雷達」。但請記住，指標永遠是落後的（先有價格，才有指標），不能盲目迷信單一訊號。
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* MA */}
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">〰️</span>
                    <h3 className="text-xl font-bold text-blue-400">移動平均線 (MA)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 意義是什麼？</p>
                      <p className="leading-relaxed">將過去 N 天的收盤價加總平均畫成一條線，用來判斷趨勢方向。例如 20MA 代表過去 20 天進場買家的平均成本（俗稱月線）。</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 space-y-3 mt-auto">
                      <p><strong>🎯 如何應用：</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>均線之上：</strong>多頭排列，股價通常有支撐。</li>
                        <li><strong>黃金交叉：</strong>短均線向上穿過長均線（如 5MA 穿過 20MA），視為買進訊號。</li>
                        <li><strong>死亡交叉：</strong>短均線向下穿過長均線，視為賣出訊號。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* RSI */}
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📊</span>
                    <h3 className="text-xl font-bold text-amber-500">相對強弱指標 (RSI)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 意義是什麼？</p>
                      <p className="leading-relaxed">衡量市場「買賣力道強弱」的震盪指標。數值介於 0 到 100 之間，用來看市場是不是已經過度狂熱或過度恐慌。</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 space-y-3 mt-auto">
                      <p><strong>🎯 如何應用：</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>大於 70 (超買)：</strong>市場過熱，買方力量可能耗盡，隨時準備拉回。</li>
                        <li><strong>小於 30 (超賣)：</strong>市場恐慌，賣壓可能已宣洩完畢，隨時準備反彈。</li>
                        <li><strong>背離 (Divergence)：</strong>股價創新高，但 RSI 卻沒有創新高，暗示上漲動能衰退，反轉在即。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* MACD */}
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🌊</span>
                    <h3 className="text-xl font-bold text-rose-400">平滑異同移動平均線 (MACD)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 意義是什麼？</p>
                      <p className="leading-relaxed">升級版的均線系統。利用長短兩條指數移動平均線的「聚合」與「發散」，來過濾掉傳統 MA 的騙線假訊號。由快慢線與柱狀圖組成。</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 space-y-3 mt-auto">
                      <p><strong>🎯 如何應用：</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>零軸之上/之下：</strong>快慢線大於零為多頭市場，小於零為空頭市場。</li>
                        <li><strong>柱狀圖變色：</strong>紅柱縮短代表多頭動能減弱，綠柱縮短代表空頭動能減弱。</li>
                        <li><strong>主要功能：</strong>非常適合用來確認「大波段趨勢」的成形與結束，避免頻繁進出。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bollinger Bands */}
                <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🪀</span>
                    <h3 className="text-xl font-bold text-purple-400">布林通道 (Bollinger Bands)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 意義是什麼？</p>
                      <p className="leading-relaxed">由 20MA（中軌）與上下 2 個標準差（上軌、下軌）構成的價格通道。統計學上，95% 的價格波動都會在通道內發生。</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 space-y-3 mt-auto">
                      <p><strong>🎯 如何應用：</strong></p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>盤整行情最佳工具：</strong>股價碰上軌賣出，碰下軌買進（高拋低吸）。</li>
                        <li><strong>通道收窄 (Squeeze)：</strong>代表行情即將面臨重大突破（方向未知），一旦帶量突破軌道，通常會引發大波段趨勢。</li>
                        <li><strong>布林漫步：</strong>在強烈多頭/空頭趨勢中，股價會緊貼著上軌/下軌持續前進，此時不應逆勢操作。</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">經典圖形型態 (Chart Patterns)</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                市場參與者的集體心理變化（貪婪與恐懼），會在價格圖表上留下特定的形狀。辨識這些型態，是找出高勝率「進場與停損點位」的關鍵：
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* 反轉型態 */}
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🔄</span>
                    <h3 className="text-xl font-bold text-rose-500">反轉型態 (Reversal Patterns)</h3>
                  </div>
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>代表原有趨勢即將結束，準備反向發展。最常出現在波段的高點或低點。</p>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        <strong className="text-foreground">頭肩頂/底 (Head and Shoulders)：</strong> 最經典的型態。左肩、頭部、右肩構成。當價格跌破/突破「頸線」時，確認反轉。目標價通常是頭部到頸線的等幅距離。
                      </li>
                      <li>
                        <strong className="text-foreground">雙重頂/底 (Double Top/Bottom)：</strong> 俗稱的 M 頭與 W 底。價格兩次測試同一個高點/低點失敗。同樣以突破頸線為確認訊號。
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 持續型態 */}
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">⏩</span>
                    <h3 className="text-xl font-bold text-emerald-500">持續型態 (Continuation Patterns)</h3>
                  </div>
                  <div className="space-y-4 text-sm leading-relaxed">
                    <p>趨勢行進中的「中場休息」。盤整過後，價格通常會朝著原本的趨勢方向繼續前進。</p>
                    <ul className="list-disc pl-5 space-y-3">
                      <li>
                        <strong className="text-foreground">三角收斂 (Triangle)：</strong> 高點越來越低，低點越來越高。買賣雙方逐漸僵持，等待方向表態。突破阻力/支撐線時進場。
                      </li>
                      <li>
                        <strong className="text-foreground">旗形/楔形 (Flag / Pennant)：</strong> 急漲或急跌後的一小段逆向整理，形狀像一面旗子。這是多頭/空頭蓄力準備下一次攻擊的特徵。
                      </li>
                    </ul>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20">
                    <p className="text-xs font-bold text-rose-400">⚠️ 型態學實戰限制：</p>
                    <p className="text-xs mt-1">「突破」常常是假的（假突破）。如果在突破時沒有伴隨成交量放大，十之八九是誘多/誘空的陷阱。</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">價量關係 (Price-Volume Relationship)</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                股市有句名言：「新手看價，老手看量。」價格可以輕易被少數人用資金拉抬或打壓，但「成交量」是用真金白銀堆出來的，主力無法作假。理解價量配合，是技術分析的最高境界。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* 價漲量增 */}
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm flex gap-4 hover:-translate-y-1 transition-transform">
                  <div className="text-4xl shrink-0">🚀</div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-500 mb-2">1. 價漲量增 (最健康的信號)</h3>
                    <p className="text-sm leading-relaxed mb-3">
                      股價上漲的同時，成交量也跟著放大。這代表市場買氣非常旺盛，大家搶著追價，上漲的「燃料」非常充足，是典型的多頭攻擊訊號。
                    </p>
                  </div>
                </div>

                {/* 價跌量縮 */}
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm flex gap-4 hover:-translate-y-1 transition-transform">
                  <div className="text-4xl shrink-0">🧘</div>
                  <div>
                    <h3 className="text-lg font-bold text-blue-400 mb-2">2. 價跌量縮 (健康的洗盤)</h3>
                    <p className="text-sm leading-relaxed mb-3">
                      股價下跌，但成交量卻急劇萎縮。這代表雖然有人在賣，但多數持股者「惜售」（不想在低價賣出），賣壓其實並不重，隨時準備再次上攻。
                    </p>
                  </div>
                </div>

                {/* 價漲量縮 */}
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-sm flex gap-4 hover:-translate-y-1 transition-transform">
                  <div className="text-4xl shrink-0">⚠️</div>
                  <div>
                    <h3 className="text-lg font-bold text-amber-500 mb-2">3. 價漲量縮 (量價背離，動能衰退)</h3>
                    <p className="text-sm leading-relaxed mb-3">
                      股價持續創新高，但買進的量卻越來越少。這就像車子踩油門但油箱見底，暗示追價意願不足，很容易出現「假突破、真破底」的反轉。
                    </p>
                  </div>
                </div>

                {/* 價跌量增 */}
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm flex gap-4 hover:-translate-y-1 transition-transform">
                  <div className="text-4xl shrink-0">💥</div>
                  <div>
                    <h3 className="text-lg font-bold text-rose-500 mb-2">4. 價跌量增 (最危險的警訊)</h3>
                    <p className="text-sm leading-relaxed mb-3">
                      股價重挫，且伴隨巨大的成交量。這代表市場出現恐慌性拋售，或者主力機構正在「大戶倒貨給散戶」。這是極度危險的空頭訊號，請三十六計走為上策！
                    </p>
                  </div>
                </div>


                <div className="col-span-1 md:col-span-2 mt-4">
                  <CaseStudyAccordion title="進階實戰：風報比 (Risk/Reward Ratio) 的數學魔法" icon="⚖️" theme="emerald">
                    <p className="mb-2">技術分析最大的價值，不是預測未來，而是幫你找到<strong>「停損空間極小，獲利空間極大」</strong>的進場點。這就是「風報比」。</p>
                    <ul className="list-disc pl-5 space-y-2 mb-2">
                      <li><strong>計算公式：</strong> 風報比 = (預期停利空間) ÷ (預期停損空間)</li>
                      <li><strong>完美進場點：</strong> 當股價拉回測試「長期支撐線」且沒有跌破時進場。此時你的停損點只需設在支撐線下方一點點（風險極低），但如果上漲，獲利空間卻很大。</li>
                      <li><strong>範例：</strong> 買在 100 元，跌破 95 元停損（賠 5 元），上看壓力區 120 元停利（賺 20 元）。風報比為 4 (20÷5)。</li>
                    </ul>
                    <p className="mt-2 text-emerald-400 font-bold">💡 實戰結論：</p>
                    <p>只要你堅持只做「風報比 &gt; 3」的交易，就算你的勝率只有 30%（十次錯七次），你長期下來依然是賺錢的！這就是技術分析能幫助你賺錢的唯一數學真相。</p>
                  </CaseStudyAccordion>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Next Level Button */}
        <div className="mt-16 mb-8 flex justify-center">
          <Link href="/education/skill-tree/level-4-advanced" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-purple-950 transition-all duration-300 bg-purple-500 rounded-2xl hover:bg-purple-400 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-1">
            <span className="flex items-center gap-2 text-lg">
              前往下一關：Level 4 高階戰術
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Link>
        </div>

      </div>
    </main>
  );
}

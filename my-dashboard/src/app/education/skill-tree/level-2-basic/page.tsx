import Link from 'next/link';
import ExpenseCalculator from '@/components/education/ExpenseCalculator';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';

export default function Level2Basic() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-blue-400 mb-4">Level 2：基礎裝備</h1>
          <p className="text-xl text-foreground/80">市場認知與被動流派</p>
          <div className="mt-6 p-6 rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <p className="text-foreground leading-relaxed">
              工欲善其事，必先利其器。了解遊戲規則與可用的武器。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">資產類別認識（武器庫）</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                在進入戰場前，你必須先認識手中的武器。每一種資產都有其「真實世界的意義」，它們不是在賭場裡猜大小的籌碼，而是你在實體經濟中扮演的各種角色。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
                
                {/* 股票 */}
                <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">📈</span>
                    <h3 className="text-xl font-bold text-blue-400">股票 (Stocks)</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-emerald-400 mb-1">真實意義：企業的所有權</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      買股票不是買一張會跳動的紙，而是「合夥做生意」。你成為了該公司的部分擁有者（股東），分享公司未來創造的利潤與現金流。
                    </p>
                  </div>
                  <div className="mt-auto bg-background/50 p-3 rounded-xl border border-foreground/5">
                    <p className="text-xs font-bold text-rose-400 mb-1">⚠️ 風險與特性</p>
                    <p className="text-xs text-foreground/70">高報酬伴隨高波動。如果公司倒閉，股票價值可能歸零；但若公司成長，報酬潛力無上限。</p>
                  </div>
                </div>

                {/* 債券 */}
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">📜</span>
                    <h3 className="text-xl font-bold text-emerald-400">債券 (Bonds)</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-emerald-400 mb-1">真實意義：當別人的債主</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      你把錢借給政府或企業，他們承諾定期付你利息，並在到期時還清本金。你扮演的是銀行的角色，賺取穩定的借貸利息。
                    </p>
                  </div>
                  <div className="mt-auto bg-background/50 p-3 rounded-xl border border-foreground/5">
                    <p className="text-xs font-bold text-rose-400 mb-1">⚠️ 風險與特性</p>
                    <p className="text-xs text-foreground/70">低波動、穩定配息。主要風險為「違約風險」（對方還不出錢）與「利率風險」（升息會導致債券跌價）。</p>
                  </div>
                </div>

                {/* 房地產 */}
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🏢</span>
                    <h3 className="text-xl font-bold text-amber-400">房地產 (Real Estate)</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-emerald-400 mb-1">真實意義：實體空間的使用權</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      持有能遮風避雨、開設店面或製造生產的實體土地與建築。你可以自己使用，或將「空間使用權」租給別人換取租金。
                    </p>
                  </div>
                  <div className="mt-auto bg-background/50 p-3 rounded-xl border border-foreground/5">
                    <p className="text-xs font-bold text-rose-400 mb-1">⚠️ 風險與特性</p>
                    <p className="text-xs text-foreground/70">極度抗通膨且具備強大現金流，但「流動性極差」（很難一秒變現），且通常需要動用龐大槓桿（房貸）。</p>
                  </div>
                </div>

                {/* 大宗商品 */}
                <div className="p-5 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">🛢️</span>
                    <h3 className="text-xl font-bold text-yellow-500">大宗商品 (Commodities)</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-emerald-400 mb-1">真實意義：經濟運轉的燃料與原料</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      原油、黃金、小麥、銅礦。這些是人類生存與工業製造不可或缺的原物料。它們本身不會產生利潤，價值純粹取決於供需關係。
                    </p>
                  </div>
                  <div className="mt-auto bg-background/50 p-3 rounded-xl border border-foreground/5">
                    <p className="text-xs font-bold text-rose-400 mb-1">⚠️ 風險與特性</p>
                    <p className="text-xs text-foreground/70">通常作為避險或對抗惡性通膨的工具。無法產生被動現金流（黃金不會生出小黃金），容易受地緣政治與氣候影響。</p>
                  </div>
                </div>

                {/* 外匯 */}
                <div className="p-5 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">💱</span>
                    <h3 className="text-xl font-bold text-cyan-400">外匯 (Forex)</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-emerald-400 mb-1">真實意義：國力的兌換券</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      交易不同國家的法定貨幣（如用美金換日幣）。你買的是「對該國經濟實力與央行政策的信任」。
                    </p>
                  </div>
                  <div className="mt-auto bg-background/50 p-3 rounded-xl border border-foreground/5">
                    <p className="text-xs font-bold text-rose-400 mb-1">⚠️ 風險與特性</p>
                    <p className="text-xs text-foreground/70">匯率波動本身通常不大，但外匯保證金交易經常使用「極高槓桿」(如 100 倍)，導致這變成一個極高風險的零和博弈戰場。</p>
                  </div>
                </div>

                {/* 加密貨幣 */}
                <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">₿</span>
                    <h3 className="text-xl font-bold text-purple-400">加密貨幣 (Crypto)</h3>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-bold text-emerald-400 mb-1">真實意義：去中心化的數位共識</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      基於區塊鏈技術的數位資產（如比特幣）。它解決了「不需第三方機構信任的價值轉移」問題，是一種對傳統金融體系的革新嘗試。
                    </p>
                  </div>
                  <div className="mt-auto bg-background/50 p-3 rounded-xl border border-foreground/5">
                    <p className="text-xs font-bold text-rose-400 mb-1">⚠️ 風險與特性</p>
                    <p className="text-xs text-foreground/70">極度高波動，24小時交易且無漲跌幅限制。缺乏傳統基本面估值模型，容易受市場情緒與法規監管打擊。</p>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">市場運作機制：遊戲的隱藏規則</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                在了解資產後，你必須知道市場是如何搓合交易的。這就像去菜市場買菜，你不是直接把錢塞給農夫，這中間包含了批發商、零售商以及各種隱形成本。
              </p>

              <div className="bg-foreground/5 rounded-2xl border border-foreground/10 p-6 space-y-8">
                
                {/* 參與者 */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">🏛️</span> 遊戲的兩大莊家：交易所與券商
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5">
                      <p className="font-bold text-blue-400 mb-1">1. 交易所 (Exchange)</p>
                      <p className="text-sm">例如：紐約證交所 (NYSE)、台灣證交所 (TWSE)。這是提供買賣雙方公開喊價的「大菜市場」。交易所負責制定規則、監管並保證交易的公平與安全。一般散戶無法直接去交易所買股票。</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5">
                      <p className="font-bold text-emerald-400 mb-1">2. 券商 (Broker)</p>
                      <p className="text-sm">例如：元大證券、Firstrade、嘉信理財。券商是「代購中人」。你必須開立券商帳戶，透過券商將你的買賣指令傳遞給交易所。券商為你提供交易軟體並保管你的資產。</p>
                    </div>
                  </div>
                </div>

                {/* 交易成本 */}
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <span className="text-2xl">💸</span> 交易的隱形成本（摩擦力）
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-lg">⚖️</span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground mb-1">買賣報價與價差 (Bid/Ask Spread)</p>
                        <p className="text-sm">當你看到一支股票現價 100 元時，通常代表「最後一筆成交價」。實際上市場有兩個價格：<br/>
                        <strong>委買價 (Bid)：</strong>買方願意出的最高價格 (例如 99.9)。<br/>
                        <strong>委賣價 (Ask)：</strong>賣方願意賣的最低價格 (例如 100.1)。<br/>
                        這 0.2 元的差距就是「價差」。如果你急著立刻買到，你就必須用較貴的委賣價 (100.1) 買入，這個價差也是市場造市商的利潤來源。</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-lg">🧾</span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground mb-1">手續費與稅金 (Fees & Taxes)</p>
                        <p className="text-sm">這是券商與政府收走的「過路費」。買進和賣出時，券商會收取手續費；賣出股票時，政府通常會徵收交易稅。頻繁的短線交易（當沖）會導致這些微小的過路費迅速侵蝕掉你所有的利潤。</p>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-1">
                        <span className="text-lg">🛝</span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground mb-1">滑價 (Slippage)</p>
                        <p className="text-sm">當你使用「市價單（不計價格立刻成交）」買入時，若市場流動性很差（賣家很少），或者剛好遇到恐慌拋售，你預期買在 100 元，最後系統可能幫你成交在 105 元，這 5 元的落差就是「滑價」。這在冷門股或加密貨幣市場尤其常見。</p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">被動投資學（懶人神技）</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                「與其在草堆裡找一根針，不如把整個草堆都買下來。」這是指數型基金之父約翰·柏格 (John Bogle) 的名言，完美詮釋了被動投資的核心哲學。
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* 指數化投資概念 */}
                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🎯</span>
                    <h3 className="text-xl font-bold text-indigo-400">1. 什麼是指數化投資？</h3>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
                    <p>
                      主動投資者試圖透過研究來「打敗大盤」（獲得比市場平均更高的報酬）。但歷史數據證明，長期下來超過 80% 的專業基金經理人都無法打敗大盤。
                    </p>
                    <p>
                      <strong>被動投資</strong>則是承認我們無法預測未來，所以放棄挑選個別股票，直接買下市場上「所有」的好公司，獲取與整體市場完全相同的<strong>「平均報酬」</strong>。
                    </p>
                  </div>
                </div>

                {/* ETF 運作原理 */}
                <div className="p-6 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🍱</span>
                    <h3 className="text-xl font-bold text-cyan-400">2. ETF 運作原理</h3>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-foreground/80">
                    <p>
                      <strong>ETF (Exchange Traded Fund)</strong> 中文叫做「指數股票型基金」。
                    </p>
                    <p>
                      想像市場是一個提供幾千道菜的超級餐廳。你自己點菜可能會踩雷。投信公司幫你把餐廳裡最受歡迎的 50 道菜，打成一個「綜合便當」來賣，這個便當就是 ETF。
                    </p>
                    <p>
                      它有一個<strong>「追蹤指數」</strong>的規則（例如只挑市值前 50 大），並會定期自動幫你汰弱留強，把爛蘋果踢出便當。
                    </p>
                  </div>
                </div>

                {/* ETF 挑選原則 */}
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">✅</span>
                    <h3 className="text-xl font-bold text-emerald-400">3. 挑選三大原則</h3>
                  </div>
                  <ul className="space-y-3 text-sm leading-relaxed text-foreground/80 list-disc pl-5">
                    <li>
                      <strong className="text-emerald-400">內扣費用要低：</strong>
                      請選擇總費用率（含管理費與雜支）極低的標的，長期下來才不會被發行商吸血。
                    </li>
                    <li>
                      <strong className="text-emerald-400">流動性與規模要大：</strong>
                      選擇市值規模大、每日成交量高的 ETF（如台灣的 0050 或美國的 SPY、VOO）。避免買到流動性差、容易產生滑價甚至下市的冷門 ETF。
                    </li>
                    <li>
                      <strong className="text-emerald-400">看懂選股邏輯：</strong>
                      不要只看名稱有「高股息」或「AI」就無腦買入。去官網看它的「選股邏輯」，確保你認同這個便當挑菜的規則。
                    </li>
                  </ul>
                </div>

                {/* 共同基金 vs ETF 比較表 */}
                <div className="p-6 rounded-2xl bg-foreground/5 border border-foreground/10 shadow-sm md:col-span-2 lg:col-span-3 mt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🥊</span>
                    <h3 className="text-xl font-bold text-foreground">4. 共同基金 vs ETF：為何我們推崇 ETF？</h3>
                  </div>
                  <p className="text-sm text-foreground/80 mb-4">銀行理專最常推銷的是「主動型共同基金」，因為手續費傭金極高。了解兩者的差異，是避免被當成韭菜收割的第一步：</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left border-collapse">
                      <thead>
                        <tr className="border-b border-foreground/10">
                          <th className="py-3 px-4 font-bold text-foreground">比較項目</th>
                          <th className="py-3 px-4 font-bold text-rose-400">傳統共同基金 (Mutual Fund)</th>
                          <th className="py-3 px-4 font-bold text-emerald-400">ETF (指數股票型基金)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-foreground/5 text-foreground/80">
                        <tr className="hover:bg-foreground/5 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground/90">操盤邏輯</td>
                          <td className="py-3 px-4">經理人主動挑股，試圖「打敗大盤」</td>
                          <td className="py-3 px-4">電腦被動追蹤指數，獲取「市場平均報酬」</td>
                        </tr>
                        <tr className="hover:bg-foreground/5 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground/90">內扣費用 (管理費)</td>
                          <td className="py-3 px-4 text-rose-400 font-bold">極高 (通常 1.5% ~ 3%)</td>
                          <td className="py-3 px-4 text-emerald-400 font-bold">極低 (通常 0.03% ~ 0.5%)</td>
                        </tr>
                        <tr className="hover:bg-foreground/5 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground/90">交易方式</td>
                          <td className="py-3 px-4">向銀行或投信申購，一天只有一個結算淨值</td>
                          <td className="py-3 px-4">像股票一樣在交易所買賣，盤中價格隨時跳動</td>
                        </tr>
                        <tr className="hover:bg-foreground/5 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground/90">持股透明度</td>
                          <td className="py-3 px-4">低（通常每月或每季才公布一次前十大持股）</td>
                          <td className="py-3 px-4">極高（每天都能在官網查到所有成分股與權重）</td>
                        </tr>
                        <tr className="hover:bg-foreground/5 transition-colors">
                          <td className="py-3 px-4 font-semibold text-foreground/90">長期勝率 (10年以上)</td>
                          <td className="py-3 px-4">超過 80% 的基金績效落後給大盤</td>
                          <td className="py-3 px-4">保證獲得大盤報酬，穩贏多數主動基金</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border-l-4 border-emerald-500">
                    <p className="text-sm font-bold text-emerald-400">💡 結論：共同基金是銀行的印鈔機，ETF 才是投資人的好朋友。</p>
                  </div>
                </div>

                <div className="md:col-span-2 lg:col-span-3 mt-4 space-y-4">
                  <CaseStudyAccordion title="實戰策略：定期定額 (DCA) vs 單筆投入 (Lump Sum)" icon="🎯" theme="indigo">
                    <p className="mb-2">當你手上有一筆閒錢時，該分批慢慢買，還是直接全部買進？</p>
                    <ul className="list-disc pl-5 space-y-3 mb-3">
                      <li>
                        <strong>定期定額 (DCA - Dollar Cost Averaging)：</strong> 
                        把資金切成 12 份或 24 份，每個月固定日期買入固定金額。
                        <br/><span className="text-emerald-400">優點：</span>買在平均成本（微笑曲線），不用去猜高低點，心理壓力極小，是情緒管理的最佳工具。
                        <br/><span className="text-rose-400">缺點：</span>在長期向上的多頭市場中，越晚投入的資金買得越貴，導致整體績效落後。
                      </li>
                      <li>
                        <strong>單筆投入 (Lump Sum)：</strong> 
                        看好標的後，直接把資金一次性全部買入。
                        <br/><span className="text-emerald-400">優點：</span>根據 Vanguard 等權威機構的歷史回測，因為市場長期趨勢向上，<strong>「單筆投入」在 68% 的時間裡績效會勝過「定期定額」</strong>。
                        <br/><span className="text-rose-400">缺點：</span>如果剛買完隔天就遇到股災暴跌 20%，多數新手的心理素質會崩潰而認賠殺出。
                      </li>
                    </ul>
                    <p className="mt-2 text-indigo-400 font-bold">💡 實戰結論：</p>
                    <p>數學上「單筆投入」勝率較高，但投資往往是心理戰。如果你一次全押會睡不著覺，那就老老實實用「定期定額」，因為<strong>能讓你抱得住的策略，才是好策略</strong>。</p>
                  </CaseStudyAccordion>

                  <CaseStudyAccordion title="機器人理財 (Robo-advisor) vs DIY 投資：隱藏的複利殺手" icon="🤖" theme="rose">
                    <p className="mb-2">近年來主打「演算法自動配置」的機器人理財非常流行，但你需要注意它每年收取的「管理費」：</p>
                    <ul className="list-disc pl-5 space-y-2 mb-2">
                      <li><strong>DIY 買 ETF (自己動手)：</strong> 買入 0050 或 VOO，每年內扣費用約 0.03% ~ 0.04%。</li>
                      <li><strong>使用機器人理財：</strong> 平台每年額外向你收取 1% 的帳戶管理費。總費用變成 1.04%。</li>
                    </ul>
                    <p className="mt-2"><strong>試算 30 年的複利慘劇：</strong></p>
                    <p className="mb-2">假設你單筆投入 100 萬，市場年化報酬率為 8%：</p>
                    <ul className="list-disc pl-5 space-y-2 mb-2">
                      <li>DIY 投資 (實拿 7.96%)：30 年後會變成約 <strong className="text-emerald-400">995 萬</strong>。</li>
                      <li>機器人理財 (實拿 6.96%)：30 年後只剩下約 <strong className="text-rose-400">753 萬</strong>。</li>
                    </ul>
                    <p className="mt-2 text-rose-400 font-bold">💡 實戰結論：</p>
                    <p>那區區 1% 的管理費差距，在 30 年的複利發酵下，竟然<strong>吃掉了你超過 240 萬的獲利</strong>！對於長期投資來說，費用越低，你的勝率與最終財富就越高。</p>
                  </CaseStudyAccordion>
                </div>

              </div>

              {/* Expense Calculator Widget */}
              <ExpenseCalculator />
            </div>
          </section>

          {/* Next Level Branching Buttons */}
          <div className="mt-20 mb-8 flex flex-col items-center border-t border-foreground/10 pt-12">
            <p className="text-foreground/50 mb-6 font-bold tracking-widest text-sm uppercase">選擇你的 Level 3 進階路線</p>
            <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
              <Link href="/education/skill-tree/level-3-fundamental" className="group relative inline-flex items-center justify-center px-6 py-4 font-bold text-amber-900 transition-all duration-300 bg-amber-500 rounded-xl hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:-translate-y-1 w-full md:w-auto">
                <span className="flex items-center gap-2">
                  🔍 路線 A：基本面分析
                </span>
              </Link>
              <Link href="/education/skill-tree/level-3-technical" className="group relative inline-flex items-center justify-center px-6 py-4 font-bold text-purple-900 transition-all duration-300 bg-purple-500 rounded-xl hover:bg-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-1 w-full md:w-auto">
                <span className="flex items-center gap-2">
                  📈 路線 B：技術面分析
                </span>
              </Link>
              <Link href="/education/skill-tree/level-3-chips" className="group relative inline-flex items-center justify-center px-6 py-4 font-bold text-rose-900 transition-all duration-300 bg-rose-500 rounded-xl hover:bg-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:-translate-y-1 w-full md:w-auto">
                <span className="flex items-center gap-2">
                  🕵️ 路線 C：籌碼面分析
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

import Link from 'next/link';
import RiskQuiz from './RiskQuiz';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';
import Rule72Calculator from '@/components/education/Rule72Calculator';

export default function Level1Beginner() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-emerald-400 hover:text-emerald-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-400 mb-4">Level 1：新手村</h1>
          <p className="text-xl text-foreground/80">核心心法與財務基底</p>
          <div className="mt-6 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-foreground leading-relaxed">
              在這個階段，重點不是「賺多少錢」，而是「不亂虧錢」並建立正確的防禦觀念。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">投資 vs. 投機</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                在踏入市場前，我們必須先釐清「投資 (Investment)」與「投機 (Speculation)」的根本差異。許多人在市場中虧錢，正是因為他們「以為自己在投資，實際上卻在投機」。
              </p>

              <blockquote className="relative p-6 bg-foreground/5 border-l-4 border-emerald-500 rounded-r-xl italic text-foreground/90 my-6 shadow-sm">
                <span className="absolute -top-3 left-2 text-6xl text-emerald-500/20 leading-none font-serif">"</span>
                <p className="relative z-10 text-lg mb-2 font-medium">
                  「投資操作是基於透徹的分析，確保本金的安全並獲得適當的報酬。不符合這些條件的操作就是投機。」
                </p>
                <footer className="text-sm font-bold text-emerald-400 mt-2 text-right">
                  — 班傑明·葛拉漢 (Benjamin Graham)《智慧型股票投資人》
                </footer>
              </blockquote>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 投資 Block */}
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20">
                  <h3 className="text-xl font-bold text-emerald-400 mb-3 flex items-center gap-2">
                    <span>🛡️</span> 什麼是投資？
                  </h3>
                  <p className="mb-4">
                    <strong>核心邏輯：</strong>買入並持有能持續產生現金流或具備長期成長價值的資產。投資人關注的是「資產本身的內在價值」以及企業未來的獲利能力。
                  </p>
                  <div className="bg-background/50 p-4 rounded-xl border border-foreground/5">
                    <h4 className="font-bold text-foreground mb-2">✅ 投資行為範例：</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li><strong>買入台積電股票：</strong>因為看好半導體產業的長期發展，且公司每年有穩定獲利與配息，打算持有 5 到 10 年與公司一起成長。</li>
                      <li><strong>定期定額買入 ETF：</strong>不預測市場高低點，每個月固定買入大盤指數型基金（如 0050），長期獲取市場整體的平均報酬。</li>
                      <li><strong>買入出租房產：</strong>看中該地區未來的發展潛力與穩定的租金收入，而非下個月能以多高的價格轉手。</li>
                    </ul>
                  </div>
                </div>

                {/* 投機 Block */}
                <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                  <h3 className="text-xl font-bold text-rose-400 mb-3 flex items-center gap-2">
                    <span>⚔️</span> 什麼是投機？
                  </h3>
                  <p className="mb-4">
                    <strong>核心邏輯：</strong>預測價格的短期波動來賺取價差。投機者通常不在乎資產本身的真實價值，只在乎「有沒有下一個人願意用更高的價格跟我買」（博傻理論）。
                  </p>
                  <div className="bg-background/50 p-4 rounded-xl border border-foreground/5">
                    <h4 className="font-bold text-foreground mb-2">⚠️ 投機行為範例：</h4>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li><strong>跟風買入迷因股 (Meme Stocks)：</strong>不知道公司在做什麼，甚至公司連年虧損，只因為網路上大家都在討論、股價連漲三天就趕緊追高買入，期望明天能賣得更貴。</li>
                      <li><strong>過度使用槓桿當沖：</strong>每天在市場中殺進殺出，試圖捕捉微小的價格波動來獲利，承擔著極高的資金風險。</li>
                      <li><strong>盲目炒作冷門虛擬幣：</strong>買入沒有任何實際應用場景或白皮書支撐的不知名代幣，單純賭它會被炒作上天。</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/10 border-l-4 border-blue-500 text-sm">
                <strong>新手村守則：</strong> 投機並非絕對的錯，但它需要極高的技術與心理素質。對於剛踏入市場的新手，我們強烈建議先從「投資」開始，建立防禦力，再來考慮是否要分配極小部分的資金進行投機嘗試。
              </div>

              <CaseStudyAccordion title="買賣價差與滑價的「二手車比喻」" icon="🚗" theme="blue">
                <p className="mb-2">很多新手喜歡頻繁交易，卻忽略了隱形的交易成本。想像你開著一台車去二手車行估價：</p>
                <ul className="list-disc pl-5 space-y-2 mb-2">
                  <li>車行老闆跟你說：「我願意用 <strong>50 萬</strong> 收購你的車。」（這就是<strong>買入報價 Bid</strong>）</li>
                  <li>這時旁邊剛好有另一個客人想買同款車，老闆對他說：「這台車我要賣 <strong>60 萬</strong>。」（這就是<strong>賣出報價 Ask</strong>）</li>
                </ul>
                <p className="mt-2">這中間 10 萬塊的差價 (Spread)，就是車行賺走的利潤，也是你在市場中隱形的交易成本。在股市中，如果一檔股票非常冷門，這個價差就會像這台二手車一樣大到嚇人；頻繁短線投機，光是付這個價差就會吃光你的本金。</p>
              </CaseStudyAccordion>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">個人財務防禦</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                「防禦贏得總冠軍」在投資領域同樣適用。如果沒有穩固的財務後盾，市場的一點點波動或生活中的突發事件，都會迫使你在最差的時機賣出資產。建立財務防禦網是所有投資的基礎。
              </p>

              <div className="space-y-6">
                {/* 記帳習慣 */}
                <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10">
                  <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-2xl">📝</span> 1. 記帳習慣：看清資金的流向
                  </h3>
                  <p className="mb-3 text-sm">
                    <strong>為什麼需要？</strong> 就像企業需要損益表一樣，如果你不知道每個月賺的錢花去哪裡，就無法找出現金流的漏洞（例如每天一杯星巴克、無意識的訂閱服務），更不可能擠出多餘的本金來投資。
                  </p>
                  <div className="bg-background/50 p-4 rounded-xl">
                    <p className="text-sm font-semibold mb-2 text-emerald-400">💡 如何執行：</p>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li><strong>輕量級：</strong> 先嘗試記帳 3 個月，掌握自己每個月的「固定支出」與「變動支出」大約是多少。</li>
                      <li><strong>進階法：</strong> 採用「先支付自己」法則（如 532 法則）。領到薪水第一天，立刻把 20% 自動轉入投資/儲蓄帳戶，剩下的 80% 才作為生活花費。</li>
                    </ul>
                  </div>
                </div>

                {/* 緊急預備金 */}
                <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10">
                  <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-2xl">💰</span> 2. 建立緊急預備金（至少 6 個月生活費）
                  </h3>
                  <p className="mb-3 text-sm">
                    <strong>為什麼需要？</strong> 天有不測風雲（如失業、生病、突發大筆開銷）。如果沒有預備金，當急需用錢又剛好碰上股市大跌時，你只能「認賠殺出」手中的股票。預備金是保護你不受市場恐慌干擾的防護罩。
                  </p>
                  <div className="bg-background/50 p-4 rounded-xl">
                    <p className="text-sm font-semibold mb-2 text-emerald-400">💡 如何執行：</p>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li><strong>計算基準：</strong> 根據記帳找出的「每月最低生存開銷」乘上 6（或保守一點乘上 12）。</li>
                      <li><strong>分批存入：</strong> 不用一次拿出一大筆錢，可以設定每個月存下幾千元，直到水位達標。這筆錢必須放在「隨時可以動用且保本」的地方（如高利活存帳戶），<strong>絕對不能拿去買股票！</strong></li>
                    </ul>
                  </div>
                </div>

                {/* 債務管理 */}
                <div className="bg-foreground/5 p-5 rounded-2xl border border-foreground/10">
                  <h3 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                    <span className="text-2xl">⚖️</span> 3. 債務管理：理清好債與壞債
                  </h3>
                  <p className="mb-3 text-sm">
                    <strong>為什麼需要？</strong> 負債的複利威力跟投資一樣可怕。如果你扛著 15% 利率的卡債去追求每年 8% 的股市報酬，那是在做賠本生意。
                  </p>
                  <div className="bg-background/50 p-4 rounded-xl">
                    <p className="text-sm font-semibold mb-2 text-emerald-400">💡 如何執行：</p>
                    <ul className="list-disc pl-5 text-sm space-y-2">
                      <li><strong>先消滅壞債：</strong> 信用卡循環利息、車貸、信貸等高利率且不會產生現金流的負債，請動用所有資源優先還清。</li>
                      <li><strong>善用好債：</strong> 如果是低利率的房貸（例如 2%），且你具備長期創造 5%~8% 投資報酬的能力，則不一定要急著提早還完，可以利用利差讓資金為你工作。</li>
                    </ul>
                  </div>
                </div>

                <CaseStudyAccordion title="信用卡循環利息的恐怖真相：10 萬變 30 萬" icon="💳" theme="rose">
                  <p className="mb-2">很多人覺得「先刷卡享受，慢慢還就好」。但信用卡循環利息通常高達 <strong>15%</strong>，是一般投資報酬率的兩倍。來看看具體數字有多嚇人：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-3">
                    <li><strong>場景：</strong> 小明刷了 10 萬元買新手機和旅遊，之後每個月只付「最低應繳金額」（通常是欠款的 2%-5%）。</li>
                    <li><strong>結果：</strong> 在 15% 循環利率下，小明需要花費超過 <strong>15 年</strong>才能還清這 10 萬塊的卡債。而他最終總共付出的金額將超過 <strong>30 萬元</strong>，其中有 20 萬是利息！</li>
                    <li><strong>對比：</strong> 如果小明當初沒有刷那 10 萬，而是拿去投資年化 8% 的 ETF，15 年後這 10 萬會變成 <strong>31.7 萬</strong>。一來一往，差距超過 <strong>60 萬</strong>。</li>
                  </ul>
                  <p className="mt-2 text-rose-400 font-bold">💡 鐵律：</p>
                  <p>消滅高利率卡債是「保證報酬率 15%」的最佳投資。在你還有任何高利率壞債的情況下，把錢拿去投資股票都是不理性的行為。</p>
                </CaseStudyAccordion>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">時間魔法：投資的終極武器</h2>
            <div className="space-y-6 text-foreground/80">
              <blockquote className="relative p-6 bg-foreground/5 border-l-4 border-purple-500 rounded-r-xl italic text-foreground/90 my-6 shadow-sm">
                <span className="absolute -top-3 left-2 text-6xl text-purple-500/20 leading-none font-serif">"</span>
                <p className="relative z-10 text-lg mb-2 font-medium">
                  「複利是世界第八大奇蹟。」
                </p>
                <footer className="text-sm font-bold text-purple-400 mt-2 text-right">
                  — 阿爾伯特·愛因斯坦 (Albert Einstein)
                </footer>
              </blockquote>
              <p className="mb-6">
                在投資的世界裡，本金與報酬率固然重要，但真正能讓財富產生質變的，是<strong>「時間」</strong>。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 複利效應 */}
                <div className="p-5 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                  <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <span className="text-2xl">❄️</span> 複利效應 (Compound Interest)
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed">
                    <strong>運作原理：</strong> 複利就像滾雪球。當你將投資賺來的「利息」不拿出來花掉，而是繼續投入本金中，下一期的利息就會基於「更大的本金」來計算。時間越長，雪球滾動的速度會呈指數型增長。
                  </p>
                  <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 text-sm">
                    <p className="font-bold text-foreground mb-1">✅ 實際應用：</p>
                    <p className="text-foreground/80"><strong>提早開始投資！</strong> 25 歲開始每個月存 1 萬元，即便 35 歲就停止投入（讓它自行滾動），到 65 歲時的最終財富，通常會遠勝過 35 歲才開始每個月存 1 萬元一路存到 65 歲的人。這就是時間為本金施加的魔法。</p>
                  </div>
                </div>

                {/* 貨幣時間價值 */}
                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
                  <h3 className="text-xl font-bold text-amber-400 mb-3 flex items-center gap-2">
                    <span className="text-2xl">⏳</span> 貨幣時間價值 (TVM)
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed">
                    <strong>為何重要？</strong> 「今天的 100 塊，比明天的 100 塊更有價值。」因為今天的錢可以拿去投資產生利息，而且還受到通貨膨脹的侵蝕。如果你把錢藏在床底，它的購買力只會隨著時間流逝而減少。
                  </p>
                  <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 text-sm">
                    <p className="font-bold text-foreground mb-1">✅ 實際應用：</p>
                    <p className="text-foreground/80"><strong>認清「通膨」這個隱形小偷。</strong> 理財的第一步，至少要讓你的資金報酬率大於每年的通貨膨脹率（通常約 2%~3%）。單純的活存無法抵抗通膨，這就是我們必須投資的根本原因。</p>
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <CaseStudyAccordion title="長期投資到底能賺多少？(以美股為例)" icon="📈" theme="purple">
                    <p className="mb-3">許多新手容易被「保證月賺 10%」的詐騙話術吸引，那是因為他們對真實世界的「合理報酬率」沒有概念。</p>
                    <ul className="list-disc pl-5 space-y-2 mb-3">
                      <li><strong>美國股市 (S&P 500)：</strong> 長期來看，年化報酬率約落在 <strong>8% ~ 10%</strong> 之間。</li>
                      <li><strong>優質公債：</strong> 長期年化報酬率約為 <strong>3% ~ 5%</strong>。</li>
                    </ul>
                    <p>以歷史數據回測：假設你每個月穩定存下 1 萬元台幣，投資於年化報酬 8% 的大盤 ETF。持續 30 年後，你的總資產將變成 <strong>1,490 萬台幣</strong>！其中你真正拿出來的本金只有 360 萬，剩下的 1,130 萬全都是市場「複利」幫你賺的錢。</p>
                  </CaseStudyAccordion>
                </div>
              </div>

              <Rule72Calculator />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">自我認知：裝備選擇器</h2>
            <div className="text-foreground/80">
              <p className="mb-4">
                沒有最好的投資策略，只有「最適合你」的投資策略。如果在下跌時會讓你睡不著覺，那再高的預期報酬率都沒有意義。
              </p>
              <RiskQuiz />

              {/* Archetypes Do's and Don'ts */}
              <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 保守型 */}
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm">
                  <div className="flex flex-col items-center text-center mb-6 border-b border-emerald-500/10 pb-4">
                    <span className="text-4xl mb-2">🐢</span>
                    <h3 className="text-xl font-bold text-emerald-400">保守型玩家</h3>
                    <p className="text-xs text-foreground/60 mt-1">無法承受本金虧損，追求絕對安穩</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1"><span className="text-lg">⭕</span> 該做什麼</p>
                      <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                        <li>建立極其穩固的緊急預備金（至少 1 年）。</li>
                        <li>專注於保本與產生穩定現金流的資產。</li>
                        <li>持有定存或高信用評等的政府公債。</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-1"><span className="text-lg">❌</span> 不該做什麼</p>
                      <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                        <li>碰任何不懂的虛擬貨幣或衍生性金融商品。</li>
                        <li>盲目聽信「保證無風險獲利 10%」的詐騙。</li>
                        <li>因為別人賺大錢就輕易改變自己的保守策略。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 穩健型 */}
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm">
                  <div className="flex flex-col items-center text-center mb-6 border-b border-blue-500/10 pb-4">
                    <span className="text-4xl mb-2">⚖️</span>
                    <h3 className="text-xl font-bold text-blue-400">穩健型玩家</h3>
                    <p className="text-xs text-foreground/60 mt-1">能承受一定波動，追求長期資產增長</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1"><span className="text-lg">⭕</span> 該做什麼</p>
                      <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                        <li>建立「股債平衡」的資產配置組合。</li>
                        <li>透過大盤指數型 ETF 獲取市場平均報酬。</li>
                        <li>保持紀律，無視短期波動定期定額投入。</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-1"><span className="text-lg">❌</span> 不該做什麼</p>
                      <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                        <li>將所有資金單押在一兩支熱門股票上。</li>
                        <li>因為短期市場崩盤而恐慌清倉賣出。</li>
                        <li>頻繁換股交易，累積過多摩擦成本與手續費。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 積極型 */}
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm">
                  <div className="flex flex-col items-center text-center mb-6 border-b border-rose-500/10 pb-4">
                    <span className="text-4xl mb-2">🚀</span>
                    <h3 className="text-xl font-bold text-rose-400">積極型玩家</h3>
                    <p className="text-xs text-foreground/60 mt-1">願意承受高波動，追求超額報酬</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-bold text-emerald-400 mb-2 flex items-center gap-1"><span className="text-lg">⭕</span> 該做什麼</p>
                      <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                        <li>確保有極其充裕的預備金做為失敗的後盾。</li>
                        <li>投資具備高成長潛力的科技股或新興產業。</li>
                        <li>花費大量時間親自研究產業趨勢與企業財報。</li>
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-rose-400 mb-2 flex items-center gap-1"><span className="text-lg">❌</span> 不該做什麼</p>
                      <ul className="list-disc pl-5 text-sm text-foreground/80 space-y-2">
                        <li>投入未來 3 年內需要用到的生活救命錢。</li>
                        <li>在沒有設定嚴格「停損點」的情況下開大槓桿。</li>
                        <li>因為連續虧損而產生「賭徒心態」向下攤平。</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>
        </div>
        
        {/* Next Level Button */}
        <div className="mt-16 mb-8 flex justify-center">
          <Link href="/education/skill-tree/level-2-basic" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-emerald-600 rounded-2xl hover:bg-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:-translate-y-1">
            <span className="flex items-center gap-2 text-lg">
              前往下一關：Level 2 基礎裝備
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

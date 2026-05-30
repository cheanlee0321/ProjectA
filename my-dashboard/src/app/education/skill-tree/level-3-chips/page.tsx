import Link from 'next/link';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';

export default function Level3Chips() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-rose-400 hover:text-rose-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-rose-400 mb-4">Level 3 分支 C：籌碼面分析</h1>
          <p className="text-xl text-foreground/80">市場追蹤者</p>
          <div className="mt-6 p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <p className="text-foreground leading-relaxed">
              掌握資金流向，就能知道誰在影響價格。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* 三大法人買賣超 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🐋</span> 三大法人買賣超
            </h2>
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-sm">
              <p className="text-foreground/80 mb-6 leading-relaxed">
                在台股等特定市場中，「三大法人」掌握了龐大的資金，他們的動向往往能左右大盤與個股的生死。跟著巨鯨游，通常比自己瞎子摸象安全。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">🌍 外資 (Foreign Investors)</h3>
                  <p className="text-sm text-foreground/80">資金最雄厚，通常偏好大型權值股（如台積電）。操作週期較長，一旦形成連續買超或賣超的趨勢，就不容易改變。</p>
                </div>
                <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">🏦 投信 (Investment Trusts)</h3>
                  <p className="text-sm text-foreground/80">國內的基金公司。偏好中小型飆股，爆發力極強。由於有「季底作帳（或結帳）」的壓力，常在每季末出現劇烈波動。</p>
                </div>
                <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-amber-400 mb-2">🏢 自營商 (Dealers)</h3>
                  <p className="text-sm text-foreground/80">證券公司自己的投資部。操作極度短線，追求絕對利潤，通常不具備長線趨勢參考價值（俗稱隔日沖大本營）。</p>
                </div>
              </div>
              <div className="mt-4">
                <CaseStudyAccordion title="實戰解析：投信季底「作帳」變「結帳」的殘酷遊戲" icon="🎭" theme="rose">
                  <p className="mb-2">每逢 3、6、9、12 月底，財經新聞總會大肆報導「投信季底作帳行情啟動」，吸引散戶進場。但這其實是一把雙面刃：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-2">
                    <li><strong>什麼是作帳？</strong> 基金經理人為了在季末交出漂亮的成績單（這攸關他們的年終獎金），會集中火力拉抬他們手中已經重倉的股票。這段期間跟著投信買，往往能嚐到甜頭。</li>
                    <li><strong>何時變結帳？</strong> 當時間逼近季底最後幾天（如 25 號以後），如果該股票已經漲幅巨大，經理人為了「保住戰果」並預留現金應付贖回，會開始瘋狂倒貨。此時如果你才剛看新聞進場，就會立刻成為接盤俠。</li>
                    <li><strong>互砍悲劇：</strong> 如果一檔股票同時被 A、B 兩家投信重倉，只要 A 投信決定先跑，股價就會下跌，B 投信的績效就會受到威脅。這會引發「囚徒困境」，導致投信間互相踩踏瘋狂拋售，股價在短短幾天內可能暴跌 20% 以上。</li>
                  </ul>
                  <p className="mt-2 text-rose-400 font-bold">💡 實戰策略：</p>
                  <p>「吃魚吃中段」。要在季初或季中（投信剛開始連續買超 3-5 天時）就跟上。一旦進入季底最後兩週，且股價已經大漲過，千萬不要再去碰投信高持股（持股比例 &gt; 10%）的標的，以免被無情結帳。</p>
                </CaseStudyAccordion>
              </div>
            </div>
          </section>

          {/* 融資融券餘額 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">⚖️</span> 融資與融券 (信用交易)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/80">
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-transform">
                <h3 className="text-xl font-bold text-rose-500 mb-3">📈 融資 (借錢買股)</h3>
                <p className="text-sm leading-relaxed mb-4">通常代表「散戶」的動向。當一檔股票股價下跌，但融資餘額卻不斷創高，代表散戶正在接刀子（俗稱：籌碼凌亂），主力最愛殺這種股票來逼散戶斷頭出場。</p>
                <div className="bg-background/50 p-3 rounded-lg border border-foreground/5 text-sm">
                  <span className="font-bold text-emerald-400">💡 健康指標：</span>股價上漲，但融資不增反減（散戶提早下車，大戶偷偷吸籌）。
                </div>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-sm hover:-translate-y-1 transition-transform">
                <h3 className="text-xl font-bold text-rose-500 mb-3">📉 融券 (借股來賣)</h3>
                <p className="text-sm leading-relaxed mb-4">看空市場的放空者。如果一檔股票基本面強勁，且股價不斷創高，但融券餘額異常龐大，就容易引發可怕的「軋空行情」（放空者被迫高價買回股票還給券商，越買越漲）。</p>
                <div className="bg-background/50 p-3 rounded-lg border border-foreground/5 text-sm">
                  <span className="font-bold text-amber-400">🔥 軋空指標：</span>券資比 (融券餘額/融資餘額) 飆高時，放空者極度危險。
                </div>
              </div>
            </div>
            <div className="mt-6">
              <CaseStudyAccordion title="史詩級軋空秀：2021 年 GameStop (GME) 散戶逆襲華爾街" icon="🚀" theme="rose">
                <p className="mb-2">這是籌碼面「軋空行情」最經典的真實案例。當籌碼極度失衡時，基本面再差的公司股價都能噴發：</p>
                <ul className="list-disc pl-5 space-y-2 mb-2">
                  <li><strong>起因：</strong> GameStop 是一家連年虧損的遊戲實體店。華爾街避險基金極度看壞它，瘋狂借券放空，導致該檔股票的「融券餘額高達 140%」（代表放空的股票比實際發行的還要多）。</li>
                  <li><strong>引爆點：</strong> Reddit 論壇上的散戶發現了這個籌碼漏洞。他們集結起來瘋狂買進 GME 股票，硬生生把股價推高。</li>
                  <li><strong>軋空效應：</strong> 股價一上漲，放空機構面臨巨額虧損，被券商強制要求「買回股票還券（回補）」。但市場上根本沒人要賣股票，機構只好不計代價用天價買入，這股買盤又進一步推升股價，形成死亡螺旋。</li>
                  <li><strong>結果：</strong> GME 股價在短短幾週內從 4 美元狂飆到 480 美元 (漲幅超過 100 倍)，多家華爾街做空機構宣告破產。這就是「籌碼面優於基本面」的最佳鐵證。</li>
                </ul>
              </CaseStudyAccordion>
            </div>
          </section>

          {/* 散戶與大戶指標 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">📊</span> 散戶指標與集保分布
            </h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                「籌碼在散戶手上，股票很難漲；籌碼在大戶手上，股票很難跌」。台灣獨有的「集保戶股權分散表」，讓我們能每週量化大戶與散戶的持股動向。
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-emerald-500 mb-3">大戶指標：持股 400 張 / 1000 張以上</h3>
                  <p className="text-sm leading-relaxed mb-3">大股東、董監事、法人機構。他們資金龐大，擁有比散戶更多的資訊優勢與研究資源。</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong className="text-foreground">籌碼集中：</strong> 大戶持股比例「連續數週上升」，代表有特定資金在默默吸籌，準備發動行情。</li>
                  </ul>
                </div>

                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-rose-500 mb-3">散戶指標：持股 1 - 5 張 / 10 張以下</h3>
                  <p className="text-sm leading-relaxed mb-3">容易受新聞媒體影響，喜歡追高殺低，資金不穩定，容易恐慌。</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li><strong className="text-foreground">籌碼凌亂：</strong> 散戶人數與持股比例「不斷創高」，通常是大戶已經趁著利多新聞出貨給散戶，這是一檔股票即將走入空頭的超級警訊。</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4">
                <CaseStudyAccordion title="經典養套殺：當「散戶激增」遇上「大戶退場」" icon="🔪" theme="rose">
                  <p className="mb-2">這是台股每年都在上演的戲碼。以某檔熱門 AI 概念股為例：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-2">
                    <li><strong>第一階段（默默吃貨）：</strong> 股價還在谷底盤整。新聞沒有報導，但你發現「千張大戶比例」從 40% 慢慢爬升到 50%，這時散戶人數還在減少。</li>
                    <li><strong>第二階段（拉抬噴發）：</strong> 主力吃飽後開始拉抬股價。配合公司釋出利多消息，股價大漲一波。此時大戶持股比例來到 60% 高峰。</li>
                    <li><strong>第三階段（高檔出貨）：</strong> 財經媒體全面頭條報導這檔股票有多好（EPS 創新高、接獲超級大單）。大量散戶被新聞吸引進場。此時你會看到「1-5張散戶人數」一週內暴增數萬人，而「千張大戶比例」卻開始從 60% 降到 55%、50%。</li>
                    <li><strong>第四階段（人踩人崩跌）：</strong> 主力出貨完畢，不再護盤。稍有風吹草動，沒有信心的散戶爭相拋售，引發多殺多的暴跌。</li>
                  </ul>
                  <p className="mt-2 text-rose-400 font-bold">💡 實戰鐵律：</p>
                  <p>「好消息滿天飛，且散戶人數暴增時，就是該賣股票的時候了。」</p>
                </CaseStudyAccordion>
              </div>
            </div>
          </section>

          {/* 內部人與主力進出 */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/80">
              {/* 主力券商進出 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
                  <span className="text-3xl">🕵️‍♂️</span> 主力券商進出
                </h2>
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-sm h-full hover:-translate-y-1 transition-transform">
                  <p className="text-sm leading-relaxed mb-4">
                    台股有一個全球少見的特色：可以查到「每天是哪個分點券商買賣了多少股票」。
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong>地緣券商：</strong>如果某家公司在台中，結果台中的特定券商瘋狂大買這檔股票，通常代表「有人早知道」好消息了。</li>
                    <li><strong>隔日沖大戶：</strong>某些特定分點券商喜歡今天大買拉漲停，明天開盤馬上倒貨。看到他們買進，隔天千萬別亂追高。</li>
                  </ul>
                </div>
              </div>

              {/* 內部人持股 */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
                  <span className="text-3xl">👔</span> 內部人持股異動
                </h2>
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-6 shadow-sm h-full hover:-translate-y-1 transition-transform">
                  <p className="text-sm leading-relaxed mb-4">
                    傳奇基金經理人彼得林區曾說：「內部人賣股票的原因有很多（買房、繳稅），但買股票的原因只有一個：他們認為股價會漲。」
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    <li><strong>董監事大買：</strong>公司高層拿自己的真金白銀在低檔買進，這是最強烈的「護盤與看好」訊號。</li>
                    <li><strong>大股東申報轉讓：</strong>如果高層在股價高檔時，突然大量申報轉讓持股，通常暗示著利多即將出盡，該腳底抹油了。</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

        </div>

        {/* Next Level Button */}
        <div className="mt-16 mb-8 flex justify-center">
          <Link href="/education/skill-tree/level-4-advanced" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-rose-950 transition-all duration-300 bg-rose-500 rounded-2xl hover:bg-rose-400 hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] hover:-translate-y-1">
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

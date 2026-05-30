import Link from 'next/link';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';
import PECalculator from '@/components/education/PECalculator';

export default function Level3Fundamental() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-amber-400 hover:text-amber-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-amber-400 mb-4">Level 3 分支 A：基本面分析</h1>
          <p className="text-xl text-foreground/80">企業調查員</p>
          <div className="mt-6 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-foreground leading-relaxed">
              主動選股玩家的必經之路。從財報看透企業體質，評估內在價值。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">財報解讀：企業的健康檢查表</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                投資一家公司就等於「合夥做生意」。既然是做生意，你必須學會看帳本。財務報表（簡稱財報）就是企業的成績單與體檢報告，而其中最重要的就是被稱為「財報三表」的這三份文件。
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* 損益表 */}
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">📈</span>
                    <h3 className="text-xl font-bold text-amber-500">1. 損益表</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 核心看點：賺錢能力</p>
                      <p className="leading-relaxed">紀錄公司在「一段時間內」賣了多少東西、花了多少成本，最後到底有沒有賺錢。這就像是你每個月的收支記帳本。</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-xl border border-foreground/5">
                      <p className="font-bold text-amber-400 mb-1">💡 如何分析與舉例</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>毛利率 (Gross Margin)：</strong>越高代表產品越有「定價權」。例如蘋果 (Apple) 手機毛利率極高，因為品牌力讓消費者願意付高價，不怕競爭對手削價競爭。</li>
                        <li><strong>營業利益率 (Operating Margin)：</strong>扣除行銷、研發等費用後本業的獲利能力，可以看出公司管控營運開銷的效率。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 資產負債表 */}
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">⚖️</span>
                    <h3 className="text-xl font-bold text-blue-400">2. 資產負債表</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 核心看點：體質健康</p>
                      <p className="leading-relaxed">在「某一個特定時間點」的快照，列出公司擁有什麼（資產）、欠別人多少錢（負債），以及真正屬於股東的錢（權益）。這就像是你個人的淨資產清單。</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-xl border border-foreground/5">
                      <p className="font-bold text-blue-400 mb-1">💡 如何分析與舉例</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>負債比率 (Debt Ratio)：</strong>負債比例過高，在經濟不景氣時容易周轉不靈而破產。</li>
                        <li><strong>流動比率 (Current Ratio)：</strong>「流動資產 ÷ 流動負債」。如果公司明天就要還 100 萬的短債，但手上現金加起來只有 20 萬，這就是極度危險的訊號。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 現金流量表 */}
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">💵</span>
                    <h3 className="text-xl font-bold text-emerald-400">3. 現金流量表</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 核心看點：真實存活率</p>
                      <p className="leading-relaxed">損益表上的利潤可以靠會計手法「做帳」，但銀行帳戶裡有沒有白花花的鈔票進出卻騙不了人。有現金才能發薪水、活下去，所謂「現金為王 (Cash is King)」。</p>
                    </div>
                    <div className="bg-background/50 p-3 rounded-xl border border-foreground/5">
                      <p className="font-bold text-emerald-400 mb-1">💡 如何分析與舉例</p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li><strong>營業現金流 (Operating Cash Flow)：</strong>如果損益表顯示公司大賺 10 億，但營業現金流卻是負的，代表貨賣出去了但「錢根本沒收回來」（應收帳款暴增）。這是典型的做假帳或財務危機的超級警訊！</li>
                        <li><strong>自由現金流 (Free Cash Flow)：</strong>公司扣除維持營運所需的廠房設備支出後，真正能自由支配的閒錢，決定了公司發放股息的底氣。</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 lg:col-span-3 space-y-4">
                  <CaseStudyAccordion title="用「個人理財」秒懂財報三表" icon="👛" theme="amber">
                    <p className="mb-2">把一家公司當成你自己的個人財務來看：</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>損益表：</strong> 你這個月的「薪水」減掉「生活費」。如果薪水 5 萬，花掉 4 萬，這個月你就淨賺 1 萬。</li>
                      <li><strong>資產負債表：</strong> 你的「房子與存款」(資產) 減掉你的「房貸與卡債」(負債)。這決定了你到底是真的有錢，還是打腫臉充胖子。</li>
                      <li><strong>現金流量表：</strong> 你口袋裡「現在立刻」能拿出來的現金。很多人月入 10 萬（損益表好看），但錢都拿去買儲蓄險或借給朋友（應收帳款），遇到急病要立刻付 1 萬醫藥費卻拿不出來，最後只好破產（這在企業就叫「黑字倒閉」）。</li>
                    </ul>
                  </CaseStudyAccordion>

                  <CaseStudyAccordion title="避開地雷股：財報作假的 5 大紅旗警訊" icon="🚩" theme="rose">
                    <p className="mb-2">財報可以被合法「美化」，也可能被非法「造假」。投資人不需要會查帳，但必須懂得辨識危險訊號（以台股史上最大造假案「康友-KY」為例）：</p>
                    <ul className="list-disc pl-5 space-y-2 mb-3">
                      <li><strong>紅旗一：營收大成長，但營業現金流持續為負。</strong> 帳面上賺很多錢，但錢根本沒收進公司戶頭（都是應收帳款），這極度危險。</li>
                      <li><strong>紅旗二：頻繁更換會計師事務所或財務長。</strong> 如果連負責查帳的會計師都不敢簽證而辭職，代表公司的帳目連專業人士都覺得有鬼。</li>
                      <li><strong>紅旗三：不合理的關係人交易。</strong> 公司頻繁跟「董事長自己開的另一家未上市小公司」買賣東西，這通常是掏空公司資產的手法。</li>
                      <li><strong>紅旗四：存貨周轉天數暴增。</strong> 倉庫裡堆滿了賣不出去的存貨，但公司卻還在持續擴廠，這可能是存貨根本不存在，或是產品已經被市場淘汰。</li>
                      <li><strong>紅旗五：帳上現金很多，卻一直借高息負債。</strong> 明明公司銀行裡有幾十億現金，卻還去發行高利率的公司債借錢？這通常代表帳上的現金是假的（早就被挪用或限制用途）。</li>
                    </ul>
                    <p className="mt-2 text-rose-400 font-bold">💡 結論：</p>
                    <p>「損益表」是公司的面子，很容易化妝；「現金流量表」是公司的底子，騙不了人。永遠要交叉比對這兩張表。</p>
                  </CaseStudyAccordion>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">企業護城河 (Economic Moat)</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                就算一間公司財報再漂亮，如果它賺錢的方法很容易被別人複製，那高額利潤很快就會被競爭對手吃掉。所謂的「護城河」，就是保護企業利潤不受侵蝕的無形城牆。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* 品牌優勢 */}
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm flex gap-4">
                  <div className="text-4xl shrink-0">💎</div>
                  <div>
                    <h3 className="text-lg font-bold text-rose-500 mb-2">1. 品牌優勢 (Intangible Assets)</h3>
                    <p className="text-sm leading-relaxed mb-3">
                      消費者願意為了這個「Logo」支付比同類商品高出許多的價格，而且對價格上漲不敏感。這賦予了公司極強的定價權。
                    </p>
                    <div className="text-sm bg-background/50 p-3 rounded-lg border border-foreground/5">
                      <span className="font-bold text-foreground">💡 舉例：</span>蘋果 (Apple)、可口可樂 (Coca-Cola)、愛馬仕 (Hermès)。
                    </div>
                  </div>
                </div>

                {/* 轉換成本 */}
                <div className="p-6 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 shadow-sm flex gap-4">
                  <div className="text-4xl shrink-0">⛓️</div>
                  <div>
                    <h3 className="text-lg font-bold text-indigo-400 mb-2">2. 轉換成本 (Switching Costs)</h3>
                    <p className="text-sm leading-relaxed mb-3">
                      客戶一旦開始使用該公司的產品或服務，要換成競爭對手的產品會非常痛苦，可能需要耗費大量時間、金錢或承擔巨大風險。
                    </p>
                    <div className="text-sm bg-background/50 p-3 rounded-lg border border-foreground/5">
                      <span className="font-bold text-foreground">💡 舉例：</span>微軟 (Office軟體)、Salesforce (企業軟體)、以及被綁住的蘋果 iOS 生態系。
                    </div>
                  </div>
                </div>

                {/* 網絡效應 */}
                <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 shadow-sm flex gap-4">
                  <div className="text-4xl shrink-0">🕸️</div>
                  <div>
                    <h3 className="text-lg font-bold text-purple-400 mb-2">3. 網絡效應 (Network Effect)</h3>
                    <p className="text-sm leading-relaxed mb-3">
                      最可怕的護城河。「使用這個產品的人越多，這個產品對所有人的價值就越高」，這往往會造成贏者全拿的壟斷局面。
                    </p>
                    <div className="text-sm bg-background/50 p-3 rounded-lg border border-foreground/5">
                      <span className="font-bold text-foreground">💡 舉例：</span>Meta (FB/IG - 你的朋友都在這)、Visa/Mastercard (越多商家收，越多消費者用)。
                    </div>
                  </div>
                </div>

                {/* 成本優勢 */}
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm flex gap-4">
                  <div className="text-4xl shrink-0">📉</div>
                  <div>
                    <h3 className="text-lg font-bold text-emerald-500 mb-2">4. 成本優勢 (Cost Advantage)</h3>
                    <p className="text-sm leading-relaxed mb-3">
                      由於規模經濟、獨特的地理位置或專利技術，公司可以用競爭對手「根本無法達到的低成本」來生產商品或提供服務。
                    </p>
                    <div className="text-sm bg-background/50 p-3 rounded-lg border border-foreground/5">
                      <span className="font-bold text-foreground">💡 舉例：</span>台積電 (TSMC - 規模與良率優勢)、好市多 (Costco - 龐大的採購議價能力)。
                    </div>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                  <CaseStudyAccordion title="護城河被攻破的血淋淋案例：Nokia 與 Intel" icon="🏰" theme="rose">
                    <p className="mb-2">護城河不是永久的，當產業發生「典範轉移」時，再厚的城牆也會瞬間倒塌：</p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Nokia 的品牌護城河失效：</strong> 曾經佔據全球 40% 手機市佔，品牌力極強。但在 Apple 推出 iPhone 後，Nokia 的「硬體品牌力」完全無法抵抗 Apple 建立的「iOS 軟體生態系 (網絡效應 + 轉換成本)」護城河。</li>
                      <li><strong>Intel 的成本/技術護城河崩壞：</strong> 曾經在晶片製造上獨步全球。但當台積電 (TSMC) 專注於純代工模式，聚集了全球 IC 設計廠的訂單，實現了更強大的規模經濟與製程學習曲線後，Intel 的護城河便遭到無情輾壓。</li>
                    </ul>
                  </CaseStudyAccordion>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">產業生命週期 (Industry Life Cycle)</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                除了評估單一公司的護城河，你還必須看懂它所處的「戰場」還有沒有水。如果整個產業都在萎縮，再強的公司也只能是「夕陽無限好」。產業通常會經歷四個發展階段：
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                
                {/* 初創期 */}
                <div className="p-5 rounded-2xl bg-slate-500/5 border border-slate-500/20 shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
                  <div className="text-3xl mb-3">🌱</div>
                  <h3 className="text-lg font-bold text-slate-400 mb-2">1. 初創期 (Introduction)</h3>
                  <div className="space-y-3 text-sm flex-grow">
                    <p><strong>特徵：</strong>技術剛萌芽，市場還在觀望，多數公司處於虧損燒錢狀態，倒閉率極高。</p>
                    <p><strong>投資邏輯：</strong>高風險高報酬，像買彩券。通常是創投 (VC) 的領域，一般散戶極難挑中最後的贏家。</p>
                    <div className="bg-background/50 p-2 rounded border border-foreground/5 mt-auto">
                      <span className="font-bold text-foreground">💡 舉例：</span>量子運算、核融合。
                    </div>
                  </div>
                </div>

                {/* 成長期 */}
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
                  <div className="text-3xl mb-3">🚀</div>
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">2. 成長期 (Growth)</h3>
                  <div className="space-y-3 text-sm flex-grow">
                    <p><strong>特徵：</strong>產品被大眾接受，營收呈指數型爆發，競爭者大量湧入。公司開始賺錢但多數用於再投資。</p>
                    <p><strong>投資邏輯：</strong>股市最喜歡的階段，股價最容易翻倍。不看 P/E 本益比，只看營收成長率與市佔率擴張。</p>
                    <div className="bg-background/50 p-2 rounded border border-foreground/5 mt-auto">
                      <span className="font-bold text-foreground">💡 舉例：</span>AI 人工智慧、電動車 (過渡期)。
                    </div>
                  </div>
                </div>

                {/* 成熟期 */}
                <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
                  <div className="text-3xl mb-3">👑</div>
                  <h3 className="text-lg font-bold text-blue-400 mb-2">3. 成熟期 (Maturity)</h3>
                  <div className="space-y-3 text-sm flex-grow">
                    <p><strong>特徵：</strong>成長停滯，市場被少數巨頭寡占。不再需要大量資本支出，公司產生龐大的自由現金流。</p>
                    <p><strong>投資邏輯：</strong>存股族的最愛。重點看殖利率、P/E 估值是否便宜、以及公司有沒有穩定發放股息並實施庫藏股。</p>
                    <div className="bg-background/50 p-2 rounded border border-foreground/5 mt-auto">
                      <span className="font-bold text-foreground">💡 舉例：</span>智慧型手機、電信業、食品飲料。
                    </div>
                  </div>
                </div>

                {/* 衰退期 */}
                <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm flex flex-col hover:-translate-y-1 transition-transform">
                  <div className="text-3xl mb-3">🍂</div>
                  <h3 className="text-lg font-bold text-rose-400 mb-2">4. 衰退期 (Decline)</h3>
                  <div className="space-y-3 text-sm flex-grow">
                    <p><strong>特徵：</strong>新技術出現導致需求永久下滑，營收與利潤持續萎縮。公司開始裁員或賤價賣資產。</p>
                    <p><strong>投資邏輯：</strong>價值陷阱的溫床。看起來本益比很低、殖利率很高，但其實是因為股價正在跌向歸零的路上。避開為妙。</p>
                    <div className="bg-background/50 p-2 rounded border border-foreground/5 mt-auto">
                      <span className="font-bold text-foreground">💡 舉例：</span>傳統百貨實體店、燃油車廠、有線電視。
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">估值模型 (Valuation Models)</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                「好公司」不等於「好股票」，關鍵在於你買入的價格。即使是台積電，買在天價也可能讓你套牢好幾年。估值模型就是用來幫你計算：<strong>這個價格到底算不算便宜？</strong>
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                
                {/* P/E vs P/FCF */}
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">⚖️</span>
                    <h3 className="text-xl font-bold text-amber-500">本益比 (P/E) vs 自由現金流收益率 (P/FCF)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 意義是什麼？</p>
                      <p className="leading-relaxed"><strong>P/E (股價/每股盈餘)：</strong>假設公司未來每年都賺一樣的錢，你需要「幾年」才能回本。<br/><strong>P/FCF (股價/每股自由現金流)：</strong>升級版的 P/E。因為「盈餘」可以靠合法會計作帳，但「自由現金流」是實打實的真金白銀，能避開許多財報地雷。</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 space-y-3 mt-auto">
                      <p><strong>🎯 何時使用：</strong>適用於獲利穩定、成熟期的企業（如統一、中華電信）。</p>
                      <p><strong>🛠️ 如何使用：</strong>與公司「過去 5 年的歷史本益比」比較，或與「同行業的競爭對手」比較。低於歷史平均通常代表相對便宜。</p>
                      <p><strong>⚠️ 為何不用/盲點：</strong>絕對不能用在「尚未獲利的成長股」或「景氣循環股」（航運、記憶體）。因為循環股在最賺錢時 P/E 最低，卻往往是股價即將崩盤的高點。</p>
                    </div>
                  </div>
                </div>

                {/* 股價淨值比 P/B */}
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏢</span>
                    <h3 className="text-xl font-bold text-blue-400">股價淨值比 (P/B)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 意義是什麼？</p>
                      <p className="leading-relaxed">「股價 ÷ 每股淨值」。淨值就是把公司所有的資產賣掉，還清債務後，剩下的真正價值。如果 P/B &lt; 1，代表你用「低於這家公司清算拍賣價」的價格買到了它（俗稱跌破淨值）。</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 space-y-3 mt-auto">
                      <p><strong>🎯 何時使用：</strong>最適合用於「金融業（銀行、保險）」與「重資產的傳統製造業」。</p>
                      <p><strong>🛠️ 如何使用：</strong>當體質優良的銀行股 P/B 跌到 1 倍以下（甚至 0.8 倍），通常是長線價值投資人眼中的極佳買點。</p>
                      <p><strong>⚠️ 為何不用/盲點：</strong>完全不適用於「軟體科技業」或「生技業」。因為微軟或谷歌最大的資產是工程師的大腦與專利（無形資產），這些不會記在帳本的淨值裡，導致它們的 P/B 看起來永遠高得嚇人，讓你永遠買不下手。</p>
                    </div>
                  </div>
                </div>

                {/* 現金流折現模型 DCF */}
                <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🔮</span>
                    <h3 className="text-xl font-bold text-purple-400">現金流折現模型 (DCF)</h3>
                  </div>
                  <div className="space-y-4 text-sm text-foreground/80 flex-grow">
                    <div>
                      <p className="font-bold text-emerald-400 mb-1">🔍 意義是什麼？</p>
                      <p className="leading-relaxed">巴菲特最推崇的終極估值法。概念是：一家公司現在的價值，等於它「未來這輩子能賺到的所有現金，折算回今天的價值」。這是基於「今天的 100 元，比明天的 100 元更有價值」（貨幣時間價值）的原理。</p>
                    </div>
                    <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 space-y-3 mt-auto">
                      <p><strong>🎯 何時使用：</strong>適用於現金流非常穩定、未來成長率容易預測的公司（如民生必需品、收費橋樑、訂閱制軟體）。</p>
                      <p><strong>🛠️ 如何使用：</strong>預估未來 5-10 年的自由現金流，給定一個折現率（預期報酬率），算算出一個「絕對的合理股價」。如果市價低於合理股價，就是買點。</p>
                      <p><strong>⚠️ 為何不用/盲點：</strong>「Garbage in, garbage out」（垃圾進，垃圾出）。只要你對未來成長率的預估偏差 1%，算出來的合理股價可能會差十萬八千里。這是一個主觀猜測成分極高的模型。</p>
                    </div>
                  </div>
                </div>

              </div>

              <PECalculator />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2">總體經濟 (Macroeconomics)</h2>
            <div className="space-y-6 text-foreground/80">
              <p>
                如果說個股基本面是「船的引擎與結構」，那總體經濟就是「海上的天氣」。當經濟颶風來臨時，即使是最好的船也可能面臨沉沒危機。看懂總經，能幫你避開大股災，甚至在底部精準抄底。
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* 央行政策與利率 */}
                <div className="p-6 rounded-2xl bg-slate-500/5 border border-slate-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏦</span>
                    <h3 className="text-xl font-bold text-slate-400">央行政策與利率 (Interest Rates)</h3>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-foreground/80 flex-grow">
                    <p>
                      <strong>對市場的影響：</strong>利率是「資金的成本」。當美國聯準會 (Fed) <strong>降息</strong>時，借錢變便宜，資金會瘋狂湧入股市，引發大牛市；反之當 <strong>升息</strong> 時，資金會撤出股市存回無風險的銀行，股市（尤其是不賺錢的科技股）往往會面臨暴跌。
                    </p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-foreground/5 mt-4">
                    <p><span className="font-bold text-emerald-400">📅 何時該注意：</span>每年 8 次的 FOMC (聯邦公開市場委員會) 利率決策會議。主席的會後發言往往會引發市場大地震。</p>
                  </div>
                </div>

                {/* 通貨膨脹 */}
                <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🔥</span>
                    <h3 className="text-xl font-bold text-rose-500">通貨膨脹 (Inflation - CPI/PCE)</h3>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-foreground/80 flex-grow">
                    <p>
                      <strong>對市場的影響：</strong>適度的通膨 (約 2%) 是經濟健康的象徵。但如果通膨失控（如高達 8%），央行就會被迫「暴力升息」來打擊物價，這會扼殺經濟成長並引發股市崩盤。
                    </p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-foreground/5 mt-4">
                    <p><span className="font-bold text-emerald-400">📅 何時該注意：</span>美國每月公布的 CPI (消費者物價指數) 與 PCE (個人消費支出物價指數) 數據發布日。</p>
                  </div>
                </div>

                {/* GDP */}
                <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🏭</span>
                    <h3 className="text-xl font-bold text-blue-400">國內生產毛額 (GDP)</h3>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-foreground/80 flex-grow">
                    <p>
                      <strong>對市場的影響：</strong>衡量一個國家經濟活動的總量。GDP 持續成長代表景氣繁榮，企業獲利普遍上升；如果 GDP 連續兩季負成長，就定義為「經濟衰退 (Recession)」，此時股市通常已經在相對低點。
                    </p>
                  </div>
                  <div className="bg-background/50 p-3 rounded-lg border border-foreground/5 mt-4">
                    <p><span className="font-bold text-emerald-400">📅 何時該注意：</span>每季度的 GDP 預估值與終值發布日。</p>
                  </div>
                </div>

                {/* 實戰工具：如何獲取資料 */}
                <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/20 shadow-sm flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🛠️</span>
                    <h3 className="text-xl font-bold text-amber-500">實戰：去哪裡找這些資料？</h3>
                  </div>
                  <div className="space-y-3 text-sm leading-relaxed text-foreground/80 flex-grow">
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>財經 M 平方 (MacroMicro)：</strong>台灣最強的總體驗證平台，提供圖表化的全球經濟數據。</li>
                      <li><strong>Investing.com (財經日曆)：</strong>免費查詢每日即將公布的重要經濟數據與各國央行會議時間（俗稱看日曆開獎）。</li>
                      <li><strong>FRED (美聯儲經濟數據庫)：</strong>最權威的美國官方經濟數據圖表庫，免費且即時。</li>
                    </ul>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </div>

        {/* Next Level Button */}
        <div className="mt-16 mb-8 flex justify-center">
          <Link href="/education/skill-tree/level-4-advanced" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-amber-950 transition-all duration-300 bg-amber-500 rounded-2xl hover:bg-amber-400 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:-translate-y-1">
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

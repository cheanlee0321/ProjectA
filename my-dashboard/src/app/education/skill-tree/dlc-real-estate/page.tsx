import Link from 'next/link';
import RealEstateCalculator from '@/components/education/RealEstateCalculator';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';export default function DLCRealEstate() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <div className="inline-block px-3 py-1 mb-4 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-sm font-bold tracking-wider uppercase">DLC 擴充包</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-cyan-400 mb-4">房地產大亨</h1>
          <p className="text-xl text-foreground/80">特定職業支線</p>
          <div className="mt-6 p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
            <p className="text-foreground leading-relaxed">
              跳脫股市，轉向實體資產與特許金融商品。學習運用槓桿與租金收益建立強大的被動現金流。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* REITs */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🏢</span> REITs (不動產投資信託)
            </h2>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 shadow-sm">
              <p className="text-foreground/80 mb-6 leading-relaxed">
                想當包租公但買不起整棟樓？不想半夜被房客叫去修馬桶？REITs 是你的最佳選擇。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-background/50 p-5 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">什麼是 REITs？</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    REITs 就像是「房地產的 ETF」。由專業團隊拿大家的錢去買商辦、購物中心、甚至數據中心，然後把收到的租金發給投資人。你可以像買賣股票一樣在交易所輕鬆買賣 REITs，流動性極佳。
                  </p>
                </div>
                <div className="bg-background/50 p-5 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">多元的次級分類</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    買 REITs 不只是買住宅。你可以投資「物流倉儲 REITs」(受惠電商崛起)、「醫療照護 REITs」(受惠高齡化社會)，甚至是「通訊電塔 REITs」(受惠 5G 發展)。
                  </p>
                </div>
                <div className="bg-background/50 p-5 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-cyan-400 mb-2">高配息的法律規定</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    在美國等地，法律規定 REITs 必須將當年 90% 以上的應稅收益以「股息」的形式發放給股東，才能享有免除公司稅的優惠。因此，REITs 通常具備相當誘人的高殖利率，是許多退休族的最愛。
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <CaseStudyAccordion title="科技巨頭的隱形房東：數據中心與電塔 REITs" icon="📡" theme="cyan">
                  <p className="mb-2">傳統房地產可能面臨少子化或商圈轉移的危機，但「數位房地產」卻正處於超級爆發期：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-2">
                    <li><strong>數據中心 REITs (如 Equinix - EQIX)：</strong> AI 時代需要龐大的算力，而伺服器需要極度穩定的電力、散熱與空間。Equinix 就是在全世界大舉興建這類機房，然後「租」給 Google、AWS、Microsoft 這些科技巨頭。</li>
                    <li><strong>通訊電塔 REITs (如 American Tower - AMT)：</strong> 你手機上網的訊號來自基地台，而電信商 (如 AT&T, Verizon) 通常不擁有那些高聳的電塔。AMT 擁有超過 20 萬座電塔，他們把電塔上的空間「出租」給電信商。</li>
                  </ul>
                  <p className="mt-2 text-cyan-400 font-bold">💡 實戰啟示：</p>
                  <p>「實體房地產不一定只能收人的租金，收機器的租金往往更賺錢，且合約更長、違約率更低。」</p>
                </CaseStudyAccordion>
              </div>
            </div>
          </section>

          {/* 槓桿操作 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">⚖️</span> 槓桿操作與房貸策略
            </h2>
            <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 shadow-sm">
              <p className="text-foreground/80 mb-6 leading-relaxed">
                房地產之所以能創造巨富，最大的秘密在於它是唯一能讓平民百姓合法「開 5 倍槓桿 (8成貸款) 且極難被斷頭」的資產。這在商界叫做 OPM (Other People's Money)——用別人的錢賺錢。
              </p>
              {/* 數學對比 */}
              <div className="mb-6 p-5 bg-background/50 rounded-xl border border-cyan-500/30">
                <h3 className="font-bold text-cyan-400 mb-3 text-lg">📊 真實數學對比：當資產增值 10%</h3>
                <p className="text-sm text-foreground/80 mb-4">假設你想投資一間 1,000 萬的房子，一年後房價上漲了 10% (變成 1,100 萬)，也就是賺了 100 萬：</p>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400">💵</span>
                    <div>
                      <strong>全現金買房 (不開槓桿)：</strong><br/>
                      你付了 1000 萬現金。賺 100 萬 ÷ 投入本金 1000 萬 = <strong className="text-emerald-400">真實報酬率 10%</strong>。
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400">📈</span>
                    <div>
                      <strong>買 1000 萬的股票 (通常不開槓桿)：</strong><br/>
                      你一樣要拿 1000 萬現金出來。賺 100 萬 ÷ 投入本金 1000 萬 = <strong className="text-amber-400">真實報酬率 10%</strong>。
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-400">🔥</span>
                    <div>
                      <strong>貸款買房 (8成貸款，開 5 倍槓桿)：</strong><br/>
                      你只拿出了 200 萬頭期款，剩下 800 萬跟銀行借。同樣賺 100 萬，但你的計算基礎變了：<br/>
                      賺 100 萬 ÷ 投入本金 200 萬 = <strong className="text-cyan-400 text-base">真實報酬率 50%！</strong>這就是富人致富的終極外掛。
                    </div>
                  </li>
                </ul>
              </div>

              <div className="mt-8 mb-8">
                <RealEstateCalculator />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-foreground/5">
                  <div className="text-3xl shrink-0">⏳</div>
                  <div>
                    <h3 className="font-bold text-cyan-500 mb-1">寬限期 (Grace Period)</h3>
                    <p className="text-sm text-foreground/80">在最初的 2 到 5 年內「只繳利息、不還本金」。這能極大化前期的現金流，讓投資客能用租金輕鬆 Cover 房貸利息，產生正現金流，並等待房價自然增值。</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-foreground/5">
                  <div className="text-3xl shrink-0">🏧</div>
                  <div>
                    <h3 className="font-bold text-cyan-500 mb-1">理財型房貸 / 增貸</h3>
                    <p className="text-sm text-foreground/80">當房價上漲或本金還到一定程度後，把房子當作超級 ATM，再次向銀行借出低利資金，轉而去投資其他高投報率的資產，形成套利的財富飛輪。</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 現金流與估價 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🧮</span> 現金流與投報率計算
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-foreground/80 mb-6">
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 shadow-sm h-full hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-teal-400 mb-3">租金投報率 (Cap Rate)</h3>
                <p className="text-sm leading-relaxed mb-4">
                  專業投資客判斷物件價值的核心公式：<strong>淨營運收入 (NOI) ÷ 房產總價</strong>。<br/><br/>
                  不能只看表面收了多少租金，必須扣除管理費、房屋稅、地價稅、保險等所有日常開銷後，算出來的「真實淨利」再來對比房價，才能看出這間房產真實的賺錢能力。
                </p>
              </div>
              <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-2xl p-6 shadow-sm h-full hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-orange-400 mb-3">BRRRR 無本套利策略</h3>
                <p className="text-sm leading-relaxed mb-4">
                  房產大亨的經典必殺技：<br/>
                  1. <strong>Buy:</strong> 買進破舊的低價房<br/>
                  2. <strong>Rehab:</strong> 重新裝潢翻修提升價值<br/>
                  3. <strong>Rent:</strong> 高價出租創造穩定現金流<br/>
                  4. <strong>Refinance:</strong> 以翻修後的高估值向銀行轉貸，把當初投入的本金全數抽回<br/>
                  5. <strong>Repeat:</strong> 拿著抽回的本金再去買下一間房子，重複循環建立房產帝國。
                </p>
              </div>
            </div>

            <div className="mt-6">
              <CaseStudyAccordion title="包租公的惡夢：空租與修繕的真實壓力測試" icon="🛠️" theme="amber">
                <p className="mb-2">紙上談兵的投報率通常很完美，但實體房產最大的風險在於隱藏成本：</p>
                <ul className="list-disc pl-5 space-y-2 mb-2">
                  <li><strong>空租期：</strong> 假設一間房月租 3 萬，一年理論上收 36 萬。但只要前一個房客搬走，重新招租花了 2 個月，你當年的總收入立刻剩下 30 萬。這期間你還得繼續繳每個月的房貸！</li>
                  <li><strong>修繕地雷：</strong> 房客半夜打來抱怨冷氣不涼、浴室漏水。換一台冷氣 3 萬，抓漏防水工程 5 萬。這 8 萬塊的支出，直接把你三個月的租金淨利給吃光了。</li>
                  <li><strong>惡房客風險 (租霸)：</strong> 遇到不繳租金又趕不走的房客，請律師走法律程序的成本與心力交瘁，是 Excel 表格上永遠算不出來的隱藏成本。</li>
                </ul>
                <p className="mt-2 text-orange-400 font-bold">💡 實戰金句：</p>
                <p>「買房收租從來都不是真正的『被動』收入。這是一門需要用心經營的小型生意。」</p>
              </CaseStudyAccordion>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}

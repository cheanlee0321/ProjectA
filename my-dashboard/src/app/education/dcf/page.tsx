import Link from 'next/link';

export default function DcfPage() {
  return (
    <main className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-6 font-medium">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            回首頁
          </Link>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center mr-6 border border-indigo-500/30">
              <span className="text-3xl">📈</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">現金流量折現法 (DCF) 教學</h1>
          </div>
          <p className="text-xl text-foreground/60 mt-4">
            以蘋果公司 (Apple Inc., AAPL) 為例，帶你一步步計算企業的內在價值。
          </p>
        </div>

        {/* Content Section 1 */}
        <section className="mb-12 bg-foreground/5 border border-foreground/10 rounded-3xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-indigo-400 mb-4">一、什麼是 DCF 模型？</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            DCF (Discounted Cash Flow，現金流量折現法) 是價值投資中最核心的估值方法。它的核心概念是：<strong>「一家公司現在的價值，等於它未來能為股東創造的所有自由現金流，折現到今天的總和。」</strong>
          </p>
          <p className="text-foreground/80 leading-relaxed mb-4">
            簡單來說，現在的 100 元，因為通膨與投資機會成本，會比明天的 100 元更有價值。因此，我們需要一個<strong>「折現率 (Discount Rate)」</strong>來把未來的錢換算成現在的價值。
          </p>
          <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 font-mono text-sm overflow-x-auto text-indigo-300">
            <p>企業價值 (EV) = CF₁/(1+r)¹ + CF₂/(1+r)² + ... + CFₙ/(1+r)ⁿ + TV/(1+r)ⁿ</p>
            <p className="mt-2 text-foreground/60 text-xs">* CF = 自由現金流, r = 折現率, TV = 終值</p>
          </div>
        </section>

        {/* Content Section 2 */}
        <section className="mb-12 bg-foreground/5 border border-foreground/10 rounded-3xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-indigo-400 mb-4">二、AAPL 估值範例與假設設定</h2>
          <p className="text-foreground/80 leading-relaxed mb-6">
            為了讓你了解實際運作，我們以蘋果 (AAPL) 為例。以下數據為教學示範之預估值，並非真實財報精確數字。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-background/50 p-6 rounded-2xl border border-foreground/5">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-400 text-sm">1</span>
                初始自由現金流 (FCF)
              </h3>
              <p className="text-3xl font-bold text-foreground mb-2">$100B <span className="text-sm font-normal text-foreground/50">(1000億美元)</span></p>
              <p className="text-sm text-foreground/60">邏輯：以 AAPL 近期財報的營運現金流扣除資本支出 (CapEx) 得到的基準值。</p>
            </div>

            <div className="bg-background/50 p-6 rounded-2xl border border-foreground/5">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-400 text-sm">2</span>
                預估成長率 (Growth Rate)
              </h3>
              <ul className="text-foreground/80 space-y-2 mb-2">
                <li>• 1-5年：<strong className="text-indigo-400">8%</strong></li>
                <li>• 6-10年：<strong className="text-indigo-400">5%</strong></li>
              </ul>
              <p className="text-sm text-foreground/60">邏輯：AAPL 屬於成熟巨頭，雖然硬體增長放緩，但高毛利的服務收入 (Services) 成長強勁，因此給予前五年 8% 成長，隨後遞減至 5%。</p>
            </div>

            <div className="bg-background/50 p-6 rounded-2xl border border-foreground/5">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-400 text-sm">3</span>
                折現率 (Discount Rate, r)
              </h3>
              <p className="text-3xl font-bold text-foreground mb-2">8.5%</p>
              <p className="text-sm text-foreground/60">邏輯：AAPL 擁有極強的護城河與 AA+ 信用評級，風險極低 (Beta約1.2)。使用 WACC (加權平均資本成本) 推算，8.5% 是一個合理且保守的要求報酬率。</p>
            </div>

            <div className="bg-background/50 p-6 rounded-2xl border border-foreground/5">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center">
                <span className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center mr-3 text-indigo-400 text-sm">4</span>
                永續成長率 (Terminal Growth)
              </h3>
              <p className="text-3xl font-bold text-foreground mb-2">2.5%</p>
              <p className="text-sm text-foreground/60">邏輯：10年後公司進入穩定成熟期，成長率通常與長期通貨膨脹率或 GDP 成長率相當。設定 2.5% 是符合大型經濟體的預期。</p>
            </div>
          </div>
        </section>

        {/* Content Section 3 */}
        <section className="mb-12 bg-foreground/5 border border-foreground/10 rounded-3xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-indigo-400 mb-6">三、計算步驟大解析</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Step 1：計算未來 10 年的自由現金流</h3>
              <p className="text-foreground/80 mb-4">將起始的 $100B 依照我們設定的成長率往後推算：</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="py-3 px-4 text-foreground/60">年份</th>
                      <th className="py-3 px-4 text-foreground/60">預估 FCF (十億)</th>
                      <th className="py-3 px-4 text-foreground/60">折現因子 (8.5%)</th>
                      <th className="py-3 px-4 text-indigo-400">折現後現值 (PV)</th>
                    </tr>
                  </thead>
                  <tbody className="text-foreground/80">
                    <tr className="border-b border-foreground/5"><td className="py-2 px-4">Year 1</td><td className="py-2 px-4">$108.0</td><td className="py-2 px-4">0.921</td><td className="py-2 px-4 font-bold text-indigo-300">$99.5</td></tr>
                    <tr className="border-b border-foreground/5"><td className="py-2 px-4">Year 2</td><td className="py-2 px-4">$116.6</td><td className="py-2 px-4">0.849</td><td className="py-2 px-4 font-bold text-indigo-300">$99.0</td></tr>
                    <tr className="border-b border-foreground/5"><td className="py-2 px-4">Year 3</td><td className="py-2 px-4">$126.0</td><td className="py-2 px-4">0.783</td><td className="py-2 px-4 font-bold text-indigo-300">$98.6</td></tr>
                    <tr className="border-b border-foreground/5"><td className="py-2 px-4">...</td><td className="py-2 px-4">...</td><td className="py-2 px-4">...</td><td className="py-2 px-4 font-bold text-indigo-300">...</td></tr>
                    <tr><td className="py-2 px-4">Year 10</td><td className="py-2 px-4">$187.9</td><td className="py-2 px-4">0.442</td><td className="py-2 px-4 font-bold text-indigo-300">$83.1</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-foreground/60 border-l-2 border-indigo-500 pl-4">
                <strong>前 10 年現值加總：</strong> 約為 <strong>$930B</strong> (9,300億美元)。
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Step 2：計算終值 (Terminal Value)</h3>
              <p className="text-foreground/80 mb-2">公司在第 10 年之後還會繼續營運，我們使用「永續成長模型 (Gordon Growth Model)」計算第 10 年之後所有現金流的總價值。</p>
              <div className="bg-background/50 p-4 rounded-xl border border-foreground/5 text-sm text-foreground/80 my-4">
                TV = (Year 10 FCF × (1 + 永續成長率)) ÷ (折現率 - 永續成長率) <br />
                TV = ($187.9B × 1.025) ÷ (0.085 - 0.025) = $3,210B
              </div>
              <p className="text-foreground/80">但這個 $3,210B 是第 10 年的價值，我們需要將它折現回「現在」：</p>
              <p className="font-bold text-indigo-300 mt-2">折現後終值現值 = $3,210B × 0.442 = $1,418B</p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Step 3：推算每股內在價值</h3>
              <p className="text-foreground/80 mb-4">將前面兩者相加得到「企業價值 (Enterprise Value)」，再扣除淨負債得到「股權價值 (Equity Value)」，最後除以流通股數。</p>
              
              <ul className="space-y-3 text-foreground/90 bg-background/30 p-6 rounded-2xl">
                <li className="flex justify-between border-b border-foreground/10 pb-2">
                  <span>1. 企業總價值 (EV) = 930 + 1,418</span>
                  <span className="font-bold">$2,348B</span>
                </li>
                <li className="flex justify-between border-b border-foreground/10 pb-2">
                  <span>2. 加上：現金與約當現金 (假設)</span>
                  <span className="font-bold text-emerald-400">+$60B</span>
                </li>
                <li className="flex justify-between border-b border-foreground/10 pb-2">
                  <span>3. 扣除：總負債 (假設)</span>
                  <span className="font-bold text-rose-400">-$100B</span>
                </li>
                <li className="flex justify-between border-b border-foreground/10 pb-2 text-indigo-300 text-lg">
                  <span>4. 股權總價值 (Equity Value)</span>
                  <span className="font-bold">$2,308B</span>
                </li>
                <li className="flex justify-between pt-2">
                  <span>5. 流通在外股數 (Shares Outstanding)</span>
                  <span className="font-bold">15.5B 股</span>
                </li>
              </ul>

              <div className="mt-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-center">
                <h4 className="text-lg text-indigo-300 mb-2">最終計算出的 AAPL 每股內在價值</h4>
                <p className="text-5xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                  $148.90
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section 4 */}
        <section className="mb-12 bg-foreground/5 border border-foreground/10 rounded-3xl p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-indigo-400 mb-4">四、安全邊際 (Margin of Safety)</h2>
          <p className="text-foreground/80 leading-relaxed mb-4">
            我們算出的 $148.90 只是基於我們「假設」的完美狀態。未來的成長率可能會不如預期，或者利率環境發生變化。因此，價值投資之父班傑明·葛拉漢強調了<strong>「安全邊際」</strong>的概念。
          </p>
          <p className="text-foreground/80 leading-relaxed">
            如果我們設定 15% 的安全邊際：<br/>
            合理買入價 = $148.90 × (1 - 0.15) = <strong className="text-emerald-400">$126.56</strong>
          </p>
          <div className="mt-6 p-4 border-l-4 border-amber-500 bg-amber-500/10 text-amber-200/90 text-sm rounded-r-lg">
            <strong>免責聲明：</strong> 本文所有數據皆為教學範例使用，並非實際投資建議，亦不代表蘋果公司當前真實估值。實務操作中，請依據最新財報數據進行計算。
          </div>
        </section>
        
      </div>
    </main>
  );
}

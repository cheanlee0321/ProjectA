import Link from 'next/link';
import PositionSizeCalculator from '@/components/education/PositionSizeCalculator';
import CaseStudyAccordion from '@/components/education/CaseStudyAccordion';

export default function Level4Advanced() {
  return (
    <main className="min-h-screen bg-background flex flex-col py-12 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto w-full">
        <Link href="/education" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors mb-8 font-medium">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回教學資源
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-400 mb-4">Level 4：高階戰術</h1>
          <p className="text-xl text-foreground/80">資金與心智控管</p>
          <div className="mt-6 p-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-foreground leading-relaxed">
              到了這個級別，技術已經不是決勝關鍵，「風險管理」與「克服人性」才是長期存活的秘密。
            </p>
          </div>
        </div>

        <div className="space-y-12">
          
          {/* 資產配置 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🧩</span> 資產配置 (Asset Allocation)
            </h2>
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 shadow-sm">
              <p className="text-foreground/80 mb-6 leading-relaxed">
                華爾街唯一免費的午餐就是「分散投資」。但分散不是亂買一通，而是要建立科學化的資產組合。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-background/50 p-5 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-indigo-400 mb-2">現代投資組合理論 (MPT)</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    諾貝爾經濟學獎得主的理論。核心概念是尋找「相關係數低」的資產（例如：股票與公債）。當股票大跌時，公債往往會上漲或抗跌，這樣一來，你的總資產波動度會大幅降低，晚上才能安穩睡覺。
                  </p>
                </div>
                <div className="bg-background/50 p-5 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-blue-400 mb-2">股債經典比例 (60/40)</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    最基礎的資產配置法：60% 資金買股票（追求攻擊與成長），40% 資金買優質債券（負責防禦與穩定配息）。雖然牛市時報酬率可能略低於 100% 持股，但遇到股災時的「存活率」卻高出好幾倍。
                  </p>
                </div>
                <div className="bg-background/50 p-5 rounded-xl border border-foreground/5 hover:-translate-y-1 transition-transform">
                  <h3 className="text-lg font-bold text-emerald-400 mb-2">再平衡 (Rebalancing) 策略</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    假設你原本設定 60% 股票、40% 債券。經過一年股市大漲，比例變成了 75/25。此時你的「風險已經過高」。再平衡就是「強迫自己賣掉漲多的股票，買入沒漲的債券」，讓比例回到 60/40。這是一種違反人性的「高拋低吸」紀律。
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 資金控管 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🛡️</span> 資金控管與風險管理
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-foreground/80">
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-rose-500 mb-3">絕對的 2% 法則</h3>
                <p className="text-sm leading-relaxed mb-4 flex-grow">
                  華爾街專業操盤手的鐵律：<strong>「單筆交易的最大虧損，絕對不超過總投資本金的 2%」</strong>。如果你的本金是 100 萬，那一筆交易看錯最多只能賠 2 萬。這樣即使你連錯 10 次，你還有 80% 的本金可以翻身。
                </p>
              </div>
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-amber-500 mb-3">凱利公式 (Kelly Criterion)</h3>
                <p className="text-sm leading-relaxed mb-4 flex-grow">
                  一套數學公式，用你的「勝率」與「賠率」來計算每次應該投入多少資金。它告訴我們一個殘酷的事實：如果勝率不高，就算重壓（All-in）一次賺翻，長期下來「破產的機率絕對是 100%」。
                </p>
              </div>
              <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 shadow-sm flex flex-col h-full hover:-translate-y-1 transition-transform">
                <h3 className="text-lg font-bold text-emerald-500 mb-3">停損與停利的藝術</h3>
                <p className="text-sm leading-relaxed mb-4 flex-grow">
                  「截斷虧損，讓利潤奔跑。」多數散戶的做法剛好相反：賺一點點就跑（停利太早），虧損了卻死抱著不放（不停損）。真正的贏家會嚴格執行停損，寧願小賠，也絕不大虧。
                </p>
              </div>
            </div>

            <PositionSizeCalculator />
          </section>

          {/* 行為財務學 */}
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-b border-foreground/10 pb-2 flex items-center gap-2">
              <span className="text-3xl">🧠</span> 行為財務學 (打敗心中的惡魔)
            </h2>
            <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6 shadow-sm">
              <p className="text-foreground/80 mb-6 leading-relaxed">
                交易系統再完美，最後按下買賣鍵的還是「人」。行為財務學專門研究大腦中的認知偏誤，這些原始的人性本能，往往是散戶在市場中賠錢的真正元兇。
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-foreground/5 hover:border-rose-500/50 transition-colors">
                  <div className="text-3xl shrink-0">😭</div>
                  <div>
                    <h3 className="font-bold text-rose-400 mb-1">損失厭惡 (Loss Aversion)</h3>
                    <p className="text-sm text-foreground/80">心理學證明：賠掉 1 萬塊的痛苦，是賺到 1 萬塊快樂的「兩倍」。這導致人們極度不願意認賠殺出，總覺得「只要我不賣，就沒有真的賠」。</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-foreground/5 hover:border-amber-500/50 transition-colors">
                  <div className="text-3xl shrink-0">💸</div>
                  <div>
                    <h3 className="font-bold text-amber-400 mb-1">沉沒成本謬誤 (Sunk Cost)</h3>
                    <p className="text-sm text-foreground/80">「我都已經套牢這麼深了，現在賣太虧，不如繼續逢低攤平！」為了挽救已經失去競爭力的公司，反而投入更多錢跟著一起陪葬。</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-foreground/5 hover:border-emerald-500/50 transition-colors">
                  <div className="text-3xl shrink-0">🦸‍♂️</div>
                  <div>
                    <h3 className="font-bold text-emerald-400 mb-1">過度自信 (Overconfidence)</h3>
                    <p className="text-sm text-foreground/80">在大多頭市場（牛市）隨便買隨便賺，就把「運氣」誤認為是自己的「實力」，開始加大槓桿，最後在一次崩盤中全軍覆沒。</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-foreground/5 hover:border-blue-500/50 transition-colors">
                  <div className="text-3xl shrink-0">🐑</div>
                  <div>
                    <h3 className="font-bold text-blue-400 mb-1">羊群效應 (FOMO)</h3>
                    <p className="text-sm text-foreground/80">害怕錯過 (Fear of Missing Out)。看到菜市場大媽跟計程車司機都在談論股票賺大錢，理智線斷裂盲目衝進去，往往就買在歷史最高點。</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-foreground/5 hover:border-purple-500/50 transition-colors">
                  <div className="text-3xl shrink-0">🙈</div>
                  <div>
                    <h3 className="font-bold text-purple-400 mb-1">確認偏誤 (Confirmation Bias)</h3>
                    <p className="text-sm text-foreground/80">買進一檔股票後，大腦會「自動過濾」所有看壞這家公司的新聞，只搜尋看好的分析報告來催眠自己。投資大師會刻意尋找反面意見來挑戰自己的觀點。</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-background/50 rounded-xl border border-foreground/5 hover:border-indigo-500/50 transition-colors">
                  <div className="text-3xl shrink-0">⚓</div>
                  <div>
                    <h3 className="font-bold text-indigo-400 mb-1">錨定效應 (Anchoring)</h3>
                    <p className="text-sm text-foreground/80">「從 600 跌到 400，太便宜了趕快買！」你把過去的「最高價」當成了價值的錨點，卻忽略了產業衰退時，合理價值可能已經掉到 300。</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <CaseStudyAccordion title="沉沒成本的真實教訓：千金股王宏達電 (HTC)" icon="📱" theme="amber">
                  <p className="mb-2">當基本面已經破敗，多數散戶卻因為「不甘心停損」而選擇跟股票談戀愛，最終面臨毀滅性的虧損：</p>
                  <ul className="list-disc pl-5 space-y-2 mb-2">
                    <li><strong>輝煌時刻：</strong> 2011 年，HTC 是全球智慧型手機的霸主之一，股價高達 1,300 元，被稱為「台灣之光」。</li>
                    <li><strong>基本面惡化：</strong> 隨後遭遇蘋果 Apple 的專利戰與三星 Samsung 的夾擊，市佔率雪崩式下滑。</li>
                    <li><strong>散戶的沉沒成本謬誤：</strong> 當股價跌到 800 元時，許多散戶心想「我 1300 買的，現在賣太虧了，等回本再賣」，甚至在 500 元時「逢低攤平」。他們完全忽略了公司的獲利能力已經徹底消失。</li>
                    <li><strong>殘酷結果：</strong> 如今宏達電股價常年在 50 元上下徘徊。那些因為「捨不得賣」而緊抱的投資人，最終損失超過 95% 的本金。</li>
                  </ul>
                  <p className="mt-2 text-rose-400 font-bold">💡 實戰金句：</p>
                  <p>「市場根本不在乎你買進的成本是多少。」當投資理由消失時，無論你是賺還是賠，都必須立刻無情地賣出。</p>
                </CaseStudyAccordion>
              </div>
            </div>
          </section>

        </div>

        {/* Next Level Button */}
        <div className="mt-16 mb-8 flex justify-center">
          <Link href="/education/skill-tree/level-5-pro" className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-indigo-950 transition-all duration-300 bg-indigo-500 rounded-2xl hover:bg-indigo-400 hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:-translate-y-1">
            <span className="flex items-center gap-2 text-lg">
              前往下一關：Level 5 專業領域
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

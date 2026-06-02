import Link from 'next/link';

export default function QuotesPage() {
  const quoteCategories = [
    {
      title: "價值與本質",
      description: "洞察價格與價值的差異，建立長期投資的基石。",
      quotes: [
        {
          author: "Benjamin Graham",
          quote: "價格是你付出的；價值是你得到的。",
          explanation: "價格是市場短期的波動，而價值是企業長期的本質。投資者的目標是以低於價值的價格買入。"
        },
        {
          author: "Peter Lynch",
          quote: "知道自己持有什麼，以及為什麼持有它。",
          explanation: "不要盲目跟風，投資前必須深入了解企業的基本面與獲利模式，這樣在市場波動時才能抱得住。"
        }
      ]
    },
    {
      title: "市場心理與逆向思考",
      description: "理解市場情緒，在群眾的恐慌與貪婪中保持清醒。",
      quotes: [
        {
          author: "華爾街諺語 / 最大痛苦理論",
          quote: "市場會盡一切可能讓最多的人看起來像笨蛋。",
          explanation: "市場走勢往往出乎大眾意料，當所有人看法一致時，市場經常會反向發展以「收割」多數人的共識。"
        },
        {
          author: "華爾街諺語",
          quote: "在別人都擔心時，牛市沿著憂慮之牆爬升；在別人充滿希望時，熊市沿著希望之河下滑。",
          explanation: "市場情緒往往是反向指標。極度恐慌時常孕育著底部，極度樂觀時則暗示著泡沫破裂的前兆。"
        },
        {
          author: "John Maynard Keynes",
          quote: "市場維持非理性的時間，可能比你維持償付能力的時間還長。",
          explanation: "即使你的判斷是對的，如果過早看空或使用了過高的槓桿，市場的瘋狂依然可能在反轉前將你洗出場。"
        },
        {
          author: "John Templeton",
          quote: "牛市生於悲觀，長於懷疑，成熟於樂觀，死於狂熱。",
          explanation: "精準描繪了市場情緒的四個週期。當市場中充滿狂熱與貪婪時，往往也就是行情的終點。"
        },
        {
          author: "Joseph P. Kennedy Sr. (擦鞋童理論)",
          quote: "當擦鞋童開始給你股票建議時，就該賣出了。",
          explanation: "當完全沒有投資經驗的普羅大眾也瘋狂湧入股市時，代表最後的接盤資金都已進場，崩盤往往隨之而來。"
        },
        {
          author: "逆向投資諺語",
          quote: "當所有人都往同一邊擠時，出口通常在另一邊。",
          explanation: "從眾心理在股市中極為危險。當市場形成絕對共識時，往往是最擁擠的交易，一有風吹草動便容易引發踩踏。"
        }
      ]
    },
    {
      title: "風險控管與紀律",
      description: "保住本金永遠是投資的第一要務。",
      quotes: [
        {
          author: "Warren Buffett",
          quote: "第一條規則：不要虧錢。第二條規則：不要忘記第一條規則。",
          explanation: "強調本金安全的重要性。虧損50%需要賺100%才能回本，因此防禦風險永遠優先於追求報酬。"
        },
        {
          author: "George Soros",
          quote: "重要的不是你對了幾次，而是你對的時候賺多少、錯的時候賠多少。",
          explanation: "投資勝率不需要極高，關鍵在於「大賺小賠」的盈虧比。控制下行風險，並讓獲利奔跑。"
        },
        {
          author: "John Templeton",
          quote: "投資最危險的四個字：『這次不一樣』。",
          explanation: "歷史總是驚人的相似，金融泡沫與崩盤的本質（人性的貪婪與恐懼）從未改變，不要為盲目樂觀找藉口。"
        },
        {
          author: "Paul Samuelson",
          quote: "投資如果很刺激，那大概不是投資。",
          explanation: "真正的長期投資是枯燥且需要耐心的，追求刺激與頻繁交易往往是投機與賭博的特徵。"
        }
      ]
    },
    {
      title: "商業模式與產業趨勢",
      description: "在淘金熱中尋找真正穩健的獲利模式。",
      quotes: [
        {
          author: "賣鏟子理論",
          quote: "沒有人知道誰能找到金礦，但所有人都需要鏟子。",
          explanation: "在不確定的新興趨勢中，投資提供必備工具或基礎設施的企業，往往比押注單一終端應用更穩健。"
        },
        {
          author: "市場觀點",
          quote: "泡沫最危險的時候，是連賣鏟子的人都開始被當成金礦的時候。",
          explanation: "當基礎設施公司的估值也被市場盲目推升到極度不合理的「夢想價」時，代表整個產業的泡沫可能已經來到極致。"
        },
        {
          author: "投資諺語",
          quote: "淘金熱發生時買鏟子公司；淘金熱快結束時買下旁邊城市的指數。淘金熱結束後，留下的是城市。",
          explanation: "技術革命的終極受惠者，往往是廣泛應用新技術來提升效率的整體經濟與傳統產業，而非早期的技術開發者。"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-12">
        <Link href="/" className="text-orange-500 hover:text-orange-400 font-medium inline-flex items-center mb-6 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回首頁
        </Link>
        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 flex items-center gap-3">
          <span className="text-orange-500">📜</span> 投資金句
        </h1>
        <p className="text-foreground/60 text-lg max-w-3xl">
          投資大師的智慧語錄與市場諺語，幫助我們在市場波動中保持清晰的判斷力。
        </p>
      </div>

      <div className="space-y-16">
        {quoteCategories.map((category, catIndex) => (
          <section key={catIndex}>
            <div className="mb-8 border-b border-foreground/10 pb-4">
              <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
                <span className="text-orange-500">#</span> {category.title}
              </h2>
              <p className="text-foreground/50">{category.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.quotes.map((item, index) => (
                <div key={index} className="p-8 rounded-3xl bg-foreground/5 border border-foreground/10 hover:bg-foreground/10 transition-colors flex flex-col h-full group">
                  <div className="text-4xl text-orange-500/30 mb-2 font-serif group-hover:text-orange-500/50 transition-colors">"</div>
                  <p className="text-xl font-medium leading-relaxed mb-6 text-foreground/90">
                    {item.quote}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-foreground/10">
                    <div className="mb-4">
                      <span className="text-xs font-bold uppercase tracking-wider text-orange-500/70 mb-1 block">解讀</span>
                      <p className="text-foreground/60 text-sm leading-relaxed">
                        {item.explanation}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 mt-6">
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-sm">
                        {item.author.charAt(0)}
                      </div>
                      <p className="text-foreground/70 font-semibold text-sm">{item.author}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

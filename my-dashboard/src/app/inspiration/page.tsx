import Link from 'next/link';

const investors = [
  {
    name: "Howard Marks",
    firm: "Oaktree Capital Management",
    url: "https://dataroma.com/m/holdings.php?m=oc",
    emoji: "🦉",
    color: "from-blue-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]",
    iconBg: "bg-blue-500/20 border-blue-500/30",
    textColor: "text-blue-500 group-hover:text-blue-400",
    description: "專注於信貸週期與風險管理，他的「投資備忘錄」是華爾街必讀，能幫助我們理解宏觀風險與市場情緒。",
  },
  {
    name: "Seth Klarman",
    firm: "Baupost Group",
    url: "https://dataroma.com/m/holdings.php?m=BAUPOST",
    emoji: "🏛️",
    color: "from-emerald-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.3)]",
    iconBg: "bg-emerald-500/20 border-emerald-500/30",
    textColor: "text-emerald-500 group-hover:text-emerald-400",
    description: "《安全邊際》作者，極度厭惡風險，常持有大量現金等待完美時機，為深度價值與特殊事件投資的權威。",
  },
  {
    name: "Michael Burry",
    firm: "Scion Asset Management",
    url: "https://dataroma.com/m/holdings.php?m=SAM",
    emoji: "⚡",
    color: "from-red-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(239,68,68,0.3)]",
    iconBg: "bg-red-500/20 border-red-500/30",
    textColor: "text-red-500 group-hover:text-red-400",
    description: "《大賣空》主角，善於發現市場極端錯價與黑天鵝事件，投資風格大膽且高度反共識。",
  },
  {
    name: "Warren Buffett",
    firm: "Berkshire Hathaway",
    url: "https://dataroma.com/m/holdings.php?m=BRK",
    emoji: "👑",
    color: "from-amber-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]",
    iconBg: "bg-amber-500/20 border-amber-500/30",
    textColor: "text-amber-500 group-hover:text-amber-400",
    description: "奧馬哈的神諭，專注於護城河深厚、現金流強勁的偉大企業，價值投資界的最高指標。",
  },
  {
    name: "Bill Ackman",
    firm: "Pershing Square Capital Management",
    url: "https://dataroma.com/m/holdings.php?m=psc",
    emoji: "🎯",
    color: "from-purple-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)]",
    iconBg: "bg-purple-500/20 border-purple-500/30",
    textColor: "text-purple-500 group-hover:text-purple-400",
    description: "激進投資者 (Activist Investor)，常透過集中做多或放空並推動企業改革來釋放巨大的股東價值。",
  },
  {
    name: "Guy Spier",
    firm: "Aquamarine Capital",
    url: "https://dataroma.com/m/holdings.php?m=aq",
    emoji: "🌊",
    color: "from-cyan-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(6,182,212,0.3)]",
    iconBg: "bg-cyan-500/20 border-cyan-500/30",
    textColor: "text-cyan-500 group-hover:text-cyan-400",
    description: "《華爾街之狼從良記》作者，深受巴菲特影響，投資風格極度自律且透明，重視長期複利。",
  },
  {
    name: "Li Lu",
    firm: "Himalaya Capital Management",
    url: "https://dataroma.com/m/holdings.php?m=HC",
    emoji: "🏔️",
    color: "from-indigo-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)]",
    iconBg: "bg-indigo-500/20 border-indigo-500/30",
    textColor: "text-indigo-500 group-hover:text-indigo-400",
    description: "查理·蒙格唯一信任並託付資金的外部基金經理人，深耕亞洲與美國的深度價值挖掘。",
  },
  {
    name: "Thomas Gayner",
    firm: "Markel Group",
    url: "https://dataroma.com/m/holdings.php?m=MKL",
    emoji: "📈",
    color: "from-teal-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(20,184,166,0.3)]",
    iconBg: "bg-teal-500/20 border-teal-500/30",
    textColor: "text-teal-500 group-hover:text-teal-400",
    description: "領導「小波克夏」Markel，擅長以保險浮存金進行長期穩健的股權投資，專注於尋找複利機器。",
  },
  {
    name: "Mohnish Pabrai",
    firm: "Pabrai Investments",
    url: "https://dataroma.com/m/holdings.php?m=PI",
    emoji: "🐘",
    color: "from-rose-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.3)]",
    iconBg: "bg-rose-500/20 border-rose-500/30",
    textColor: "text-rose-500 group-hover:text-rose-400",
    description: "蒙格的忠實信徒，採用極度集中的「達摩多」投資法，專尋「正面我贏，反面我損失不多」的標的。",
  },
  {
    name: "Chuck Akre",
    firm: "Akre Capital Management",
    url: "https://dataroma.com/m/holdings.php?m=ACM",
    emoji: "🌲",
    color: "from-lime-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(132,204,22,0.3)]",
    iconBg: "bg-lime-500/20 border-lime-500/30",
    textColor: "text-lime-500 group-hover:text-lime-400",
    description: "著名的「三腳凳」投資框架，專注尋找高資本回報率且具備優秀誠實管理層的偉大企業。",
  },
  {
    name: "Terry Smith",
    firm: "Fundsmith",
    url: "https://dataroma.com/m/holdings.php?m=FS",
    emoji: "🇬🇧",
    color: "from-blue-600/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(37,99,235,0.3)]",
    iconBg: "bg-blue-600/20 border-blue-600/30",
    textColor: "text-blue-600 group-hover:text-blue-500",
    description: "有英國巴菲特之稱，堅持「買好公司、別買貴、什麼都不做」的極簡哲學，長期績效卓越。",
  },
  {
    name: "Pat Dorsey",
    firm: "Dorsey Asset Management",
    url: "https://dataroma.com/m/holdings.php?m=DAM",
    emoji: "🏰",
    color: "from-yellow-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(234,179,8,0.3)]",
    iconBg: "bg-yellow-500/20 border-yellow-500/30",
    textColor: "text-yellow-500 group-hover:text-yellow-400",
    description: "晨星護城河理論奠基者，追蹤他的持股能學習如何辨識具備強大「經濟特許權」的公司。",
  },
  {
    name: "Francois Rochon",
    firm: "Giverny Capital",
    url: "https://dataroma.com/m/holdings.php?m=GC",
    emoji: "🍁",
    color: "from-red-600/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(220,38,38,0.3)]",
    iconBg: "bg-red-600/20 border-red-600/30",
    textColor: "text-red-600 group-hover:text-red-500",
    description: "強調將股市波動視為噪音，專注於企業實質利潤增長，他的年度信件是非常好的價值投資教材。",
  },
  {
    name: "David Einhorn",
    firm: "Greenlight Capital",
    url: "https://dataroma.com/m/holdings.php?m=GLRE",
    emoji: "🎲",
    color: "from-emerald-600/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(5,150,105,0.3)]",
    iconBg: "bg-emerald-600/20 border-emerald-600/30",
    textColor: "text-emerald-600 group-hover:text-emerald-500",
    description: "擅長極度深度的財報分析，曾成功放空雷曼兄弟，是做多被低估企業與放空造假公司的雙面好手。",
  },
  {
    name: "Tom Russo",
    firm: "Gardner Russo & Quinn",
    url: "https://dataroma.com/m/holdings.php?m=GR",
    emoji: "☕",
    color: "from-orange-500/10",
    hoverColor: "hover:shadow-[0_20px_40px_-15px_rgba(249,115,22,0.3)]",
    iconBg: "bg-orange-500/20 border-orange-500/30",
    textColor: "text-orange-500 group-hover:text-orange-400",
    description: "專注於投資全球具備強大定價能力與家族經營背景的消費巨頭品牌，並能耐心地持有數十年。",
  }
];

export default function InspirationPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col p-6 md:p-12 lg:p-24 relative overflow-hidden">
      {/* Background Orbs for Glassmorphism effect */}
      <div className="absolute top-0 right-1/4 w-[30rem] h-[30rem] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-[30rem] h-[30rem] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="z-10 w-full max-w-6xl mx-auto">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <Link href="/" className="inline-flex items-center text-foreground/60 hover:text-foreground mb-6 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回首頁
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 drop-shadow-lg">
              投資靈感 💡
            </h1>
            <p className="text-lg text-foreground/60 max-w-2xl">
              追蹤頂尖投資大師的持股變化，挖掘潛在的投資機會與靈感來源。
            </p>
          </div>
        </div>

        {/* Featured Dataroma Card */}
        <div className="mb-12">
          <a href="https://www.dataroma.com/m/home.php" target="_blank" rel="noopener noreferrer" className="group block">
            <div className="relative p-8 md:p-10 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-pink-500/20 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1 hover:bg-foreground/10 hover:border-pink-500/40 hover:shadow-[0_20px_40px_-15px_rgba(236,72,153,0.3)]">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-rose-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center shrink-0 border border-pink-500/30 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-3xl">🌐</span>
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">DATAROMA 首頁</h2>
                    <p className="text-foreground/60 text-lg">
                      綜合探索各大機構與知名投資人的最新持倉報告 (13F)。
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-pink-500 font-medium whitespace-nowrap group-hover:text-pink-400 transition-colors">
                  <span>前往網站</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        </div>

        <h3 className="text-2xl font-bold text-foreground mb-8">知名大師投資組合</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {investors.map((investor) => (
            <a key={investor.name} href={investor.url} target="_blank" rel="noopener noreferrer" className="group">
              <div className={`h-full relative p-6 md:p-8 rounded-3xl bg-foreground/5 backdrop-blur-xl border border-foreground/10 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:bg-foreground/10 hover:border-foreground/20 ${investor.hoverColor}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${investor.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${investor.iconBg} group-hover:scale-110 transition-transform duration-500`}>
                      <span className="text-2xl">{investor.emoji}</span>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-1">{investor.name}</h2>
                    <p className="text-foreground/50 text-sm font-medium mb-3">{investor.firm}</p>
                    <p className="text-foreground/70 text-sm leading-relaxed mb-4">{investor.description}</p>
                  </div>
                  <div className={`mt-6 flex items-center font-medium transition-colors ${investor.textColor}`}>
                    <span>查看持股</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}

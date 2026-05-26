import IndicatorCard from "@/components/IndicatorCard";
import { fetchMarketData } from "@/lib/indicators";

export default async function Home() {
  const data = await fetchMarketData();

  const SectionHeader = ({ title, emoji }: { title: string, emoji: string }) => (
    <h2 className="text-2xl font-bold text-white/90 mt-16 mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
      <span className="text-3xl">{emoji}</span>
      {title}
    </h2>
  );

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-20 max-w-7xl mx-auto">
      
      {/* Header / Hero */}
      <header className="mb-8 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-danger/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-warning/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative z-10 flex flex-wrap items-center gap-4">
          股市風險指標<span className="text-danger drop-shadow-[0_0_15px_rgba(255,64,129,0.5)]">儀表板</span>
          <span className="text-sm font-normal text-white/50 px-3 py-1 border border-white/10 rounded-full bg-white/5 whitespace-nowrap">
            🟢 Real-time API Connected
          </span>
        </h1>
        <p className="text-white/60 text-lg max-w-2xl relative z-10">
          綜合 15 項總經與市場結構關鍵指標，預判潛在的股市泡沫與修正風險。
          <br/>(已啟用 Yahoo 即時串接、FRED 總經資料庫與 Web 爬蟲，15 項指標皆為真實即時數據！)
        </p>
      </header>

      {/* --- Section 1: 市場估值與結構 --- */}
      <SectionHeader title="市場估值與結構" emoji="🏛️" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        <IndicatorCard
          title="席勒本益比 (CAPE)"
          description="使用過去 10 年經通膨調整後的平均實質盈餘計算本益比。大於 30-35 屬嚴重高估 (網頁爬蟲即時)。"
          currentValue={data.cape.value} statusText={data.cape.text} status={data.cape.status} history={data.cape.history}
        />
        <IndicatorCard
          title="市場廣度 (RSP/SPY)"
          description="等權重標普與市值加權比值。持續下滑代表大盤全靠少數權值股支撐 (Yahoo 即時)。"
          currentValue={data.breadth.value} statusText={data.breadth.text} status={data.breadth.status} history={data.breadth.history}
        />
      </div>

      {/* --- Section 2: 總體經濟與流動性 --- */}
      <SectionHeader title="總體經濟與流動性" emoji="🌍" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        <IndicatorCard
          title="M2 貨幣供給量 (YoY)"
          description="美國廣義貨幣供給量年增率。當資金萎縮 (負成長) 時極易引發股市崩盤與資產破滅 (FRED 即時)。"
          currentValue={data.m2.value} statusText={data.m2.text} status={data.m2.status} history={data.m2.history}
        />
        <IndicatorCard
          title="美元指數 (DXY)"
          description="衡量美元對一籃子貨幣的強弱。強勢美元(>105)往往會抽乾全球新興市場與風險資產流動性 (Yahoo 即時)。"
          currentValue={data.dxy.value} statusText={data.dxy.text} status={data.dxy.status} history={data.dxy.history}
        />
        <IndicatorCard
          title="巴菲特指標"
          description="美股總市值除以美國 GDP。高於 1.5 到 2 個標準差代表資產泡沫化 (FRED 即時)。"
          currentValue={data.buffett.value} statusText={data.buffett.text} status={data.buffett.status} history={data.buffett.history}
        />
        <IndicatorCard
          title="薩姆規則 (Sahm Rule)"
          description="當 3 個月失業率移動平均值較低點上升 0.5% 時，代表經濟已實質進入衰退 (FRED 即時)。"
          currentValue={data.sahm.value} statusText={data.sahm.text} status={data.sahm.status} history={data.sahm.history}
        />
        <IndicatorCard
          title="銅金比 (Copper/Gold)"
          description="銅代表實體工業需求，黃金代表避險。比值下滑但股市創高為嚴重總經背離 (Yahoo 即時)。"
          currentValue={data.copperGold.value} statusText={data.copperGold.text} status={data.copperGold.status} history={data.copperGold.history}
        />
        <IndicatorCard
          title="銀行放款意願 (SLOOS)"
          description="聯準會調查銀行收緊貸款的比例。大於 40% 通常引發企業資金斷裂與衰退 (FRED 即時)。"
          currentValue={data.sloos.value} statusText={data.sloos.text} status={data.sloos.status} history={data.sloos.history}
        />
        <IndicatorCard
          title="殖利率曲線 (10Y-2Y)"
          description="長短天期公債殖利率利差。真正崩盤通常發生在「深度倒掛結束，急速轉正」之時 (FRED 即時)。"
          currentValue={data.yieldCurve.value} statusText={data.yieldCurve.text} status={data.yieldCurve.status} history={data.yieldCurve.history}
        />
      </div>

      {/* --- Section 3: 信用風險與情緒 --- */}
      <SectionHeader title="信用風險與情緒" emoji="🔥" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 mb-20">
        <IndicatorCard
          title="金融條件指數 (NFCI)"
          description="芝加哥聯儲統合 105 項金融指標。大於 0 表示金融與信用環境異常緊縮，為危機前兆 (FRED 即時)。"
          currentValue={data.nfci.value} statusText={data.nfci.text} status={data.nfci.status} history={data.nfci.history}
        />
        <IndicatorCard
          title="VIX 恐慌指數"
          description="泡沫末期常被壓至極低檔，突然跳升突破 20 往往是崩盤前兆 (Yahoo 即時)。"
          currentValue={data.vix.value} statusText={data.vix.text} status={data.vix.status} history={data.vix.history}
        />
        <IndicatorCard
          title="SKEW 黑天鵝指數"
          description="衡量市場對極端尾部風險的定價，大於 140 代表大戶正悄悄瘋狂避險 (Yahoo 即時)。"
          currentValue={data.skew.value} statusText={data.skew.text} status={data.skew.status} history={data.skew.history}
        />
        <IndicatorCard
          title="信用利差 (High Yield)"
          description="垃圾債殖利率與無風險公債利差。突然急速飆升代表市場對企業違約極度恐慌 (FRED 即時)。"
          currentValue={data.creditSpreads.value} statusText={data.creditSpreads.text} status={data.creditSpreads.status} history={data.creditSpreads.history}
        />
        <IndicatorCard
          title="CNN 恐懼與貪婪指數"
          description="綜合動能與避險等因素。長期處於 75 以上代表市場被不理性的散戶FOMO情緒主導 (CNN 爬蟲即時)。"
          currentValue={data.fearGreed.value} statusText={data.fearGreed.text} status={data.fearGreed.status} history={data.fearGreed.history}
        />
        <IndicatorCard
          title="FINRA 融資餘額"
          description="衡量投資人「借錢炒股」的瘋狂程度。若從歷史高點驟降 10% 易引發斷頭踩踏 (FRED 即時)。"
          currentValue={data.marginDebt.value} statusText={data.marginDebt.text} status={data.marginDebt.status} history={data.marginDebt.history}
        />
      </div>
    </main>
  );
}

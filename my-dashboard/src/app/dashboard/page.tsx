export const dynamic = 'force-dynamic';
import IndicatorCard from "@/components/IndicatorCard";
import { fetchMarketData } from "@/lib/indicators";
import Link from "next/link";
import { getUserApiKeys } from "@/lib/keys";

import AiSummary from "@/components/AiSummary";
import { Suspense } from "react";

export default async function DashboardPage() {
  const keys = await getUserApiKeys();
  const data = await fetchMarketData(keys.finmind);

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center py-10 px-4 sm:px-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 -left-1/4 w-3/4 h-[600px] bg-rose-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 -right-1/4 w-3/4 h-[600px] bg-indigo-500/10 rounded-full blur-[150px] -z-10 animate-pulse-slow" style={{animationDelay: '2s'}}></div>

      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center mb-16 z-10 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-indigo-500 mr-4">
              Antigravity
            </span>
            <span className="text-foreground/80 font-light">|</span>
            <span className="ml-4 text-3xl font-bold tracking-tight">避險儀表板</span>
          </h1>
          <p className="text-foreground/60 text-lg md:text-xl font-medium tracking-wide max-w-2xl leading-relaxed">
            綜合 15 項總經、市場結構與關鍵情緒指標，偵測系統性泡沫與修正風險。
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/watchlist" className="px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-indigo-500/25 bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 flex items-center">
            ⭐ 追蹤清單
          </Link>
          <Link href="/" className="px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-rose-500/25 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 flex items-center">
            ← 返回首頁
          </Link>
        </div>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 xl:grid-cols-4 gap-8 z-10">
        
        {/* Left Column: AI Summary */}
        <div className="xl:col-span-1 h-full min-h-[600px]">
          <Suspense fallback={<div className="bg-foreground/5 animate-pulse rounded-3xl h-full w-full"></div>}>
            <AiSummary data={data} geminiApiKey={keys.gemini} geminiModel={keys.geminiModel} />
          </Suspense>
        </div>

        {/* Right Column: Indicators Grid */}
        <div className="xl:col-span-3 space-y-12">
          
          {/* Section 1 */}
          <SectionHeader title="市場估值與結構" emoji="📊" statuses={[data.cape.status, data.breadth.status, data.buffett.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IndicatorCard title="席勒本益比 (CAPE)" value={data.cape.value} status={data.cape.status} 
              description="使用過去 10 年通膨調整後的平均實質盈餘計算本益比。大於 30-35 屬嚴重高估。" />
            <IndicatorCard title="市場廣度 (RSP/SPY)" value={data.breadth.value} status={data.breadth.status} 
              description="等權重指數與市值加權之比。持續下滑代表大盤全靠少數權值股撐場。" />
            <IndicatorCard title="巴菲特指標" value={data.buffett.value} status={data.buffett.status} 
              description="美股總市值除以美國 GDP。大於 1.5 到 2 個標準差代表資產泡沫。" />
          </div>

          {/* Section 2 */}
          <SectionHeader title="總體經濟與資金" emoji="🌍" statuses={[data.m2.status, data.dxy.status, data.sahm.status, data.copperGold.status, data.sloos.status, data.yieldCurve.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IndicatorCard title="M2 貨幣供給 (YoY)" value={data.m2.value} status={data.m2.status} 
              description="美國廣義貨幣供給年增率。當資金急縮 (負值)，極易戳破股市泡沫。" />
            <IndicatorCard title="美元指數 (DXY)" value={data.dxy.value} status={data.dxy.status} 
              description="衡量美元對一籃子貨幣的強弱。強勢美元 (>105) 往往會抽乾全球新興市場風險資金。" />
            <IndicatorCard title="薩姆規則 (Sahm Rule)" value={data.sahm.value} status={data.sahm.status} 
              description="近 3 個月失業率移動平均值，較低點上升 0.5% 時，代表經濟已實質進入衰退。" />
            <IndicatorCard title="銅金比 (Copper/Gold)" value={data.copperGold.value} status={data.copperGold.status} 
              description="銅代表實體工業需求，黃金代表避險情緒。下滑代表需求疲軟且避險升溫。" />
            <IndicatorCard title="銀行放款標準 (SLOOS)" value={data.sloos.value} status={data.sloos.status} 
              description="淨緊縮銀行比例。大於 40% 經常引發企業資金斷鏈與衰退。" />
            <IndicatorCard title="殖利率倒掛 (10Y-2Y)" value={data.yieldCurve.value} status={data.yieldCurve.status} 
              description="長短天期公債利差。倒掛結束且急劇陡峭時，通常伴隨崩盤。" />
          </div>

          {/* Section 3 */}
          <SectionHeader title="信用風險與情緒" emoji="🚨" statuses={[data.nfci.status, data.vix.status, data.skew.status, data.creditSpreads.status, data.fearGreed.status, data.marginDebt.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IndicatorCard title="金融條件指數 (NFCI)" value={data.nfci.value} status={data.nfci.status} 
              description="芝加哥聯儲統整的 105 項金融指標。大於 0 表示金融環境異常緊縮。" />
            <IndicatorCard title="VIX 恐慌指數" value={data.vix.value} status={data.vix.status} 
              description="泡沫期常被壓至極低檔，突然跳升突破 20 往往是崩盤前兆。" />
            <IndicatorCard title="SKEW 黑天鵝指數" value={data.skew.value} status={data.skew.status} 
              description="衡量市場對極端尾部風險的定價，大於 140 代表大戶正瘋狂避險。" />
            <IndicatorCard title="信用利差 (High Yield)" value={data.creditSpreads.value} status={data.creditSpreads.status} 
              description="垃圾債與無風險公債利差。急速飆高代表邊緣企業融資極度困難。" />
            <IndicatorCard title="CNN 恐懼與貪婪指數" value={data.fearGreed.value} status={data.fearGreed.status} 
              description="綜合動能與避險情緒。長期處於 >75 以上，代表市場被非理性貪婪 (FOMO) 主導。" />
            <IndicatorCard title="FINRA 融資餘額" value={data.marginDebt.value} status={data.marginDebt.status} 
              description="衡量投資人「借錢買股」的槓桿程度。若從歷史高點回落 >10% 易引發斷頭踩踏。" />
          </div>

          {/* Section 4 */}
          <SectionHeader title="台灣專屬指標" emoji="🇹🇼" statuses={[data.taiwanBusinessIndicator.status, data.taiwanMargin.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="https://www.ndc.gov.tw/nc_27_4422" target="_blank" rel="noopener noreferrer" className="group block relative overflow-hidden bg-foreground/5 border border-foreground/10 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-foreground/30 hover:bg-foreground/10 cursor-pointer h-full">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <h3 className="text-lg font-semibold text-foreground/70 mb-4 tracking-wide group-hover:text-indigo-400 transition-colors">台灣-景氣對策信號</h3>
              <div className="flex flex-col h-[80px] justify-center items-center gap-2 mb-6">
                <div className="text-2xl font-bold tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">前往國發會網站查詢</div>
                <div className="text-sm font-medium text-foreground/50">點擊查看最新景氣燈號</div>
              </div>
              <div className="w-full h-1 bg-foreground/10 rounded-full mb-6 overflow-hidden"></div>
              <p className="text-xs text-foreground/50 font-medium leading-relaxed mt-auto">
                <span className="text-xs text-foreground/30">資料來源：國家發展委員會</span>
              </p>
            </a>
            
            <IndicatorCard title="台灣-上市融資餘額" value={data.taiwanMargin.value} status={data.taiwanMargin.status} 
              description="衡量台股散戶槓桿程度。水位過高 (如 3000億) 且急速拉高時，籌碼凌亂，斷頭風險大增。" />
          </div>

        </div>
      </div>
    </main>
  );
}

function SectionHeader({ title, emoji, statuses }: { title: string, emoji: string, statuses: ('safe' | 'warning' | 'danger')[] }) {
  const hasDanger = statuses.includes('danger');
  const hasWarning = statuses.includes('warning');
  
  return (
    <div className="flex items-center mb-8 border-b border-foreground/10 pb-4">
      <div className="text-3xl mr-4 bg-foreground/5 p-3 rounded-2xl border border-foreground/10">{emoji}</div>
      <h2 className="text-2xl font-bold text-foreground/80 tracking-tight">{title}</h2>
      <div className="ml-auto flex gap-2">
        {hasDanger && <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]"></span>}
        {hasWarning && !hasDanger && <span className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></span>}
        {!hasDanger && !hasWarning && <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>}
      </div>
    </div>
  );
}

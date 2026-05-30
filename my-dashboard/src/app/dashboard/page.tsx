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
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
            風險指標儀表板
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

      <div className="w-full max-w-7xl flex flex-col gap-12 z-10">
        
        {/* Top Section: AI Summary */}
        <div className="w-full">
          <Suspense fallback={
            <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 mb-12 relative z-10 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-[300px] animate-pulse">
              <div className="text-4xl mb-4 animate-bounce">✨</div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Gemini AI 正在分析中...</h2>
              <p className="text-foreground/60 text-sm">請稍候，正在綜合各項指標為您生成市場摘要</p>
            </div>
          }>
            <AiSummary />
          </Suspense>
        </div>

        {/* Indicators Grid */}
        <div className="space-y-12">
          
          {/* Section 1 */}
          <SectionHeader title="市場估值與結構" emoji="📊" statuses={[data.cape.status, data.buffett.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IndicatorCard spyHistory={data.spy.history} title="席勒本益比 (CAPE)" value={data.cape.value} status={data.cape.status} statusText={data.cape.text} history={data.cape.history} 
              description="使用過去 10 年通膨調整後的平均實質盈餘計算本益比。大於 30-35 屬嚴重高估。"
              criteria={{ red: '> 35', yellow: '25-35', green: '< 25' }} />
            <IndicatorCard spyHistory={data.spy.history} title="巴菲特指標" value={data.buffett.value} status={data.buffett.status} statusText={data.buffett.text} history={data.buffett.history} 
              description="美股總市值除以美國 GDP。大於 1.5 到 2 個標準差代表資產泡沫。"
              criteria={{ red: '> 150%', yellow: '130-150%', green: '< 130%' }} />
          </div>

          {/* Section 2 */}
          <SectionHeader title="總體經濟與資金" emoji="🌍" statuses={[data.m2.status, data.dxy.status, data.sahm.status, data.copperGold.status, data.sloos.status, data.yieldCurve.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IndicatorCard spyHistory={data.spy.history} title="M2 貨幣供給 (YoY)" value={data.m2.value} status={data.m2.status} statusText={data.m2.text} history={data.m2.history} 
              description="美國廣義貨幣供給年增率。當資金急縮 (負值)，極易戳破股市泡沫。"
              criteria={{ red: '< 0%', yellow: '0-4%', green: '> 4%' }} />
            <IndicatorCard spyHistory={data.spy.history} title="美元指數 (DXY)" value={data.dxy.value} status={data.dxy.status} statusText={data.dxy.text} history={data.dxy.history} 
              description="衡量美元對一籃子貨幣的強弱。強勢美元 (>105) 往往會抽乾全球新興市場風險資金。"
              criteria={{ red: '> 105', yellow: '100-105', green: '< 100' }} />
            <IndicatorCard spyHistory={data.spy.history} title="薩姆規則 (Sahm Rule)" value={data.sahm.value} status={data.sahm.status} statusText={data.sahm.text} history={data.sahm.history} 
              description="近 3 個月失業率移動平均值，較低點上升 0.5% 時，代表經濟已實質進入衰退。"
              criteria={{ red: '> 0.5%', yellow: '0.3-0.5%', green: '< 0.3%' }} />
            <IndicatorCard spyHistory={data.spy.history} title="銅金比 (Copper/Gold)" value={data.copperGold.value} status={data.copperGold.status} statusText={data.copperGold.text} history={data.copperGold.history} 
              description="銅代表實體工業需求，黃金代表避險情緒。下滑代表需求疲軟且避險升溫。"
              criteria={{ red: '< 0.14', yellow: '0.14-0.16', green: '> 0.16' }} />
            <IndicatorCard spyHistory={data.spy.history} title="銀行放款標準 (SLOOS)" value={data.sloos.value} status={data.sloos.status} statusText={data.sloos.text} history={data.sloos.history} 
              description="淨緊縮銀行比例。大於 40% 經常引發企業資金斷鏈與衰退。"
              criteria={{ red: '> 40%', yellow: '20-40%', green: '< 20%' }} />
            <IndicatorCard spyHistory={data.spy.history} title="殖利率倒掛 (10Y-2Y)" value={data.yieldCurve.value} status={data.yieldCurve.status} statusText={data.yieldCurve.text} history={data.yieldCurve.history} 
              description="長短天期公債利差。倒掛結束且急劇陡峭時，通常伴隨崩盤。"
              criteria={{ red: '0-0.5%', yellow: '< 0%', green: '> 0.5%' }} />
          </div>

          {/* Section 3 */}
          <SectionHeader title="信用風險與情緒" emoji="🚨" statuses={[data.nfci.status, data.vix.status, data.skew.status, data.creditSpreads.status, data.fearGreed.status, data.marginDebt.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IndicatorCard spyHistory={data.spy.history} title="金融條件指數 (NFCI)" value={data.nfci.value} status={data.nfci.status} statusText={data.nfci.text} history={data.nfci.history} 
              description="芝加哥聯儲統整的 105 項金融指標。大於 0 表示金融環境異常緊縮。"
              criteria={{ red: '> 0', yellow: '-0.3 - 0', green: '< -0.3' }} />
            <IndicatorCard spyHistory={data.spy.history} title="VIX 恐慌指數" value={data.vix.value} status={data.vix.status} statusText={data.vix.text} history={data.vix.history} 
              description="泡沫期常被壓至極低檔，突然跳升突破 20 往往是崩盤前兆。"
              criteria={{ red: '> 20', yellow: '15-20', green: '< 15' }} />
            <IndicatorCard spyHistory={data.spy.history} title="SKEW 黑天鵝指數" value={data.skew.value} status={data.skew.status} statusText={data.skew.text} history={data.skew.history} 
              description="衡量市場對極端尾部風險的定價，大於 140 代表大戶正瘋狂避險。"
              criteria={{ red: '> 140', yellow: '130-140', green: '< 130' }} />
            <IndicatorCard spyHistory={data.spy.history} title="信用利差 (High Yield)" value={data.creditSpreads.value} status={data.creditSpreads.status} statusText={data.creditSpreads.text} history={data.creditSpreads.history} 
              description="垃圾債與無風險公債利差。急速飆高代表邊緣企業融資極度困難。"
              criteria={{ red: '> 6%', yellow: '4.5-6%', green: '< 4.5%' }} />
            <IndicatorCard spyHistory={data.spy.history} title="CNN 恐懼與貪婪指數" value={data.fearGreed.value} status={data.fearGreed.status} statusText={data.fearGreed.text} history={data.fearGreed.history} 
              description="綜合動能與避險情緒。長期處於 >75 以上，代表市場被非理性貪婪 (FOMO) 主導。"
              criteria={{ red: '> 75', yellow: '25-75', green: '< 25' }} />
            <IndicatorCard spyHistory={data.spy.history} title="FINRA 融資餘額" value={data.marginDebt.value} status={data.marginDebt.status} statusText={data.marginDebt.text} history={data.marginDebt.history} 
              description="衡量投資人「借錢買股」的槓桿程度。若從歷史高點回落 >10% 易引發斷頭踩踏。"
              criteria={{ red: '> 800B', yellow: '650-800B', green: '< 650B' }} />
          </div>

          {/* Section 4 */}
          <SectionHeader title="台灣專屬指標" emoji="🇹🇼" statuses={[data.taiwanBusinessIndicator?.status || '', data.taiwanMargin.status, data.taiwanM1BM2.status, data.taiwanExport.status, data.usdTwd.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="https://index.ndc.gov.tw/n/zh_tw/lightscore#/" target="_blank" rel="noopener noreferrer" className="group block relative overflow-hidden bg-foreground/5 border border-foreground/10 rounded-3xl p-6 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-foreground/30 hover:bg-foreground/10 cursor-pointer h-full">
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
            
            <IndicatorCard spyHistory={data.spy.history} title="台灣-上市融資餘額" value={data.taiwanMargin.value} status={data.taiwanMargin.status} statusText={data.taiwanMargin.text} history={data.taiwanMargin.history} 
              description="衡量台股散戶槓桿程度。水位過高 (如 3000億) 且急速拉高時，籌碼凌亂，斷頭風險大增。"
              criteria={{ red: '> 3000億', yellow: '2500-3000億', green: '< 2500億' }} />
            <IndicatorCard spyHistory={data.spy.history} title="M1B 與 M2 剪刀差" value={data.taiwanM1BM2.value} status={data.taiwanM1BM2.status} statusText={data.taiwanM1BM2.text} history={data.taiwanM1BM2.history} 
              description="M1B(活水)與M2(定存)年增率之差。剪刀差向下收斂或轉負代表資金退潮，不利台股動能。"
              criteria={{ red: '< -2%', yellow: '-2% ~ 0%', green: '> 0%' }} />
            <IndicatorCard spyHistory={data.spy.history} title="台灣出口總值 (YoY)" value={data.taiwanExport.value} status={data.taiwanExport.status} statusText={data.taiwanExport.text} history={data.taiwanExport.history} 
              description="外銷訂單的同步/領先指標，反映台灣出口導向企業的獲利基本面。負成長時股市難有大行情。"
              criteria={{ red: '< 0%', yellow: '0% - 5%', green: '> 5%' }} />
            <IndicatorCard spyHistory={data.spy.history} title="台幣匯率 (USD/TWD)" value={data.usdTwd.value} status={data.usdTwd.status} statusText={data.usdTwd.text} history={data.usdTwd.history} 
              description="台幣貶值(數值上升)通常伴隨外資匯出與大賣台股，升值則有利資金行情。"
              criteria={{ red: '> 32', yellow: '30-32', green: '< 30' }} />
          </div>

          {/* Section 5 */}
          <SectionHeader title="加密貨幣與投機情緒" emoji="🪙" statuses={[data.cryptoFng.status, data.bitcoin.status]} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <IndicatorCard spyHistory={data.spy.history} title="Crypto 恐懼與貪婪指數" value={data.cryptoFng.value} status={data.cryptoFng.status as any} statusText={data.cryptoFng.text} history={data.cryptoFng.history} 
              description="加密貨幣市場的投機情緒指標。長期處於極度貪婪區間往往伴隨價格崩盤。"
              criteria={{ red: '> 75', yellow: '25-75', green: '< 25' }} />
            <IndicatorCard spyHistory={data.spy.history} title="比特幣 (BTC-USD)" value={data.bitcoin.value} status={data.bitcoin.status as any} statusText={data.bitcoin.text} history={data.bitcoin.history} 
              description="全球流動性與風險偏好的最前緣指標。通常與那斯達克等高風險資產具高度連動。"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function SectionHeader({ title, emoji, statuses, hideLights }: { title: string, emoji: string, statuses: string[], hideLights?: boolean }) {
  if (hideLights) {
    return (
      <div className="flex items-center mb-8 border-b border-foreground/10 pb-4">
        <div className="text-3xl mr-4 bg-foreground/5 p-3 rounded-2xl border border-foreground/10">{emoji}</div>
        <h2 className="text-2xl font-bold text-foreground/80 tracking-tight">{title}</h2>
      </div>
    );
  }

  const redCount = statuses.filter(s => s === 'danger' || s === 'red').length;
  const yellowCount = statuses.filter(s => s === 'warning' || s === 'yellow').length;
  const greenCount = statuses.length - redCount - yellowCount;
  
  return (
    <div className="flex items-center mb-8 border-b border-foreground/10 pb-4">
      <div className="text-3xl mr-4 bg-foreground/5 p-3 rounded-2xl border border-foreground/10">{emoji}</div>
      <h2 className="text-2xl font-bold text-foreground/80 tracking-tight">{title}</h2>
      <div className="ml-auto flex gap-3">
        <div className="flex items-center gap-2 bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-pulse"></span>
          <span className="text-rose-400 font-bold text-sm leading-none">{redCount}</span>
        </div>
        <div className="flex items-center gap-2 bg-yellow-400/10 px-3 py-1.5 rounded-full border border-yellow-400/20">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]"></span>
          <span className="text-yellow-400 font-bold text-sm leading-none">{yellowCount}</span>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
          <span className="text-emerald-500 font-bold text-sm leading-none">{greenCount}</span>
        </div>
      </div>
    </div>
  );
}

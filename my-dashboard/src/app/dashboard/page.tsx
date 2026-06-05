export const dynamic = 'force-dynamic';
import IndicatorCard from "@/components/IndicatorCard";
import { fetchMarketData } from "@/lib/indicators";
import Link from "next/link";
import { getUserApiKeys } from "@/lib/keys";

import AiSummary from "@/components/AiSummary";
import { Suspense } from "react";
import AutoRefresh from "@/components/AutoRefresh";

export default async function DashboardPage() {
  const keys = await getUserApiKeys();

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
          <Link href="/" className="px-6 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-rose-500/25 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 flex items-center">
            ← 返回首頁
          </Link>
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col gap-12 z-10">
        
        {/* Top Section: AI Summary */}
        <div className="w-full">
          <Suspense fallback={<AiSummarySkeleton />}>
            <AiSummary />
          </Suspense>
        </div>

        {/* Indicators Grid */}
        <Suspense fallback={<GridSkeleton />}>
          <DashboardDataGrid finmindKey={keys.finmind} />
        </Suspense>

      </div>
    </main>
  );
}

function AiSummarySkeleton() {
  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 mb-12 relative z-10 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-[300px] animate-pulse">
      <div className="text-4xl mb-4 animate-bounce">✨</div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Gemini AI 正在分析中...</h2>
      <p className="text-foreground/60 text-sm">請稍候，正在綜合各項指標為您生成市場摘要</p>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="space-y-12 w-full animate-pulse">
      <div className="flex items-center mb-8 border-b border-foreground/10 pb-4">
        <div className="w-12 h-12 bg-foreground/10 rounded-2xl mr-4"></div>
        <div className="h-8 bg-foreground/10 rounded-lg w-48"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-[400px] bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col p-6">
            <div className="h-6 bg-foreground/10 rounded w-1/2 mb-4"></div>
            <div className="h-10 bg-foreground/10 rounded w-1/3 mb-4"></div>
            <div className="h-32 bg-foreground/10 rounded w-full mt-auto"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function DashboardDataGrid({ finmindKey }: { finmindKey: string }) {
  const data = await fetchMarketData(finmindKey);

  return (
    <div className="space-y-12">
      <AutoRefresh shouldRefresh={data.isDataLoading} />
      
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
      <SectionHeader title="總體經濟與資金" emoji="🌍" statuses={[data.m2.status, data.dxy.status, data.copperGold.status, data.sloos.status, data.yieldCurve.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IndicatorCard spyHistory={data.spy.history} title="M2 貨幣供給 (YoY)" value={data.m2.value} status={data.m2.status} statusText={data.m2.text} history={data.m2.history} 
          description="美國廣義貨幣供給年增率。當資金急縮 (負值)，極易戳破股市泡沫。"
          criteria={{ red: '< 0%', yellow: '0-4%', green: '> 4%' }} />
        <IndicatorCard spyHistory={data.spy.history} title="美元指數 (DXY)" value={data.dxy.value} status={data.dxy.status} statusText={data.dxy.text} history={data.dxy.history} 
          description="衡量美元對一籃子貨幣的強弱。強勢美元 (>105) 往往會抽乾全球新興市場風險資金。"
          criteria={{ red: '> 105', yellow: '100-105', green: '< 100' }} />

        <IndicatorCard spyHistory={data.spy.history} title="銅金比 (Copper/Gold)" value={data.copperGold.value} status={data.copperGold.status} statusText={data.copperGold.text} history={data.copperGold.history} 
          description="銅代表實體工業需求，黃金代表避險情緒。下滑代表需求疲軟且避險升溫。"
          criteria={{ red: '< 0.12', yellow: '0.12-0.16', green: '> 0.16' }} />
        <IndicatorCard spyHistory={data.spy.history} title="銀行放款標準 (SLOOS)" value={data.sloos.value} status={data.sloos.status} statusText={data.sloos.text} history={data.sloos.history} 
          description="淨緊縮銀行比例。大於 40% 經常引發企業資金斷鏈與衰退。"
          criteria={{ red: '> 40%', yellow: '20-40%', green: '< 20%' }} />
        <IndicatorCard spyHistory={data.spy.history} title="殖利率倒掛 (10Y-2Y)" value={data.yieldCurve.value} status={data.yieldCurve.status} statusText={data.yieldCurve.text} history={data.yieldCurve.history} 
          description="長短天期公債利差。倒掛結束且急劇陡峭時，通常伴隨崩盤。"
          criteria={{ red: '< 0%', yellow: '0-0.5%', green: '> 0.5%' }} />
      </div>

      {/* Section 3 */}
      <SectionHeader title="信用風險與情緒" emoji="🚨" statuses={[data.nfci.status, data.vix.status, data.skew.status, data.creditSpreads.status, data.fearGreed.status, data.marginDebt.status, data.finraToCurrency.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IndicatorCard spyHistory={data.spy.history} title="金融條件指數 (NFCI)" value={data.nfci.value} status={data.nfci.status} statusText={data.nfci.text} history={data.nfci.history} 
          description="芝加哥聯儲統整的 105 項金融指標。大於 0 表示金融環境異常緊縮。"
          criteria={{ red: '> 0', yellow: '-0.3 - 0', green: '< -0.3' }} />
        <IndicatorCard spyHistory={data.spy.history} title="VIX 恐慌指數" value={data.vix.value} status={data.vix.status} statusText={data.vix.text} history={data.vix.history} 
          description="泡沫期常被壓至極低檔，突然跳升突破 30 往往是恐慌信號。"
          criteria={{ red: '> 30', yellow: '20-30', green: '< 20' }} />
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
        <IndicatorCard spyHistory={data.spyToCurrency.history} spyLabel="S&P 500 / 流通貨幣" title="FINRA / 流通貨幣" value={data.finraToCurrency.value} status={data.finraToCurrency.status} statusText={data.finraToCurrency.text} history={data.finraToCurrency.history} 
          description="FINRA融資餘額除以實體流通貨幣(M0)。反映股市槓桿相對於實體貨幣的透支程度。>0.40代表極限槓桿。"
          criteria={{ red: '> 0.40', yellow: '0.30-0.40', green: '< 0.30' }}
          valueThresholds={{ red: 0.40, yellow: 0.30 }} />
        <IndicatorCard spyHistory={data.spy.history} title="S&P 500 / M2" value={data.spyToM2.value} status={data.spyToM2.status} statusText={data.spyToM2.text} history={data.spyToM2.history} 
          description="標普 500 指數除以美國 M2 貨幣供給量。反映股市估值相對於市場真實流動資金的膨脹程度。"
          criteria={{ red: '> 0.027', yellow: '0.017-0.027', green: '< 0.017' }}
          valueThresholds={{ red: 0.027, yellow: 0.017 }} />
      </div>

      {/* Section: 流動性與政策 */}
      <SectionHeader title="流動性與政策" emoji="🏦" statuses={[data.walcl.status, data.rrpontsyd.status, data.fedfunds.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IndicatorCard spyHistory={data.spy.history} title="聯準會總資產 (WALCL)" value={data.walcl.value} status={data.walcl.status} statusText={data.walcl.text} history={data.walcl.history} 
          description="聯準會資產負債表規模。縮表 (QT) 會抽乾市場流動性，對高估值資產不利。"
          criteria={{ red: '強力縮表', yellow: '溫推縮表', green: '擴表' }} />
        <IndicatorCard spyHistory={data.spy.history} title="隔夜附賣回 (RRP)" value={data.rrpontsyd.value} status={data.rrpontsyd.status} statusText={data.rrpontsyd.text} history={data.rrpontsyd.history} 
          description="市場過剩資金的緩衝池。當水位接近歸零，代表金融體系的資金緩衝已被耗盡。"
          criteria={{ red: '< 50B', yellow: '50-200B', green: '> 200B' }} />
        <IndicatorCard spyHistory={data.spy.history} title="聯邦基準利率" value={data.fedfunds.value} status={data.fedfunds.status} statusText={data.fedfunds.text} history={data.fedfunds.history} 
          description="美國基準利率。長時間維持在 5% 以上的高息環境，會大幅增加企業與消費者的違約風險。"
          criteria={{ red: '> 5%', yellow: '3-5%', green: '< 3%' }} />
      </div>

      {/* Section: 就業與實體經濟 */}
      <SectionHeader title="就業與實體經濟" emoji="🏭" statuses={[data.sahm.status, data.icsa.status, data.jtsjol.status, data.houst.status, data.mortgage30us.status, data.sox.status, data.ismProxy.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <IndicatorCard spyHistory={data.spy.history} title="薩姆規則衰退指標" value={data.sahm.value} status={data.sahm.status} statusText={data.sahm.text} history={data.sahm.history} 
          description="失業率3個月移動平均減去前12個月低點。> 0.5% 代表經濟已陷入衰退。"
          criteria={{ red: '> 0.5%', yellow: '0.3-0.5%', green: '< 0.3%' }} />
        <IndicatorCard spyHistory={data.spy.history} title="初領失業救濟金 (ICSA)" value={data.icsa.value} status={data.icsa.status} statusText={data.icsa.text} history={data.icsa.history} 
          description="最敏銳的就業領先指標。若連續飆高突破 30 萬人，通常代表企業正進行大規模裁員。"
          criteria={{ red: '> 300K', yellow: '250-300K', green: '< 250K' }} />
        <IndicatorCard spyHistory={data.spy.history} title="職缺數 (JOLTS)" value={data.jtsjol.value} status={data.jtsjol.status} statusText={data.jtsjol.text} history={data.jtsjol.history} 
          description="勞動市場緊繃程度指標。職缺數若大幅滑落 (< 7M)，代表勞動需求快速降溫。"
          criteria={{ red: '< 7M', yellow: '7-8.5M', green: '> 8.5M' }} />
        <IndicatorCard spyHistory={data.spy.history} title="新屋開工數" value={data.houst.value} status={data.houst.status} statusText={data.houst.text} history={data.houst.history} 
          description="房市與實體經濟的火車頭。若建商縮手 (< 1.0M)，常預示實體經濟將步入衰退。"
          criteria={{ red: '< 1.0M', yellow: '1.0-1.3M', green: '> 1.3M' }} />
        <IndicatorCard spyHistory={data.spy.history} title="30年期房貸利率" value={data.mortgage30us.value} status={data.mortgage30us.status} statusText={data.mortgage30us.text} history={data.mortgage30us.history} 
          description="直接影響民眾消費力的關鍵指標。若利率飆高 (> 7%) 會凍結房市流動性並擠壓其他消費。"
          criteria={{ red: '> 7%', yellow: '5-7%', green: '< 5%' }} />
        <IndicatorCard spyHistory={data.spy.history} title="費城半導體 (SOX) YoY" value={data.sox.value} status={data.sox.status} statusText={data.sox.text} history={data.sox.history} 
          description="全球科技與半導體景氣的終極指標。負成長代表進入半導體下行週期，高度牽動台股。"
          criteria={{ red: '< -10%', yellow: '-10% ~ 10%', green: '> 10%' }} />
        <IndicatorCard spyHistory={data.spy.history} title="美國工業生產 YoY (ISM 替代)" value={data.ismProxy.value} status={data.ismProxy.status} statusText={data.ismProxy.text} history={data.ismProxy.history} 
          description="由於版權限制無法直接使用 ISM PMI，此為高度正相關的工業生產年增率，負值代表製造業萎縮。"
          criteria={{ red: '< 0%', yellow: '0% - 2%', green: '> 2%' }} />
      </div>

      {/* Section: 通膨與消費者體質 */}
      <SectionHeader title="通膨與消費者體質" emoji="🛒" statuses={[data.t10yie.status, data.pcepilfe.status, data.drcc.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <IndicatorCard spyHistory={data.spy.history} title="10年期通膨預期 (T10YIE)" value={data.t10yie.value} status={data.t10yie.status} statusText={data.t10yie.text} history={data.t10yie.history} 
          description="債市定價出來的未來通膨預期。失控往上 (> 2.5%) 代表 Fed 升息壓力大；急速往下 (< 1.5%) 代表通縮風險。"
          criteria={{ red: '> 2.5%', yellow: '< 1.5%', green: '1.5-2.5%' }} />
        <IndicatorCard spyHistory={data.spy.history} title="核心 PCE YoY" value={data.pcepilfe.value} status={data.pcepilfe.status} statusText={data.pcepilfe.text} history={data.pcepilfe.history} 
          description="聯準會最看重的通膨指標。若黏著在高位 (> 3%)，聯準會降息空間將被嚴重壓縮。"
          criteria={{ red: '> 3%', yellow: '2-3%', green: '< 2%' }} />
        <IndicatorCard spyHistory={data.spy.history} title="信用卡違約率" value={data.drcc.value} status={data.drcc.status} statusText={data.drcc.text} history={data.drcc.history} 
          description="衡量底層與中產階級現金流。違約率飆高至歷史極端區間 (> 4%) 通常預示消費降級及零售股爆雷。"
          criteria={{ red: '> 4%', yellow: '3-4%', green: '< 3%' }} />
      </div>

      {/* Section 4: Taiwan */}
      <SectionHeader title="台灣籌碼動能" emoji="🎲" statuses={[data.taiwanForeignBuy.status, data.taiwanMargin.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <IndicatorCard spyHistory={data.spy.history} twiiHistory={data.twii.history} title="外資現貨買賣超" value={data.taiwanForeignBuy.value} status={data.taiwanForeignBuy.status} statusText={data.taiwanForeignBuy.text} history={data.taiwanForeignBuy.history} 
          description="外資於台股集中市場之買賣超金額。若近 5 日累積賣超大於 500 億，代表外資正在大舉提款。"
          criteria={{ red: '< -500億', yellow: '-500-300億', green: '> 300億' }} />
        <IndicatorCard spyHistory={data.spy.history} twiiHistory={data.twii.history} title="上市融資餘額" value={data.taiwanMargin.value} status={data.taiwanMargin.status} statusText={data.taiwanMargin.text} history={data.taiwanMargin.history} 
          description="衡量台股散戶槓桿程度。水位過高 (如 3000億) 且急速拉高時，籌碼凌亂，斷頭風險大增。"
          criteria={{ red: '> 3000億', yellow: '2500-3000億', green: '< 2500億' }} />
      </div>

      <SectionHeader title="台灣基本面與資金" emoji="📈" statuses={[data.taiwanBusinessIndicator?.status || '', data.taiwanM1BM2.status, data.taiwanExport.status, data.usdTwd.status]} />
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
        
        <IndicatorCard spyHistory={data.spy.history} twiiHistory={data.twii.history} title="台灣-上市融資餘額" value={data.taiwanMargin.value} status={data.taiwanMargin.status} statusText={data.taiwanMargin.text} history={data.taiwanMargin.history} 
          description="衡量台股散戶槓桿程度。水位過高 (如 3000億) 且急速拉高時，籌碼凌亂，斷頭風險大增。"
          criteria={{ red: '> 3000億', yellow: '2500-3000億', green: '< 2500億' }} />
        <IndicatorCard spyHistory={data.spy.history} twiiHistory={data.twii.history} title="M1B 與 M2 剪刀差" value={data.taiwanM1BM2.value} status={data.taiwanM1BM2.status} statusText={data.taiwanM1BM2.text} history={data.taiwanM1BM2.history} 
          description="M1B(活水)與M2(定存)年增率之差。剪刀差向下收斂或轉負代表資金退潮，不利台股動能。"
          criteria={{ red: '< -2%', yellow: '-2% ~ 0%', green: '> 0%' }} />
        <IndicatorCard spyHistory={data.spy.history} twiiHistory={data.twii.history} title="台灣出口總值 (YoY)" value={data.taiwanExport.value} status={data.taiwanExport.status} statusText={data.taiwanExport.text} history={data.taiwanExport.history} 
          description="外銷訂單的同步/領先指標，反映台灣出口導向企業的獲利基本面。負成長時股市難有大行情。"
          criteria={{ red: '< 0%', yellow: '0% - 5%', green: '> 5%' }} />
        <IndicatorCard spyHistory={data.spy.history} twiiHistory={data.twii.history} title="台幣匯率 (USD/TWD)" value={data.usdTwd.value} status={data.usdTwd.status} statusText={data.usdTwd.text} history={data.usdTwd.history} 
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

export const dynamic = 'force-dynamic';
import IndicatorCard from "@/components/IndicatorCard";
import { fetchMarketData } from "@/lib/indicators";
import Link from "next/link";
import { getUserApiKeys } from "@/lib/keys";

import AiSummary from "@/components/AiSummary";
import { Suspense } from "react";

export default async function Home() {
  const keys = await getUserApiKeys();
  const data = await fetchMarketData(keys.finmind);

  const SectionHeader = ({ title, emoji, statuses }: { title: string, emoji: string, statuses: string[] }) => {
    const red = statuses.filter(s => s === 'red').length;
    const yellow = statuses.filter(s => s === 'yellow').length;
    const green = statuses.filter(s => s === 'green').length;

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-foreground/10 mt-16 mb-6 pb-4">
        <h2 className="text-2xl font-bold text-foreground/90 flex items-center gap-3">
          <span className="text-3xl">{emoji}</span>
          {title}
        </h2>
        
        <div className="flex items-center gap-4 mt-4 sm:mt-0 bg-foreground/5 rounded-full px-4 py-2 border border-foreground/10">
          {green > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-safe shadow-[0_0_10px_rgba(0,230,118,0.5)]"></div>
              <span className="font-semibold text-safe">{green}</span>
            </div>
          )}
          {yellow > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning shadow-[0_0_10px_rgba(255,215,64,0.5)]"></div>
              <span className="font-semibold text-warning">{yellow}</span>
            </div>
          )}
          {red > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-danger animate-pulse-danger shadow-[0_0_10px_rgba(255,64,129,0.5)]"></div>
              <span className="font-semibold text-danger">{red}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen p-8 md:p-12 lg:p-20 max-w-7xl mx-auto">
      
      {/* Header / Hero */}
      <header className="mb-8 relative">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-danger/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute top-20 right-0 w-96 h-96 bg-warning/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="mb-6 flex items-center justify-between relative z-10">
          <Link href="/" className="text-foreground/50 hover:text-foreground transition-colors flex items-center group">
            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            ËøîÂ?È¶ñÈ?
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 relative z-10 flex flex-wrap items-center gap-4">
          ?°Â?È¢®Èö™?áÊ?<span className="text-danger drop-shadow-[0_0_15px_rgba(255,64,129,0.5)]">?ÄË°®Êùø</span>
          <span className="text-sm font-normal text-foreground/60 px-3 py-1 border border-foreground/10 rounded-full bg-foreground/5 whitespace-nowrap">
            ?ü¢ Real-time API Connected
          </span>
        </h1>
        <p className="text-foreground/60 text-lg max-w-2xl relative z-10">
          Á∂úÂ? 15 ?ÖÁ∏ΩÁ∂ìË?Â∏ÇÂ†¥ÁµêÊ??úÈçµ?áÊ?ÔºåÈ??§Ê??®Á??°Â?Ê≥°Ê≤´?á‰øÆÊ≠?¢®?™„Ä?          <br/>(Â∑≤Â???Yahoo ?≥Ê?‰∏≤Êé•?ÅFRED Á∏ΩÁ?Ë≥áÊ?Â∫´Ë? Web ?¨Ëü≤Ôº?5 ?ÖÊ?Ê®ôÁ??∫Á?ÂØ¶Âç≥?ÇÊï∏?öÔ?)
        </p>
      </header>

      {/* AI Summary Section */}
      <Suspense fallback={
        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-3xl p-8 mb-12 relative z-10 animate-pulse flex items-center justify-center min-h-[200px]">
          <div className="flex flex-col items-center gap-4">
            <div className="text-4xl animate-bounce">??/div>
            <p className="text-indigo-300 font-medium">Gemini AI Ê≠?ú®?ÜÊ??Ä?∞Êï∏??..</p>
          </div>
        </div>
      }>
        <AiSummary />
      </Suspense>

      {/* --- Section 1: Â∏ÇÂ†¥‰º∞ÂÄºË?ÁµêÊ? --- */}
      <SectionHeader title="Â∏ÇÂ†¥‰º∞ÂÄºË?ÁµêÊ?" emoji="??Ô∏? statuses={[data.cape.status, data.breadth.status, data.buffett.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        <IndicatorCard
          title="Â∏≠Â??¨Á?ÊØ?(CAPE)"
          description="‰ΩøÁî®?éÂéª 10 Âπ¥Á??öËÜ®Ë™øÊï¥ÂæåÁ?Âπ≥Â?ÂØ¶Ë≥™?àÈ?Ë®àÁ??¨Á?ÊØî„ÄÇÂ§ß??30-35 Â±¨Âö¥?çÈ?‰º?(Á∂≤È??¨Ëü≤?≥Ê?)??
          currentValue={data.cape.value} statusText={data.cape.text} status={data.cape.status} history={data.cape.history}
        />
        <IndicatorCard
          title="Â∏ÇÂ†¥Âª?∫¶ (RSP/SPY)"
          description="Á≠âÊ??çÊ??ÆË?Â∏ÇÂÄºÂ?Ê¨äÊ??º„ÄÇÊ?Á∫å‰?Êªë‰ª£Ë°®Â§ß?§ÂÖ®?†Â??∏Ê??ºËÇ°?ØÊ? (Yahoo ?≥Ê?)??
          currentValue={data.breadth.value} statusText={data.breadth.text} status={data.breadth.status} history={data.breadth.history}
        />
        <IndicatorCard
          title="Â∑¥Ëè≤?πÊ?Ê®?
          description="ÁæéËÇ°Á∏ΩÂ??ºÈô§‰ª•Á???GDP?ÇÈ???1.5 ??2 ?ãÊ?Ê∫ñÂ∑Æ‰ª?°®Ë≥áÁî¢Ê≥°Ê≤´??(FRED ?≥Ê?)??
          currentValue={data.buffett.value} statusText={data.buffett.text} status={data.buffett.status} history={data.buffett.history}
        />
      </div>

      {/* --- Section 2: Á∏ΩÈ?Á∂ìÊ??áÊ??ïÊÄ?--- */}
      <SectionHeader title="Á∏ΩÈ?Á∂ìÊ??áÊ??ïÊÄ? emoji="??" statuses={[data.m2.status, data.dxy.status, data.sahm.status, data.copperGold.status, data.sloos.status, data.yieldCurve.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        <IndicatorCard
          title="M2 Ë≤®Âπ£‰æõÁµ¶??(YoY)"
          description="ÁæéÂ?Âª?æ©Ë≤®Âπ£‰æõÁµ¶?èÂπ¥Â¢ûÁ??ÇÁï∂Ë≥áÈ??éÁ∏Æ (Ë≤†Ê??? ?ÇÊ•µ?ìÂ??ºËÇ°Â∏ÇÂ¥©?§Ë?Ë≥áÁî¢?¥Ê? (FRED ?≥Ê?)??
          currentValue={data.m2.value} statusText={data.m2.text} status={data.m2.status} history={data.m2.history}
        />
        <IndicatorCard
          title="ÁæéÂ??áÊï∏ (DXY)"
          description="Ë°°È?ÁæéÂ?Â∞ç‰?Á±ÉÂ?Ë≤®Âπ£?ÑÂº∑Âº±„ÄÇÂº∑?¢Á???>105)ÂæÄÂæÄ?ÉÊäΩ‰πæÂÖ®?ÉÊñ∞?àÂ??¥Ë?È¢®Èö™Ë≥áÁî¢ÊµÅÂ???(Yahoo ?≥Ê?)??
          currentValue={data.dxy.value} statusText={data.dxy.text} status={data.dxy.status} history={data.dxy.history}
        />
        <IndicatorCard
          title="?©Â?Ë¶èÂ? (Sahm Rule)"
          description="??3 ?ãÊ?Â§±Ê•≠?áÁßª?ïÂπ≥?áÂÄºË?‰ΩéÈ?‰∏äÂ? 0.5% ?ÇÔ?‰ª?°®Á∂ìÊ?Â∑≤ÂØ¶Ë≥™ÈÄ≤ÂÖ•Ë°∞ÈÄÄ (FRED ?≥Ê?)??
          currentValue={data.sahm.value} statusText={data.sahm.text} status={data.sahm.status} history={data.sahm.history}
        />
        <IndicatorCard
          title="?ÖÈ?ÊØ?(Copper/Gold)"
          description="?Ö‰ª£Ë°®ÂØ¶È´îÂ∑•Ê•≠È?Ê±ÇÔ?ÈªÉÈ?‰ª?°®?øÈö™?ÇÊ??º‰?Êªë‰??°Â??µÈ??∫Âö¥?çÁ∏ΩÁ∂ìË???(Yahoo ?≥Ê?)??
          currentValue={data.copperGold.value} statusText={data.copperGold.text} status={data.copperGold.status} history={data.copperGold.history}
        />
        <IndicatorCard
          title="?ÄË°åÊîæÊ¨æÊ?È°?(SLOOS)"
          description="?ØÊ??ÉË™ø?•È?Ë°åÊî∂Á∑äË≤∏Ê¨æÁ?ÊØî‰??ÇÂ§ß??40% ?öÂ∏∏ÂºïÁôº‰ºÅÊ•≠Ë≥áÈ??∑Ë??áË°∞?Ä (FRED ?≥Ê?)??
          currentValue={data.sloos.value} statusText={data.sloos.text} status={data.sloos.status} history={data.sloos.history}
        />
        <IndicatorCard
          title="ÊÆñÂà©?áÊõ≤Á∑?(10Y-2Y)"
          description="?∑Áü≠Â§©Ê??¨ÂÇµÊÆñÂà©?áÂà©Â∑Æ„ÄÇÁ?Ê≠?¥©?§ÈÄöÂ∏∏?ºÁ??®„ÄåÊ∑±Â∫¶ÂÄíÊ?ÁµêÊ?ÔºåÊÄ•ÈÄüË?Ê≠?Äç‰???(FRED ?≥Ê?)??
          currentValue={data.yieldCurve.value} statusText={data.yieldCurve.text} status={data.yieldCurve.status} history={data.yieldCurve.history}
        />
      </div>

      {/* --- Section 3: ‰ø°Áî®È¢®Èö™?áÊ?Á∑?--- */}
      <SectionHeader title="‰ø°Áî®È¢®Èö™?áÊ?Á∑? emoji="?î•" statuses={[data.nfci.status, data.vix.status, data.skew.status, data.creditSpreads.status, data.fearGreed.status, data.marginDebt.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 mb-20">
        <IndicatorCard
          title="?ëË?Ê¢ù‰ª∂?áÊï∏ (NFCI)"
          description="?ùÂ??•ËÅØ?≤Áµ±??105 ?ÖÈ??çÊ?Ê®ô„ÄÇÂ§ß??0 Ë°®Á§∫?ëË??á‰ø°?®Áí∞Â¢ÉÁï∞Â∏∏Á?Á∏ÆÔ??∫Âç±Ê©üÂ???(FRED ?≥Ê?)??
          currentValue={data.nfci.value} statusText={data.nfci.text} status={data.nfci.status} history={data.nfci.history}
        />
        <IndicatorCard
          title="VIX ?êÊ??áÊï∏"
          description="Ê≥°Ê≤´?´Ê?Â∏∏Ë¢´Â£ìËá≥Ê•µ‰?Ê™îÔ?Á™ÅÁÑ∂Ë∑≥Â?Á™ÅÁ†¥ 20 ÂæÄÂæÄ?ØÂ¥©?§Â???(Yahoo ?≥Ê?)??
          currentValue={data.vix.value} statusText={data.vix.text} status={data.vix.status} history={data.vix.history}
        />
        <IndicatorCard
          title="SKEW ÈªëÂ§©ÈµùÊ???
          description="Ë°°È?Â∏ÇÂ†¥Â∞çÊ•µÁ´ØÂ∞æ?®È¢®?™Á?ÂÆöÂÉπÔºåÂ§ß??140 ‰ª?°®Â§ßÊà∂Ê≠???ÑÁ??ÇÈÅø??(Yahoo ?≥Ê?)??
          currentValue={data.skew.value} statusText={data.skew.text} status={data.skew.status} history={data.skew.history}
        />
        <IndicatorCard
          title="‰ø°Áî®?©Â∑Æ (High Yield)"
          description="?ÉÂúæ?µÊ??©Á??áÁÑ°È¢®Èö™?¨ÂÇµ?©Â∑Æ?ÇÁ??∂ÊÄ•ÈÄüÈ??á‰ª£Ë°®Â??¥Â?‰ºÅÊ•≠?ïÁ?Ê•µÂ∫¶?êÊ? (FRED ?≥Ê?)??
          currentValue={data.creditSpreads.value} statusText={data.creditSpreads.text} status={data.creditSpreads.status} history={data.creditSpreads.history}
        />
        <IndicatorCard
          title="CNN ?êÊáº?áË≤™Â©™Ê???
          description="Á∂úÂ??ïËÉΩ?áÈÅø?™Á??†Á??ÇÈï∑?üË???75 ‰ª•‰?‰ª?°®Â∏ÇÂ†¥Ë¢´‰??ÜÊÄßÁ???à∂FOMO?ÖÁ?‰∏ªÂ? (CNN ?¨Ëü≤?≥Ê?)??
          currentValue={data.fearGreed.value} statusText={data.fearGreed.text} status={data.fearGreed.status} history={data.fearGreed.history}
        />
        <IndicatorCard
          title="FINRA ?çË?È§òÈ?"
          description="Ë°°È??ïË?‰∫∫„ÄåÂÄüÈå¢?íËÇ°?çÁ??ãÁ?Á®ãÂ∫¶?ÇËã•ÂæûÊ≠∑?≤È?ÈªûÈ???10% ?ìÂ??ºÊñ∑?≠Ë∏©Ë∏?(FRED ?≥Ê?)??
          currentValue={data.marginDebt.value} statusText={data.marginDebt.text} status={data.marginDebt.status} history={data.marginDebt.history}
        />
      </div>

      {/* --- Section 4: ?∞ÁÅ£?°Â??áÊ? --- */}
      <SectionHeader title="?∞ÁÅ£?°Â??áÊ?" emoji="?áπ?áº" statuses={[data.taiwanBusinessIndicator.status, data.taiwanMargin.status]} />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 mb-20">
        <a href="https://index.ndc.gov.tw/n/zh_tw/lightscore#/" target="_blank" rel="noopener noreferrer" className="block h-full">
          <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between transition-transform hover:scale-[1.02] hover:border-foreground/20 duration-300 relative overflow-hidden group h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 relative z-20">
                <h3 className="text-lg font-semibold text-foreground/90 flex items-center gap-2">
                  ?∞ÁÅ£-?ØÊ∞£Â∞çÁ?‰ø°Ë?
                  <svg className="w-4 h-4 text-foreground/50 group-hover:text-foreground/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </h3>
              </div>
            </div>
            <div className="flex flex-col gap-1 mb-2 z-10">
              <div className="text-2xl font-bold tracking-tight text-foreground/80 group-hover:text-foreground transition-colors">?çÂ??ãÁôº?ÉÁ∂≤Á´ôÊü•Ë©???/div>
              <div className="text-sm font-medium text-foreground/50">ÈªûÊ??•Á??Ä?∞ÊôØÊ∞????/div>
            </div>
            <div className="h-16 w-full mt-auto relative -mx-2 opacity-80 group-hover:opacity-100 transition-opacity z-10 flex items-end ml-2 pb-1">
              <span className="text-xs text-foreground/30">Ë≥áÊ?‰æÜÊ?ÔºöÂ?ÂÆ∂ÁôºÂ±ïÂ??°Ê?</span>
            </div>
          </div>
        </a>
        <IndicatorCard
          title="?∞ÁÅ£-‰∏äÂ??çË?È§òÈ?"
          description="Ë°°È??∞ËÇ°??à∂ÊßìÊ°øÁ®ãÂ∫¶?ÇÊ∞¥‰ΩçÊñºÈ´òÊ? (Â¶?3000?? ?ñÊÄ•ÈÄüÈ?È´òÊ?ÔºåÁ?Á¢ºÂ?‰∫Ç‰??∑È†≠È¢®Èö™Â§ßÂ? (FinMind ?≥Ê?)??
          currentValue={data.taiwanMargin.value} statusText={data.taiwanMargin.text} status={data.taiwanMargin.status} history={data.taiwanMargin.history}
        />
      </div>
    </main>
  );
}


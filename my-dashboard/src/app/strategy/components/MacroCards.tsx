import { fetchMarketData } from "@/lib/indicators";
import { getUserApiKeys } from "@/lib/keys";
import IndicatorCard from "@/components/IndicatorCard";

export default async function MacroCards() {
  const keys = await getUserApiKeys();
  const data = await fetchMarketData(keys.finmind);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-16">
      <IndicatorCard 
        spyHistory={data.spy.history} 
        title="席勒本益比 (CAPE)" 
        badge="否決權濾網"
        value={data.cape.value} 
        status={data.cape.status as any} 
        statusText={data.cape.text} 
        history={data.cape.history} 
        description="使用過去 10 年通膨調整後的平均實質盈餘計算本益比。大於 30-35 屬嚴重高估。"
        criteria={{ red: '> 35', yellow: '25-35', green: '< 25' }} 
      />
      <IndicatorCard 
        spyHistory={data.spy.history} 
        title="薩姆規則衰退指標" 
        badge="否決權濾網"
        value={data.sahm.value} 
        status={data.sahm.status as any} 
        statusText={data.sahm.text} 
        history={data.sahm.history} 
        description="失業率3個月移動平均減去前12個月低點。> 0.5% 代表經濟已陷入衰退。"
        criteria={{ red: '> 0.5%', yellow: '0.3-0.5%', green: '< 0.3%' }} 
      />
      <IndicatorCard 
        spyHistory={data.spy.history} 
        title="10年期公債實質利率" 
        badge="否決權濾網"
        value={data.tips.value} 
        status={data.tips.status as any} 
        statusText={data.tips.text} 
        history={data.tips.history} 
        description="衡量真實資金成本的指標 (TIPS Yield)。過高的實質利率會持續對高估值風險資產造成估值下修壓力。"
        criteria={{ red: '> 2.0%', yellow: '1.0-2.0%', green: '< 1.0%' }} 
      />
    </div>
  );
}

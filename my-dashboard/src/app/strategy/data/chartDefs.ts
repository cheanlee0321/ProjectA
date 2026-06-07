import { ChartDefinition } from '../types';

export const chartDefs: readonly ChartDefinition[] = [
  { id: 'chart1', title: 'FINRA vs S&P 500', titleColor: 'text-blue-400', description: 'ETF SPY = 1x S&P 500. 觀察大盤資金水位，當融資餘額與 S&P 500 走勢背離或同時過熱時，需警戒。', rightKey: 'sp500ToM0', rightName: 'S&P 500 / 流通貨幣', rightColor: '#3B82F6', formatRight: true },
  { id: 'chart6', title: 'FINRA vs UPRO', titleColor: 'text-sky-400', description: 'ETF UPRO = 3x S&P 500. 對資金流動性更敏感，適合用來判斷激進部位的撤退時機。', rightKey: 'uproToM0', rightName: 'UPRO / 流通貨幣', rightColor: '#38BDF8', formatRight: true },
  { id: 'chart2', title: 'FINRA vs QQQ', titleColor: 'text-emerald-400', description: 'ETF QQQ = 1x NASDAQ 100. 科技股與資金流動性高度相關，觀察 M0 擴張是否能支撐那斯達克估值。', rightKey: 'qqqToM0', rightName: 'QQQ / 流通貨幣', rightColor: '#10B981', formatRight: true },
  { id: 'chart3', title: 'FINRA vs TQQQ', titleColor: 'text-amber-400', description: 'ETF TQQQ = 3x NASDAQ 100. 觀察極端投機情緒，高融資配上高 TQQQ 時，往往是泡沫破裂前兆。', rightKey: 'tqqqToM0', rightName: 'TQQQ / 流通貨幣', rightColor: '#F59E0B', formatRight: true },
  { id: 'chart4', title: 'FINRA vs 席勒本益比 (CAPE)', titleColor: 'text-fuchsia-400', description: '當融資比值與 CAPE 席勒本益比同時處於高位，代表市場同時存在槓桿過高與估值泡沫。', rightKey: 'cape', rightName: '席勒本益比 (CAPE)', rightColor: '#D946EF', formatRight: false },
  { id: 'chart5', title: 'FINRA vs 10年期公債實質利率 (TIPS Yield)', titleColor: 'text-teal-400', description: '高實質利率代表資金成本昂貴，若此時 FINRA 亮紅燈，崩盤風險極高；槓桿 ETF 的內在耗損也會加劇。', rightKey: 'tips', rightName: '10年期公債實質利率 (%)', rightColor: '#2DD4BF', formatRight: false },
];

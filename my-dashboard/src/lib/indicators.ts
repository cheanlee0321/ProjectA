import YahooFinance from 'yahoo-finance2';
import { unstable_cache } from 'next/cache';
const yahooFinance = new YahooFinance();

export interface IndicatorData {
  value: number | string;
  status: 'red' | 'yellow' | 'green' | 'loading';
  text: string;
  history?: { date: string; value: number }[];
}

export interface MarketData {
  // 市場估值與結構
  cape: IndicatorData;
  breadth: IndicatorData;
  // 總體經濟與流動性
  buffett: IndicatorData;
  sahm: IndicatorData;
  copperGold: IndicatorData;
  sloos: IndicatorData;
  yieldCurve: IndicatorData;
  m2: IndicatorData; // 新增
  dxy: IndicatorData; // 新增
  // 信用風險與情緒
  vix: IndicatorData;
  skew: IndicatorData;
  creditSpreads: IndicatorData;
  fearGreed: IndicatorData;
  marginDebt: IndicatorData;
  nfci: IndicatorData; // 新增
  // 台灣股市指標
  taiwanBusinessIndicator: IndicatorData;
  taiwanMargin: IndicatorData;
  taiwanM1BM2: IndicatorData;
  taiwanExport: IndicatorData;
  usdTwd: IndicatorData;
  cryptoFng: IndicatorData;
  bitcoin: IndicatorData;
  spy: { history: { date: string; value: number }[] };
}

const FRED_API_KEY = process.env.FRED_API_KEY || '';
async function fetchFredSeries(seriesId: string, units: string = 'lin'): Promise<{current: number | null, history: {date: string, value: number}[], isError: boolean}> {
  try {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 10); // 抓過去十年
    const startDate = d.toISOString().split('T')[0];
    const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&observation_start=${startDate}&units=${units}`, { next: { revalidate: 86400 } });
    const contentType = res.headers.get('content-type');
    if (!res.ok || (contentType && contentType.includes('text/html'))) {
      const errText = await res.text();
      console.error(`FRED API error for ${seriesId}: ${res.status} ${res.statusText}`, errText.slice(0, 200));
      return { current: null, history: [], isError: true };
    }
    const data = await res.json();
    const history = [];
    if (data.observations && data.observations.length > 0) {
      const current = parseFloat(data.observations[0].value);
      // FRED 預設是降序(desc)，我們需要升序給圖表繪製
      for(let obs of [...data.observations].reverse()) {
        const val = parseFloat(obs.value);
        if(!isNaN(val)) history.push({ date: obs.date, value: val });
      }
      return { current: isNaN(current) ? null : current, history, isError: false };
    }
  } catch (e) { console.error(`FRED error ${seriesId}:`, e); }
  return { current: null, history: [], isError: true };
}

const fetchYahooChart = unstable_cache(
  async (symbol: string, interval: '1d' | '1wk' | '1mo' = '1wk') => {
    try {
      const d = new Date();
      d.setFullYear(d.getFullYear() - 10);
      const chart = await yahooFinance.chart(symbol, { period1: d, interval });
      const history = chart.quotes.map(q => ({
        date: q.date.toISOString().split('T')[0],
        value: q.close ?? 0
      })).filter(q => q.value !== 0);
      const current = history.length > 0 ? history[history.length - 1].value : null;
      return { current, history };
    } catch(e) { return { current: null, history: [] }; }
  },
  ['yahoo-finance-chart'],
  { revalidate: 86400 }
);

async function fetchCapeRatio(): Promise<{current: number | null, history: {date: string, value: number}[]}> {
  try {
    const res = await fetch('https://www.multpl.com/shiller-pe/table/by-month', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      next: { revalidate: 86400 }
    });
    const html = await res.text();
    
    const history = [];
    const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    
    for (let i = 0; i < Math.min(rows.length, 120); i++) {
      const row = rows[i];
      const cols = row.match(/<td>([\s\S]*?)<\/td>/gi);
      if (cols && cols.length >= 2) {
        const dateStr = cols[0].replace(/<\/?td>/g, '').trim();
        const valStr = cols[1].replace(/<\/?td>/g, '').replace(/&#x2002;/g, '').trim();
        const d = new Date(dateStr);
        if (!isNaN(d.getTime()) && !isNaN(parseFloat(valStr))) {
          history.push({
            date: d.toISOString().split('T')[0],
            value: parseFloat(valStr)
          });
        }
      }
    }
    
    const chartHistory = history.reverse();
    const current = chartHistory.length > 0 ? chartHistory[chartHistory.length - 1].value : null;
    return { current, history: chartHistory };
  } catch (e) {
    console.error("CAPE Fetch Error", e);
  }
  return { current: null, history: [] };
}

async function fetchFearAndGreed(): Promise<{current: number | null, history: {date: string, value: number}[]}> {
  try {
    const res = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36', 'Accept': 'application/json' },
      next: { revalidate: 86400 }
    });
    const data = await res.json();
    const current = data.fear_and_greed?.score ?? null;
    const history = data.fear_and_greed_historical?.data?.map((d: any) => ({
      date: new Date(d.x).toISOString().split('T')[0],
      value: d.y
    })) ?? [];
    return { current, history };
  } catch (e) {}
  return { current: null, history: [] };
}

async function fetchCryptoFearGreed(): Promise<{current: number | null, history: {date: string, value: number}[], isError: boolean}> {
  try {
    const res = await fetch('https://api.alternative.me/fng/?limit=0', { next: { revalidate: 86400 } });
    const data = await res.json();
    const history = [];
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 10);
    
    for (let i = data.data.length - 1; i >= 0; i--) {
      const item = data.data[i];
      const d = new Date(parseInt(item.timestamp) * 1000);
      if (d >= cutoff) {
         history.push({
            date: d.toISOString().split('T')[0],
            value: parseInt(item.value)
         });
      }
    }
    const current = history.length > 0 ? history[history.length - 1].value : null;
    return { current, history, isError: false };
  } catch (e) {
    console.error("fetchCryptoFearGreed error", e);
  }
  return { current: null, history: [], isError: true };
}

async function fetchTaiwanMargin(token: string): Promise<{current: number | null, history: {date: string, value: number}[]}> {
  try {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 3); // 台股籌碼資料抓 3 年
    const startDate = d.toISOString().split('T')[0];
    const res = await fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockTotalMarginPurchaseShortSale&start_date=${startDate}&token=${token}`, { next: { revalidate: 86400 } });
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      // Finmind returns MarginPurchase and MarginPurchaseMoney separately sometimes, we want MarginPurchaseMoney TodayBalance if available, or just MarginPurchase TodayBalance
      const purchaseData = data.data.filter((d: any) => d.name === 'MarginPurchaseMoney' || d.name === 'MarginPurchase');
      const history = purchaseData.map((d: any) => ({
        date: d.date,
        value: d.TodayBalance
      }));
      // group by date and take the max value to prefer MarginPurchaseMoney (which is in NTD, usually very large). Actually MarginPurchaseMoney is in dollars, MarginPurchase is in shares.
      // Let's specifically filter MarginPurchaseMoney if it exists.
      const moneyData = purchaseData.filter((d: any) => d.name === 'MarginPurchaseMoney');
      const finalData = moneyData.length > 0 ? moneyData : purchaseData;
      
      const parsedHistory = finalData.map((d: any) => ({
        date: d.date,
        value: d.TodayBalance
      }));
      const current = parsedHistory[parsedHistory.length - 1].value;
      return { current, history: parsedHistory };
    }
  } catch (e) {}
  return { current: null, history: [] };
}

async function fetchTaiwanM1BM2(): Promise<{current: number | null, history: {date: string, value: number}[], isError: boolean}> {
  try {
    const res = await fetch(`https://cpx.cbc.gov.tw/API/DataAPI/Get?FileName=EF15M01`, { next: { revalidate: 86400 } });
    const data = await res.json();
    const datasets = data.data.dataSets;
    const history = [];
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 10);
    
    for (const row of datasets) {
       const dateStr = row[0]; // e.g., "2024M01"
       if (!dateStr || dateStr.length < 7) continue;
       const year = dateStr.substring(0, 4);
       const month = dateStr.substring(5, 7);
       const d = new Date(`${year}-${month}-01`);
       
       if (d < cutoff) continue;

       const m1bYoy = parseFloat(row[28]);
       const m2Yoy = parseFloat(row[30]);
       
       if (!isNaN(m1bYoy) && !isNaN(m2Yoy)) {
          history.push({
             date: d.toISOString().split('T')[0],
             value: parseFloat((m1bYoy - m2Yoy).toFixed(2))
          });
       }
    }
    const current = history.length > 0 ? history[history.length - 1].value : null;
    return { current, history, isError: false };
  } catch (e) {
    console.error("fetchTaiwanM1BM2 error", e);
  }
  return { current: null, history: [], isError: true };
}

export async function fetchMarketData(finmindToken: string): Promise<MarketData> {
  try {
    const [vix, skew, spy, rsp, copper, gold, dxy, sahm, sloos, yieldCurve, spread, wilshire, gdp, cape, fg, margin, m2, nfci, twMargin, m1bm2, twExport, usdTwd, cryptoFng, btc] = await Promise.all([
      fetchYahooChart('^VIX', '1wk'),
      fetchYahooChart('^SKEW', '1wk'),
      fetchYahooChart('SPY', '1wk'),
      fetchYahooChart('RSP', '1wk'),
      fetchYahooChart('HG=F', '1wk'),
      fetchYahooChart('GC=F', '1wk'),
      fetchYahooChart('DX-Y.NYB', '1wk'),
      fetchFredSeries('SAHMREALTIME'),
      fetchFredSeries('DRTSCILM'),
      fetchFredSeries('T10Y2Y'),
      fetchFredSeries('BAMLH0A0HYM2'),
      fetchFredSeries('NCBEILQ027S'),
      fetchFredSeries('GDP'),
      fetchCapeRatio(),
      fetchFearAndGreed(),
      fetchFredSeries('BOGZ1FL663067003Q'),
      fetchFredSeries('M2SL'), // 新增 M2
      fetchFredSeries('NFCI'),  // 新增 NFCI
      fetchTaiwanMargin(finmindToken),
      fetchTaiwanM1BM2(), // 台灣 M1B & M2 剪刀差
      fetchFredSeries('VALEXPTWM052N', 'pc1'), // 台灣出口 (YoY)
      fetchYahooChart('TWD=X', '1wk'), // USD/TWD 匯率
      fetchCryptoFearGreed(), // 加密貨幣恐懼與貪婪
      fetchYahooChart('BTC-USD', '1wk') // 比特幣走勢
    ]);

    // 計算市場廣度歷史 (RSP / SPY)
    const breadthHistory = [];
    const minLen = Math.min(rsp.history.length, spy.history.length);
    for(let i=0; i<minLen; i++) {
      if(spy.history[i].value > 0) {
        breadthHistory.push({
          date: rsp.history[i].date,
          value: parseFloat((rsp.history[i].value / spy.history[i].value).toFixed(3))
        });
      }
    }
    const breadthNumber = breadthHistory.length > 0 ? breadthHistory[breadthHistory.length - 1].value : (rsp.current && spy.current ? parseFloat((rsp.current / spy.current).toFixed(3)) : 0);
    let bStatus: 'red'|'yellow'|'green' = 'green';
    let bText = '結構健康';
    if (breadthNumber < 0.3) { bStatus = 'yellow'; bText = '資金集中權值股'; }
    if (breadthNumber < 0.28) { bStatus = 'red'; bText = '極端背離 (虛胖)'; }

    // 銅金比歷史
    const cgHistory = [];
    const minLenCg = Math.min(copper.history.length, gold.history.length);
    for(let i=0; i<minLenCg; i++) {
      if(gold.history[i].value > 0) {
        cgHistory.push({
          date: copper.history[i].date,
          value: parseFloat(((copper.history[i].value / gold.history[i].value) * 100).toFixed(2))
        });
      }
    }
    const cgNumber = cgHistory.length > 0 ? cgHistory[cgHistory.length - 1].value : (copper.current && gold.current ? parseFloat(((copper.current / gold.current) * 100).toFixed(2)) : 0);
    let cgStatus: 'red'|'yellow'|'green' = 'green';
    let cgText = '實體需求平穩';
    if (cgNumber < 0.16) { cgStatus = 'yellow'; cgText = '需求放緩疑慮'; }
    if (cgNumber < 0.14) { cgStatus = 'red'; cgText = '總經背離 (實體萎縮)'; }

    // 巴菲特指標歷史
    const buffettHistory = [];
    let buffettRatio = 0;
    if (wilshire.current && gdp.current) {
      buffettRatio = ((wilshire.current / 1000) / gdp.current) * 100;
      const blen = Math.min(wilshire.history.length, gdp.history.length);
      for(let i=0; i<blen; i++) {
        buffettHistory.push({
          date: wilshire.history[i].date,
          value: parseFloat((((wilshire.history[i].value / 1000) / gdp.history[i].value) * 100).toFixed(1))
        });
      }
    }
    let buffettStatus: 'red'|'yellow'|'green' = 'green';
    let buffettText = '估值合理';
    if (wilshire.isError || gdp.isError) {
      buffettStatus = 'red';
      buffettText = 'FRED API Error';
    } else if (buffettRatio > 150) {
      buffettStatus = 'red';
      buffettText = '極端高估';
    } else if (buffettRatio > 130) {
      buffettStatus = 'yellow';
      buffettText = '估值偏高';
    }

    // M2 YoY
    const m2History = [];
    // M2SL 是月度資料，利用索引 i 與 i-12 來精確計算 YoY
    for (let i = 12; i < m2.history.length; i++) {
       const currentVal = m2.history[i].value;
       const lastYearVal = m2.history[i - 12].value;
       const yoy = ((currentVal - lastYearVal) / lastYearVal) * 100;
       m2History.push({
         date: m2.history[i].date,
         value: parseFloat(yoy.toFixed(2))
       });
    }
    const m2YoyNumber = m2History.length > 0 ? m2History[m2History.length - 1].value : 0;
    let m2Status: 'red'|'yellow'|'green' = 'green';
    let m2Text = '動能充沛';
    if (m2.isError) {
      m2Status = 'red';
      m2Text = 'FRED API Error';
    } else if (m2YoyNumber < 0) {
      m2Status = 'red';
      m2Text = '資金嚴重萎縮';
    } else if (m2YoyNumber < 4) {
      m2Status = 'yellow';
      m2Text = '流動性放緩';
    }

    // NFCI
    const nfciValue = nfci.current ?? 0;
    let nfciStatus: 'red'|'yellow'|'green' = 'green';
    let nfciText = '環境寬鬆';
    if (nfci.isError) {
      nfciStatus = 'red';
      nfciText = 'FRED API Error';
    } else if (nfciValue > 0) {
      nfciStatus = 'red';
      nfciText = '金融緊縮';
    } else if (nfciValue > -0.3) {
      nfciStatus = 'yellow';
      nfciText = '中性偏緊';
    }

    // DXY
    const dxyValue = dxy.current ?? 100;
    let dxyStatus: 'red'|'yellow'|'green' = 'green';
    let dxyText = '弱勢美元';
    if (dxyValue > 105) { dxyStatus = 'red'; dxyText = '強美元 (抽乾流動性)'; }
    else if (dxyValue > 100) { dxyStatus = 'yellow'; dxyText = '美元偏強'; }

    // Taiwan Margin
    let twMStatus: 'red'|'yellow'|'green' = 'green';
    let twMText = '籌碼穩定';
    let twMValueStr = 'N/A';
    if (twMargin.current !== null) {
      // if it's MarginPurchaseMoney, it's in NTD. e.g. 300,000,000,000 = 3000億
      const isMoney = twMargin.current > 10000000; 
      if (isMoney) {
        const inBillion = twMargin.current / 100000000;
        twMValueStr = `${inBillion.toFixed(0)}億`;
        if (inBillion > 3000) { twMStatus = 'red'; twMText = '融資過熱(>3000億)'; }
        else if (inBillion > 2500) { twMStatus = 'yellow'; twMText = '融資偏高'; }
      } else {
        twMValueStr = twMargin.current.toString() + '張';
      }
    }

    // Taiwan M1B & M2
    let m1bm2Status: 'red'|'yellow'|'green' = 'green';
    let m1bm2Text = '資金動能強';
    if (m1bm2.isError) { m1bm2Status = 'red'; m1bm2Text = 'CBC API Error'; }
    else if ((m1bm2.current ?? 0) < -2) { m1bm2Status = 'red'; m1bm2Text = '資金嚴重退潮'; }
    else if ((m1bm2.current ?? 0) < 0) { m1bm2Status = 'yellow'; m1bm2Text = '資金動能轉弱'; }

    // Taiwan Export
    let twExportStatus: 'red'|'yellow'|'green' = 'green';
    let twExportText = '出口擴張';
    if (twExport.isError) { twExportStatus = 'red'; twExportText = 'FRED API Error'; }
    else if ((twExport.current ?? 0) < 0) { twExportStatus = 'red'; twExportText = '出口衰退'; }
    else if ((twExport.current ?? 0) < 5) { twExportStatus = 'yellow'; twExportText = '動能放緩'; }

    // USD/TWD
    let usdTwdStatus: 'red'|'yellow'|'green'|'neutral' = 'green';
    let usdTwdText = '熱錢湧入';
    if ((usdTwd.current ?? 0) > 32) { usdTwdStatus = 'red'; usdTwdText = '台幣重貶 (外資大賣)'; }
    else if ((usdTwd.current ?? 0) > 30) { usdTwdStatus = 'yellow'; usdTwdText = '台幣偏弱'; }

    // Crypto Fear & Greed
    let cryptoFngStatus: 'red'|'yellow'|'green'|'neutral' = 'yellow';
    let cryptoFngText = '中立';
    if (cryptoFng.isError) { cryptoFngStatus = 'red'; cryptoFngText = 'API Error'; }
    else if ((cryptoFng.current ?? 50) > 75) { cryptoFngStatus = 'red'; cryptoFngText = '極度貪婪'; }
    else if ((cryptoFng.current ?? 50) < 25) { cryptoFngStatus = 'green'; cryptoFngText = '極度恐慌'; }

    // Bitcoin
    let btcStatus: 'red'|'yellow'|'green'|'neutral' = 'neutral';
    let btcText = '觀察中';
    let btcValueStr = 'N/A';
    if (btc.current !== null) {
      btcValueStr = `$${btc.current.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    }

    return {
      cape: { value: cape.current ?? 'N/A', status: (cape.current ?? 0) > 35 ? 'red' : ((cape.current ?? 0) > 25 ? 'yellow' : 'green'), text: (cape.current ?? 0) > 35 ? '嚴重透支未來' : '估值合理', history: cape.history },
      breadth: { value: breadthNumber, status: bStatus, text: bText, history: breadthHistory },
      buffett: { value: (wilshire.isError || gdp.isError) ? 'N/A' : (buffettRatio ? buffettRatio.toFixed(1)+'%' : 'N/A'), status: buffettStatus, text: buffettText, history: buffettHistory },
      sahm: { value: sahm.isError ? 'N/A' : (sahm.current ? sahm.current.toFixed(2)+'%' : 'N/A'), status: sahm.isError ? 'red' : ((sahm.current ?? 0) > 0.5 ? 'red' : ((sahm.current ?? 0) > 0.3 ? 'yellow' : 'green')), text: sahm.isError ? 'FRED API Error' : ((sahm.current ?? 0) > 0.5 ? '實質衰退' : '無衰退跡象'), history: sahm.history },
      copperGold: { value: cgNumber, status: cgStatus, text: cgText, history: cgHistory },
      sloos: { value: sloos.isError ? 'N/A' : (sloos.current ? sloos.current.toFixed(1)+'%' : 'N/A'), status: sloos.isError ? 'red' : ((sloos.current ?? 0) > 40 ? 'red' : ((sloos.current ?? 0) > 20 ? 'yellow' : 'green')), text: sloos.isError ? 'FRED API Error' : ((sloos.current ?? 0) > 40 ? '流動性枯竭' : '資金寬鬆'), history: sloos.history },
      yieldCurve: { value: yieldCurve.isError ? 'N/A' : (yieldCurve.current ? yieldCurve.current.toFixed(2)+'%' : 'N/A'), status: yieldCurve.isError ? 'red' : ((yieldCurve.current ?? 0) < 0 ? 'yellow' : ((yieldCurve.current ?? 0) < 0.5 && (yieldCurve.current ?? 0) > 0 ? 'red' : 'green')), text: yieldCurve.isError ? 'FRED API Error' : ((yieldCurve.current ?? 0) < 0 ? '曲線倒掛' : '正常'), history: yieldCurve.history },
      m2: { value: m2.isError ? 'N/A' : m2YoyNumber.toFixed(2)+'%', status: m2Status, text: m2Text, history: m2History },
      dxy: { value: dxyValue.toFixed(2), status: dxyStatus, text: dxyText, history: dxy.history },
      vix: { value: vix.current ? vix.current.toFixed(2) : 'N/A', status: (vix.current ?? 0) > 20 ? 'red' : ((vix.current ?? 0) > 15 ? 'yellow' : 'green'), text: (vix.current ?? 0) > 20 ? '恐慌拋售' : '平穩安全', history: vix.history },
      skew: { value: skew.current ? skew.current.toFixed(2) : 'N/A', status: (skew.current ?? 0) > 140 ? 'red' : ((skew.current ?? 0) > 130 ? 'yellow' : 'green'), text: (skew.current ?? 0) > 140 ? '黑天鵝警戒' : '尾部風險低', history: skew.history },
      creditSpreads: { value: spread.isError ? 'N/A' : (spread.current ? spread.current.toFixed(2)+'%' : 'N/A'), status: spread.isError ? 'red' : ((spread.current ?? 0) > 6 ? 'red' : ((spread.current ?? 0) > 4.5 ? 'yellow' : 'green')), text: spread.isError ? 'FRED API Error' : ((spread.current ?? 0) > 6 ? '違約恐慌' : '資金充裕'), history: spread.history },
      fearGreed: { value: fg.current ? Math.round(fg.current) : 'N/A', status: (fg.current ?? 50) > 75 ? 'red' : ((fg.current ?? 50) < 25 ? 'green' : 'yellow'), text: (fg.current ?? 50) > 75 ? '極度貪婪' : '中立', history: fg.history },
      marginDebt: { value: margin.isError ? 'N/A' : (margin.current ? `$${(margin.current/1000).toFixed(0)}B` : 'N/A'), status: margin.isError ? 'red' : ((margin.current ?? 0)/1000 > 800 ? 'red' : ((margin.current ?? 0)/1000 > 650 ? 'yellow' : 'green')), text: margin.isError ? 'FRED API Error' : ((margin.current ?? 0)/1000 > 800 ? '天量槓桿' : '常規水準'), history: margin.history.map(h => ({date: h.date, value: h.value/1000})) },
      nfci: { value: nfci.isError ? 'N/A' : nfciValue.toFixed(2), status: nfciStatus, text: nfciText, history: nfci.history },
      taiwanBusinessIndicator: { value: 'N/A', status: 'loading', text: '', history: [] }, // 已改為純連結
      taiwanMargin: { value: twMValueStr, status: twMStatus, text: twMText, history: twMargin.history },
      taiwanM1BM2: { value: m1bm2.isError ? 'N/A' : (m1bm2.current ? m1bm2.current.toFixed(2)+'%' : 'N/A'), status: m1bm2Status as any, text: m1bm2Text, history: m1bm2.history },
      taiwanExport: { value: twExport.isError ? 'N/A' : (twExport.current ? twExport.current.toFixed(2)+'%' : 'N/A'), status: twExportStatus as any, text: twExportText, history: twExport.history },
      usdTwd: { value: usdTwd.current ? usdTwd.current.toFixed(2) : 'N/A', status: usdTwdStatus as any, text: usdTwdText, history: usdTwd.history },
      cryptoFng: { value: cryptoFng.isError ? 'N/A' : (cryptoFng.current ? cryptoFng.current.toString() : 'N/A'), status: cryptoFngStatus as any, text: cryptoFngText, history: cryptoFng.history },
      bitcoin: { value: btcValueStr, status: btcStatus as any, text: btcText, history: btc.history },
      spy: { history: spy.history }
    };
  } catch (error: any) {
    console.error("Error fetching market data:", error);
    const errObj = { value: 0, status: 'loading' as const, text: 'Error', history: [] };
    return { cape: errObj, breadth: errObj, buffett: errObj, sahm: errObj, copperGold: errObj, sloos: errObj, yieldCurve: errObj, vix: errObj, skew: errObj, creditSpreads: errObj, fearGreed: errObj, marginDebt: errObj, m2: errObj, dxy: errObj, nfci: errObj, taiwanBusinessIndicator: errObj, taiwanMargin: errObj, taiwanM1BM2: errObj, taiwanExport: errObj, usdTwd: errObj, cryptoFng: errObj, bitcoin: errObj, spy: { history: [] } };
  }
}


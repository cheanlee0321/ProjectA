import YahooFinance from 'yahoo-finance2';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
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
  nfci: IndicatorData; 
  drcc: IndicatorData; // 信用卡違約率
  // 新增流動性與政策
  walcl: IndicatorData;
  rrpontsyd: IndicatorData;
  fedfunds: IndicatorData;
  // 新增就業與實體經濟
  icsa: IndicatorData;
  jtsjol: IndicatorData;
  houst: IndicatorData;
  mortgage30us: IndicatorData;
  // 新增通膨預期
  t10yie: IndicatorData;
  pcepilfe: IndicatorData;
  // 台灣股市指標
  taiwanBusinessIndicator: IndicatorData;
  taiwanMargin: IndicatorData;
  taiwanM1BM2: IndicatorData;
  taiwanExport: IndicatorData;
  usdTwd: IndicatorData;
  taiwanForeignBuy: IndicatorData; // 新增外資現貨買賣超
  sox: IndicatorData; // 費城半導體 YoY
  ismProxy: IndicatorData; // 美國工業生產 YoY (ISM 替代)
  cryptoFng: IndicatorData;
  bitcoin: IndicatorData;
  spy: { history: { date: string; value: number }[] };
  twii: { history: { date: string; value: number }[] };
}

const globalFred = globalThis as unknown as { fredCache?: Record<string, any> };
if (!globalFred.fredCache) globalFred.fredCache = {};

const FRED_API_KEY = process.env.FRED_API_KEY || '';
async function fetchFredSeries(seriesId: string, units: string = 'lin', retries: number = 5, delay: number = 1000): Promise<{current: number | null, history: {date: string, value: number}[], isError: boolean}> {
  const cacheKey = `${seriesId}-${units}`;
  if (globalFred.fredCache![cacheKey]) {
    return globalFred.fredCache![cacheKey];
  }
  try {
    // 不再限制過去十年，抓取 FRED 提供的所有歷史資料
    const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&units=${units}`, { next: { revalidate: 86400 } });
    
    if (res.status === 429 && retries > 0) {
      console.warn(`FRED API 429 Too Many Requests for ${seriesId}. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      return fetchFredSeries(seriesId, units, retries - 1, delay * 2);
    }

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
      const result = { current: isNaN(current) ? null : current, history, isError: false };
      globalFred.fredCache![cacheKey] = result;
      return result;
    }
  } catch (e) { console.error(`FRED error ${seriesId}:`, e); }
  return { current: null, history: [], isError: true };
}

const fetchYahooChart = unstable_cache(
  async (symbol: string, interval: '1d' | '1wk' | '1mo' = '1wk') => {
    try {
      // 設定一個夠早的日期以抓取所有歷史資料
      const d = new Date('1970-01-01');
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
    
    for (let i = 0; i < rows.length; i++) {
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

async function fetchTaiwanMargin(token: string): Promise<{current: number | null, history: {date: string, value: number}[], isMoney: boolean}> {
  try {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 25); // 拿取最大資料年分 (25年)
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
      const isMoney = moneyData.length > 0;
      const finalData = isMoney ? moneyData : purchaseData;
      
      const parsedHistory = finalData.map((d: any) => ({
        date: d.date,
        value: isMoney ? d.TodayBalance / 100000000 : d.TodayBalance
      }));
      const current = parsedHistory[parsedHistory.length - 1].value;
      return { current, history: parsedHistory, isMoney };
    }
  } catch (e) {}
  return { current: null, history: [], isMoney: false };
}

async function fetchTaiwanForeignBuy(token: string): Promise<{current: number | null, history: {date: string, value: number}[], isError: boolean}> {
  try {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 5);
    const startDate = d.toISOString().split('T')[0];
    const res = await fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockTotalInstitutionalInvestors&start_date=${startDate}&token=${token}`, { next: { revalidate: 86400 } });
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      // name: 'Foreign_Investor'
      const foreignData = data.data.filter((d: any) => d.name === 'Foreign_Investor');
      if (foreignData.length > 0) {
        const history = foreignData.map((d: any) => {
          const netBuy = d.buy - d.sell;
          return {
            date: d.date,
            value: netBuy / 100000000 // 轉換為億
          };
        });
        const current = history[history.length - 1].value;
        return { current, history, isError: false };
      }
    }
  } catch (e) {
    console.error("fetchTaiwanForeignBuy error", e);
  }
  return { current: null, history: [], isError: true };
}

async function fetchTaiwanM1BM2(): Promise<{current: number | null, history: {date: string, value: number}[], isError: boolean}> {
  try {
    const res = await fetch(`https://cpx.cbc.gov.tw/API/DataAPI/Get?FileName=EF15M01`, { next: { revalidate: 86400 } });
    const data = await res.json();
    const datasets = data.data.dataSets;
    const history = [];
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 30); // 拿取最大資料年分 (30年)
    
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

export const fetchMarketData = cache(async (finmindToken: string): Promise<MarketData> => {
  try {
    const [vix, skew, spy, rsp, copper, gold, dxy, sahm, sloos, yieldCurve, spread, wilshire, gdp, cape, fg, margin, m2, nfci, twMargin, m1bm2, twExport, usdTwd, cryptoFng, btc, twii, walcl, rrp, fedfunds, icsa, jtsjol, houst, mort, t10yie, pce, drcc, twForeignBuy, soxIndex, indpro] = await Promise.all([
      fetchYahooChart('^VIX', '1wk'),
      fetchYahooChart('^SKEW', '1wk'),
      fetchYahooChart('SPY', '1wk'),
      fetchYahooChart('RSP', '1wk'),
      fetchYahooChart('HG=F', '1mo'),
      fetchYahooChart('GC=F', '1mo'),
      fetchYahooChart('DX-Y.NYB', '1wk'),
      fetchFredSeries('SAHMREALTIME'),
      fetchFredSeries('DRTSCIS'),
      fetchFredSeries('T10Y2Y'),
      fetchFredSeries('BAMLH0A0HYM2'),
      fetchFredSeries('NCBEILQ027S'),
      fetchFredSeries('GDP'),
      fetchCapeRatio(),
      fetchFearAndGreed(),
      fetchFredSeries('BOGZ1FL663067003Q'),
      fetchFredSeries('M2SL'),
      fetchFredSeries('NFCI'),
      fetchTaiwanMargin(finmindToken),
      fetchTaiwanM1BM2(),
      fetchFredSeries('VALEXPTWM052N', 'pc1'),
      fetchYahooChart('TWD=X', '1wk'),
      fetchCryptoFearGreed(),
      fetchYahooChart('BTC-USD', '1wk'),
      fetchYahooChart('^TWII', '1wk'),
      fetchFredSeries('WALCL'),
      fetchFredSeries('RRPONTSYD'),
      fetchFredSeries('FEDFUNDS'),
      fetchFredSeries('ICSA'),
      fetchFredSeries('JTSJOL'),
      fetchFredSeries('HOUST'),
      fetchFredSeries('MORTGAGE30US'),
      fetchFredSeries('T10YIE'),
      fetchFredSeries('PCEPILFE', 'pc1'),
      fetchFredSeries('DRCCLACBS'),
      fetchTaiwanForeignBuy(finmindToken),
      fetchYahooChart('^SOX', '1wk'),
      fetchFredSeries('INDPRO', 'pc1')
    ]);

    // 計算市場廣度歷史 (RSP YoY - SPY YoY 績效差)
    const breadthHistory = [];
    const minLen = Math.min(rsp.history.length, spy.history.length);
    // interval 為 1wk，52 週約為 1 年
    for(let i=52; i<minLen; i++) {
      const rspToday = rsp.history[i].value;
      const rspLastYear = rsp.history[i-52].value;
      const spyToday = spy.history[i].value;
      const spyLastYear = spy.history[i-52].value;
      
      if(rspLastYear > 0 && spyLastYear > 0) {
        const rspYoy = ((rspToday - rspLastYear) / rspLastYear) * 100;
        const spyYoy = ((spyToday - spyLastYear) / spyLastYear) * 100;
        const diff = rspYoy - spyYoy; // 負值代表 RSP 績效落後 SPY
        
        breadthHistory.push({
          date: rsp.history[i].date,
          value: parseFloat(diff.toFixed(2))
        });
      }
    }
    const breadthNumber = breadthHistory.length > 0 ? breadthHistory[breadthHistory.length - 1].value : 0;
    let bStatus: 'red'|'yellow'|'green' = 'green';
    let bText = '結構健康';
    if (breadthNumber < -15) { bStatus = 'red'; bText = '極端背離 (虛胖)'; }
    else if (breadthNumber < -5) { bStatus = 'yellow'; bText = '資金集中權值股'; }

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
    if (cgNumber < 0.12) { cgStatus = 'red'; cgText = '總經背離 (實體萎縮)'; }
    else if (cgNumber < 0.16) { cgStatus = 'yellow'; cgText = '需求放緩疑慮'; }

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
      if (twMargin.isMoney) {
        const inBillion = twMargin.current; // Already in 億
        twMValueStr = `${inBillion.toFixed(0)}億`;
        if (inBillion > 3000) { twMStatus = 'red'; twMText = '融資過熱(>3000億)'; }
        else if (inBillion > 2500) { twMStatus = 'yellow'; twMText = '融資偏高'; }
      } else {
        twMValueStr = twMargin.current.toString() + '張';
      }
    }

    // Taiwan Foreign Buy/Sell
    let twFBStatus: 'red'|'yellow'|'green' = 'green';
    let twFBText = '外資買超';
    let twFBValueStr = 'N/A';
    if (!twForeignBuy.isError && twForeignBuy.current !== null) {
      twFBValueStr = twForeignBuy.current > 0 ? `+${twForeignBuy.current.toFixed(0)}億` : `${twForeignBuy.current.toFixed(0)}億`;
      // 計算近 5 日累積買賣超
      let sum5 = 0;
      const len = twForeignBuy.history.length;
      for (let i = Math.max(0, len - 5); i < len; i++) {
        sum5 += twForeignBuy.history[i].value;
      }
      if (sum5 < -500) { twFBStatus = 'red'; twFBText = '外資大賣提款'; }
      else if (sum5 < 300) { twFBStatus = 'yellow'; twFBText = '多空交戰'; }
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
    else if (twExport.current !== null) {
      if (twExport.current < 0) { twExportStatus = 'red'; twExportText = '出口衰退'; }
      else if (twExport.current < 5) { twExportStatus = 'yellow'; twExportText = '動能放緩'; }
    }

    // SOX YoY
    let soxStatus: 'red'|'yellow'|'green' = 'green';
    let soxText = '半導體多頭';
    let soxHistory: {date: string, value: number}[] = [];
    let soxCurrent: number | null = null;
    if (!soxIndex.isError && soxIndex.history.length > 52) {
      for (let i = 52; i < soxIndex.history.length; i++) {
        const val = ((soxIndex.history[i].value - soxIndex.history[i-52].value) / soxIndex.history[i-52].value) * 100;
        soxHistory.push({ date: soxIndex.history[i].date, value: val });
      }
      if (soxHistory.length > 0) soxCurrent = soxHistory[soxHistory.length-1].value;
    }
    if (soxCurrent !== null) {
      if (soxCurrent < -10) { soxStatus = 'red'; soxText = '半導體空頭'; }
      else if (soxCurrent < 10) { soxStatus = 'yellow'; soxText = '動能放緩'; }
    }

    // ISM Proxy (INDPRO YoY)
    let ismStatus: 'red'|'yellow'|'green' = 'green';
    let ismText = '製造業擴張';
    let ismCurrent = indpro.current;
    if (ismCurrent !== null) {
      if (ismCurrent < 0) { ismStatus = 'red'; ismText = '製造業衰退'; }
      else if (ismCurrent < 2) { ismStatus = 'yellow'; ismText = '動能疲弱'; }
    }

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

    // WALCL
    let walclStatus: 'red'|'yellow'|'green' = 'green';
    let walclText = '擴表 (資金寬鬆)';
    let walclValueStr = 'N/A';
    if (!walcl.isError && walcl.current !== null) {
       const walclTrillions = walcl.current / 1000000;
       walclValueStr = `$${walclTrillions.toFixed(2)}T`;
       if (walcl.history.length > 52) {
         const currentVal = walcl.history[walcl.history.length-1].value;
         const lastYearVal = walcl.history[walcl.history.length-53].value;
         const yoy = ((currentVal - lastYearVal) / lastYearVal) * 100;
         if (yoy < -5) { walclStatus = 'red'; walclText = '強力縮表 (抽乾資金)'; }
         else if (yoy < 0) { walclStatus = 'yellow'; walclText = '溫和縮表'; }
       }
    }

    // RRPONTSYD
    let rrpStatus: 'red'|'yellow'|'green' = 'green';
    let rrpText = '水位正常';
    if (!rrp.isError && rrp.current !== null) {
       if (rrp.current < 50) { rrpStatus = 'red'; rrpText = '緩衝池耗盡'; }
       else if (rrp.current < 200) { rrpStatus = 'yellow'; rrpText = '水位偏低'; }
    }

    // FEDFUNDS
    let fedStatus: 'red'|'yellow'|'green' = 'green';
    let fedText = '資金寬鬆';
    if (!fedfunds.isError && fedfunds.current !== null) {
       if (fedfunds.current > 5) { fedStatus = 'red'; fedText = '極度緊縮'; }
       else if (fedfunds.current > 3) { fedStatus = 'yellow'; fedText = '中性偏緊'; }
    }

    // ICSA
    let icsaStatus: 'red'|'yellow'|'green' = 'green';
    let icsaText = '就業穩健';
    let icsaValueStr = 'N/A';
    if (!icsa.isError && icsa.current !== null) {
       const icsaK = icsa.current / 1000;
       icsaValueStr = `${icsaK.toFixed(0)}K`;
       if (icsa.current > 300000) { icsaStatus = 'red'; icsaText = '裁員潮爆發'; }
       else if (icsa.current > 250000) { icsaStatus = 'yellow'; icsaText = '就業放緩'; }
    }

    // JTSJOL
    let jtsjolStatus: 'red'|'yellow'|'green' = 'green';
    let jtsjolText = '勞動需求強';
    let jtsjolValueStr = 'N/A';
    if (!jtsjol.isError && jtsjol.current !== null) {
       const jtsjolM = jtsjol.current / 1000;
       jtsjolValueStr = `${jtsjolM.toFixed(2)}M`;
       if (jtsjol.current < 7000) { jtsjolStatus = 'red'; jtsjolText = '需求急凍'; }
       else if (jtsjol.current < 8500) { jtsjolStatus = 'yellow'; jtsjolText = '需求放緩'; }
    }

    // HOUST
    let houstStatus: 'red'|'yellow'|'green' = 'green';
    let houstText = '房市熱絡';
    let houstValueStr = 'N/A';
    if (!houst.isError && houst.current !== null) {
       const houstM = houst.current / 1000;
       houstValueStr = `${houstM.toFixed(2)}M`;
       if (houst.current < 1000) { houstStatus = 'red'; houstText = '建商縮手'; }
       else if (houst.current < 1300) { houstStatus = 'yellow'; houstText = '動能趨緩'; }
    }

    // MORTGAGE30US
    let mortStatus: 'red'|'yellow'|'green' = 'green';
    let mortText = '資金成本低';
    if (!mort.isError && mort.current !== null) {
       if (mort.current > 7) { mortStatus = 'red'; mortText = '房市承壓'; }
       else if (mort.current > 5) { mortStatus = 'yellow'; mortText = '負擔加重'; }
    }

    // T10YIE
    let t10Status: 'red'|'yellow'|'green' = 'green';
    let t10Text = '通膨溫和';
    if (!t10yie.isError && t10yie.current !== null) {
       if (t10yie.current > 2.5) { t10Status = 'red'; t10Text = '通膨失控疑慮'; }
       else if (t10yie.current < 1.5) { t10Status = 'yellow'; t10Text = '通縮風險'; }
    }

    // PCEPILFE
    let pceStatus: 'red'|'yellow'|'green' = 'green';
    let pceText = '物價穩定';
    if (!pce.isError && pce.current !== null) {
       if (pce.current > 3) { pceStatus = 'red'; pceText = '通膨高漲'; }
       else if (pce.current > 2) { pceStatus = 'yellow'; pceText = '通膨黏著'; }
    }

    // DRCCLACBS
    let drccStatus: 'red'|'yellow'|'green' = 'green';
    let drccText = '消費健康';
    if (!drcc.isError && drcc.current !== null) {
       if (drcc.current > 4) { drccStatus = 'red'; drccText = '資金斷鏈'; }
       else if (drcc.current > 3) { drccStatus = 'yellow'; drccText = '違約升溫'; }
    }

    return {
      cape: { value: cape.current ?? 'N/A', status: (cape.current ?? 0) > 35 ? 'red' : ((cape.current ?? 0) > 25 ? 'yellow' : 'green'), text: (cape.current ?? 0) > 35 ? '嚴重透支未來' : '估值合理', history: cape.history },
      breadth: { value: breadthNumber > 0 ? `+${breadthNumber.toFixed(2)}%` : `${breadthNumber.toFixed(2)}%`, status: bStatus, text: bText, history: breadthHistory },
      buffett: { value: (wilshire.isError || gdp.isError) ? 'N/A' : (buffettRatio ? buffettRatio.toFixed(1)+'%' : 'N/A'), status: buffettStatus, text: buffettText, history: buffettHistory },
      sahm: { value: sahm.isError ? 'N/A' : (sahm.current ? sahm.current.toFixed(2)+'%' : 'N/A'), status: sahm.isError ? 'red' : ((sahm.current ?? 0) > 0.5 ? 'red' : ((sahm.current ?? 0) > 0.3 ? 'yellow' : 'green')), text: sahm.isError ? 'FRED API Error' : ((sahm.current ?? 0) > 0.5 ? '實質衰退' : ((sahm.current ?? 0) > 0.3 ? '衰退疑慮' : '無衰退跡象')), history: sahm.history },
      copperGold: { value: cgNumber, status: cgStatus, text: cgText, history: cgHistory },
      sloos: { value: sloos.isError ? 'N/A' : (sloos.current ? sloos.current.toFixed(1)+'%' : 'N/A'), status: sloos.isError ? 'red' : ((sloos.current ?? 0) > 40 ? 'red' : ((sloos.current ?? 0) > 20 ? 'yellow' : 'green')), text: sloos.isError ? 'FRED API Error' : ((sloos.current ?? 0) > 40 ? '流動性枯竭' : '資金寬鬆'), history: sloos.history },
      yieldCurve: { value: yieldCurve.isError ? 'N/A' : (yieldCurve.current ? yieldCurve.current.toFixed(2)+'%' : 'N/A'), status: yieldCurve.isError ? 'red' : ((yieldCurve.current ?? 0) < 0 ? 'red' : ((yieldCurve.current ?? 0) < 0.5 ? 'yellow' : 'green')), text: yieldCurve.isError ? 'FRED API Error' : ((yieldCurve.current ?? 0) < 0 ? '曲線倒掛' : ((yieldCurve.current ?? 0) < 0.5 ? '剛解除倒掛' : '正常')), history: yieldCurve.history },
      m2: { value: m2.isError ? 'N/A' : m2YoyNumber.toFixed(2)+'%', status: m2Status, text: m2Text, history: m2History },
      dxy: { value: dxyValue.toFixed(2), status: dxyStatus, text: dxyText, history: dxy.history },
      vix: { value: vix.current ? vix.current.toFixed(2) : 'N/A', status: (vix.current ?? 0) > 30 ? 'red' : ((vix.current ?? 0) > 20 ? 'yellow' : 'green'), text: (vix.current ?? 0) > 30 ? '恐慌拋售' : ((vix.current ?? 0) > 20 ? '波動升溫' : '平穩安全'), history: vix.history },
      skew: { value: skew.current ? skew.current.toFixed(2) : 'N/A', status: (skew.current ?? 0) > 140 ? 'red' : ((skew.current ?? 0) > 130 ? 'yellow' : 'green'), text: (skew.current ?? 0) > 140 ? '黑天鵝警戒' : '尾部風險低', history: skew.history },
      creditSpreads: { value: spread.isError ? 'N/A' : (spread.current ? spread.current.toFixed(2)+'%' : 'N/A'), status: spread.isError ? 'red' : ((spread.current ?? 0) > 6 ? 'red' : ((spread.current ?? 0) > 4.5 ? 'yellow' : 'green')), text: spread.isError ? 'FRED API Error' : ((spread.current ?? 0) > 6 ? '違約恐慌' : '資金充裕'), history: spread.history },
      fearGreed: { value: fg.current ? Math.round(fg.current) : 'N/A', status: (fg.current ?? 50) > 75 ? 'red' : ((fg.current ?? 50) < 25 ? 'green' : 'yellow'), text: (fg.current ?? 50) > 75 ? '極度貪婪' : '中立', history: fg.history },
      marginDebt: { value: margin.isError ? 'N/A' : (margin.current ? `$${(margin.current/1000).toFixed(0)}B` : 'N/A'), status: margin.isError ? 'red' : ((margin.current ?? 0)/1000 > 800 ? 'red' : ((margin.current ?? 0)/1000 > 650 ? 'yellow' : 'green')), text: margin.isError ? 'FRED API Error' : ((margin.current ?? 0)/1000 > 800 ? '天量槓桿' : '常規水準'), history: margin.history.map(h => ({date: h.date, value: h.value/1000})) },
      nfci: { value: nfci.isError ? 'N/A' : nfciValue.toFixed(2), status: nfciStatus, text: nfciText, history: nfci.history },
      taiwanBusinessIndicator: { value: 'N/A', status: 'loading', text: '', history: [] },
      taiwanForeignBuy: { value: twForeignBuy.isError ? 'N/A' : twFBValueStr, status: twFBStatus, text: twForeignBuy.isError ? 'API Error' : twFBText, history: twForeignBuy.history },
      taiwanMargin: { value: twMValueStr, status: twMStatus, text: twMText, history: twMargin.history },
      taiwanM1BM2: { value: m1bm2.isError ? 'N/A' : (m1bm2.current ? m1bm2.current.toFixed(2)+'%' : 'N/A'), status: m1bm2Status as any, text: m1bm2Text, history: m1bm2.history },
      taiwanExport: { value: twExport.isError ? 'N/A' : (twExport.current ? twExport.current.toFixed(2)+'%' : 'N/A'), status: twExportStatus as any, text: twExportText, history: twExport.history },
      usdTwd: { value: usdTwd.current ? usdTwd.current.toFixed(2) : 'N/A', status: usdTwdStatus as any, text: usdTwdText, history: usdTwd.history },
      sox: { value: soxCurrent === null ? 'N/A' : soxCurrent.toFixed(2)+'%', status: soxStatus, text: soxCurrent === null ? 'Error' : soxText, history: soxHistory },
      ismProxy: { value: ismCurrent === null ? 'N/A' : ismCurrent.toFixed(2)+'%', status: ismStatus, text: indpro.isError ? 'FRED API Error' : ismText, history: indpro.history },
      cryptoFng: { value: cryptoFng.isError ? 'N/A' : (cryptoFng.current ? cryptoFng.current.toString() : 'N/A'), status: cryptoFngStatus as any, text: cryptoFngText, history: cryptoFng.history },
      bitcoin: { value: btcValueStr, status: btcStatus as any, text: btcText, history: btc.history },
      walcl: { value: walcl.isError ? 'N/A' : walclValueStr, status: walclStatus, text: walcl.isError ? 'FRED API Error' : walclText, history: walcl.history.map(h => ({date: h.date, value: h.value / 1000000})) },
      rrpontsyd: { value: rrp.isError ? 'N/A' : (rrp.current ? `$${rrp.current.toFixed(0)}B` : 'N/A'), status: rrpStatus, text: rrp.isError ? 'FRED API Error' : rrpText, history: rrp.history },
      fedfunds: { value: fedfunds.isError ? 'N/A' : (fedfunds.current ? fedfunds.current.toFixed(2)+'%' : 'N/A'), status: fedStatus, text: fedfunds.isError ? 'FRED API Error' : fedText, history: fedfunds.history },
      icsa: { value: icsa.isError ? 'N/A' : icsaValueStr, status: icsaStatus, text: icsa.isError ? 'FRED API Error' : icsaText, history: icsa.history.map(h => ({date: h.date, value: h.value / 1000})) },
      jtsjol: { value: jtsjol.isError ? 'N/A' : jtsjolValueStr, status: jtsjolStatus, text: jtsjol.isError ? 'FRED API Error' : jtsjolText, history: jtsjol.history.map(h => ({date: h.date, value: h.value / 1000})) },
      houst: { value: houst.isError ? 'N/A' : houstValueStr, status: houstStatus, text: houst.isError ? 'FRED API Error' : houstText, history: houst.history.map(h => ({date: h.date, value: h.value / 1000})) },
      mortgage30us: { value: mort.isError ? 'N/A' : (mort.current ? mort.current.toFixed(2)+'%' : 'N/A'), status: mortStatus, text: mort.isError ? 'FRED API Error' : mortText, history: mort.history },
      t10yie: { value: t10yie.isError ? 'N/A' : (t10yie.current ? t10yie.current.toFixed(2)+'%' : 'N/A'), status: t10Status, text: t10yie.isError ? 'FRED API Error' : t10Text, history: t10yie.history },
      pcepilfe: { value: pce.isError ? 'N/A' : (pce.current ? pce.current.toFixed(2)+'%' : 'N/A'), status: pceStatus, text: pce.isError ? 'FRED API Error' : pceText, history: pce.history },
      drcc: { value: drcc.isError ? 'N/A' : (drcc.current ? drcc.current.toFixed(2)+'%' : 'N/A'), status: drccStatus, text: drcc.isError ? 'FRED API Error' : drccText, history: drcc.history },
      spy: { history: spy.history },
      twii: { history: twii.history }
    };
  } catch (error: any) {
    console.error("Error fetching market data:", error);
    const errObj = { value: 0, status: 'loading' as const, text: 'Error', history: [] };
    return { cape: errObj, breadth: errObj, buffett: errObj, sahm: errObj, copperGold: errObj, sloos: errObj, yieldCurve: errObj, vix: errObj, skew: errObj, creditSpreads: errObj, fearGreed: errObj, marginDebt: errObj, m2: errObj, dxy: errObj, nfci: errObj, taiwanBusinessIndicator: errObj, taiwanForeignBuy: errObj, taiwanMargin: errObj, taiwanM1BM2: errObj, taiwanExport: errObj, usdTwd: errObj, sox: errObj, ismProxy: errObj, cryptoFng: errObj, bitcoin: errObj, walcl: errObj, rrpontsyd: errObj, fedfunds: errObj, icsa: errObj, jtsjol: errObj, houst: errObj, mortgage30us: errObj, t10yie: errObj, pcepilfe: errObj, drcc: errObj, spy: { history: [] }, twii: { history: [] } };
  }
});


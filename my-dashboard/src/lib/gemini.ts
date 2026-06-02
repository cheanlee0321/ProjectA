import { GoogleGenerativeAI } from "@google/generative-ai";
import { MarketData } from "./indicators";
import { unstable_cache } from 'next/cache';
import { fetchMarketData } from './indicators';

export async function generateMarketSummary(data: MarketData, apiKey: string) {
  if (!apiKey) {
    return "錯誤：未設定 GEMINI_API_KEY，請先至設定頁面填寫。";
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  // Choose the model recommended for fast text generation
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
你是一位頂尖的華爾街量化分析師與總體經濟學家。請根據以下最新的股市風險指標數據，為我撰寫一份簡潔、專業的「AI 執行摘要 (Executive Summary)」。

【市場估值與結構】
- CAPE 席勒本益比: ${data.cape.value} (${data.cape.text}) [燈號: ${data.cape.status}]
- 市場廣度 (RSP/SPY): ${data.breadth.value} (${data.breadth.text}) [燈號: ${data.breadth.status}]
- 巴菲特指標: ${data.buffett.value} (${data.buffett.text}) [燈號: ${data.buffett.status}]

【流動性與政策】
- 聯準會總資產 (WALCL): ${data.walcl.value} (${data.walcl.text}) [燈號: ${data.walcl.status}]
- 隔夜附賣回 (RRP): ${data.rrpontsyd.value} (${data.rrpontsyd.text}) [燈號: ${data.rrpontsyd.status}]
- 聯邦基準利率: ${data.fedfunds.value} (${data.fedfunds.text}) [燈號: ${data.fedfunds.status}]
- M2 貨幣供給 YoY: ${data.m2.value} (${data.m2.text}) [燈號: ${data.m2.status}]
- 美元指數 (DXY): ${data.dxy.value} (${data.dxy.text}) [燈號: ${data.dxy.status}]

【就業與實體經濟】
- 薩姆規則衰退指標: ${data.sahm.value} (${data.sahm.text}) [燈號: ${data.sahm.status}]
- 初領失業救濟金: ${data.icsa.value} (${data.icsa.text}) [燈號: ${data.icsa.status}]
- JOLTs 職缺數: ${data.jtsjol.value} (${data.jtsjol.text}) [燈號: ${data.jtsjol.status}]
- 新屋開工數: ${data.houst.value} (${data.houst.text}) [燈號: ${data.houst.status}]
- 30年期房貸利率: ${data.mortgage30us.value} (${data.mortgage30us.text}) [燈號: ${data.mortgage30us.status}]
- 費城半導體 (SOX) YoY: ${data.sox.value} (${data.sox.text}) [燈號: ${data.sox.status}]
- 美國工業生產 YoY: ${data.ismProxy.value} (${data.ismProxy.text}) [燈號: ${data.ismProxy.status}]
- 銅金比: ${data.copperGold.value} (${data.copperGold.text}) [燈號: ${data.copperGold.status}]

【通膨與消費者體質】
- 10年期通膨預期 (T10YIE): ${data.t10yie.value} (${data.t10yie.text}) [燈號: ${data.t10yie.status}]
- 核心 PCE YoY: ${data.pcepilfe.value} (${data.pcepilfe.text}) [燈號: ${data.pcepilfe.status}]
- 信用卡違約率: ${data.drcc.value} (${data.drcc.text}) [燈號: ${data.drcc.status}]

【信用風險與情緒】
- 金融條件指數 (NFCI): ${data.nfci.value} (${data.nfci.text}) [燈號: ${data.nfci.status}]
- VIX 恐慌指數: ${data.vix.value} (${data.vix.text}) [燈號: ${data.vix.status}]
- SKEW 黑天鵝指數: ${data.skew.value} (${data.skew.text}) [燈號: ${data.skew.status}]
- 信用利差 (High Yield): ${data.creditSpreads.value} (${data.creditSpreads.text}) [燈號: ${data.creditSpreads.status}]
- 銀行放款意願 (SLOOS): ${data.sloos.value} (${data.sloos.text}) [燈號: ${data.sloos.status}]
- 殖利率曲線 (10Y-2Y): ${data.yieldCurve.value} (${data.yieldCurve.text}) [燈號: ${data.yieldCurve.status}]
- CNN 恐懼與貪婪: ${data.fearGreed.value} (${data.fearGreed.text}) [燈號: ${data.fearGreed.status}]
- FINRA 融資餘額: ${data.marginDebt.value} (${data.marginDebt.text}) [燈號: ${data.marginDebt.status}]

【台灣專屬指標】
- 外資現貨買賣超: ${data.taiwanForeignBuy.value} (${data.taiwanForeignBuy.text}) [燈號: ${data.taiwanForeignBuy.status}]
- 台灣上市融資餘額: ${data.taiwanMargin.value} (${data.taiwanMargin.text}) [燈號: ${data.taiwanMargin.status}]
- M1B 與 M2 剪刀差: ${data.taiwanM1BM2.value} (${data.taiwanM1BM2.text}) [燈號: ${data.taiwanM1BM2.status}]
- 台灣出口總值 (YoY): ${data.taiwanExport.value} (${data.taiwanExport.text}) [燈號: ${data.taiwanExport.status}]
- 台幣匯率 (USD/TWD): ${data.usdTwd.value} (${data.usdTwd.text}) [燈號: ${data.usdTwd.status}]

【加密貨幣與投機情緒】
- Crypto 恐懼與貪婪: ${data.cryptoFng.value} (${data.cryptoFng.text}) [燈號: ${data.cryptoFng.status}]
- 比特幣走勢: ${data.bitcoin.value} (${data.bitcoin.text}) [燈號: ${data.bitcoin.status}]

請依循以下架構撰寫：
1. **整體盤勢與風險總結** (50-80 字)：綜合上述各面向，評估當前整體系統性風險程度。
2. **⚠️ 紅燈警示與具體避險建議**：請「特別挑出」上述資料中標示為 \`red\` 或 \`yellow\` 的指標 (尤其優先處理紅燈)。針對這些危險訊號，給出明確、具體的避險策略與資金控管建議 (例如：降低科技股部位、增加現金比重、轉入防禦性類股或短天期美債等)。若目前完全無紅黃燈，請給出適當的持股建議或預防性提示。
3. **台灣市場與投機資金觀察** (50字內)：針對台灣專屬指標及加密貨幣情緒，給出簡短的資金流向評估。

請使用繁體中文，語氣保持客觀、專業、精準，重點使用條列式以利閱讀。
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini AI Error:", error);
    if (error.message && error.message.includes("API key not valid")) {
      return "AI 生成失敗：您提供的 Gemini API Key 無效，請檢查設定。";
    }
    return "AI 生成失敗，請稍後再試。";
  }
}

// Use globalThis to persist cache across hot-reloads in development
const globalCache = globalThis as unknown as {
  geminiSummaryCache?: {
    [key: string]: {
      text: string;
      date: string;
      timestamp: number;
    }
  }
};

if (!globalCache.geminiSummaryCache) {
  globalCache.geminiSummaryCache = {};
}

export function clearSummaryCache() {
  if (globalCache.geminiSummaryCache) {
    globalCache.geminiSummaryCache = {};
  }
}

// 透過傳入金鑰作為參數，Next.js 的 unstable_cache 會自動將參數進行雜湊 (Hash) 並加入快取鍵值中。
// 這意味著不同金鑰會產生獨立的快取，確保使用者之間的資料完全隔離。
const generateAndCacheSummary = unstable_cache(
  async (geminiApiKey: string, finmindToken: string) => {
    if (!geminiApiKey) {
      return { text: "請先至設定頁面填寫您的 Google Gemini API Key 以解鎖 AI 市場解讀功能。", date: "" };
    }

    const data = await fetchMarketData(finmindToken);
    const text = await generateMarketSummary(data, geminiApiKey);
    
    const date = new Date().toLocaleString('zh-TW', { 
      timeZone: 'Asia/Taipei',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return { text, date };
  },
  ['gemini-market-summary-daily-dynamic'],
  { 
    revalidate: 86400,
    tags: ['gemini-market-summary-daily-dynamic'] 
  } // Cache for 24 hours
);

export async function getCachedMarketSummary(geminiApiKey: string, finmindToken: string) {
  const cacheKey = `${geminiApiKey}-${finmindToken}`;
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  // Check in-memory cache first (prevents regeneration on every entry in dev mode)
  if (
    globalCache.geminiSummaryCache && 
    globalCache.geminiSummaryCache[cacheKey] && 
    (now - globalCache.geminiSummaryCache[cacheKey].timestamp < ONE_DAY_MS)
  ) {
    return {
      text: globalCache.geminiSummaryCache[cacheKey].text,
      date: globalCache.geminiSummaryCache[cacheKey].date
    };
  }

  // Fallback to unstable_cache (for production / Vercel Data Cache)
  const result = await generateAndCacheSummary(geminiApiKey, finmindToken);

  // Save to in-memory cache
  if (globalCache.geminiSummaryCache) {
    globalCache.geminiSummaryCache[cacheKey] = {
      text: result.text,
      date: result.date,
      timestamp: now
    };
  }

  return result;
}


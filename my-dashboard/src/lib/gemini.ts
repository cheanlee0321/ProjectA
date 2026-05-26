import { GoogleGenerativeAI } from "@google/generative-ai";
import { MarketData } from "./indicators";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateMarketSummary(data: MarketData) {
  if (!apiKey) {
    return "錯誤：未設定 GEMINI_API_KEY 環境變數。";
  }

  // Choose the model recommended for fast text generation
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
你是一位頂尖的華爾街量化分析師與總體經濟學家。請根據以下最新的股市風險指標數據，為我撰寫一份簡潔、專業的「AI 執行摘要 (Executive Summary)」。

【市場估值與結構】
- CAPE 席勒本益比: ${data.cape.value} (${data.cape.text}) [燈號: ${data.cape.status}]
- 市場廣度 (RSP/SPY): ${data.breadth.value} (${data.breadth.text}) [燈號: ${data.breadth.status}]
- 巴菲特指標: ${data.buffett.value} (${data.buffett.text}) [燈號: ${data.buffett.status}]

【總體經濟與流動性】
- M2 貨幣供給 YoY: ${data.m2.value} (${data.m2.text}) [燈號: ${data.m2.status}]
- 美元指數 (DXY): ${data.dxy.value} (${data.dxy.text}) [燈號: ${data.dxy.status}]
- 薩姆規則 (Sahm): ${data.sahm.value} (${data.sahm.text}) [燈號: ${data.sahm.status}]
- 銅金比: ${data.copperGold.value} (${data.copperGold.text}) [燈號: ${data.copperGold.status}]
- 銀行放款意願 (SLOOS): ${data.sloos.value} (${data.sloos.text}) [燈號: ${data.sloos.status}]
- 殖利率曲線 (10Y-2Y): ${data.yieldCurve.value} (${data.yieldCurve.text}) [燈號: ${data.yieldCurve.status}]

【信用風險與情緒】
- 金融條件指數 (NFCI): ${data.nfci.value} (${data.nfci.text}) [燈號: ${data.nfci.status}]
- VIX 恐慌指數: ${data.vix.value} (${data.vix.text}) [燈號: ${data.vix.status}]
- SKEW 黑天鵝指數: ${data.skew.value} (${data.skew.text}) [燈號: ${data.skew.status}]
- 信用利差 (High Yield): ${data.creditSpreads.value} (${data.creditSpreads.text}) [燈號: ${data.creditSpreads.status}]
- CNN 恐懼與貪婪: ${data.fearGreed.value} (${data.fearGreed.text}) [燈號: ${data.fearGreed.status}]
- 融資餘額: ${data.marginDebt.value} (${data.marginDebt.text}) [燈號: ${data.marginDebt.status}]

請分別針對「市場估值與結構」、「總體經濟與流動性」、「信用風險與情緒」這三個面向，各用 50-80 字總結當前狀況與潛在風險。
最後，給出一段 50 字以內的「整體投資建議」。
請使用繁體中文，語氣保持客觀、專業、精準。
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "AI 生成失敗，請稍後再試。";
  }
}

import { unstable_cache } from 'next/cache';
import { fetchMarketData } from './indicators';

export const getCachedMarketSummary = unstable_cache(
  async () => {
    const data = await fetchMarketData();
    const text = await generateMarketSummary(data);
    
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
  ['gemini-market-summary-daily'],
  { revalidate: 86400 } // Cache for 24 hours
);


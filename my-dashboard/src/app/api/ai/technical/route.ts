import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';
import { analyzeTechnicalIndicators } from '@/lib/technical';

// 允許最長執行 60 秒 (若在 Vercel Pro/Enterprise 才有效)
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { ticker, geminiApiKey, geminiModel, latestPrice, forceRefresh, historicalPrices = [] } = await req.json();

    if (!geminiApiKey) {
      return NextResponse.json({ error: '未設定 Gemini API Key' }, { status: 400 });
    }

    if (!historicalPrices || historicalPrices.length === 0) {
      return NextResponse.json({ error: '無足夠的歷史股價資料以進行技術分析' }, { status: 400 });
    }

    // 1. 檢查 Supabase 是否有快取 (技術面更新較快，我們設定 1 天快取即可)
    if (user && !forceRefresh) {
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data: cachedReport } = await supabase
        .from('ai_reports')
        .select('report_content, updated_at')
        .eq('ticker', ticker + '_TECHNICAL') // 使用後綴區分基本面和技術面快取
        .eq('user_id', user.id)
        .maybeSingle();

      if (cachedReport && new Date(cachedReport.updated_at) > oneDayAgo) {
        return NextResponse.json({ 
          cached: true, 
          text: cachedReport.report_content,
          updatedAt: cachedReport.updated_at
        });
      }
    }

    // 2. 準備 Gemini 模型
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ 
      model: geminiModel || "gemini-2.5-flash",
      // @ts-ignore
      tools: [{ googleSearch: {} }] 
    });

    // 3. 計算最新技術指標
    const prices = historicalPrices.map((p: any) => p.close);
    const tech = analyzeTechnicalIndicators(prices);

    const prompt = `
# 角色設定
你是一位擅長技術分析與量化交易的華爾街操盤手。你能夠根據股價走勢與技術指標 (RSI, MACD) 快速判斷目前的市場多空情緒與潛在轉折點。

# 任務目標
請針對股票代碼：${ticker} 進行最新的技術面深度解析。
你必須強制使用網頁搜尋功能，快速確認該股票最近幾天的重大新聞，以輔助判斷技術面的異動原因。

# 系統提供數據
目前最新收盤價：${latestPrice || '未知'}
1. RSI (14天)：${tech.rsi ? tech.rsi.toFixed(2) : '無'} (${tech.rsiStatus})
2. MACD (12, 26, 9)：${tech.macd?.MACD ? tech.macd.MACD.toFixed(3) : '無'} (${tech.macdStatus})

# 輸出格式與架構要求
請使用繁體中文，善用 Markdown 語法，給出精簡俐落的分析。

## 📊 技術面總結 (Technical Summary)
* 簡述目前趨勢是強勢多頭、空頭還是震盪盤整。
* 綜合 RSI 與 MACD 判斷目前的市場情緒（例如：是否過熱、有無背離跡象、動能是否增強）。

## 🎯 關鍵指標解析 (Indicator Analysis)
* **RSI 狀態**：分析 RSI 數值，若進入超買/超賣區，提醒可能的反轉風險。
* **MACD 狀態**：說明快線與慢線的交叉情況，判斷短期動能方向與力道。
* **近期催化劑 (Catalyst)**：根據你搜尋到的最新新聞，用一句話點出影響近期走勢的可能原因。

## 💡 操盤手建議 (Trading Action)
* 基於上述技術面與消息面數據，針對「短線操作」給予具體建議（例如：逢低佈局、嚴設停損、等待突破、獲利了結等）。
    `;

    // 4. 呼叫 Streaming API
    const result = await model.generateContentStream(prompt);
    
    // 5. 建立可讀取串流
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullText = '';
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullText += chunkText;
            controller.enqueue(encoder.encode(chunkText));
          }
          
          if (user) {
            await supabase.from('ai_reports').upsert({
              ticker: ticker + '_TECHNICAL',
              user_id: user.id,
              report_content: fullText,
              updated_at: new Date().toISOString()
            }, { onConflict: 'ticker,user_id' });
          }

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache, no-transform',
      }
    });

  } catch (error: any) {
    console.error("AI Technical Report Route Error:", error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}

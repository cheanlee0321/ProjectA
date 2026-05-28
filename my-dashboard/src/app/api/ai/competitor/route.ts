import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { ticker, geminiApiKey, geminiModel, data, forceRefresh } = await req.json();

    if (!geminiApiKey) {
      return NextResponse.json({ error: '未設定 Gemini API Key' }, { status: 400 });
    }

    const cacheTickerKey = `${ticker}_COMPETITOR`;

    // 1. 檢查 Supabase 是否有 30 天內的快取 (1個月) - 僅限有登入的使用者，且未要求強迫刷新
    if (user && !forceRefresh) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: cachedReport } = await supabase
        .from('ai_reports')
        .select('report_content, updated_at')
        .eq('ticker', cacheTickerKey)
        .eq('user_id', user.id)
        .maybeSingle();

      if (cachedReport && new Date(cachedReport.updated_at) > thirtyDaysAgo) {
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

    const prompt = `
# 角色設定
你是一位華爾街頂尖的股票分析師。你擅長透過深度研究產業鏈，分析企業競爭優勢、護城河狀態與市場估值，並給出具體的投資洞察。

# 任務目標
請針對股票代碼：${ticker} 進行最新的「同業比較與競爭優勢分析」。
你必須強制使用網頁搜尋功能，找出該公司的「主要競爭對手」（例如：若為 Intel 則需對比 AMD，若為台積電則對比三星與 Intel 等）。

以下為系統目前抓取到的財務數據摘要供你參考，請結合你搜尋到的最新同業資訊進行分析：
公司簡介：${data?.profile?.description || '無'}
目前股價：${data?.profile?.price || '無'}
所屬產業：${data?.profile?.industry || '無'}

# 輸出格式與架構要求
請使用繁體中文，善用 Markdown 語法與「表格」，確保結構清晰專業。

## 📍 【分析目標與競爭對手】
*(請條列式指出該公司的 2~3 家主要競爭對手)*

## 1. 核心業務護城河對比
*   分析 ${ticker} 的核心競爭力與護城河（如：技術領先、規模經濟、品牌忠誠度、網絡效應等）。
*   對比競爭對手，指出 ${ticker} 的護城河是否穩固，或正在遭受威脅。

## 2. 近期財報與市佔率表現
*   比較 ${ticker} 與競爭對手在最新一季的營收成長率與市佔率變化。
*   指出誰在所屬產業中展現了更強的動能（Momentum）。

## 3. 估值對比 (Valuation Comparison)
*   根據搜尋到的最新數據，比較 ${ticker} 與主要對手的估值水準（如：本益比 P/E、企業價值倍數 EV/EBITDA、股價營收比 P/S 等）。
*   評估 ${ticker} 的估值是溢價還是折價，以及背後的原因是否合理。

## 4. 技術與市場優劣勢分析
*   使用表格列出 ${ticker} 與其競爭對手的「優勢 (Strengths)」與「劣勢 (Weaknesses)」。

## 5. 分析師總結建議
*   給出一小段總結，對於 ${ticker} 在當前競爭格局下的投資吸引力給予評價，並提醒投資人應關注的潛在風險。
    `;

    // 3. 呼叫 Streaming API
    const result = await model.generateContentStream(prompt);
    
    // 4. 建立可讀取串流 (ReadableStream) 回傳給前端
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
              ticker: cacheTickerKey,
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
    console.error("AI Competitor Route Error:", error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}

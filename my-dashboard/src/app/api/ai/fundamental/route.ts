import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

// 允許最長執行 60 秒 (若在 Vercel Pro/Enterprise 才有效，但我們用串流可一定程度避免 Timeout)
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { ticker, geminiApiKey, geminiModel, data, forceRefresh } = await req.json();

    if (!geminiApiKey) {
      return NextResponse.json({ error: '未設定 Gemini API Key' }, { status: 400 });
    }

    // 1. 檢查 Supabase 是否有 30 天內的快取 (1個月) - 僅限有登入的使用者，且未要求強迫刷新
    if (user && !forceRefresh) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: cachedReport } = await supabase
        .from('ai_reports')
        .select('report_content, updated_at')
        .eq('ticker', ticker)
        .eq('user_id', user.id)
        .maybeSingle();

      if (cachedReport && new Date(cachedReport.updated_at) > thirtyDaysAgo) {
        // 若有快取，直接以字串形式一次回傳 (不需串流)
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
      // @ts-ignore - SDK type might not perfectly match, but this enables Google Search Grounding
      tools: [{ googleSearch: {} }] 
    });

    const prompt = `
# 角色設定
你是一位華爾街頂尖的股票分析師。你擅長透過深度閱讀最新的財報 (Earnings Release) 與法說會逐字稿 (Earnings Call Transcript)，來挖掘市場忽略的細節、管理層的隱含情緒 (Sentiment)，並給出具體的投資洞察。

# 任務目標
請針對股票代碼：${ticker} 進行最新的財報與法說會深度解析。
你必須強制使用網頁搜尋功能，找出該公司「最新一次」的財報發布與法說會內容。

以下為系統目前抓取到的財務數據摘要供你參考，請將此資料與你搜尋到的最新法說會資訊結合分析：
公司簡介：${data?.profile?.description || '無'}
目前股價：${data?.profile?.price || '無'}
所屬產業：${data?.profile?.industry || '無'}

# 輸出格式與架構要求
請使用繁體中文，善用 Markdown 語法與「表格」，確保結構清晰專業。

## 📍 【最新財報發布日期】：YYYY-MM-DD
*(請務必在報告最上方明確標示出你搜尋到的最新財報發布確切日期)*

## 1. 財報「驚喜」與「驚嚇」 (Earnings Surprises)
*   條列式總結本季營收與獲利是否擊敗市場預期 (Beat/Miss)。
*   點出財報中最令人意外的亮點 (Surprise) 或隱憂 (Disappointment)。

## 2. CEO/CFO 談話情緒與前瞻指引 (Management Sentiment & Guidance)
*   **情緒分析**：管理層在法說會上的語氣是樂觀、保守還是防禦性？
*   **前瞻指引 (Guidance)**：管理層對下一季或全年的營收/利潤預期為何？有沒有下修或上調展望？

## 3. Q&A 環節：分析師最尖銳的問題
*   統整法說會最後的問答時間 (Q&A) 中，華爾街分析師們最關心、或最具攻擊性的 2~3 個問題。
*   總結管理層是如何回應這些敏感問題的（有沒有避重就輕？）。

## 4. 競爭對手對比與護城河狀態
*   簡短提及 1~2 家主要競爭對手（如：台積電對比三星，Intel 對比 AMD）。
*   分析該公司在本季的表現是否從對手手中奪取了市佔率，或是護城河遭受威脅。

## 5. 分析師總結建議
*   給出一小段總結，對於這份財報的整體看法，以及給投資人的後續關注焦點。
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
          
          // 串流結束後，若有登入才將完整內容寫入 Supabase 快取
          if (user) {
            await supabase.from('ai_reports').upsert({
              ticker,
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
    console.error("AI Report Route Error:", error);
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}

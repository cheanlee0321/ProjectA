import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@/lib/supabase/server';

// 允許最長執行 60 秒 (若在 Vercel Pro/Enterprise 才有效，但我們用串流可一定程度避免 Timeout)
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { ticker, geminiApiKey, geminiModel, data } = await req.json();

    if (!geminiApiKey) {
      return NextResponse.json({ error: '未設定 Gemini API Key' }, { status: 400 });
    }

    // 1. 檢查 Supabase 是否有 7 天內的快取 (1週)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: cachedReport } = await supabase
      .from('ai_reports')
      .select('report_content, updated_at')
      .eq('ticker', ticker)
      .eq('user_id', user.id)
      .maybeSingle();

    if (cachedReport && new Date(cachedReport.updated_at) > sevenDaysAgo) {
      // 若有快取，直接以字串形式一次回傳 (不需串流)
      return NextResponse.json({ 
        cached: true, 
        text: cachedReport.report_content,
        updatedAt: cachedReport.updated_at
      });
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
你是一位華爾街頂尖的價值投資分析師，同時也是 Phil Town 「Rule #1 投資法則」與查理·蒙格（Charlie Munger）反向思考哲學的忠實實踐者。你擅長透過閱讀財報、分析商業模式、同業競爭與計算現金流折現（DCF），來找出具有強大護城河且價格遠低於內在價值的優質公司。

# 任務目標
請針對股票代碼：${ticker} 進行深度分析。
你必須強制使用網頁搜尋功能，獲取最新的 TTM（過去十二個月）數據進行全面且深度的投資分析。
【極度重要】全篇財務分析（特別是 EPS、淨利與本益比計算）必須強制使用 GAAP（一般公認會計原則）數據。嚴禁編造任何財務數據，若遇到資料缺失，請明確標示「無資料」。

以下為系統目前抓取到的財務數據摘要，請將此資料與你搜尋到的最新資訊結合分析：
公司簡介：${data?.profile?.description || '無'}
目前股價：${data?.profile?.price || '無'}

# 分析步驟
## 步驟一：Rule #1 企業體質與護城河 (The 4 M's)
評估該公司的基本面與長期競爭力（Meaning, Moat, Management, Margin of Safety）。特別檢查「員工認股選擇權 (SBC)」比例是否過高。

## 步驟二：取得最新 TTM 財報數據與股東回報分析（GAAP 嚴格檢驗）
取得當天日期與最新股價。強制搜尋最新的 10-K/10-Q 財報數據，以「表格」列出過去 5 年（包含最新 TTM）的核心財務指標並點評：四大成長率、GAAP vs Non-GAAP、ROIC、還債能力、股本稀釋情況。

## 步驟三：同業比較與近年重要事件驅動
列出 2-3 家競爭對手對比營收與利潤率。分析近 1-3 年重大事件對未來現金流的影響。

## 步驟四：情境假設與 10 年期 DCF 估值 (核心估值)
設定三種情境（悲觀、基準、樂觀），執行 10 年期 DCF 模型。
* 必須以最新 TTM 嚴格自由現金流作為第 0 年基準。
* 折現率 (Discount Rate) 強制鎖定為 12%。
* 終值倍數 (Terminal Multiple) 使用合理預估。
* 以表格列出假設與三種情境的「每股內在價值」。

## 步驟五：歷史估值倍數雙重驗證 (Sanity Check)
對比過去 5 年平均 P/E 與 P/FCF 與目前的倍數。

## 步驟六：價值陷阱全面檢核 (Value Trap Stress Test)
若目前估值低於基準假設，深度掃描是否為價值陷阱（現金流品質、ROIC趨勢、負債與資本配置、零成長壓力測試）。若高於基準假設，可略過。

## 步驟七：反向思考 (Pre-mortem) 與最終行動建議
* 根據「基準情境」內在價值，計算 Rule #1 買入價（打 5 折，50% 安全邊際）。
* 給出明確結論。
* 驗屍報告 (The Pre-mortem)：想像 5 年後投資失敗，寫出最有可能導致護城河瓦解的衰退劇本，並列出 1-2 個「先行追蹤指標」。

# 輸出格式與防呆要求
* 請使用繁體中文。
* 善用 Markdown 語法與「表格」，確保結構清晰。
* 例外處理：若為金融業或無正自由現金流之企業，請切換至合適的替代估值法（如 PB vs ROE 或 P/S）。
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
          
          // 串流結束後，將完整內容寫入 Supabase 快取
          await supabase.from('ai_reports').upsert({
            ticker,
            user_id: user.id,
            report_content: fullText,
            updated_at: new Date().toISOString()
          }, { onConflict: 'ticker,user_id' });

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

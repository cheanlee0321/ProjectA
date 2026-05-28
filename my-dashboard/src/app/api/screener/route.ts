import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import yahooFinanceModule from 'yahoo-finance2';

const yahooFinance = new (yahooFinanceModule as any)();

// 將 Yahoo Finance 查詢邏輯獨立出來
async function fetchScreenerData(scrId: string) {
    const queryOptions = { count: 50 };
    const result = await yahooFinance.screener({ scrIds: scrId }, queryOptions);

    if (!result || !result.quotes || result.quotes.length === 0) {
        throw new Error('找不到符合條件的股票');
    }

    // 整理需要的欄位
    return result.quotes.map((quote: any) => ({
        symbol: quote.symbol,
        shortName: quote.shortName || quote.longName || 'N/A',
        marketCap: quote.marketCap ? formatNumber(quote.marketCap) : 'N/A',
        price: quote.regularMarketPrice ? quote.regularMarketPrice.toFixed(2) : 'N/A',
        changePercent: quote.regularMarketChangePercent ? quote.regularMarketChangePercent.toFixed(2) : '0.00',
        peRatio: quote.trailingPE ? quote.trailingPE.toFixed(2) : 'N/A',
        volume: quote.regularMarketVolume ? formatNumber(quote.regularMarketVolume) : 'N/A'
    }));
}

// 使用 unstable_cache 包裝，基於 scrId 建立獨立快取，壽命 1 天 (86400 秒)
const getCachedScreenerData = unstable_cache(
    async (scrId: string) => fetchScreenerData(scrId),
    ['screener-data'], // Cache Key base
    { revalidate: 86400, tags: ['screener'] }
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const scrId = body.scrId || 'most_actives'; 
        
        // 透過快取函式取得資料
        const formattedData = await getCachedScreenerData(scrId);

        return NextResponse.json({ success: true, data: formattedData });
        
    } catch (error: any) {
        console.error("Yahoo Finance API Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message || '抓取 Yahoo Finance 資料失敗，請稍後再試。' 
        }, { status: 500 });
    }
}

// 輔助函數：將大數字格式化為 M (百萬) 或 B (十億)
function formatNumber(num: number): string {
    if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    }
    if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    }
    return num.toLocaleString();
}

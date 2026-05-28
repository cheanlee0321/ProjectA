import { unstable_cache } from 'next/cache';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();

export const fetchHistoricalPrices = unstable_cache(
  async (ticker: string) => {
    try {
      const symbol = ticker.toUpperCase();
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 3); // Fetch 3 years of data
      const period1 = startDate.toISOString().split('T')[0];

      const chart = await yahooFinance.chart(symbol, {
        period1,
        interval: '1d'
      });

      if (!chart || !chart.quotes) {
        return [];
      }

      // 轉換成 Recharts 好用的格式，並過濾掉沒有收盤價的日期 (例如假日)
      const data = chart.quotes
        .filter(q => q.close !== null && q.close !== undefined)
        .map(q => {
          // 將日期轉換為 YYYY-MM-DD 格式
          const dateObj = new Date(q.date);
          return {
            date: dateObj.toISOString().split('T')[0],
            close: q.close
          };
        });

      return data;
    } catch (error) {
      console.error('Failed to fetch historical prices:', error);
      return [];
    }
  },
  ['historical-prices-v2'],
  { revalidate: 86400 } // 快取 1 天 (86400 秒)
);

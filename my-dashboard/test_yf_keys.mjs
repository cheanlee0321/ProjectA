import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function fetchYahooFinanceFundamentalData(ticker) {
  try {
    const symbol = ticker.toUpperCase();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5);
    const period1 = startDate.toISOString().split('T')[0];

    const tsData = await yahooFinance.fundamentalsTimeSeries(symbol, {
      period1,
      module: 'all',
      type: 'annual'
    });
    
    // just collect all keys across all items to see what is available
    const keys = new Set();
    tsData.forEach(item => {
      Object.keys(item).forEach(k => keys.add(k));
    });
    
    console.log("All available keys in tsData:");
    console.log(Array.from(keys).sort().join(', '));

  } catch (error) {
    console.error("Yahoo Finance TS Error:", error);
  }
}

fetchYahooFinanceFundamentalData('CDNS');

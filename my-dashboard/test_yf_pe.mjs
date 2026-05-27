import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

async function testChartPE(ticker) {
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
    
    // Fetch monthly historical prices
    const chart = await yahooFinance.chart(symbol, {
      period1: period1,
      interval: '1mo'
    });
    const quotes = chart.quotes;

    const metrics = [];
    tsData.forEach(_item => {
      const item = _item;
      if (!item.date) return;
      const targetDate = new Date(item.date);
      const targetDateStr = targetDate.toISOString().split('T')[0];
      
      let closestPrice = 0;
      let minDiff = Infinity;
      
      quotes.forEach(q => {
        if (!q.date) return;
        const qDate = new Date(q.date);
        const diff = Math.abs(qDate.getTime() - targetDate.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          closestPrice = q.close;
        }
      });

      const eps = item.dilutedEPS || item.basicEPS || 0;
      const earningsYield = closestPrice && eps > 0 ? (eps / closestPrice) : 0;
      
      metrics.push({
        date: targetDateStr,
        eps,
        price: closestPrice,
        earningsYield,
        impliedPE: earningsYield ? 1 / earningsYield : null
      });
    });
    
    console.log(metrics);

  } catch (error) {
    console.error("Yahoo Finance TS Error:", error);
  }
}

testChartPE('CDNS');

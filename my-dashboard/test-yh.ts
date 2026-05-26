import yahooFinance from 'yahoo-finance2';

async function run() {
  const symbol = '2330.TW';
  const quote = await yahooFinance.quote(symbol);
  console.log("Quote:", quote.shortName, quote.regularMarketPrice);

  const summary = await yahooFinance.quoteSummary(symbol, {
    modules: ['incomeStatementHistory', 'financialData', 'defaultKeyStatistics']
  });
  
  if (summary.incomeStatementHistory?.incomeStatementHistory) {
     const latest = summary.incomeStatementHistory.incomeStatementHistory[0];
     console.log("Latest Income:", latest.endDate, latest.totalRevenue, latest.netIncome);
  }
}
run().catch(console.error);

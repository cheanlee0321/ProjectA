const { YahooFinance } = require('yahoo-finance2');
const yahooFinance = new YahooFinance();

async function run() {
  try {
    const symbol = '2330.TW';
    // Quote
    const quote = await yahooFinance.quote(symbol);
    console.log("Quote:", quote.shortName, quote.regularMarketPrice);

    // Fundamentals (Income Statement etc)
    const summary = await yahooFinance.quoteSummary(symbol, {
      modules: ['incomeStatementHistory', 'financialData', 'defaultKeyStatistics']
    });
    
    console.log("Income statement length:", summary.incomeStatementHistory?.incomeStatementHistory?.length);
    if (summary.incomeStatementHistory?.incomeStatementHistory) {
       const latest = summary.incomeStatementHistory.incomeStatementHistory[0];
       console.log("Latest Income Statement Date:", latest.endDate);
       console.log("Revenue:", latest.totalRevenue);
       console.log("Net Income:", latest.netIncome);
    }

    console.log("Financial Data keys:", Object.keys(summary.financialData || {}));
    console.log("Key Stats keys:", Object.keys(summary.defaultKeyStatistics || {}));

  } catch (error) {
    console.error(error);
  }
}
run();

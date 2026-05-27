import yahooFinance from 'yahoo-finance2';

async function main() {
  try {
    const res = await yahooFinance.quoteSummary('2330.TW', {
      modules: ['defaultKeyStatistics', 'financialData', 'price']
    });
    console.log(JSON.stringify(res, null, 2));
  } catch (e) {
    console.error(e);
  }
}

main();

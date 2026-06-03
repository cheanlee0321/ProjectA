import YahooFinance from 'yahoo-finance2';

async function checkTickers() {
  const tickers = ['^CPC', '^CPCE', '^PCR'];
  for (const t of tickers) {
    try {
      const res = await YahooFinance.quote(t);
      console.log(`${t} found:`, res.regularMarketPrice);
    } catch(e) {
      console.log(`${t} not found or error.`);
    }
  }
}
checkTickers();

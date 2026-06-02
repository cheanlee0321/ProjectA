import fs from 'fs';
async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const key = env.match(/FRED_API_KEY=([^\n\r]+)/)[1].trim();

  const curRes = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=MBCURRCIR&api_key=${key}&file_type=json&sort_order=desc&limit=1`);
  const curData = await curRes.json();
  const curVal = parseFloat(curData.observations[0].value);
  const curDate = curData.observations[0].date;

  const spyRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=1mo');
  const spyData = await spyRes.json();
  const spyQuotes = spyData.chart.result[0].indicators.quote[0].close;
  const spyLatest = spyQuotes[spyQuotes.length - 1];

  console.log('Latest MBCURRCIR:', curVal, 'at', curDate);
  console.log('Latest SPY:', spyLatest);
  console.log('Ratio:', (spyLatest / curVal).toFixed(4));
}
run();

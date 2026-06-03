import fs from 'fs';
async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const key = env.match(/FRED_API_KEY=([^\n\r]+)/)[1].trim();

  const m2Res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=M2SL&api_key=${key}&file_type=json&sort_order=desc&limit=5`);
  const m2Data = await m2Res.json();
  console.log('M2SL recent:', m2Data.observations.slice(0, 3));

  const spyRes = await fetch('https://query1.finance.yahoo.com/v8/finance/chart/SPY?interval=1d&range=5d');
  const spyData = await spyRes.json();
  const spyQuotes = spyData.chart.result[0].indicators.quote[0].close;
  const spyLatest = spyQuotes.filter(v => v !== null).pop();
  console.log('SPY latest:', spyLatest);

  const m2Val = parseFloat(m2Data.observations[0].value);
  console.log('M2 latest:', m2Val, '(Billions)');
  console.log('SPY / M2 =', (spyLatest / m2Val).toFixed(6));
}
run();

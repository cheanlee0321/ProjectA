import fs from 'fs';
async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const keyMatch = env.match(/FRED_API_KEY=([^\n\r]+)/);
  if (!keyMatch) {
     console.log('No FRED key');
     return;
  }
  const key = keyMatch[1].trim();

  const series = ['SAHMREALTIME', 'DRTSCILM', 'T10Y2Y', 'BAMLH0A0HYM2', 'WILL5000PR', 'GDP', 'M2SL', 'NFCI', 'WALCL', 'WRESBAL', 'FEDFUNDS', 'ICSA', 'JTSJOL', 'HOUST', 'MORTGAGE30US', 'T10YIE', 'PCEPILFE', 'DRCCRVACBS', 'INDPRO', 'MBCURRCIR'];
  
  const promises = series.map(async s => {
     try {
       const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${s}&api_key=${key}&file_type=json&sort_order=desc&limit=1`);
       console.log(s, res.status);
     } catch (e) {
       console.log(s, 'Error', e.message);
     }
  });

  await Promise.all(promises);
}
run();

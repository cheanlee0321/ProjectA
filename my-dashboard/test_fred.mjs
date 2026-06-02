import fs from 'fs';
async function run() {
  const env = fs.readFileSync('.env.local', 'utf8');
  const match = env.match(/FRED_API_KEY=([^\n\r]+)/);
  if (!match) return console.log('no fred key');
  const key = match[1].trim();

  try {
    const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=MBCURRCIR&api_key=${key}&file_type=json&sort_order=desc`);
    const data = await res.json();
    console.log('MBCURRCIR (Monthly):', data.observations?.slice(0, 5));

    const res2 = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=BOGZ1FL663067003Q&api_key=${key}&file_type=json&sort_order=desc`);
    const data2 = await res2.json();
    console.log('MARGIN (Quarterly):', data2.observations?.slice(0, 5));
    
    // Check FINRA margin debt (FINRA's own) is NOT on FRED, wait BOGZ1FL663067003Q IS margin debt on FRED!
  } catch(e) {
    console.log(e);
  }
}
run();

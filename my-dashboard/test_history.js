const key = '72f7e7aac93ea6642b1709247b3f96be';

async function check() {
  try {
    // 1. Check FRED historical
    const fredRes = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=T10Y2Y&api_key=${key}&file_type=json&sort_order=desc&limit=5`);
    const fredData = await fredRes.json();
    console.log("FRED T10Y2Y:", fredData.observations.map(o => ({d: o.date, v: o.value})));

    // 2. Check CNN historical
    const cnnRes = await fetch('https://production.dataviz.cnn.io/index/fearandgreed/graphdata', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const cnnData = await cnnRes.json();
    console.log("CNN Historical:", cnnData.fear_and_greed_historical ? cnnData.fear_and_greed_historical.data.slice(0,2) : 'None');

  } catch (e) {
    console.error(e);
  }
}
check();

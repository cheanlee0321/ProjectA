const https = require('https');
const FRED_API_KEY = '72f7e7aac93ea6642b1709247b3f96be';

async function fetchFredSeries(seriesId) {
  return new Promise((resolve) => {
    https.get(`https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&sort_order=desc&units=lin`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const json = JSON.parse(data);
        const history = [];
        if (json.observations) {
            for(let obs of [...json.observations].reverse()) {
              const val = parseFloat(obs.value);
              if(!isNaN(val)) history.push({ date: obs.date, value: val });
            }
        }
        resolve(history);
      });
    });
  });
}

async function main() {
    const currcir = await fetchFredSeries('MBCURRCIR');
    const margin = await fetchFredSeries('BOGZ1FL663067003Q');
    
    console.log("Margin Last 2:", margin.slice(-2));
    console.log("Currcir Last 2:", currcir.slice(-2));
    
    let finraToCurrencyHistory = [];
    let lastMarginVal = null;
    let mIndex = 0;
    for (const c of currcir) {
       while (mIndex < margin.length && margin[mIndex].date <= c.date) {
         lastMarginVal = margin[mIndex].value;
         mIndex++;
       }
       if (lastMarginVal !== null && c.value > 0) {
          finraToCurrencyHistory.push({
            date: c.date,
            value: parseFloat((lastMarginVal / (c.value * 1000)).toFixed(4)),
            marginDate: mIndex > 0 ? margin[mIndex-1].date : null,
            marginVal: lastMarginVal,
            currcirVal: c.value
          });
       }
    }
    
    console.log("Ratio History Last 3:", finraToCurrencyHistory.slice(-3));
}

main();

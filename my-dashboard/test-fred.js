const https = require('https');

const url = `https://api.stlouisfed.org/fred/series/observations?series_id=BAA10Y&api_key=72f7e7aac93ea6642b1709247b3f96be&file_type=json&sort_order=desc&units=lin`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log("Count:", json.count);
      console.log("Observations length:", json.observations ? json.observations.length : 0);
      if (json.observations && json.observations.length > 0) {
        console.log("First (newest):", json.observations[0].date);
        console.log("Last (oldest):", json.observations[json.observations.length - 1].date);
      }
    } catch(e) {
      console.log("Parse error:", e);
    }
  });
});

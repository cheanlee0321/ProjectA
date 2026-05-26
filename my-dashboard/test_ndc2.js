async function fetchNdc() {
  try {
    const res = await fetch("https://index.ndc.gov.tw/n/json/data/10", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json"
      }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response starts with:", text.substring(0, 100));
    try {
        const json = JSON.parse(text);
        console.log("JSON keys:", Object.keys(json));
    } catch(e) {}
  } catch(e) { console.error(e); }
}
fetchNdc();

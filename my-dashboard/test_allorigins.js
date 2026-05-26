async function testAllOrigins() {
  try {
    const targetUrl = encodeURIComponent('https://index.ndc.gov.tw/n/json/data/10');
    const res = await fetch(`https://api.allorigins.win/get?url=${targetUrl}`);
    const data = await res.json();
    console.log("AllOrigins Status:", res.status);
    
    // allorigins returns { contents: "..." }
    const contents = data.contents;
    console.log("Contents starts with:", contents.substring(0, 100));
    
    if (contents && !contents.includes("Cloudflare")) {
        try {
            const parsed = JSON.parse(contents);
            console.log("Successfully parsed JSON!");
            console.log(Object.keys(parsed));
        } catch(e) {
            console.log("Not valid JSON");
        }
    }
  } catch(e) { console.error(e); }
}
testAllOrigins();

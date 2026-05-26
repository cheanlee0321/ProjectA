async function testYahooTw() {
  try {
    const res = await fetch("https://tw.stock.yahoo.com/macroeconomic/taiwan-business-indicator");
    const html = await res.text();
    // Yahoo often embeds data in a script tag with ID __NEXT_DATA__
    const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (match) {
        const data = JSON.parse(match[1]);
        // console.log(Object.keys(data.props.pageProps));
        // let's try to find the actual indicator data in the json
        console.log("Yahoo data found! Size:", html.length);
        const findScore = (obj) => {
            let str = JSON.stringify(obj);
            if(str.includes('綜合判斷分數') || str.includes('taiwan-business-indicator')) {
                console.log("Found relevant text in JSON");
                // just print a small snippet of it
                let idx = str.indexOf('綜合判斷分數');
                if (idx > -1) {
                  console.log(str.substring(idx - 100, idx + 200));
                }
            }
        }
        findScore(data);
    } else {
        console.log("Not found NEXT_DATA");
    }
  } catch(e) { console.error(e); }
}
testYahooTw();

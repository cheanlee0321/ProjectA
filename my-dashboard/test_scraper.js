async function scrapeNdc() {
  try {
    const res = await fetch("https://index.ndc.gov.tw/n/zh_tw/data/eco");
    const html = await res.text();
    // Usually the data is embedded in a <script> tag or easily parsable table.
    console.log(html.substring(0, 500));
    // check if there is '景氣對策信號'
    const idx = html.indexOf('綜合判斷分數');
    if (idx > -1) {
        console.log(html.substring(idx - 100, idx + 200));
    } else {
        console.log("Not found");
    }
  } catch(e) {
    console.error(e);
  }
}
scrapeNdc();

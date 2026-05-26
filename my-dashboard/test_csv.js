async function fetchCsv() {
  try {
    const url = "https://ws.ndc.gov.tw/Download.ashx?u=LzAwMS9hZG1pbmlzdHJhdG9yLzEwL3JlbGZpbGUvNTY0NC82NDE2L2I4YWRjZmVkLTBhNjYtNGYzOS04NWQ1LTg0ZDJlZjc1MWI5NS5jc3Y%3d&n=5pmv5rCj5oyH5qiZ6YGT5pe25bqP5YiX5Luj6KGoXzIwMjMwOTA3LmNzdg%3d%3d&icon=..csv";
    const res = await fetch(url);
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Text length:", text.length);
    console.log("First 100 chars:", text.substring(0, 100));
  } catch (e) {
    console.error(e);
  }
}
fetchCsv();

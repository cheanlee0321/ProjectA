async function testOpenApi() {
  try {
    const res = await fetch("https://openapi.ndc.gov.tw/api/v1/BusinessIndicator");
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text.substring(0, 500));
  } catch(e) { console.error(e); }
}
testOpenApi();

async function testFinmind() {
  try {
    const res1 = await fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanBusinessIndicator&start_date=2023-01-01`);
    const data1 = await res1.json();
    console.log("TaiwanBusinessIndicator without token:", JSON.stringify(data1).substring(0, 500));
  } catch(e) { console.error(e); }
}
testFinmind();

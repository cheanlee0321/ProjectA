

const FINMIND_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY2hlYW5sZWUwMzIxIiwiZW1haWwiOiJjaGVhbmxlZTAzMjFAZ21haWwuY29tIiwidG9rZW5fdmVyc2lvbiI6MH0.LxuXk1vAyDQwHx2rxHNfy0h4vz_feyB2R6EPZMAuTo8";

async function testApi() {
  console.log("Testing TaiwanBusinessIndicator...");
  const res1 = await fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanBusinessIndicator&start_date=2023-01-01&token=${FINMIND_TOKEN}`);
  const data1 = await res1.json();
  console.log("TaiwanBusinessIndicator:", data1);

  console.log("Testing TaiwanStockTotalMarginPurchaseShortSale...");
  const res2 = await fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockTotalMarginPurchaseShortSale&start_date=2024-04-01&token=${FINMIND_TOKEN}`);
  const data2 = await res2.json();
  console.log(JSON.stringify(data2.data?.slice(-2), null, 2));
}

testApi();

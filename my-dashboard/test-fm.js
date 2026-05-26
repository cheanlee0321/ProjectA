async function run() {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY2hlYW5sZWUwMzIxIiwiZW1haWwiOiJjaGVhbmxlZTAzMjFAZ21haWwuY29tIiwidG9rZW5fdmVyc2lvbiI6MH0.LxuXk1vAyDQwHx2rxHNfy0h4vz_feyB2R6EPZMAuTo8';
  
  const mRes = await fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPER&data_id=2330&start_date=2024-05-01&token=${token}`);
  const mData = await mRes.json();
  
  if (mData.data && mData.data.length > 0) {
    console.log("PER Sample:", mData.data.slice(0, 2));
  } else {
    console.log("No PER data.");
  }
}
run().catch(console.error);

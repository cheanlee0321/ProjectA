async function run() {
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY2hlYW5sZWUwMzIxIiwiZW1haWwiOiJjaGVhbmxlZTAzMjFAZ21haWwuY29tIiwidG9rZW5fdmVyc2lvbiI6MH0.LxuXk1vAyDQwHx2rxHNfy0h4vz_feyB2R6EPZMAuTo8';
  
  const mRes = await fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockBalanceSheet&data_id=2330&start_date=2022-01-01&token=${token}`);
  const mData = await mRes.json();
  
  if (mData.data && mData.data.length > 0) {
    console.log("BalanceSheet types:", [...new Set(mData.data.map(d => d.type))].join(', '));
    // Print total assets and equity
    const assets = mData.data.filter(d => d.type.includes('Asset')).slice(0, 5);
    const equity = mData.data.filter(d => d.type.includes('Equit')).slice(0, 5);
    console.log("Assets:", assets);
    console.log("Equity:", equity);
  } else {
    console.log("No BalanceSheet data.");
  }
}
run().catch(console.error);

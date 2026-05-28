

async function test() {
  const stockId = '2330';
  const startDate = '2024-04-20';
  const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockHoldingSharesPer&data_id=${stockId}&start_date=${startDate}`;
  
  console.log('Fetching:', url);
  const res = await fetch(url);
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
}

test();

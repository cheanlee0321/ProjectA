async function run() {
  const profile = await fetch("https://financialmodelingprep.com/stable/profile?symbol=2330.TW&apikey=TKhUYek10w5C7i13SWnLJgoJFr3lewlU").then(r => r.json());
  console.log("Profile Length:", profile.length);
  
  const income = await fetch("https://financialmodelingprep.com/stable/income-statement?symbol=2330.TW&limit=1&apikey=TKhUYek10w5C7i13SWnLJgoJFr3lewlU").then(r => r.json());
  console.log("Income Length:", income.length, "Data:", JSON.stringify(income[0] || income).substring(0, 200));

  const metrics = await fetch("https://financialmodelingprep.com/stable/key-metrics?symbol=2330.TW&limit=1&apikey=TKhUYek10w5C7i13SWnLJgoJFr3lewlU").then(r => r.json());
  console.log("Metrics Length:", metrics.length, "Data:", JSON.stringify(metrics[0] || metrics).substring(0, 200));
}
run();

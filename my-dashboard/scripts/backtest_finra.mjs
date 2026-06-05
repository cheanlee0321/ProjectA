import fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import YahooFinance from 'yahoo-finance2';
const yahooFinance = new YahooFinance();

const FRED_API_KEY = "72f7e7aac93ea6642b1709247b3f96be";

async function fetchFred() {
  const res = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=MBCURRCIR&api_key=${FRED_API_KEY}&file_type=json`);
  const data = await res.json();
  const history = [];
  if (data.observations) {
    for (const obs of data.observations) {
      const val = parseFloat(obs.value);
      if (!isNaN(val)) history.push({ date: obs.date, value: val });
    }
  }
  return history;
}

function fetchMargin() {
  const filePath = path.join(process.cwd(), '../Data/margin-statistics.xlsx');
  const fileBuffer = fs.readFileSync(filePath);
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
  const history = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (row && row.length >= 2) {
      let dateStr = row[0];
      if (typeof dateStr === 'string' && dateStr.length === 7) {
        dateStr = `${dateStr}-01`;
      }
      const val = parseFloat(row[1]);
      if (dateStr && !isNaN(val)) {
        history.push({ date: dateStr, value: val });
      }
    }
  }
  history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return history;
}

async function fetchYFMonthly(symbol) {
  const chart = await yahooFinance.chart(symbol, { period1: '2010-01-01', interval: '1mo' });
  return chart.quotes.map(q => ({
    date: q.date.toISOString().split('T')[0],
    price: q.close ?? 0
  })).filter(q => q.price > 0);
}

function simulateStrategy(indicatorHistory, qqqAlloc, tqqqAlloc) {
  let cash = 100000;
  let qqqShares = 0;
  let tqqqShares = 0;
  let plan = null; 
  let lastSignal = null; 
  let maxDrawdown = 0;
  let maxPortfolioValue = 0;

  for (const data of indicatorHistory) {
    const currentRatio = data.ratio;
    
    let currentSignal = 'yellow';
    if (currentRatio > 0.40) currentSignal = 'red';
    else if (currentRatio <= 0.30) currentSignal = 'green';
    
    if (currentSignal === 'green' && lastSignal !== 'green') {
      plan = { type: 'buy', remaining: 10, totalCashToDeploy: cash };
    } else if (currentSignal === 'red' && lastSignal !== 'red') {
      plan = { type: 'sell', remaining: 10, totalQQQToSell: qqqShares, totalTQQQToSell: tqqqShares };
    }
    
    if (currentSignal !== 'yellow') {
        lastSignal = currentSignal;
    }
    
    if (plan && plan.remaining > 0) {
      if (plan.type === 'buy') {
        let spend = plan.totalCashToDeploy / 10;
        spend = Math.min(spend, cash); 
        
        const qqqSpend = spend * qqqAlloc;
        const tqqqSpend = spend * tqqqAlloc;
        
        qqqShares += qqqSpend / data.qqq;
        tqqqShares += tqqqSpend / data.tqqq;
        cash -= spend;
        plan.remaining -= 1;
      } else if (plan.type === 'sell') {
        const qqqToSell = plan.totalQQQToSell / 10;
        const tqqqToSell = plan.totalTQQQToSell / 10;
        
        cash += (qqqToSell * data.qqq) + (tqqqToSell * data.tqqq);
        qqqShares -= qqqToSell;
        tqqqShares -= tqqqToSell;
        plan.remaining -= 1;
      }
    }

    const currentPortfolioValue = cash + (qqqShares * data.qqq) + (tqqqShares * data.tqqq);
    if (currentPortfolioValue > maxPortfolioValue) maxPortfolioValue = currentPortfolioValue;
    const drawdown = (maxPortfolioValue - currentPortfolioValue) / maxPortfolioValue;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  
  const lastData = indicatorHistory[indicatorHistory.length - 1];
  const finalPortfolioValue = cash + (qqqShares * lastData.qqq) + (tqqqShares * lastData.tqqq);
  
  return { finalPortfolioValue, maxDrawdown, totalReturn: ((finalPortfolioValue - 100000)/1000) };
}

function simulateBuyAndHold(indicatorHistory, symbolField) {
  let initialPrice = indicatorHistory[0][symbolField];
  let shares = 100000 / initialPrice;
  let maxDrawdown = 0;
  let maxPortfolioValue = 0;
  
  for (const data of indicatorHistory) {
      const val = shares * data[symbolField];
      if (val > maxPortfolioValue) maxPortfolioValue = val;
      const dd = (maxPortfolioValue - val) / maxPortfolioValue;
      if (dd > maxDrawdown) maxDrawdown = dd;
  }
  
  const finalValue = shares * indicatorHistory[indicatorHistory.length - 1][symbolField];
  return { finalPortfolioValue: finalValue, maxDrawdown, totalReturn: ((finalValue - 100000)/1000) };
}

async function runBacktest() {
  console.log("Loading data...");
  const currcir = await fetchFred();
  const margin = fetchMargin();
  const qqq = await fetchYFMonthly('QQQ');
  const tqqq = await fetchYFMonthly('TQQQ');
  
  const pricesByMonth = {};
  for (const q of qqq) {
    const yyyymm = q.date.substring(0, 7);
    if (!pricesByMonth[yyyymm]) pricesByMonth[yyyymm] = {};
    pricesByMonth[yyyymm].qqq = q.price;
  }
  for (const t of tqqq) {
    const yyyymm = t.date.substring(0, 7);
    if (!pricesByMonth[yyyymm]) pricesByMonth[yyyymm] = {};
    pricesByMonth[yyyymm].tqqq = t.price;
  }

  let indicatorHistory = [];
  let lastMarginVal = null;
  let mIndex = 0;
  for (const c of currcir) {
    while (mIndex < margin.length && margin[mIndex].date <= c.date) {
      lastMarginVal = margin[mIndex].value;
      mIndex++;
    }
    if (lastMarginVal !== null && c.value > 0) {
      const ratio = lastMarginVal / (c.value * 1000);
      const yyyymm = c.date.substring(0, 7);
      
      if (pricesByMonth[yyyymm] && pricesByMonth[yyyymm].qqq && pricesByMonth[yyyymm].tqqq) {
        indicatorHistory.push({
          date: c.date,
          yyyymm: yyyymm,
          ratio: ratio,
          qqq: pricesByMonth[yyyymm].qqq,
          tqqq: pricesByMonth[yyyymm].tqqq
        });
      }
    }
  }

  console.log(`Starting backtest over ${indicatorHistory.length} months...\n`);
  
  const resStrat5050 = simulateStrategy(indicatorHistory, 0.5, 0.5);
  const resStratTQQQ = simulateStrategy(indicatorHistory, 0, 1.0);
  const resBnHQQQ = simulateBuyAndHold(indicatorHistory, 'qqq');
  const resBnHTQQQ = simulateBuyAndHold(indicatorHistory, 'tqqq');

  const printRes = (name, res) => {
    console.log(`--- ${name} ---`);
    console.log(`Final Value : $${res.finalPortfolioValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`);
    console.log(`Total Return: ${res.totalReturn.toFixed(2)}%`);
    console.log(`Max Drawdown: ${(res.maxDrawdown * 100).toFixed(2)}%\n`);
  };

  printRes("Benchmark 1: All-in QQQ (Buy & Hold)", resBnHQQQ);
  printRes("Benchmark 2: All-in TQQQ (Buy & Hold)", resBnHTQQQ);
  printRes("Strategy 1: FINRA Indicator (50% QQQ / 50% TQQQ)", resStrat5050);
  printRes("Strategy 2: FINRA Indicator (100% TQQQ)", resStratTQQQ);
}

runBacktest().catch(console.error);

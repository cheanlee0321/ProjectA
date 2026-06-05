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
  const filePath = path.join(process.cwd(), '../Data/FINRA-margin-statistics.xlsx');
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

function simulateStrategy(indicatorHistory, p1Alloc, p2Alloc, delayMonths, key1, key2) {
  let cash = 100000;
  let s1Shares = 0;
  let s2Shares = 0;
  let plan = null; 
  let lastSignal = null; 
  let maxDrawdown = 0;
  let maxPortfolioValue = 0;

  for (let i = 0; i < indicatorHistory.length; i++) {
    const data = indicatorHistory[i];
    
    let currentRatio = null;
    if (i - delayMonths >= 0) {
      currentRatio = indicatorHistory[i - delayMonths].ratio;
    }
    
    let currentSignal = 'yellow';
    if (currentRatio !== null) {
      if (currentRatio > 0.40) currentSignal = 'red';
      else if (currentRatio <= 0.30) currentSignal = 'green';
    }
    
    if (currentSignal === 'green' && lastSignal !== 'green') {
      plan = { type: 'buy', remaining: 10, totalCashToDeploy: cash };
    } else if (currentSignal === 'red' && lastSignal !== 'red') {
      plan = { type: 'sell', remaining: 10, total1ToSell: s1Shares, total2ToSell: s2Shares };
    }
    
    if (currentSignal !== 'yellow') {
        lastSignal = currentSignal;
    }
    
    if (plan && plan.remaining > 0) {
      if (plan.type === 'buy') {
        let spend = plan.totalCashToDeploy / 10;
        spend = Math.min(spend, cash); 
        
        const spend1 = spend * p1Alloc;
        const spend2 = spend * p2Alloc;
        
        s1Shares += spend1 / data[key1];
        s2Shares += spend2 / data[key2];
        cash -= spend;
        plan.remaining -= 1;
      } else if (plan.type === 'sell') {
        const sell1 = plan.total1ToSell / 10;
        const sell2 = plan.total2ToSell / 10;
        
        cash += (sell1 * data[key1]) + (sell2 * data[key2]);
        s1Shares -= sell1;
        s2Shares -= sell2;
        plan.remaining -= 1;
      }
    }

    const currentPortfolioValue = cash + (s1Shares * data[key1]) + (s2Shares * data[key2]);
    if (currentPortfolioValue > maxPortfolioValue) maxPortfolioValue = currentPortfolioValue;
    const drawdown = (maxPortfolioValue - currentPortfolioValue) / maxPortfolioValue;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  
  const lastData = indicatorHistory[indicatorHistory.length - 1];
  const finalPortfolioValue = cash + (s1Shares * lastData[key1]) + (s2Shares * lastData[key2]);
  
  return { finalPortfolioValue, maxDrawdown, totalReturn: ((finalPortfolioValue - 100000)/1000) };
}

async function runBacktest() {
  console.log("Loading data...");
  const currcir = await fetchFred();
  const margin = fetchMargin();
  const qqq = await fetchYFMonthly('QQQ');
  const tqqq = await fetchYFMonthly('TQQQ');
  const spy = await fetchYFMonthly('SPY');
  const upro = await fetchYFMonthly('UPRO');
  
  const pricesByMonth = {};
  const mapData = (arr, key) => {
      for (const item of arr) {
          const yyyymm = item.date.substring(0, 7);
          if (!pricesByMonth[yyyymm]) pricesByMonth[yyyymm] = {};
          pricesByMonth[yyyymm][key] = item.price;
      }
  };
  mapData(qqq, 'qqq');
  mapData(tqqq, 'tqqq');
  mapData(spy, 'spy');
  mapData(upro, 'upro');

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
      
      if (pricesByMonth[yyyymm] && pricesByMonth[yyyymm].qqq && pricesByMonth[yyyymm].tqqq && pricesByMonth[yyyymm].spy && pricesByMonth[yyyymm].upro) {
        indicatorHistory.push({
          date: c.date,
          yyyymm: yyyymm,
          ratio: ratio,
          qqq: pricesByMonth[yyyymm].qqq,
          tqqq: pricesByMonth[yyyymm].tqqq,
          spy: pricesByMonth[yyyymm].spy,
          upro: pricesByMonth[yyyymm].upro
        });
      }
    }
  }

  console.log(`Starting backtest over ${indicatorHistory.length} months...\n`);
  
  const printRes = (name, res) => {
    console.log(`--- ${name} ---`);
    console.log(`Final Value : $${res.finalPortfolioValue.toLocaleString(undefined, {maximumFractionDigits: 2})}`);
    console.log(`Total Return: ${res.totalReturn.toFixed(2)}%`);
    console.log(`Max Drawdown: ${(res.maxDrawdown * 100).toFixed(2)}%\n`);
  };

  [0, 1, 2].forEach(delay => {
      console.log(`======================`);
      console.log(`   DELAY: ${delay} MONTHS`);
      console.log(`======================`);
      
      const res100Q = simulateStrategy(indicatorHistory, 1.0, 0, delay, 'qqq', 'tqqq');
      const res5050Q = simulateStrategy(indicatorHistory, 0.5, 0.5, delay, 'qqq', 'tqqq');
      const res100TQ = simulateStrategy(indicatorHistory, 0, 1.0, delay, 'qqq', 'tqqq');
      
      const res100S = simulateStrategy(indicatorHistory, 1.0, 0, delay, 'spy', 'upro');
      const res5050S = simulateStrategy(indicatorHistory, 0.5, 0.5, delay, 'spy', 'upro');
      const res100UP = simulateStrategy(indicatorHistory, 0, 1.0, delay, 'spy', 'upro');

      printRes("100% QQQ", res100Q);
      printRes("50% QQQ / 50% TQQQ", res5050Q);
      printRes("100% TQQQ", res100TQ);
      
      printRes("100% SPY", res100S);
      printRes("50% SPY / 50% UPRO", res5050S);
      printRes("100% UPRO", res100UP);
  });
}

runBacktest().catch(console.error);

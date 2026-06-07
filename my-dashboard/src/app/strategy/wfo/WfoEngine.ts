import { StrategyData } from '../types';

export interface BacktestResult {
  date: string;
  equity: number;
  qqqEquity: number;
  tqqqEquity: number;
  drawdown: number;
  position: 'TQQQ' | 'MIX' | 'CASH';
  yellowThresh?: number;
  redThresh?: number;
}

export interface Metrics {
  cagr: number;
  maxDrawdown: number;
  sharpe: number;
}

export function calculateMetrics(equityCurve: BacktestResult[]): Metrics {
  if (equityCurve.length < 2) return { cagr: 0, maxDrawdown: 0, sharpe: 0 };
  
  const startEq = equityCurve[0].equity;
  const endEq = equityCurve[equityCurve.length - 1].equity;
  const years = equityCurve.length / 12;
  const cagr = Math.pow(endEq / startEq, 1 / years) - 1;

  let maxDrawdown = 0;
  let peak = startEq;
  
  const returns: number[] = [];
  
  for (let i = 1; i < equityCurve.length; i++) {
    const prev = equityCurve[i - 1].equity;
    const curr = equityCurve[i].equity;
    const ret = (curr - prev) / prev;
    returns.push(ret);
    
    if (curr > peak) peak = curr;
    const dd = (curr - peak) / peak;
    if (dd < maxDrawdown) maxDrawdown = dd;
  }

  const avgRet = returns.reduce((a, b) => a + b, 0) / returns.length;
  const varRet = returns.reduce((a, b) => a + Math.pow(b - avgRet, 2), 0) / returns.length;
  const stdRet = Math.sqrt(varRet);
  
  // Annualized Sharpe (assuming 2% risk free rate = 0.02/12 monthly)
  const rf = 0.02 / 12;
  const sharpe = stdRet > 0 ? ((avgRet - rf) / stdRet) * Math.sqrt(12) : 0;

  return { cagr, maxDrawdown, sharpe };
}

export function runBacktest(
  data: StrategyData[], 
  yellowThresh: number, 
  redThresh: number,
  startMonth?: string,
  endMonth?: string,
  useFilters: boolean = false
): BacktestResult[] {
  let filtered = data;
  if (startMonth) filtered = filtered.filter(d => d.month >= startMonth);
  if (endMonth) filtered = filtered.filter(d => d.month <= endMonth);

  const results: BacktestResult[] = [];
  let currentEquity = 100;
  let qqqEq = 100;
  let tqqqEq = 100;
  let peak = 100;

  for (let i = 1; i < filtered.length; i++) {
    const prev = filtered[i - 1];
    const curr = filtered[i];

    // Using ratios to M0 as price proxies
    const qqqRet = (prev.qqqToM0 && curr.qqqToM0) ? (curr.qqqToM0 - prev.qqqToM0) / prev.qqqToM0 : 0;
    const tqqqRet = (prev.tqqqToM0 && curr.tqqqToM0) ? (curr.tqqqToM0 - prev.tqqqToM0) / prev.tqqqToM0 : qqqRet * 3;

    qqqEq *= (1 + qqqRet);
    tqqqEq *= (1 + tqqqRet);

    // Indicator logic (from previous month to avoid lookahead)
    // Actually finraToM0 might be null if data is old, fallback to 0.1
    const indicator = prev.finraToM0 ?? 0.1;

    let position: 'TQQQ' | 'MIX' | 'CASH' = 'TQQQ';
    
    // Check Veto Filters if enabled
    let isVetoed = false;
    if (useFilters) {
      if ((prev.cape ?? 0) > 35 || (prev.tips ?? 0) > 2.0) {
        isVetoed = true;
      }
    }

    if (indicator >= redThresh || isVetoed) {
      position = 'CASH';
    } else if (indicator >= yellowThresh) {
      position = 'MIX'; // 50% QQQ / 50% CASH
    } else {
      position = 'MIX'; // Wait, strategy is 50% QQQ / 50% TQQQ normally?
      // "50% QQQ / 50% TQQQ" is the recommended strategy. Let's stick to that for normal state.
      // So Normal = 50% QQQ + 50% TQQQ.
      // Yellow = 100% QQQ (reduce leverage).
      // Red = 100% CASH.
      position = 'TQQQ'; 
    }

    let stratRet = 0;
    if (position === 'TQQQ') {
      stratRet = 0.5 * qqqRet + 0.5 * tqqqRet; // Normal 50/50 state
    } else if (position === 'MIX') {
      stratRet = 1.0 * qqqRet; // Yellow: Switch to 100% QQQ
    } else {
      stratRet = 0; // Red: Cash
    }

    currentEquity *= (1 + stratRet);
    if (currentEquity > peak) peak = currentEquity;

    results.push({
      date: curr.month,
      equity: currentEquity,
      qqqEquity: qqqEq,
      tqqqEquity: tqqqEq,
      drawdown: (currentEquity - peak) / peak,
      position
    });
  }

  return results;
}

export function runGridSearch(data: StrategyData[]) {
  const yellows = [0.22, 0.24, 0.26, 0.28, 0.30];
  const reds = [0.35, 0.38, 0.41, 0.44];

  let bestSharpe = -999;
  let bestParams = { y: 0.24, r: 0.41 };

  for (const y of yellows) {
    for (const r of reds) {
      if (y >= r) continue;
      const res = runBacktest(data, y, r);
      const metrics = calculateMetrics(res);
      if (metrics.sharpe > bestSharpe && metrics.maxDrawdown > -0.6) {
        bestSharpe = metrics.sharpe;
        bestParams = { y, r };
      }
    }
  }
  return bestParams;
}

export function runWalkForward(data: StrategyData[]) {
  // 過濾掉沒有 qqqToM0 的早期無效數據 (例如 1999 年以前)
  const validData = data.filter(d => d.qqqToM0 !== undefined && d.qqqToM0 !== null);
  
  const trainYears = 10;
  const tradeYears = 3;
  
  if (validData.length < 12 * (trainYears + 1)) return [];

  const startYear = parseInt(validData[0].month.split('-')[0]);
  const endYear = parseInt(validData[validData.length - 1].month.split('-')[0]);

  let currentYear = startYear;
  
  let finalStitchedCurve: BacktestResult[] = [];
  let lastEquity = 100;
  let lastQqqEq = 100;
  let lastTqqqEq = 100;

  while (currentYear + trainYears < endYear) {
    const trainStart = `${currentYear}-01`;
    const trainEnd = `${currentYear + trainYears - 1}-12`;
    
    // Adjust trade period for the last chunk
    const tradeEndYear = Math.min(currentYear + trainYears + tradeYears - 1, endYear);
    const tradeStart = `${currentYear + trainYears}-01`;
    const tradeEnd = `${tradeEndYear}-12`;

    const trainData = validData.filter(d => d.month >= trainStart && d.month <= trainEnd);
    if (trainData.length === 0) break;

    const bestParams = runGridSearch(trainData);
    
    const tradeData = validData.filter(d => d.month >= trainStart && d.month <= tradeEnd); // include train for overlap to get prev month indicator, but we only slice trade part
    const fullRes = runBacktest(tradeData, bestParams.y, bestParams.r);
    
    const oosRes = fullRes.filter(r => r.date >= tradeStart && r.date <= tradeEnd);

    // Stitch
    for (let i = 0; i < oosRes.length; i++) {
      const fullResIndex = fullRes.findIndex(r => r.date === oosRes[i].date);
      
      const prevOosEq = fullResIndex > 0 ? fullRes[fullResIndex - 1].equity : 100;
      const stratRet = (oosRes[i].equity - prevOosEq) / prevOosEq;
      
      const prevQqqEq = fullResIndex > 0 ? fullRes[fullResIndex - 1].qqqEquity : 100;
      const qRet = (oosRes[i].qqqEquity - prevQqqEq) / prevQqqEq;
      
      lastEquity *= (1 + stratRet);
      lastQqqEq *= (1 + qRet);
      
      finalStitchedCurve.push({
        ...oosRes[i],
        equity: lastEquity,
        qqqEquity: lastQqqEq,
        tqqqEquity: lastTqqqEq,
        yellowThresh: bestParams.y,
        redThresh: bestParams.r
      });
    }

    currentYear += tradeYears;
  }

  return finalStitchedCurve;
}

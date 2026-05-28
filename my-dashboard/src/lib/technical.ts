import { RSI, MACD } from 'technicalindicators';

export function calculateRSI(prices: number[], period: number = 14) {
  if (!prices || prices.length < period) {
    return null;
  }
  
  const rsiValues = RSI.calculate({
    period,
    values: prices
  });
  
  return rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : null;
}

export function calculateFullRSISeries(prices: number[], period: number = 14) {
  if (!prices || prices.length < period) {
    return new Array(prices.length).fill(null);
  }
  
  const rsiValues = RSI.calculate({
    period,
    values: prices
  });
  
  const padding = new Array(prices.length - rsiValues.length).fill(null);
  return [...padding, ...rsiValues];
}

export function calculateMACD(prices: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (!prices || prices.length < slowPeriod) {
    return null;
  }
  
  const macdValues = MACD.calculate({
    values: prices,
    fastPeriod,
    slowPeriod,
    signalPeriod,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
  
  return macdValues.length > 0 ? macdValues[macdValues.length - 1] : null;
}

export function calculateFullMACDSeries(prices: number[], fastPeriod = 12, slowPeriod = 26, signalPeriod = 9) {
  if (!prices || prices.length < slowPeriod) {
    return new Array(prices.length).fill(null);
  }
  
  const macdValues = MACD.calculate({
    values: prices,
    fastPeriod,
    slowPeriod,
    signalPeriod,
    SimpleMAOscillator: false,
    SimpleMASignal: false
  });
  
  // Pad the beginning with nulls so it matches the length of prices
  const padding = new Array(prices.length - macdValues.length).fill(null);
  return [...padding, ...macdValues];
}

export function analyzeTechnicalIndicators(prices: number[]) {
  const rsi = calculateRSI(prices);
  const macd = calculateMACD(prices);
  
  let rsiStatus = '中性';
  if (rsi !== null) {
    if (rsi >= 70) rsiStatus = '超買 (Overbought)';
    else if (rsi <= 30) rsiStatus = '超賣 (Oversold)';
  }
  
  let macdStatus = '中性';
  if (macd && macd.MACD !== undefined && macd.signal !== undefined) {
    if (macd.MACD > macd.signal) macdStatus = '黃金交叉 (Bullish)';
    else if (macd.MACD < macd.signal) macdStatus = '死亡交叉 (Bearish)';
  }
  
  return {
    rsi,
    rsiStatus,
    macd,
    macdStatus
  };
}

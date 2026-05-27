import { fetchFullFundamentalData } from './fundamental';

export type FScoreResult = {
  score: number;
  passFail: boolean[];
  details: string[];
};

export type DuPontResult = {
  year: string;
  roe: number;
  netProfitMargin: number;
  assetTurnover: number;
  equityMultiplier: number;
};

export async function getAdvancedAnalysisData(ticker: string, fmpKey: string, finmindToken: string) {
  const data = await fetchFullFundamentalData(ticker, fmpKey, finmindToken);
  if (!data || !data.income || data.income.length < 2) return null;

  const { income, balance, metrics } = data;

  // We need at least 2 years of data for F-Score (current vs previous)
  // Assume data is sorted by date ascending (oldest first), which is what fundamental.ts does.
  
  // DuPont Analysis (calculate for all available years)
  const dupont: DuPontResult[] = [];
  for (let i = 0; i < income.length; i++) {
    const inc = income[i];
    const bal = balance[i] || {};
    
    const netIncome = inc.netIncome || 0;
    const revenue = inc.revenue || 0;
    const totalAssets = bal.totalAssets || 0;
    const totalEquity = bal.totalEquity || 0;

    const netProfitMargin = revenue ? (netIncome / revenue) : 0;
    const assetTurnover = totalAssets ? (revenue / totalAssets) : 0;
    const equityMultiplier = totalEquity ? (totalAssets / totalEquity) : 0;
    const roe = totalEquity ? (netIncome / totalEquity) : 0;

    dupont.push({
      year: inc.fiscalYear || inc.date.substring(0, 4),
      roe,
      netProfitMargin,
      assetTurnover,
      equityMultiplier
    });
  }

  // Piotroski F-Score (calculated for the most recent year compared to the previous year)
  let fScoreResult: FScoreResult = { score: 0, passFail: Array(9).fill(false), details: [] };
  
  if (income.length >= 2) {
    const currIdx = income.length - 1;
    const prevIdx = income.length - 2;

    const currInc = income[currIdx];
    const prevInc = income[prevIdx];
    const currBal = balance[currIdx] || {};
    const prevBal = balance[prevIdx] || {};
    const currMet = metrics[currIdx] || {};
    const prevMet = metrics[prevIdx] || {};

    const passFail = Array(9).fill(false);
    const details = [
      "Return on Assets (ROA) > 0",
      "Operating Cash Flow (OCF) > 0",
      "Change in ROA > 0",
      "Accruals (OCF > Net Income)",
      "Change in Leverage (Debt/Assets) < 0",
      "Change in Current Ratio > 0",
      "Change in Shares Outstanding <= 0",
      "Change in Gross Margin > 0",
      "Change in Asset Turnover > 0"
    ];

    // 1. ROA > 0
    const currRoa = currBal.totalAssets ? (currInc.netIncome / currBal.totalAssets) : (currMet.returnOnAssets || 0);
    passFail[0] = currRoa > 0;

    // 2. OCF > 0 (Proxy: Net Income > 0 if OCF missing)
    const currOcf = currInc.operatingCashFlow || currInc.netIncome; 
    passFail[1] = currOcf > 0;

    // 3. Change in ROA > 0
    const prevRoa = prevBal.totalAssets ? (prevInc.netIncome / prevBal.totalAssets) : (prevMet.returnOnAssets || 0);
    passFail[2] = currRoa > prevRoa;

    // 4. Accruals (OCF > Net Income)
    passFail[3] = currOcf > currInc.netIncome;

    // 5. Change in Leverage (Long Term Debt / Assets) < 0
    const currDebt = currBal.longTermDebt || currBal.totalLiabilities || (currBal.totalAssets - currBal.totalEquity);
    const prevDebt = prevBal.longTermDebt || prevBal.totalLiabilities || (prevBal.totalAssets - prevBal.totalEquity);
    const currLeverage = currBal.totalAssets ? (currDebt / currBal.totalAssets) : 0;
    const prevLeverage = prevBal.totalAssets ? (prevDebt / prevBal.totalAssets) : 0;
    passFail[4] = currLeverage < prevLeverage;

    // 6. Change in Current Ratio > 0
    const currCurrentRatio = currBal.currentLiabilities ? (currBal.currentAssets / currBal.currentLiabilities) : (currMet.currentRatio || 0);
    const prevCurrentRatio = prevBal.currentLiabilities ? (prevBal.currentAssets / prevBal.currentLiabilities) : (prevMet.currentRatio || 0);
    passFail[5] = currCurrentRatio > prevCurrentRatio;

    // 7. Change in Shares Outstanding <= 0
    const currShares = currInc.weightedAverageShsOut || currInc.weightedAverageShsOutDil || 0;
    const prevShares = prevInc.weightedAverageShsOut || prevInc.weightedAverageShsOutDil || 0;
    passFail[6] = (currShares > 0 && prevShares > 0) ? (currShares <= prevShares) : true; 

    // 8. Change in Gross Margin > 0
    const currGm = currInc.revenue ? (currInc.grossProfit / currInc.revenue) : 0;
    const prevGm = prevInc.revenue ? (prevInc.grossProfit / prevInc.revenue) : 0;
    passFail[7] = currGm > prevGm;

    // 9. Change in Asset Turnover > 0
    const currAt = currBal.totalAssets ? (currInc.revenue / currBal.totalAssets) : 0;
    const prevAt = prevBal.totalAssets ? (prevInc.revenue / prevBal.totalAssets) : 0;
    passFail[8] = currAt > prevAt;

    fScoreResult = {
      score: passFail.filter(Boolean).length,
      passFail,
      details
    };
  }

  return {
    dupont,
    fScoreResult
  };
}

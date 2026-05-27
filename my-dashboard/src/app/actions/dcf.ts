'use server';

import { getUserApiKeys } from '@/lib/keys';
import { fetchFullFundamentalData } from '@/lib/fundamental';

export async function getDCFHistoricalAverages(ticker: string) {
  const keys = await getUserApiKeys();
  const finalTicker = ticker.toUpperCase();
  
  const isTaiwan = finalTicker.endsWith('.TW') || finalTicker.endsWith('.TWO');
  if ((isTaiwan && !keys.finmind) || (!isTaiwan && !keys.fmp)) {
    return { error: '缺少對應市場的 API 金鑰' };
  }

  const data = await fetchFullFundamentalData(finalTicker, keys.fmp || '', keys.finmind || '');
  if (!data || !data.profile || data.income.length === 0) {
    return { error: '無法取得該股票的基本面資料' };
  }

  // 取得最近 4 年的資料，以計算 3 年的成長率
  const recentIncome = [...data.income].sort((a: any, b: any) => b.fiscalYear.localeCompare(a.fiscalYear)).slice(0, 4);
  const recentBalance = [...data.balance].sort((a: any, b: any) => b.fiscalYear.localeCompare(a.fiscalYear)).slice(0, 1); // Only need the latest for debt
  
  if (recentIncome.length < 2) {
    return { error: '歷史資料不足，無法計算平均值' };
  }

  let totalRevGrowth = 0;
  let revGrowthCount = 0;
  let totalOpMargin = 0;
  let opMarginCount = 0;
  let totalTaxRate = 0;
  let taxRateCount = 0;

  for (let i = 0; i < recentIncome.length - 1; i++) {
    const curr = recentIncome[i];
    const prev = recentIncome[i + 1];
    
    // Revenue Growth
    if (prev.revenue > 0) {
      const growth = (curr.revenue - prev.revenue) / prev.revenue;
      totalRevGrowth += growth;
      revGrowthCount++;
    }

    // Operating Margin
    if (curr.revenue > 0) {
      const margin = curr.operatingIncome / curr.revenue;
      totalOpMargin += margin;
      opMarginCount++;
    }

    // Tax Rate (Estimated as (Income Before Tax - Net Income) / Income Before Tax)
    // If we only have operatingIncome and netIncome, we can approximate tax rate if interest is small, 
    // or just use 20% as default if we can't reliably calculate it.
    // FMP has incomeBeforeTax, but our normalized object might not. We will try:
    const preTaxIncome = curr.operatingIncome; // Simplified
    if (preTaxIncome > 0 && curr.netIncome > 0 && preTaxIncome > curr.netIncome) {
      const taxRate = (preTaxIncome - curr.netIncome) / preTaxIncome;
      if (taxRate > 0 && taxRate < 1) {
        totalTaxRate += taxRate;
        taxRateCount++;
      }
    }
  }

  const avgRevGrowth = revGrowthCount > 0 ? totalRevGrowth / revGrowthCount : 0;
  const avgOpMargin = opMarginCount > 0 ? totalOpMargin / opMarginCount : 0;
  const avgTaxRate = taxRateCount > 0 ? totalTaxRate / taxRateCount : 0.2; // Default 20% if unable to calculate

  // Get Shares Outstanding, Net Debt, and PE Ratio
  let sharesOutstanding = 1000000;
  let totalDebt = 0;
  let cashAndEquivalents = 0;
  let trailingPE = 15;

  try {
    // Try to get precise shares outstanding and debt from Yahoo Finance
    const YahooFinanceLib = (await import('yahoo-finance2')).default;
    const yahooFinance = new YahooFinanceLib();
    const yfTicker = isTaiwan && !finalTicker.includes('.') ? `${finalTicker}.TW` : finalTicker;
    
    // We can fetch quoteSummary for financialData (debt/cash), defaultKeyStatistics (shares), and summaryDetail (PE)
    const quoteSummary = await yahooFinance.quoteSummary(yfTicker, { 
      modules: ['defaultKeyStatistics', 'financialData', 'price', 'summaryDetail'] 
    });

    if (quoteSummary.defaultKeyStatistics?.sharesOutstanding) {
      sharesOutstanding = quoteSummary.defaultKeyStatistics.sharesOutstanding;
    } else if (quoteSummary.price?.marketCap && quoteSummary.price?.regularMarketPrice) {
      sharesOutstanding = quoteSummary.price.marketCap / quoteSummary.price.regularMarketPrice;
    } else if (data.profile.mktCap && data.profile.price && data.profile.price > 0) {
      sharesOutstanding = data.profile.mktCap / data.profile.price;
    }

    if (quoteSummary.financialData?.totalDebt !== undefined) {
      totalDebt = quoteSummary.financialData.totalDebt;
    }
    if (quoteSummary.financialData?.totalCash !== undefined) {
      cashAndEquivalents = quoteSummary.financialData.totalCash;
    }
    if (quoteSummary.summaryDetail?.trailingPE !== undefined) {
      trailingPE = quoteSummary.summaryDetail.trailingPE;
    } else if (quoteSummary.summaryDetail?.forwardPE !== undefined) {
      trailingPE = quoteSummary.summaryDetail.forwardPE;
    }
  } catch (err) {
    console.error("Failed to fetch yahoo finance quote summary for DCF defaults", err);
    // Fallback to FMP or heuristics
    if (data.profile.mktCap && data.profile.price && data.profile.price > 0) {
      sharesOutstanding = data.profile.mktCap / data.profile.price;
    }
    if (recentBalance.length > 0) {
      const latestBs = recentBalance[0];
      totalDebt = latestBs.totalDebt || latestBs.currentLiabilities || 0; 
      cashAndEquivalents = latestBs.cashAndCashEquivalents || latestBs.currentAssets || 0;
    }
  }

  // If after fallback it's still 0, we can use the heuristic from balance sheet
  if (totalDebt === 0 && cashAndEquivalents === 0 && recentBalance.length > 0) {
    const latestBs = recentBalance[0];
    totalDebt = latestBs.totalDebt || latestBs.currentLiabilities || 0; 
    cashAndEquivalents = latestBs.cashAndCashEquivalents || latestBs.currentAssets || 0;
  }

  const netDebt = Math.max(0, totalDebt - cashAndEquivalents);
  const currentRevenue = recentIncome[0].revenue || 0;
  const currentPrice = data.profile.price || 0;

  return {
    success: true,
    data: {
      ticker: finalTicker,
      name: data.profile.companyName,
      currency: data.profile.currency,
      currentPrice,
      currentRevenue,
      avgRevGrowth,
      avgOpMargin,
      avgTaxRate,
      sharesOutstanding,
      netDebt,
      trailingPE
    }
  };
}

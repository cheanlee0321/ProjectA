import { unstable_cache } from 'next/cache';
import YahooFinance from 'yahoo-finance2';

const yahooFinance = new YahooFinance();
const BASE_URL = 'https://financialmodelingprep.com/stable';

export async function getCompanyProfile(ticker: string, fmpKey: string) {
  if (!fmpKey) return null;
  const res = await fetch(`${BASE_URL}/profile?symbol=${ticker}&apikey=${fmpKey}`, {
    next: { revalidate: 604800 }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function getIncomeStatement(ticker: string, fmpKey: string, limit = 5) {
  if (!fmpKey) return [];
  const res = await fetch(`${BASE_URL}/income-statement?symbol=${ticker}&limit=${limit}&apikey=${fmpKey}`, {
    next: { revalidate: 604800 } // Cache for 7 days
  });
  if (res.status === 402 || res.status === 403) throw new Error('PREMIUM_RESTRICTED');
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.reverse() : []; // Reverse to have oldest first for charts
}

export async function getBalanceSheet(ticker: string, fmpKey: string, limit = 5) {
  if (!fmpKey) return [];
  const res = await fetch(`${BASE_URL}/balance-sheet-statement?symbol=${ticker}&limit=${limit}&apikey=${fmpKey}`, {
    next: { revalidate: 604800 }
  });
  if (res.status === 402 || res.status === 403) throw new Error('PREMIUM_RESTRICTED');
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.reverse() : [];
}

export async function getCashFlowStatement(ticker: string, fmpKey: string, limit = 5) {
  if (!fmpKey) return [];
  const res = await fetch(`${BASE_URL}/cash-flow-statement?symbol=${ticker}&limit=${limit}&apikey=${fmpKey}`, {
    next: { revalidate: 604800 }
  });
  if (res.status === 402 || res.status === 403) throw new Error('PREMIUM_RESTRICTED');
  if (!res.ok) return [];
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.reverse().map(item => ({
      ...item,
      investingCashFlow: item.investingCashFlow ?? item.netCashUsedForInvestingActivites ?? 0,
      financingCashFlow: item.financingCashFlow ?? item.netCashUsedProvidedByFinancingActivities ?? 0
    }));
  }
  return [];
}

export async function getKeyMetrics(ticker: string, fmpKey: string, limit = 5) {
  if (!fmpKey) return [];
  const res = await fetch(`${BASE_URL}/key-metrics?symbol=${ticker}&limit=${limit}&apikey=${fmpKey}`, {
    next: { revalidate: 604800 }
  });
  if (res.status === 402 || res.status === 403) throw new Error('PREMIUM_RESTRICTED');
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.reverse() : [];
}

export const fetchFullFundamentalData = unstable_cache(
  async (ticker: string, fmpKey: string, finmindToken: string) => {
    const data = await _fetchFullFundamentalData(ticker, fmpKey, finmindToken);
    if (!data) return null;
    return {
      ...data,
      fetchDate: new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit' })
    };
  },
  ['fundamental-data-v5'],
  { revalidate: 604800 }
);

async function _fetchFullFundamentalData(ticker: string, fmpKey: string, finmindToken: string) {
  if (ticker.endsWith('.TW') || ticker.endsWith('.TWO')) {
    return await fetchTaiwanFundamentalData(ticker, fmpKey, finmindToken);
  }

  const symbol = ticker.toUpperCase();
  let profile = null, income = [], balance = [], cashflow = [], metrics = [], isPremiumRestricted = false;

  try {
    const results = await Promise.all([
      getCompanyProfile(symbol, fmpKey),
      getIncomeStatement(symbol, fmpKey),
      getBalanceSheet(symbol, fmpKey),
      getCashFlowStatement(symbol, fmpKey),
      getKeyMetrics(symbol, fmpKey)
    ]);
    profile = results[0];
    income = results[1];
    balance = results[2];
    cashflow = results[3];
    metrics = results[4];
  } catch (e: any) {
    if (e.message === 'PREMIUM_RESTRICTED') {
      isPremiumRestricted = true;
      profile = await getCompanyProfile(symbol, fmpKey);
      
      const yfData = await fetchYahooFinanceFundamentalData(symbol);
      income = yfData.income;
      balance = yfData.balance;
      cashflow = yfData.cashflow;
      metrics = yfData.metrics;
    } else {
      console.error("FMP API Error:", e);
      profile = await getCompanyProfile(symbol, fmpKey);
    }
  }

  if (!profile) return null;

  return {
    profile,
    income,
    balance,
    cashflow,
    metrics,
    isPremiumRestricted
  };
}

async function fetchYahooFinanceFundamentalData(ticker: string) {
  try {
    const symbol = ticker.toUpperCase();
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 5);
    const period1 = startDate.toISOString().split('T')[0];

    const tsData = await yahooFinance.fundamentalsTimeSeries(symbol, {
      period1,
      module: 'all',
      type: 'annual'
    });

    let quotes: any[] = [];
    try {
      const chart = await yahooFinance.chart(symbol, {
        period1,
        interval: '1mo'
      });
      quotes = chart.quotes || [];
    } catch (chartErr) {
      console.warn("Could not fetch chart for PE calculation:", chartErr);
    }

    const income: any[] = [];
    const balance: any[] = [];
    const cashflow: any[] = [];
    const metrics: any[] = [];

    const sorted = tsData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (const _item of sorted) {
      const item = _item as any;
      if (!item.date) continue;
      const targetDate = new Date(item.date);
      const year = targetDate.getFullYear().toString();
      const dateStr = targetDate.toISOString().split('T')[0];

      income.push({
        date: dateStr,
        fiscalYear: year,
        revenue: item.totalRevenue || item.operatingRevenue || 0,
        costOfRevenue: item.costOfRevenue || 0,
        grossProfit: item.grossProfit || 0,
        operatingExpenses: item.operatingExpense || item.totalExpenses || 0,
        operatingIncome: item.operatingIncome || item.EBIT || 0,
        netIncome: item.netIncome || item.netIncomeCommonStockholders || 0,
        eps: item.dilutedEPS || item.basicEPS || 0
      });

      const totalAssets = item.totalAssets || 0;
      const totalEquity = item.stockholdersEquity || item.totalEquityGrossMinorityInterest || item.commonStockEquity || 0;
      const currentAssets = item.currentAssets || 0;
      const currentLiabilities = item.currentLiabilities || 0;

      balance.push({
        date: dateStr,
        fiscalYear: year,
        totalAssets,
        totalEquity,
        currentAssets,
        currentLiabilities
      });

      const operatingCashFlow = item.operatingCashFlow || item.cashFlowFromContinuingOperatingActivities || 0;
      const investingCashFlow = item.investingCashFlow || item.cashFlowFromContinuingInvestingActivities || 0;
      const financingCashFlow = item.financingCashFlow || item.cashFlowFromContinuingFinancingActivities || 0;
      const capitalExpenditure = item.capitalExpenditure || 0;
      const freeCashFlow = item.freeCashFlow || (operatingCashFlow - Math.abs(capitalExpenditure));

      cashflow.push({
        date: dateStr,
        fiscalYear: year,
        operatingCashFlow,
        investingCashFlow,
        financingCashFlow,
        capitalExpenditure,
        freeCashFlow
      });

      const netIncome = item.netIncome || item.netIncomeCommonStockholders || 0;
      
      let closestPrice = 0;
      if (quotes.length > 0) {
        let minDiff = Infinity;
        for (const q of quotes) {
          if (!q.date) continue;
          const qDate = new Date(q.date);
          const diff = Math.abs(qDate.getTime() - targetDate.getTime());
          if (diff < minDiff) {
            minDiff = diff;
            closestPrice = q.close || 0;
          }
        }
      }
      const eps = item.dilutedEPS || item.basicEPS || 0;
      const earningsYield = closestPrice > 0 && eps > 0 ? (eps / closestPrice) : 0;
      
      metrics.push({
        date: dateStr,
        fiscalYear: year,
        returnOnEquity: totalEquity ? netIncome / totalEquity : 0,
        returnOnAssets: totalAssets ? netIncome / totalAssets : 0,
        currentRatio: currentLiabilities ? currentAssets / currentLiabilities : 0,
        earningsYield: earningsYield
      });
    }

    return { income, balance, cashflow, metrics };
  } catch (error) {
    console.error("Yahoo Finance TS Error:", error);
    return { income: [], balance: [], cashflow: [], metrics: [] };
  }
}

async function fetchTaiwanFundamentalData(ticker: string, fmpKey: string, finmindToken: string) {
  const stockId = ticker.split('.')[0]; // e.g. 2330.TW -> 2330
  const startDate = '2019-01-01'; // Get last 5 years

  // 使用 fmpKey 去抓取台股的 Profile (FMP 支援台股基本資訊，包含價格)
  let profile = await getCompanyProfile(ticker, fmpKey);

  let quotePrice = 0;
  let quoteChange = 0;
  let quoteCurrency = 'TWD';
  let quoteExchange = 'TWSE';
  let quoteName = stockId;

  try {
    const quote = await yahooFinance.quote(ticker);
    if (quote) {
      quotePrice = quote.regularMarketPrice || 0;
      quoteChange = quote.regularMarketChange || 0;
      quoteCurrency = quote.currency || 'TWD';
      quoteExchange = quote.fullExchangeName || 'TWSE';
      quoteName = quote.longName || quote.shortName || stockId;
    }
  } catch (e) {
    console.error('Yahoo Finance Error:', e);
  }

  if (!finmindToken) {
    if (!profile) {
      profile = {
        symbol: ticker,
        companyName: quoteName !== stockId ? quoteName : stockId,
        industry: '-',
        sector: '-',
        description: '資料來源: FinMind 台灣金融數據 API',
        ceo: '-',
        city: 'Taiwan',
        state: '',
        price: quotePrice,
        changes: quoteChange,
        currency: quoteCurrency,
        exchangeShortName: quoteExchange
      };
    } else {
      profile.price = quotePrice || profile.price;
      profile.changes = quoteChange || profile.changes;
      profile.currency = quoteCurrency || profile.currency;
      profile.exchangeShortName = quoteExchange || profile.exchangeShortName;
    }
    return { profile, income: [], balance: [], cashflow: [], metrics: [] };
  }

  try {
    const [finRes, perRes, bsRes, cfRes] = await Promise.all([
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockFinancialStatements&data_id=${stockId}&start_date=${startDate}&token=${finmindToken}`, { next: { revalidate: 604800 } }).then(r => r.json()),
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPER&data_id=${stockId}&start_date=${startDate}&token=${finmindToken}`, { next: { revalidate: 604800 } }).then(r => r.json()),
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockBalanceSheet&data_id=${stockId}&start_date=${startDate}&token=${finmindToken}`, { next: { revalidate: 604800 } }).then(r => r.json()),
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockCashFlowsStatement&data_id=${stockId}&start_date=${startDate}&token=${finmindToken}`, { next: { revalidate: 604800 } }).then(r => r.json())
    ]);

    const yearlyIncome: Record<string, any> = {};
    if (finRes.data) {
      finRes.data.forEach((item: any) => {
        const year = item.date.split('-')[0];
        if (!yearlyIncome[year]) {
          yearlyIncome[year] = { 
            date: `${year}-12-31`, 
            fiscalYear: year, 
            revenue: 0, costOfRevenue: 0, grossProfit: 0, 
            operatingExpenses: 0, operatingIncome: 0, netIncome: 0, eps: 0 
          };
        }
        const val = Number(item.value);
        switch (item.type) {
          case 'Revenue': yearlyIncome[year].revenue += val; break;
          case 'CostOfGoodsSold': yearlyIncome[year].costOfRevenue += val; break;
          case 'GrossProfit': yearlyIncome[year].grossProfit += val; break;
          case 'OperatingExpenses': yearlyIncome[year].operatingExpenses += val; break;
          case 'OperatingIncome': yearlyIncome[year].operatingIncome += val; break;
          case 'IncomeAfterTaxes': yearlyIncome[year].netIncome += val; break;
          case 'EPS': yearlyIncome[year].eps += val; break;
        }
      });
    }
    const income = Object.values(yearlyIncome).sort((a: any, b: any) => a.fiscalYear.localeCompare(b.fiscalYear));

    const yearlyBalance: Record<string, any> = {};
    if (bsRes.data) {
      bsRes.data.forEach((item: any) => {
        const year = item.date.split('-')[0];
        if (!yearlyBalance[year]) {
          yearlyBalance[year] = { totalAssets: 0, totalEquity: 0, currentAssets: 0, currentLiabilities: 0 };
        }
        const val = Number(item.value);
        if (item.type === 'TotalAssets') yearlyBalance[year].totalAssets = val;
        if (item.type === 'EquityAttributableToOwnersOfParent') yearlyBalance[year].totalEquity = val;
        if (item.type === 'CurrentAssets') yearlyBalance[year].currentAssets = val;
        if (item.type === 'CurrentLiabilities') yearlyBalance[year].currentLiabilities = val;
      });
    }
    
    const balance = Object.keys(yearlyBalance).map(year => ({
      date: `${year}-12-31`,
      fiscalYear: year,
      ...yearlyBalance[year]
    })).sort((a, b) => a.fiscalYear.localeCompare(b.fiscalYear));

    const yearlyCashFlow: Record<string, any> = {};
    if (cfRes && cfRes.data) {
      cfRes.data.forEach((item: any) => {
        const year = item.date.split('-')[0];
        if (!yearlyCashFlow[year]) {
          yearlyCashFlow[year] = { operatingCashFlow: 0, investingCashFlow: 0, financingCashFlow: 0, capitalExpenditure: 0 };
        }
        const val = Number(item.value);
        if (item.type === 'CashFlowsFromOperatingActivities') yearlyCashFlow[year].operatingCashFlow = val;
        if (item.type === 'CashProvidedByInvestingActivities' || item.type === 'NetCashFlowsFromUsedInInvestingActivities' || item.type === 'CashFlowsFromUsedInInvestingActivities') yearlyCashFlow[year].investingCashFlow = val;
        if (item.type === 'CashFlowsProvidedFromFinancingActivities' || item.type === 'NetCashFlowsFromUsedInFinancingActivities' || item.type === 'CashFlowsFromUsedInFinancingActivities') yearlyCashFlow[year].financingCashFlow = val;
        // Approximation for CapEx
        if (item.type === 'PropertyAndPlantAndEquipment' || item.type === 'AcquisitionOfPropertyPlantAndEquipment') yearlyCashFlow[year].capitalExpenditure = -Math.abs(val);
      });
    }

    const cashflow = Object.keys(yearlyCashFlow).map(year => {
      const c = yearlyCashFlow[year];
      const operatingCashFlow = c.operatingCashFlow || 0;
      const capitalExpenditure = c.capitalExpenditure || 0;
      return {
        date: `${year}-12-31`,
        fiscalYear: year,
        operatingCashFlow,
        investingCashFlow: c.investingCashFlow || 0,
        financingCashFlow: c.financingCashFlow || 0,
        capitalExpenditure,
        freeCashFlow: operatingCashFlow + capitalExpenditure
      };
    }).sort((a, b) => a.fiscalYear.localeCompare(b.fiscalYear));

    const yearlyMetrics: Record<string, any> = {};
    if (perRes.data) {
      perRes.data.forEach((item: any) => {
        const year = item.date.split('-')[0];
        yearlyMetrics[year] = {
          date: item.date,
          fiscalYear: year,
          earningsYield: item.PER ? 1 / item.PER : 0,
          evToEBITDA: null,
          freeCashFlowYield: item.dividend_yield ? item.dividend_yield / 100 : 0
        };
      });
    }
    
    const metrics = Object.values(yearlyMetrics).map((m: any) => {
      const year = m.fiscalYear;
      const netIncome = yearlyIncome[year]?.netIncome || 0;
      const totalAssets = yearlyBalance[year]?.totalAssets || 0;
      const totalEquity = yearlyBalance[year]?.totalEquity || 0;
      const currentAssets = yearlyBalance[year]?.currentAssets || 0;
      const currentLiabilities = yearlyBalance[year]?.currentLiabilities || 0;
      
      return {
        ...m,
        returnOnEquity: totalEquity ? (netIncome / totalEquity) : 0,
        returnOnAssets: totalAssets ? (netIncome / totalAssets) : 0,
        currentRatio: currentLiabilities ? (currentAssets / currentLiabilities) : 0
      };
    }).sort((a: any, b: any) => a.fiscalYear.localeCompare(b.fiscalYear));

    if (!profile) {
      profile = {
        symbol: ticker,
        companyName: quoteName !== stockId ? quoteName : stockId,
        industry: '-',
        sector: '-',
        description: '資料來源: FinMind 台灣金融數據 API',
        ceo: '-',
        city: 'Taiwan',
        state: '',
        price: quotePrice,
        changes: quoteChange,
        currency: quoteCurrency,
        exchangeShortName: quoteExchange
      };
    } else {
      profile.price = quotePrice || profile.price;
      profile.changes = quoteChange || profile.changes;
      profile.currency = quoteCurrency || profile.currency;
      profile.exchangeShortName = quoteExchange || profile.exchangeShortName;
    }

    return { profile, income, balance, cashflow, metrics };

  } catch (error) {
    console.error("FinMind Error:", error);
    return { profile, income: [], balance: [], cashflow: [], metrics: [] };
  }
}

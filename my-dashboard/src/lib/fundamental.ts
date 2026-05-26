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
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.reverse() : []; // Reverse to have oldest first for charts
}

export async function getBalanceSheet(ticker: string, fmpKey: string, limit = 5) {
  if (!fmpKey) return [];
  const res = await fetch(`${BASE_URL}/balance-sheet-statement?symbol=${ticker}&limit=${limit}&apikey=${fmpKey}`, {
    next: { revalidate: 604800 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.reverse() : [];
}

export async function getKeyMetrics(ticker: string, fmpKey: string, limit = 5) {
  if (!fmpKey) return [];
  const res = await fetch(`${BASE_URL}/key-metrics?symbol=${ticker}&limit=${limit}&apikey=${fmpKey}`, {
    next: { revalidate: 604800 }
  });
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
  ['fundamental-data-dynamic'],
  { revalidate: 604800 }
);

async function _fetchFullFundamentalData(ticker: string, fmpKey: string, finmindToken: string) {
  if (ticker.endsWith('.TW') || ticker.endsWith('.TWO')) {
    return await fetchTaiwanFundamentalData(ticker, fmpKey, finmindToken);
  }

  const symbol = ticker.toUpperCase();
  const [profile, income, balance, metrics] = await Promise.all([
    getCompanyProfile(symbol, fmpKey),
    getIncomeStatement(symbol, fmpKey),
    getBalanceSheet(symbol, fmpKey),
    getKeyMetrics(symbol, fmpKey)
  ]);

  if (!profile) return null;

  return {
    profile,
    income,
    balance,
    metrics
  };
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
    return { profile, income: [], balance: [], metrics: [] };
  }

  try {
    const [finRes, perRes, bsRes] = await Promise.all([
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockFinancialStatements&data_id=${stockId}&start_date=${startDate}&token=${finmindToken}`, { next: { revalidate: 604800 } }).then(r => r.json()),
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPER&data_id=${stockId}&start_date=${startDate}&token=${finmindToken}`, { next: { revalidate: 604800 } }).then(r => r.json()),
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockBalanceSheet&data_id=${stockId}&start_date=${startDate}&token=${finmindToken}`, { next: { revalidate: 604800 } }).then(r => r.json())
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

    return { profile, income, balance, metrics };

  } catch (error) {
    console.error("FinMind Error:", error);
    return { profile, income: [], balance: [], metrics: [] };
  }
}

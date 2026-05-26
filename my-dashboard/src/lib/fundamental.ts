const BASE_URL = 'https://financialmodelingprep.com/stable';
const FINMIND_TOKEN = process.env.FINMIND_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY2hlYW5sZWUwMzIxIiwiZW1haWwiOiJjaGVhbmxlZTAzMjFAZ21haWwuY29tIiwidG9rZW5fdmVyc2lvbiI6MH0.LxuXk1vAyDQwHx2rxHNfy0h4vz_feyB2R6EPZMAuTo8';

export async function getCompanyProfile(ticker: string) {
  const res = await fetch(`${BASE_URL}/profile?symbol=${ticker}&apikey=${process.env.FMP_API_KEY}`, {
    next: { revalidate: 3600 }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function getIncomeStatement(ticker: string, limit = 5) {
  const res = await fetch(`${BASE_URL}/income-statement?symbol=${ticker}&limit=${limit}&apikey=${process.env.FMP_API_KEY}`, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.reverse() : []; // Reverse to have oldest first for charts
}

export async function getBalanceSheet(ticker: string, limit = 5) {
  const res = await fetch(`${BASE_URL}/balance-sheet-statement?symbol=${ticker}&limit=${limit}&apikey=${process.env.FMP_API_KEY}`, {
    next: { revalidate: 86400 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.reverse() : [];
}

export async function getKeyMetrics(ticker: string, limit = 5) {
  const res = await fetch(`${BASE_URL}/key-metrics?symbol=${ticker}&limit=${limit}&apikey=${process.env.FMP_API_KEY}`, {
    next: { revalidate: 86400 }
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.reverse() : [];
}

export async function fetchFullFundamentalData(ticker: string) {
  if (ticker.endsWith('.TW') || ticker.endsWith('.TWO')) {
    return await fetchTaiwanFundamentalData(ticker);
  }

  const symbol = ticker.toUpperCase();
  const [profile, income, balance, metrics] = await Promise.all([
    getCompanyProfile(symbol),
    getIncomeStatement(symbol),
    getBalanceSheet(symbol),
    getKeyMetrics(symbol)
  ]);

  if (!profile) return null;

  return {
    profile,
    income,
    balance,
    metrics
  };
}

async function fetchTaiwanFundamentalData(ticker: string) {
  const stockId = ticker.split('.')[0]; // e.g. 2330.TW -> 2330
  const startDate = '2019-01-01'; // Get last 5 years

  let profile = await getCompanyProfile(ticker);

  try {
    const [finRes, perRes, bsRes] = await Promise.all([
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockFinancialStatements&data_id=${stockId}&start_date=${startDate}&token=${FINMIND_TOKEN}`, { next: { revalidate: 3600 } }).then(r => r.json()),
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockPER&data_id=${stockId}&start_date=${startDate}&token=${FINMIND_TOKEN}`, { next: { revalidate: 3600 } }).then(r => r.json()),
      fetch(`https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockBalanceSheet&data_id=${stockId}&start_date=${startDate}&token=${FINMIND_TOKEN}`, { next: { revalidate: 3600 } }).then(r => r.json())
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
        companyName: stockId,
        industry: '-',
        sector: '-',
        description: '資料來源: FinMind 台灣金融數據 API',
        ceo: '-',
        city: 'Taiwan',
        state: ''
      };
    }

    return { profile, income, balance: [], metrics };

  } catch (error) {
    console.error("FinMind Error:", error);
    return { profile, income: [], balance: [], metrics: [] };
  }
}

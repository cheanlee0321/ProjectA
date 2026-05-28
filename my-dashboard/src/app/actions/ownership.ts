'use server';

import { getUserApiKeys } from '@/lib/keys';

const BASE_URL_V3 = 'https://financialmodelingprep.com/api/v3';
const BASE_URL_V4 = 'https://financialmodelingprep.com/api/v4';

export async function getInsiderTrading(ticker: string) {
  try {
    const keys = await getUserApiKeys();
    if (!keys.fmp) {
      return { error: 'Missing FMP API Key' };
    }

    // 13F and insider trading data usually update daily, cache for 1 week (604800 seconds)
    const res = await fetch(`${BASE_URL_V4}/insider-trading?symbol=${ticker}&page=0&apikey=${keys.fmp}`, {
      next: { revalidate: 604800 }
    });

    if (!res.ok) {
      if (res.status === 403) return { error: 'API Access Denied or Premium Required' };
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return { data };
  } catch (error: any) {
    console.error('Error fetching insider trading:', error);
    return { error: error.message };
  }
}

export async function getInstitutionalHoldings(ticker: string) {
  try {
    const keys = await getUserApiKeys();
    if (!keys.fmp) {
      return { error: 'Missing FMP API Key' };
    }

    // Cache for 1 week
    const res = await fetch(`${BASE_URL_V3}/institutional-holder/${ticker}?apikey=${keys.fmp}`, {
      next: { revalidate: 604800 }
    });

    if (!res.ok) {
      if (res.status === 403) return { error: 'API Access Denied or Premium Required' };
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return { data };
  } catch (error: any) {
    console.error('Error fetching institutional holdings:', error);
    return { error: error.message };
  }
}

export async function getTaiwanInstitutionalBuySell(ticker: string) {
  try {
    const keys = await getUserApiKeys();
    const stockId = ticker.split('.')[0];
    
    const date = new Date();
    date.setDate(date.getDate() - 30);
    const startDate = date.toISOString().split('T')[0];

    const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockInstitutionalInvestorsBuySell&data_id=${stockId}&start_date=${startDate}${keys.finmind ? `&token=${keys.finmind}` : ''}`;

    const res = await fetch(url, {
      next: { revalidate: 86400 }
    });

    const json = await res.json();
    if (json.status !== 200) return { error: json.msg || `API Error: ${json.status}` };

    return { data: json.data };
  } catch (error: any) {
    console.error('Error fetching TW institutional buy/sell:', error);
    return { error: error.message };
  }
}

export async function getTaiwanHoldingShares(ticker: string) {
  try {
    const keys = await getUserApiKeys();
    const stockId = ticker.split('.')[0];
    
    const date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    const startDate = date.toISOString().split('T')[0];

    const url = `https://api.finmindtrade.com/api/v4/data?dataset=TaiwanStockHoldingSharesPer&data_id=${stockId}&start_date=${startDate}${keys.finmind ? `&token=${keys.finmind}` : ''}`;

    const res = await fetch(url, {
      next: { revalidate: 86400 }
    });

    const json = await res.json();
    if (json.status !== 200) return { error: json.msg || `API Error: ${json.status}` };

    return { data: json.data };
  } catch (error: any) {
    console.error('Error fetching TW holding shares:', error);
    return { error: error.message };
  }
}


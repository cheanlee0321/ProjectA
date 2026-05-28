'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleWatchlist(symbol: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'unauthorized', message: '請先登入以使用追蹤功能' }
  }

  try {
    // 獲取該使用者的 watchlists 紀錄
    const { data: existing } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (existing) {
      let currentSymbols = existing.symbols || [];
      if (!Array.isArray(currentSymbols)) currentSymbols = [];

      if (currentSymbols.includes(symbol)) {
        // 存在就移除
        currentSymbols = currentSymbols.filter((s: string) => s !== symbol);
        let updatedTargetPrices = existing.target_prices || {};
        if (symbol in updatedTargetPrices) {
          delete updatedTargetPrices[symbol];
        }
        
        const { error } = await supabase
          .from('watchlists')
          .update({ symbols: currentSymbols, target_prices: updatedTargetPrices })
          .eq('id', existing.id);
        
        if (error) throw error;
        revalidatePath(`/fundamental/${symbol}`);
        revalidatePath('/watchlist');
        return { success: true, action: 'removed' }
      } else {
        // 不存在就加入
        currentSymbols.push(symbol);
        const { error } = await supabase
          .from('watchlists')
          .update({ symbols: currentSymbols })
          .eq('id', existing.id);
        
        if (error) throw error;
        revalidatePath(`/fundamental/${symbol}`);
        revalidatePath('/watchlist');
        return { success: true, action: 'added' }
      }
    } else {
      // 完全沒有紀錄，建立新的一筆 (陣列格式)
      const { error } = await supabase
        .from('watchlists')
        .insert({ user_id: user.id, symbols: [symbol] })
      
      if (error) throw error;
      revalidatePath(`/fundamental/${symbol}`);
      revalidatePath('/watchlist');
      return { success: true, action: 'added' }
    }
  } catch (err: any) {
    console.error('Watchlist toggle error:', err);
    return { success: false, error: err.message || '操作失敗，請稍後再試' }
  }
}

export async function getWatchlistStatus(symbol: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return false;

  const { data } = await supabase
    .from('watchlists')
    .select('symbols')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!data || !data.symbols || !Array.isArray(data.symbols)) return false;
  return data.symbols.includes(symbol);
}

export async function getUserWatchlist() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return [];

  const { data } = await supabase
    .from('watchlists')
    .select('symbols, target_prices, created_at')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!data || !data.symbols || !Array.isArray(data.symbols)) return [];

  const targetPrices = data.target_prices || {};

  // 將陣列轉換成 UI 預期的格式
  return data.symbols.map((s: string) => ({
    symbol: s,
    targetPrice: targetPrices[s] || null,
    created_at: data.created_at || new Date().toISOString()
  }));
}

export async function updateTargetPrice(symbol: string, price: number | null) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'unauthorized', message: '請先登入' }
  }

  try {
    const { data: existing } = await supabase
      .from('watchlists')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!existing) return { success: false, error: 'not found', message: '找不到追蹤清單' }

    const currentTargetPrices = existing.target_prices || {}
    
    if (price === null) {
      delete currentTargetPrices[symbol]
    } else {
      currentTargetPrices[symbol] = price
    }

    const { error } = await supabase
      .from('watchlists')
      .update({ target_prices: currentTargetPrices })
      .eq('id', existing.id)

    if (error) throw error;
    revalidatePath('/watchlist')
    return { success: true }
  } catch (err: any) {
    console.error('Update target price error:', err);
    return { success: false, error: err.message || '操作失敗，請稍後再試' }
  }
}

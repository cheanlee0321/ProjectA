'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import mammoth from 'mammoth'
import YahooFinance from 'yahoo-finance2'

export async function uploadReport(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: '請先登入以新增報告' }
  }

  try {
    let symbol = formData.get('symbol') as string;
    const market = formData.get('market') as string;
    const title = formData.get('title') as string;
    const reportDate = formData.get('reportDate') as string;
    const fileSource = formData.get('fileSource') as string; // 'upload' or 'url'
    
    // Format symbol based on market
    symbol = symbol.toUpperCase().trim();
    if (market === 'TW' && !symbol.endsWith('.TW') && !symbol.endsWith('.TWO')) {
      symbol = `${symbol}.TW`;
    }

    // Validate symbol via Yahoo Finance
    try {
      const quote = await YahooFinance.quote(symbol);
      if (!quote) throw new Error();
    } catch (e) {
      return { success: false, error: `找不到股票代號 ${symbol}，請確認輸入是否正確` };
    }
    
    // 取得作者 email 的前半段
    const email = user.email || '';
    const author = email.split('@')[0] || 'Unknown';

    let content = '';
    let original_file_url = '';
    let file_type = 'gdoc';

    if (fileSource === 'upload') {
      const file = formData.get('file') as File;
      if (!file) {
        return { success: false, error: '請選擇檔案' };
      }
      
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.\-_]/g, '')}`;
      
      // 上傳檔案至 Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, buffer, {
          contentType: file.type,
          upsert: false
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return { success: false, error: '檔案上傳失敗' };
      }

      // 取得公開連結
      const { data: publicUrlData } = supabase.storage
        .from('reports')
        .getPublicUrl(fileName);
        
      original_file_url = publicUrlData.publicUrl;

      // 解析內容
      if (file.name.endsWith('.docx')) {
        file_type = 'docx';
        const result = await mammoth.convertToHtml({ buffer });
        content = result.value;
      } else if (file.name.endsWith('.txt')) {
        file_type = 'txt';
        content = `<pre class="whitespace-pre-wrap">${buffer.toString('utf-8')}</pre>`;
      } else {
        return { success: false, error: '不支援的檔案格式，請上傳 .txt 或 .docx' };
      }
    } else {
      // Google Doc URL
      const url = formData.get('url') as string;
      if (!url) {
        return { success: false, error: '請提供 Google Doc 連結' };
      }
      original_file_url = url;
      file_type = 'gdoc';
      content = '<div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"><p class="text-center text-gray-500">這是一份外部連結的 Google Doc 報告，我們無法直接顯示內文。請點擊下方的原始連結查看。</p></div>';
    }

    // 寫入資料庫
    const { error: dbError } = await supabase
      .from('investment_reports')
      .insert({
        symbol,
        title,
        content,
        original_file_url,
        file_type,
        author,
        report_date: reportDate
      });

    if (dbError) {
      console.error("DB Insert error:", dbError);
      return { success: false, error: '資料庫寫入失敗' };
    }

    revalidatePath('/');
    revalidatePath('/reports');
    
    return { success: true };
  } catch (err: any) {
    console.error('Upload report error:', err);
    return { success: false, error: err.message || '處理失敗，請稍後再試' }
  }
}

export async function getReports(symbol?: string, sortBy: 'date' | 'author' = 'date') {
  const supabase = await createClient()
  
  let query = supabase.from('investment_reports').select('*');
  
  if (symbol && symbol !== 'all') {
    query = query.eq('symbol', symbol.toUpperCase());
  }
  
  if (sortBy === 'author') {
    query = query.order('author', { ascending: true }).order('report_date', { ascending: false });
  } else {
    query = query.order('report_date', { ascending: false });
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Fetch reports error:", error);
    return [];
  }
  
  return data;
}

export async function getReportById(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('investment_reports')
    .select('*')
    .eq('id', id)
    .maybeSingle();
    
  if (error) return null;
  return data;
}

export async function deleteReport(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return { success: false, error: 'unauthorized' };
  }

  const userEmailPrefix = user.email.split('@')[0];
  const isDeveloper = userEmailPrefix === 'cheanlee0321';

  // Fetch the report to check author and get file url
  const { data: report, error: fetchError } = await supabase
    .from('investment_reports')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !report) {
    return { success: false, error: '報告不存在' };
  }

  const isOwner = report.author === userEmailPrefix;

  if (!isDeveloper && !isOwner) {
    return { success: false, error: '您沒有權限刪除此報告' };
  }

  // Delete from DB
  const { error: deleteError } = await supabase
    .from('investment_reports')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error("Delete DB error:", deleteError);
    return { success: false, error: '資料庫刪除失敗' };
  }

  // If it's an uploaded file, try to delete it from Storage
  if (report.file_type !== 'gdoc' && report.original_file_url) {
    try {
      // url example: .../storage/v1/object/public/reports/1690000000_file.docx
      const urlParts = report.original_file_url.split('/reports/');
      if (urlParts.length > 1) {
        const fileName = urlParts[1];
        await supabase.storage.from('reports').remove([fileName]);
      }
    } catch (e) {
      console.error("Storage delete error:", e);
      // Proceed anyway, DB delete was successful
    }
  }

  revalidatePath('/');
  revalidatePath('/reports');
  
  return { success: true };
}

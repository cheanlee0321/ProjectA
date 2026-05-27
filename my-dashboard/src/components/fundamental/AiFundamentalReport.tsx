'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

interface Props {
  ticker: string;
  geminiApiKey: string | null;
  geminiModel: string | null;
  data: any;
}

export default function AiFundamentalReport({ ticker, geminiApiKey, geminiModel, data }: Props) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportDate, setReportDate] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchReport = async (forceRefresh = false) => {
    if (!forceRefresh && hasFetched.current) return;
    if (!geminiApiKey) {
      setError('請先至設定頁面填寫您的 Google Gemini API Key 以解鎖 AI 深度分析功能。');
      setLoading(false);
      return;
    }

    if (!forceRefresh) {
      hasFetched.current = true;
    } else {
      setLoading(true);
      setContent('');
      setError(null);
    }

    try {
      const response = await fetch('/api/ai/fundamental', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticker, geminiApiKey, geminiModel, data, forceRefresh })
      });


        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || '無法取得 AI 分析報告');
        }

        // 檢查是否為直接回傳的快取 (JSON)
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const json = await response.json();
          if (json.cached) {
            setContent(json.text);
            if (json.updatedAt) {
              setReportDate(new Date(json.updatedAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }));
            }
            setLoading(false);
            return;
          }
        }

        // 處理串流 (Streaming)
        const reader = response.body?.getReader();
        if (!reader) throw new Error('ReadableStream not supported');

        const decoder = new TextDecoder();
        let done = false;
        let isFirstChunk = true;

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            if (isFirstChunk) {
              setLoading(false); // 收到第一個字節就取消 Loading 狀態
              setReportDate(new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })); // 設定當下產生的時間
              isFirstChunk = false;
            }
            setContent((prev) => prev + decoder.decode(value, { stream: true }));
          }
        }
    } catch (err: any) {
      setError(err.message || '發生未知錯誤');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [ticker, geminiApiKey, data]);

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-red-400 h-full flex flex-col items-center justify-center text-center">
        <span className="text-4xl mb-4">⚠️</span>
        <h3 className="font-bold text-lg mb-2">AI 分析失敗</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-foreground/5 border border-foreground/10 p-6 md:p-8 rounded-2xl h-full shadow-inner relative overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-foreground/10">
        <div className="flex flex-wrap items-center gap-4">
          <h3 className="text-xl font-bold text-foreground flex items-center flex-wrap gap-2">
            🤖 AI 財報與法說會深度解析
            <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              {geminiModel || 'gemini-2.5-flash'}
            </span>
            {reportDate && (
              <span className="text-xs font-medium text-foreground/50 bg-foreground/5 px-2 py-0.5 rounded-full border border-foreground/10">
                報告產出時間: {reportDate}
              </span>
            )}
          </h3>
          <span className="text-xs text-foreground/40 px-2 py-1 rounded border border-foreground/10 hidden sm:inline-block">
            ⚠️ AI 資料可能有誤，請審慎參考，詳實驗證
          </span>
        </div>
        <div className="flex items-center gap-4">
          {loading && (
            <span className="text-xs font-medium bg-rose-500/20 text-rose-300 px-3 py-1 rounded-full animate-pulse border border-rose-500/30">
              分析中...
            </span>
          )}
          {!loading && (
            <button 
              onClick={() => fetchReport(true)}
              className="text-xs px-3 py-1.5 bg-foreground/10 hover:bg-foreground/20 text-foreground/80 rounded-md transition-colors"
            >
              重新產生報告
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {loading && !content ? (
          <div className="flex flex-col items-center justify-center h-full text-foreground/50 space-y-6 py-12">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-t-2 border-rose-400 animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-r-2 border-indigo-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-center text-sm leading-relaxed max-w-[200px]">
              AI 正在閱讀 {ticker} 最新財報與搜尋網路新聞...<br />這可能需要 30~60 秒，請耐心等候。
            </p>
          </div>
        ) : (
          <div className="prose prose-invert prose-rose max-w-none text-sm md:text-base leading-relaxed prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-a:text-rose-400 prose-table:w-full prose-th:bg-foreground/10 prose-th:p-2 prose-td:p-2 prose-td:border-t prose-td:border-foreground/10">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Scrollbar styles to add to globals.css later if needed, but standard tailwind prose handles most of it nicely */}
    </div>
  );
}

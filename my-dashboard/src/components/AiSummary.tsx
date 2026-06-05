"use client";

import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import { generateAiSummaryAction, regenerateSummary } from "@/app/actions/summary";

export default function AiSummary() {
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<{ text: string; date: string; promptText: string; isLoading: boolean } | null>(null);

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await generateAiSummaryAction();
      setData(result);
    });
  };

  const handleRegenerate = () => {
    startTransition(async () => {
      await regenerateSummary();
      const result = await generateAiSummaryAction();
      setData(result);
    });
  };

  if (!data) {
    return (
      <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 mb-12 relative z-10 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-[300px]">
        <div className="text-4xl mb-4">✨</div>
        <h2 className="text-2xl font-bold text-foreground mb-4">Gemini AI 執行摘要</h2>
        <p className="text-foreground/60 text-sm mb-6">點擊下方按鈕，根據最新數據生成 AI 分析摘要</p>
        <button 
          onClick={handleGenerate}
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-500/10 text-indigo-400 font-semibold rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/20"
        >
          {isPending ? "生成中..." : "產生 AI 摘要"}
        </button>
      </div>
    );
  }

  if (data.isLoading || isPending) {
    return (
      <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 mb-12 relative z-10 backdrop-blur-md shadow-2xl flex flex-col items-center justify-center min-h-[300px] animate-pulse">
        <div className="text-4xl mb-4 animate-bounce">✨</div>
        <h2 className="text-2xl font-bold text-foreground mb-2">等待資料中...</h2>
        <p className="text-foreground/60 text-sm">請稍候，正在取得所有最新資料以供 AI 分析</p>
      </div>
    );
  }

  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-3xl p-8 mb-12 relative z-10 backdrop-blur-md shadow-2xl">
      <div className="flex items-center justify-between mb-6 border-b border-foreground/10 pb-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl">✨</div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Gemini AI 執行摘要</h2>
            <p className="text-foreground/60 text-sm mt-1">基於即時數據，由 Gemini 2.5 Flash 自動生成</p>
          </div>
        </div>
        <button 
          onClick={handleRegenerate}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 font-semibold rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-indigo-500/20"
        >
          <svg 
            className={`w-4 h-4 ${isPending ? 'animate-spin' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isPending ? "重新分析中..." : "重新產生"}
        </button>
      </div>
      
      <div className="prose max-w-none text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground prose-p:text-foreground/80 prose-ul:text-foreground/80 prose-li:text-foreground/80 leading-relaxed">
        <ReactMarkdown>{data.text}</ReactMarkdown>
      </div>

      <div className="mt-6 text-right text-foreground/50 text-sm font-medium border-t border-foreground/10 pt-4 mb-6">
        總結生成時間：{data.date}
      </div>

      {data.promptText && (
        <div className="mt-8 pt-6 border-t border-foreground/10">
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-foreground/60 hover:text-foreground transition-colors flex items-center gap-2 select-none">
              <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              顯示分析 Prompt
            </summary>
            <div className="mt-4 p-4 bg-background/50 rounded-xl text-sm text-foreground/70 whitespace-pre-wrap font-mono overflow-x-auto">
              {data.promptText}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

import { getCachedMarketSummary } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";
import { getUserApiKeys } from "@/lib/keys";
import RegenerateButton from "./RegenerateButton";

export default async function AiSummary() {
  const keys = await getUserApiKeys();
  const { text: summary, date, isLoading } = await getCachedMarketSummary(keys.gemini, keys.finmind);

  if (isLoading) {
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
        <RegenerateButton />
      </div>
      
      <div className="prose max-w-none text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground prose-p:text-foreground/80 prose-ul:text-foreground/80 prose-li:text-foreground/80 leading-relaxed">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>

      <div className="mt-6 text-right text-foreground/50 text-sm font-medium border-t border-foreground/10 pt-4">
        總結生成時間：{date}
      </div>
    </div>
  );
}

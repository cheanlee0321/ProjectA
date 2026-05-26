import { getCachedMarketSummary } from "@/lib/gemini";
import ReactMarkdown from "react-markdown";

export default async function AiSummary() {
  const { text: summary, date } = await getCachedMarketSummary();

  return (
    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-3xl p-8 mb-12 relative z-10 backdrop-blur-md shadow-2xl">
      <div className="flex items-center gap-4 mb-6 border-b border-indigo-500/20 pb-4">
        <div className="text-4xl">✨</div>
        <div>
          <h2 className="text-2xl font-bold text-indigo-300">Gemini AI 執行摘要</h2>
          <p className="text-indigo-200/60 text-sm mt-1">基於即時數據，由 Gemini 2.5 Flash 自動生成</p>
        </div>
      </div>
      
      <div className="prose prose-invert prose-indigo max-w-none text-indigo-100/80 leading-relaxed">
        <ReactMarkdown>{summary}</ReactMarkdown>
      </div>

      <div className="mt-6 text-right text-indigo-300/50 text-sm font-medium border-t border-indigo-500/10 pt-4">
        總結生成時間：{date}
      </div>
    </div>
  );
}

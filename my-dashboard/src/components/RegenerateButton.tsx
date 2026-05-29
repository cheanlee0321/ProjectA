"use client";

import { useTransition } from "react";
import { regenerateSummary } from "@/app/actions/summary";

export default function RegenerateButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button 
      onClick={() => startTransition(() => regenerateSummary())}
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
  );
}

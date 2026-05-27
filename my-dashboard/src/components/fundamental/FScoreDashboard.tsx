"use client";

import React from 'react';
import { FScoreResult } from '@/lib/advancedAnalysis';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function FScoreDashboard({ result }: { result: FScoreResult | null }) {
  if (!result) return <div className="p-4 text-gray-500">尚無足夠資料計算 Piotroski F-Score (需兩年財報)</div>;

  const { score, passFail, details } = result;

  // Determine color based on score
  let scoreColor = 'text-red-500';
  let ringColor = 'stroke-red-500';
  if (score >= 7) {
    scoreColor = 'text-green-500';
    ringColor = 'stroke-green-500';
  } else if (score >= 4) {
    scoreColor = 'text-yellow-500';
    ringColor = 'stroke-yellow-500';
  }

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 9) * circumference;

  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold mb-6 text-foreground">Piotroski F-Score 財務健康評分</h3>
      
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* Left: Score Circle */}
        <div className="flex flex-col items-center justify-center relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            <circle
              className="stroke-foreground/10"
              strokeWidth="12"
              fill="transparent"
              r={radius}
              cx="70"
              cy="70"
            />
            <circle
              className={`${ringColor} transition-all duration-1000 ease-out`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              r={radius}
              cx="70"
              cy="70"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-5xl font-extrabold ${scoreColor}`}>{score}</span>
            <span className="text-foreground/50 text-sm mt-1">/ 9 分</span>
          </div>
        </div>

        {/* Right: Checklist */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {details.map((detail, idx) => {
            const passed = passFail[idx];
            return (
              <div 
                key={idx} 
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  passed 
                    ? 'border-green-500/20 bg-green-500/5' 
                    : 'border-red-500/20 bg-red-500/5'
                }`}
              >
                {passed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                )}
                <span className={`text-sm ${passed ? 'text-foreground/90' : 'text-foreground/60'}`}>
                  {detail}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-6 text-xs text-foreground/40">
        * 註：7-9分為財務健康，4-6分為一般，0-3分可能有潛在風險。指標以最近一期年報/季報與前期相比。
      </div>
    </div>
  );
}

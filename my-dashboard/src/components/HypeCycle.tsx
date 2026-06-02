"use client";

import React from 'react';

export default function HypeCycle() {
  const points = [
    { id: 1, name: '技術誕生的促動期', x: 15, y: 73, phase: 'Technology Trigger', desc: '新技術出現，媒體大量報導，引發市場強烈關注。', color: 'bg-emerald-500' },
    { id: 2, name: '過度期望的峰值期', x: 35, y: 10, phase: 'Peak of Inflated Expectations', desc: '早期成功案例出現，預期被推向不切實際的高峰。', color: 'bg-rose-500' },
    { id: 3, name: '泡沫化的底谷期', x: 55, y: 85, phase: 'Trough of Disillusionment', desc: '實驗失敗或進展不如預期，期望破滅，股價大幅回落。', color: 'bg-indigo-500' },
    { id: 4, name: '穩步爬升的光明期', x: 76, y: 59, phase: 'Slope of Enlightenment', desc: '更多企業了解技術的實際應用方式，二代產品出現。', color: 'bg-blue-400' },
    { id: 5, name: '實質生產的高原期', x: 95, y: 45, phase: 'Plateau of Productivity', desc: '技術成為主流，市場穩定增長，企業開始獲利。', color: 'bg-teal-500' },
  ];

  return (
    <div className="w-full relative bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-3xl p-8 mt-16 shadow-2xl overflow-hidden group">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000"></div>
      
      <div className="mb-8 relative z-10">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center">
          <span className="text-4xl mr-3">🎢</span> 技術成熟度曲線 (Hype Cycle)
        </h2>
        <p className="text-foreground/60 text-lg">
          辨識新科技的市場情緒，避免在「過度期望的峰值」追高，並在「泡沫化的底谷」尋找錯殺的價值。
        </p>
      </div>

      <div className="relative w-full aspect-[2/1] min-h-[300px] max-h-[500px] mt-10 mb-6">
        
        {/* The Curve (SVG) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible drop-shadow-2xl">
          <defs>
            <linearGradient id="hypeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.8)" /> {/* Emerald */}
              <stop offset="35%" stopColor="rgba(244, 63, 94, 0.8)" /> {/* Rose */}
              <stop offset="55%" stopColor="rgba(99, 102, 241, 0.8)" /> {/* Indigo */}
              <stop offset="75%" stopColor="rgba(59, 130, 246, 0.8)" /> {/* Blue */}
              <stop offset="100%" stopColor="rgba(20, 184, 166, 0.8)" /> {/* Teal */}
            </linearGradient>
            
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Axis */}
          <line x1="0" y1="95" x2="100" y2="95" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
          <line x1="2" y1="5" x2="2" y2="95" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
          
          {/* Labels */}
          <text x="50" y="99" fontSize="2.5" fill="currentColor" className="text-foreground/40 font-medium" textAnchor="middle">時間 (Time)</text>
          <text x="-50" y="0" fontSize="2.5" fill="currentColor" className="text-foreground/40 font-medium" transform="rotate(-90)" textAnchor="middle">期望值 (Expectations)</text>

          {/* Guidelines */}
          <line x1="2" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" className="text-foreground/10" />
          <line x1="2" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" className="text-foreground/10" />

          {/* The Path */}
          <path 
            d="M 2 90 C 20 90, 25 10, 35 10 C 45 10, 50 85, 55 85 C 65 85, 75 45, 98 45" 
            fill="none" 
            stroke="url(#hypeGradient)" 
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#glow)"
            className="animate-[dash_3s_ease-out_forwards]"
            strokeDasharray="300"
            strokeDashoffset="300"
          />
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }
          `}} />
        </svg>

        {/* Phase Points */}
        {points.map((point) => (
          <div 
            key={point.id} 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 group/point z-10 cursor-pointer"
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
          >
            <div className={`w-5 h-5 rounded-full ${point.color} shadow-lg border-2 border-background transition-transform duration-300 group-hover/point:scale-125 group-hover/point:shadow-[0_0_20px_currentColor]`} style={{ color: 'inherit' }}></div>
            
            {/* Tooltip */}
            <div className="absolute opacity-0 invisible group-hover/point:opacity-100 group-hover/point:visible transition-all duration-300 bottom-full left-1/2 -translate-x-1/2 mb-3 w-max max-w-[250px] z-20">
              <div className="bg-background/95 backdrop-blur-xl border border-foreground/10 shadow-2xl rounded-xl p-4 text-sm">
                <p className="font-bold text-foreground text-base mb-1">{point.name}</p>
                <p className="text-foreground/60 text-xs mb-2 font-medium">{point.phase}</p>
                <p className="text-foreground/80 text-sm leading-relaxed">{point.desc}</p>
              </div>
              <div className="w-3 h-3 bg-background border-b border-r border-foreground/10 transform rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2"></div>
            </div>
            
            {/* Always visible label */}
            <div className={`absolute left-1/2 -translate-x-1/2 w-max mt-3 ${point.id === 2 ? 'top-full' : (point.id === 3 ? 'bottom-full mb-8 top-auto' : 'top-full')}`}>
              <span className="text-xs md:text-sm font-bold text-foreground/80 bg-background/60 px-3 py-1 rounded-full backdrop-blur-md border border-foreground/10 shadow-sm block">
                {point.name}
              </span>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  );
}

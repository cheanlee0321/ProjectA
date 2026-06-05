"use client";

import React from 'react';

export default function DunningKruger() {
  const points = [
    { id: 1, name: '愚昧之巔', x: 20, y: 15, phase: 'Peak of Mount Stupid', desc: '剛接觸一點知識，自信心爆棚，以為自己無所不知，最容易在此時重倉虧損。', color: 'bg-rose-500' },
    { id: 2, name: '絕望之谷', x: 45, y: 85, phase: 'Valley of Despair', desc: '經歷市場震撼教育，發現投資比想像中複雜得多，自信心跌至谷底。', color: 'bg-indigo-500' },
    { id: 3, name: '開悟之坡', x: 70, y: 55, phase: 'Slope of Enlightenment', desc: '開始建立交易系統與紀律，掌握真正的知識與技能，自信心踏實回升。', color: 'bg-blue-400' },
    { id: 4, name: '平穩高原', x: 95, y: 40, phase: 'Plateau of Sustainability', desc: '成為真正的贏家，深知自己的能力圈與邊界，情緒穩定且自信。', color: 'bg-emerald-500' },
  ];

  return (
    <div className="w-full relative bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-3xl p-8 mt-16 shadow-2xl overflow-hidden group">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-orange-500/20 transition-all duration-1000"></div>
      
      <div className="mb-8 relative z-10">
        <h2 className="text-3xl font-bold text-foreground mb-2 flex items-center">
          <span className="text-4xl mr-3">🧠</span> 達克效應 (Dunning-Kruger Effect)
        </h2>
        <p className="text-foreground/60 text-lg">
          新手在初期常會過度自信（愚昧之巔），只有在經歷市場的毒打後（絕望之谷），才能真正開始學習並累積實力，最終成為穩健的投資者。
        </p>
      </div>

      <div className="relative w-full aspect-[2/1] min-h-[300px] max-h-[500px] mt-10 mb-6">
        
        {/* The Curve (SVG) */}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible drop-shadow-2xl">
          <defs>
            <linearGradient id="dkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(245, 158, 11, 0.8)" /> {/* Amber */}
              <stop offset="20%" stopColor="rgba(244, 63, 94, 0.8)" /> {/* Rose */}
              <stop offset="45%" stopColor="rgba(99, 102, 241, 0.8)" /> {/* Indigo */}
              <stop offset="70%" stopColor="rgba(59, 130, 246, 0.8)" /> {/* Blue */}
              <stop offset="100%" stopColor="rgba(16, 185, 129, 0.8)" /> {/* Emerald */}
            </linearGradient>
            
            <filter id="glowDk" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Axis */}
          <line x1="0" y1="95" x2="100" y2="95" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
          <line x1="2" y1="5" x2="2" y2="95" stroke="currentColor" strokeWidth="0.5" className="text-foreground/20" />
          
          {/* Labels */}
          <text x="50" y="99" fontSize="2.5" fill="currentColor" className="text-foreground/40 font-medium" textAnchor="middle">能力 / 知識 (Competence)</text>
          <text x="-50" y="0" fontSize="2.5" fill="currentColor" className="text-foreground/40 font-medium" transform="rotate(-90)" textAnchor="middle">自信心 (Confidence)</text>

          {/* The Path */}
          <path 
            d="M 5 95 C 10 95, 15 15, 20 15 C 30 15, 35 85, 45 85 C 55 85, 60 55, 70 55 C 80 55, 85 40, 95 40" 
            fill="none" 
            stroke="url(#dkGradient)" 
            strokeWidth="1.5"
            strokeLinecap="round"
            filter="url(#glowDk)"
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
            <div className={`absolute left-1/2 -translate-x-1/2 w-max mt-3 ${point.id === 1 ? 'top-full' : (point.id === 2 ? 'bottom-full mb-8 top-auto' : 'top-full')}`}>
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

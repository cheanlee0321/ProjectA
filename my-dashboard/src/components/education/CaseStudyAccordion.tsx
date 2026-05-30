"use client";

import { useState } from 'react';

interface CaseStudyAccordionProps {
  title: string;
  icon?: string;
  theme?: 'rose' | 'indigo' | 'emerald' | 'amber' | 'blue' | 'yellow' | 'slate' | 'cyan' | 'purple';
  children: React.ReactNode;
}

export default function CaseStudyAccordion({ title, icon = '💡', theme = 'emerald', children }: CaseStudyAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const themeColors = {
    rose: 'border-rose-500/30 bg-rose-500/5 text-rose-400 hover:bg-rose-500/10',
    indigo: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400 hover:bg-indigo-500/10',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-500 hover:bg-amber-500/10',
    blue: 'border-blue-500/30 bg-blue-500/5 text-blue-400 hover:bg-blue-500/10',
    yellow: 'border-yellow-500/30 bg-yellow-500/5 text-yellow-500 hover:bg-yellow-500/10',
    slate: 'border-slate-500/30 bg-slate-800/40 text-slate-300 hover:bg-slate-700/50',
    cyan: 'border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10',
    purple: 'border-purple-500/30 bg-purple-500/5 text-purple-400 hover:bg-purple-500/10',
  };

  const buttonStyle = themeColors[theme] || themeColors.emerald;

  return (
    <div className={`mt-4 rounded-xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-foreground/20 bg-background/50 shadow-md' : 'border-transparent'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${!isOpen ? buttonStyle : 'bg-foreground/5 text-foreground'}`}
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-xl shrink-0">{icon}</span>
          <span className="font-bold">實戰案例：{title}</span>
        </div>
        <svg
          className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-5 text-foreground/80 text-sm leading-relaxed border-t border-foreground/10 mt-1 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}

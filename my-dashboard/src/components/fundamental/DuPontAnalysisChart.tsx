"use client";

import React from 'react';
import { DuPontResult } from '@/lib/advancedAnalysis';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

export default function DuPontAnalysisChart({ data }: { data: DuPontResult[] }) {
  if (!data || data.length === 0) {
    return <div className="p-4 text-gray-500">無足夠資料繪製杜邦分析圖表。</div>;
  }

  // format data for percentage display
  const formattedData = data.map(d => ({
    ...d,
    roeDisplay: Number((d.roe * 100).toFixed(2)),
    netMarginDisplay: Number((d.netProfitMargin * 100).toFixed(2)),
    assetTurnoverDisplay: Number(d.assetTurnover.toFixed(2)), // not a percentage
    equityMultiplierDisplay: Number(d.equityMultiplier.toFixed(2)) // not a percentage
  }));

  return (
    <div className="bg-foreground/5 border border-foreground/10 rounded-xl p-6 mb-8">
      <h3 className="text-xl font-bold mb-2 text-foreground">杜邦分析 (DuPont Analysis)</h3>
      <p className="text-sm text-foreground/60 mb-6">
        將 ROE (股東權益報酬率) 拆解為三大驅動因素：淨利率、總資產周轉率、權益乘數 (槓桿)。
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ROE Trend */}
        <div className="h-72">
          <h4 className="text-sm font-semibold mb-4 text-center text-foreground/80">ROE 走勢 (%)</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--foreground)" strokeOpacity={0.1} />
              <XAxis dataKey="year" stroke="var(--foreground)" strokeOpacity={0.6} fontSize={12} />
              <YAxis stroke="var(--foreground)" strokeOpacity={0.6} fontSize={12} tickFormatter={(val) => `${val}%`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)', borderRadius: '12px' }}
                itemStyle={{ color: '#3B82F6' }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="roeDisplay" 
                name="ROE (%)" 
                stroke="#3B82F6" 
                strokeWidth={3} 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* The 3 Factors */}
        <div className="h-72">
          <h4 className="text-sm font-semibold mb-4 text-center text-foreground/80">杜邦三大要素拆解</h4>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--foreground)" strokeOpacity={0.1} />
              <XAxis dataKey="year" stroke="var(--foreground)" strokeOpacity={0.6} fontSize={12} />
              <YAxis yAxisId="left" stroke="var(--foreground)" strokeOpacity={0.6} fontSize={12} tickFormatter={(val) => `${val}%`} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--foreground)" strokeOpacity={0.6} fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)', borderRadius: '12px' }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="netMarginDisplay" 
                name="淨利率 (%)" 
                stroke="#10B981" 
                strokeWidth={2} 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="assetTurnoverDisplay" 
                name="資產周轉率 (倍)" 
                stroke="#F59E0B" 
                strokeWidth={2} 
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="equityMultiplierDisplay" 
                name="權益乘數 (倍)" 
                stroke="#8B5CF6" 
                strokeWidth={2} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-foreground/5 rounded-lg border border-foreground/10">
        <div className="text-sm font-semibold mb-2 text-foreground/80">📝 分析指南</div>
        <ul className="text-sm text-foreground/70 list-disc pl-5 space-y-1">
          <li><strong>淨利率 (Profit Margin)：</strong> 公司本業賺錢的能力。越高代表產品利潤越好或成本控制得當。</li>
          <li><strong>資產周轉率 (Asset Turnover)：</strong> 公司運用資產創造營收的效率。越高代表資產利用率越好。</li>
          <li><strong>權益乘數 (Equity Multiplier)：</strong> 公司的財務槓桿。數字越高代表負債比例越高，可以放大 ROE，但也帶來更高的財務風險。</li>
        </ul>
      </div>
    </div>
  );
}

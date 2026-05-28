"use client";

import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Activity } from 'lucide-react';
import AiFundamentalReport from './AiFundamentalReport';
import AiCompetitorAnalysis from './AiCompetitorAnalysis';
import ReportLibrary from '@/components/reports/ReportLibrary';
import FScoreDashboard from './FScoreDashboard';
import DuPontAnalysisChart from './DuPontAnalysisChart';
import PriceChart from './PriceChart';
import OwnershipAnalysis from './OwnershipAnalysis';
import TechnicalAnalysis from './TechnicalAnalysis';

export default function ClientFundamentalView({ data, advancedData, ticker, geminiApiKey, geminiModel, relatedReports = [], historicalPrices = [] }: { data: any, advancedData: any, ticker: string, geminiApiKey: string | null, geminiModel: string | null, relatedReports?: any[], historicalPrices?: any[] }) {
  const [activeTab, setActiveTab] = useState<'summary' | 'financials' | 'ratios' | 'advanced-analysis' | 'technical' | 'ownership' | 'ai-report' | 'related-reports'>('summary');
  const [selectedChart, setSelectedChart] = useState<{ title: string, data: { year: string, value: number }[], isPercent?: boolean, isInverse?: boolean, section?: string } | null>(null);

  if (!data || !data.profile) {
    return <div className="text-foreground text-center mt-20 text-2xl">找不到該股票資料，請確認代號是否正確。</div>;
  }

  const { profile, income, balance, cashflow, metrics } = data;

  // Chart Data Preparation (from income statement)
  const summaryChartData = income.map((item: any) => ({
    year: item.date ? item.date.split('-')[0] : item.fiscalYear,
    revenue: item.revenue / 1000000000, // in Billions
    netIncome: item.netIncome / 1000000000 // in Billions
  }));

  const handleIncomeClick = (title: string, dataKey: string, divisor: number = 1000000) => {
    setSelectedChart({
      title: `${title} 歷史趨勢`,
      section: 'income',
      data: income.map((item: any) => ({
        year: item.date ? item.date.split('-')[0] : item.fiscalYear,
        value: Number(item[dataKey]) / divisor
      }))
    });
  };

  const handleBalanceClick = (title: string, dataKey: string, divisor: number = 1000000) => {
    setSelectedChart({
      title: `${title} 歷史趨勢`,
      section: 'balance',
      data: balance.map((item: any) => ({
        year: item.date ? item.date.split('-')[0] : item.fiscalYear,
        value: Number(item[dataKey]) / divisor
      }))
    });
  };

  const handleCashFlowClick = (title: string, dataKey: string, divisor: number = 1000000) => {
    setSelectedChart({
      title: `${title} 歷史趨勢`,
      section: 'cashflow',
      data: (cashflow || []).map((item: any) => ({
        year: item.date ? item.date.split('-')[0] : item.fiscalYear,
        value: Number(item[dataKey]) / divisor
      }))
    });
  };

  const handleMetricClick = (title: string, dataKey: string, isPercent: boolean = false, isInverse: boolean = false) => {
    setSelectedChart({
      title: `${title} 歷史趨勢`,
      section: 'ratios',
      isPercent,
      data: metrics.map((item: any) => ({
        year: item.date ? item.date.split('-')[0] : item.fiscalYear,
        value: isInverse ? (item[dataKey] ? 1 / item[dataKey] : 0) : (item[dataKey] || 0)
      }))
    });
  };

  const formatTooltipValue = (value: number | string | any, isPercent?: boolean) => {
    const numValue = Number(value);
    if (isNaN(numValue)) return value;
    if (isPercent) return `${(numValue * 100).toFixed(2)}%`;
    return numValue.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const renderDynamicChart = (sectionName: string) => {
    if (!selectedChart || selectedChart.section !== sectionName) return null;

    return (
      <div className="bg-background border border-rose-500/30 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 mt-6 mb-12">
        <h4 className="text-xl font-bold text-rose-300 mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2" />
          {selectedChart.title}
        </h4>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedChart.data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--foreground)" strokeOpacity={0.1} />
              <XAxis dataKey="year" stroke="var(--foreground)" strokeOpacity={0.6} />
              <YAxis stroke="var(--foreground)" strokeOpacity={0.6} domain={['auto', 'auto']} tickFormatter={(value) => selectedChart.isPercent ? `${(value * 100).toFixed(0)}%` : value.toString()} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)', borderRadius: '12px' }}
                itemStyle={{ color: '#fb7185' }}
                formatter={(value: any) => formatTooltipValue(value, selectedChart.isPercent)}
              />
              <Line type="monotone" dataKey="value" name="數值" stroke="#fb7185" strokeWidth={3} dot={{ r: 6, fill: '#fb7185', strokeWidth: 2, stroke: 'var(--background)' }} activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-8 relative z-10 w-full pb-20">
      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b border-foreground/10 mb-8">
        {[
          { id: 'summary', label: '公司概況' },
          { id: 'financials', label: '三大報表' },
          { id: 'ratios', label: '關鍵指標' },
          { id: 'advanced-analysis', label: '進階財務模型' },
          { id: 'technical', label: '技術面分析' },
          { id: 'ownership', label: '籌碼面分析' },
          { id: 'ai-report', label: 'AI 財報速讀' },
          { id: 'related-reports', label: '📚分析報告書架' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSelectedChart(null);
            }}
            className={`px-6 py-3 font-medium transition-all ${activeTab === tab.id
              ? 'text-rose-400 border-b-2 border-rose-400 bg-foreground/5 rounded-t-lg'
              : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-t-lg'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-3xl p-6 md:p-10 shadow-2xl">

        {activeTab === 'summary' && (
          <div className="space-y-12">
            {/* Price Trend Chart Section */}
            {historicalPrices && historicalPrices.length > 0 && (
              <PriceChart data={historicalPrices} ticker={ticker} />
            )}

            {/* Chart Section */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-foreground/10 pb-4">營收與淨利趨勢 (十億美元)</h3>
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={summaryChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--foreground)" strokeOpacity={0.2} />
                    <XAxis dataKey="year" stroke="var(--foreground)" strokeOpacity={0.8} />
                    <YAxis stroke="var(--foreground)" strokeOpacity={0.8} />
                    <Tooltip
                      contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)', borderRadius: '12px' }}
                      itemStyle={{ color: 'var(--foreground)' }}
                    />
                    <Legend />
                    <Bar dataKey="revenue" name="營收 (Revenue)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="netIncome" name="淨利 (Net Income)" fill="#e11d48" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Profile Info */}
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-6 border-b border-foreground/10 pb-4">公司簡介</h3>
              <p className="text-foreground/70 leading-relaxed text-lg mb-6">{profile.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-foreground/5 p-4 rounded-xl border border-foreground/5">
                  <div className="text-foreground/50 text-sm mb-1">產業 (Industry)</div>
                  <div className="text-foreground font-medium">{profile.industry}</div>
                </div>
                <div className="bg-foreground/5 p-4 rounded-xl border border-foreground/5">
                  <div className="text-foreground/50 text-sm mb-1">板塊 (Sector)</div>
                  <div className="text-foreground font-medium">{profile.sector}</div>
                </div>
                <div className="bg-foreground/5 p-4 rounded-xl border border-foreground/5">
                  <div className="text-foreground/50 text-sm mb-1">CEO</div>
                  <div className="text-foreground font-medium">{profile.ceo}</div>
                </div>
                <div className="bg-foreground/5 p-4 rounded-xl border border-foreground/5">
                  <div className="text-foreground/50 text-sm mb-1">總部</div>
                  <div className="text-foreground font-medium">{profile.city}, {profile.state}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-12">
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">年度損益表 (Annual Income Statement)</h3>
                <span className="text-rose-400/80 text-sm flex items-center"><Activity className="w-4 h-4 mr-1" /> 點擊任意行即可查看歷史趨勢圖</span>
              </div>
              <table className="w-full text-left text-foreground">
                <thead className="bg-foreground/10 text-foreground/80 border-b border-foreground/20">
                  <tr>
                    <th className="p-4 rounded-tl-xl font-semibold">項目 (百萬美元)</th>
                    {[...income].reverse().map((item: any) => (
                      <th key={item.date || item.fiscalYear} className="p-4 font-semibold">{item.date ? item.date.split('-')[0] : item.fiscalYear}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleIncomeClick('營業收入', 'revenue')}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">營業收入 (Revenue)</td>
                    {[...income].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.revenue / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleIncomeClick('營業成本', 'costOfRevenue')}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">營業成本 (Cost of Revenue)</td>
                    {[...income].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.costOfRevenue / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors font-medium text-indigo-300 cursor-pointer group" onClick={() => handleIncomeClick('毛利', 'grossProfit')}>
                    <td className="p-4 group-hover:text-indigo-200 transition-colors">毛利 (Gross Profit)</td>
                    {[...income].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.grossProfit / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleIncomeClick('營業費用', 'operatingExpenses')}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">營業費用 (Operating Expenses)</td>
                    {[...income].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.operatingExpenses / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors font-medium text-indigo-300 cursor-pointer group" onClick={() => handleIncomeClick('營業利益', 'operatingIncome')}>
                    <td className="p-4 group-hover:text-indigo-200 transition-colors">營業利益 (Operating Income)</td>
                    {[...income].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.operatingIncome / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors font-bold text-rose-400 cursor-pointer group" onClick={() => handleIncomeClick('淨利', 'netIncome')}>
                    <td className="p-4 group-hover:text-rose-300 transition-colors">淨利 (Net Income)</td>
                    {[...income].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.netIncome / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleIncomeClick('每股盈餘 (EPS)', 'eps', 1)}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">每股盈餘 (EPS)</td>
                    {[...income].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{item.eps.toFixed(2)}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {renderDynamicChart('income')}

            {/* Balance Sheet Table */}
            <div className="overflow-x-auto mt-12">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">年度資產負債表 (Annual Balance Sheet)</h3>
                <span className="text-rose-400/80 text-sm flex items-center"><Activity className="w-4 h-4 mr-1" /> 點擊任意行即可查看歷史趨勢圖</span>
              </div>
              <table className="w-full text-left text-foreground">
                <thead className="bg-foreground/10 text-foreground/80 border-b border-foreground/20">
                  <tr>
                    <th className="p-4 rounded-tl-xl font-semibold">項目 (百萬美元)</th>
                    {[...balance].reverse().map((item: any) => (
                      <th key={item.date || item.fiscalYear} className="p-4 font-semibold">{item.date ? item.date.split('-')[0] : item.fiscalYear}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleBalanceClick('總資產', 'totalAssets')}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">總資產 (Total Assets)</td>
                    {[...balance].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.totalAssets / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleBalanceClick('流動資產', 'currentAssets')}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">流動資產 (Current Assets)</td>
                    {[...balance].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.currentAssets / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleBalanceClick('流動負債', 'currentLiabilities')}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">流動負債 (Current Liabilities)</td>
                    {[...balance].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.currentLiabilities / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors font-bold text-rose-400 cursor-pointer group" onClick={() => handleBalanceClick('總權益', 'totalEquity')}>
                    <td className="p-4 group-hover:text-rose-300 transition-colors">總權益 (Total Equity)</td>
                    {[...balance].reverse().map((item: any) => (
                      <td key={item.date} className="p-4">{(item.totalEquity / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {renderDynamicChart('balance')}

            {/* Cash Flow Table */}
            {cashflow && cashflow.length > 0 && (
              <div className="overflow-x-auto mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-foreground">年度現金流量表 (Annual Cash Flow Statement)</h3>
                  <span className="text-rose-400/80 text-sm flex items-center"><Activity className="w-4 h-4 mr-1" /> 點擊任意行即可查看歷史趨勢圖</span>
                </div>
                <table className="w-full text-left text-foreground">
                  <thead className="bg-foreground/10 text-foreground/80 border-b border-foreground/20">
                    <tr>
                      <th className="p-4 rounded-tl-xl font-semibold">項目 (百萬美元)</th>
                      {[...cashflow].reverse().map((item: any) => (
                        <th key={item.date || item.fiscalYear} className="p-4 font-semibold">{item.date ? item.date.split('-')[0] : item.fiscalYear}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/10">
                    <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleCashFlowClick('營業現金流', 'operatingCashFlow')}>
                      <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">營業現金流 (Operating Cash Flow)</td>
                      {[...cashflow].reverse().map((item: any) => (
                        <td key={item.date} className="p-4">{((item.operatingCashFlow || 0) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleCashFlowClick('投資現金流', 'investingCashFlow')}>
                      <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">投資現金流 (Investing Cash Flow)</td>
                      {[...cashflow].reverse().map((item: any) => (
                        <td key={item.date} className="p-4">{((item.investingCashFlow || 0) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleCashFlowClick('籌資現金流', 'financingCashFlow')}>
                      <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">籌資現金流 (Financing Cash Flow)</td>
                      {[...cashflow].reverse().map((item: any) => (
                        <td key={item.date} className="p-4">{((item.financingCashFlow || 0) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleCashFlowClick('資本支出', 'capitalExpenditure')}>
                      <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">資本支出 (Capital Expenditure)</td>
                      {[...cashflow].reverse().map((item: any) => (
                        <td key={item.date} className="p-4">{((item.capitalExpenditure || 0) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      ))}
                    </tr>
                    <tr className="hover:bg-foreground/10 transition-colors font-bold text-rose-400 cursor-pointer group" onClick={() => handleCashFlowClick('自由現金流', 'freeCashFlow')}>
                      <td className="p-4 group-hover:text-rose-300 transition-colors">自由現金流 (Free Cash Flow)</td>
                      {[...cashflow].reverse().map((item: any) => (
                        <td key={item.date} className="p-4">{((item.freeCashFlow || 0) / 1000000).toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {renderDynamicChart('cashflow')}
          </div>
        )}

        {activeTab === 'ratios' && (
          <div className="space-y-12">
            <div className="overflow-x-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-foreground">年度關鍵指標 (Key Metrics)</h3>
                <span className="text-rose-400/80 text-sm flex items-center"><Activity className="w-4 h-4 mr-1" /> 點擊任意行即可查看歷史趨勢圖</span>
              </div>
              <table className="w-full text-left text-foreground">
                <thead className="bg-foreground/10 text-foreground/80 border-b border-foreground/20">
                  <tr>
                    <th className="p-4 rounded-tl-xl font-semibold">指標</th>
                    {[...metrics].reverse().map((item: any) => (
                      <th key={item.date} className="p-4 font-semibold">{item.date.split('-')[0]}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/10">
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleMetricClick('本益比估算', 'earningsYield', false, true)}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">本益比估算 (Implied P/E)</td>
                    {[...metrics].reverse().map((item: any) => (
                      <td key={item.date || item.fiscalYear} className="p-4">{item.earningsYield ? (1 / item.earningsYield).toFixed(2) : '-'}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleMetricClick('企業價值倍數', 'evToEBITDA', false, false)}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">企業價值倍數 (EV/EBITDA)</td>
                    {[...metrics].reverse().map((item: any) => (
                      <td key={item.date || item.fiscalYear} className="p-4">{item.evToEBITDA?.toFixed(2) || '-'}</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleMetricClick('股東權益報酬率', 'returnOnEquity', true, false)}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">股東權益報酬率 (ROE)</td>
                    {[...metrics].reverse().map((item: any) => (
                      <td key={item.date || item.fiscalYear} className="p-4">{((item.returnOnEquity || 0) * 100).toFixed(2)}%</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleMetricClick('資產報酬率', 'returnOnAssets', true, false)}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">資產報酬率 (ROA)</td>
                    {[...metrics].reverse().map((item: any) => (
                      <td key={item.date || item.fiscalYear} className="p-4">{((item.returnOnAssets || 0) * 100).toFixed(2)}%</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleMetricClick('自由現金流殖利率', 'freeCashFlowYield', true, false)}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">自由現金流殖利率 (FCF Yield)</td>
                    {[...metrics].reverse().map((item: any) => (
                      <td key={item.date || item.fiscalYear} className="p-4">{((item.freeCashFlowYield || 0) * 100).toFixed(2)}%</td>
                    ))}
                  </tr>
                  <tr className="hover:bg-foreground/10 transition-colors cursor-pointer group" onClick={() => handleMetricClick('流動比率', 'currentRatio', false, false)}>
                    <td className="p-4 text-foreground/70 group-hover:text-rose-300 transition-colors">流動比率 (Current Ratio)</td>
                    {[...metrics].reverse().map((item: any) => (
                      <td key={item.date || item.fiscalYear} className="p-4">{item.currentRatio?.toFixed(2) || '-'}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {renderDynamicChart('ratios')}
          </div>
        )}

        {activeTab === 'technical' && (
          <div className="w-full">
            <TechnicalAnalysis
              ticker={ticker}
              geminiApiKey={geminiApiKey}
              geminiModel={geminiModel}
              historicalPrices={historicalPrices}
            />
          </div>
        )}

        {activeTab === 'ownership' && (
          <div className="w-full">
            <OwnershipAnalysis ticker={ticker} />
          </div>
        )}

        {activeTab === 'ai-report' && (
          <div className="w-full flex flex-col gap-8">
            <div className="h-[800px] w-full">
              <AiFundamentalReport ticker={ticker} geminiApiKey={geminiApiKey} geminiModel={geminiModel} data={data} historicalPrices={historicalPrices} />
            </div>
            <div className="h-[800px] w-full">
              <AiCompetitorAnalysis ticker={ticker} geminiApiKey={geminiApiKey} geminiModel={geminiModel} data={data} />
            </div>
          </div>
        )}

        {activeTab === 'advanced-analysis' && (
          <div className="w-full">
            <FScoreDashboard result={advancedData?.fScoreResult} />
            <DuPontAnalysisChart data={advancedData?.dupont || []} />
          </div>
        )}

        {activeTab === 'related-reports' && (
          <div className="w-full">
            <ReportLibrary
              initialReports={relatedReports}
              userEmail={null}
              hideHeader={true}
              hideSymbolFilter={true}
            />
          </div>
        )}

      </div>
    </div>
  );
}

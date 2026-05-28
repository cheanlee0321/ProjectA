'use client';

import { useState, useEffect } from 'react';
import { getInsiderTrading, getInstitutionalHoldings, getTaiwanInstitutionalBuySell, getTaiwanHoldingShares } from '@/app/actions/ownership';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, LineChart, Line } from 'recharts';

export default function OwnershipAnalysis({ ticker }: { ticker: string }) {
  const isTaiwan = ticker.endsWith('.TW') || ticker.endsWith('.TWO');

  const [insiderData, setInsiderData] = useState<any[]>([]);
  const [institutionalData, setInstitutionalData] = useState<any[]>([]);
  const [twInstData, setTwInstData] = useState<any[]>([]);
  const [twHoldingData, setTwHoldingData] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Global fallback error
  const [twInstError, setTwInstError] = useState<string | null>(null);
  const [twHoldingError, setTwHoldingError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setLoading(true);
      setError(null);
      setTwInstError(null);
      setTwHoldingError(null);

      try {
        if (isTaiwan) {
          const [buySellRes, holdingRes] = await Promise.all([
            getTaiwanInstitutionalBuySell(ticker),
            getTaiwanHoldingShares(ticker)
          ]);

          if (isMounted) {
            if (buySellRes.error) setTwInstError(buySellRes.error);
            if (holdingRes.error) setTwHoldingError(holdingRes.error);

            if (buySellRes.data) {
              const grouped: Record<string, any> = {};
              buySellRes.data.forEach((item: any) => {
                const d = item.date;
                if (!grouped[d]) grouped[d] = { date: d, foreign: 0, trust: 0, dealer: 0 };
                
                const net = item.buy - item.sell;
                if (item.name.includes('Foreign_Investor') || item.name.includes('Foreign_Dealer_Self')) {
                  grouped[d].foreign += net;
                } else if (item.name.includes('Investment_Trust')) {
                  grouped[d].trust += net;
                } else if (item.name.includes('Dealer_')) {
                  grouped[d].dealer += net;
                }
              });
              
              const chartData = Object.values(grouped).sort((a: any, b: any) => a.date.localeCompare(b.date));
              setTwInstData(chartData);
            }

            if (holdingRes.data) {
              const grouped: Record<string, number> = {};
              holdingRes.data.forEach((item: any) => {
                if (item.HoldingSharesLevel >= 15) {
                  grouped[item.date] = (grouped[item.date] || 0) + item.percent;
                }
              });
              const chartData = Object.keys(grouped).map(date => ({
                date,
                percent: Number(grouped[date].toFixed(2))
              })).sort((a, b) => a.date.localeCompare(b.date));
              
              setTwHoldingData(chartData);
            }
          }
        } else {
          const [insiderRes, instRes] = await Promise.all([
            getInsiderTrading(ticker),
            getInstitutionalHoldings(ticker)
          ]);

          if (isMounted) {
            if (insiderRes.error) setError(insiderRes.error);
            if (instRes.error) setError(instRes.error);

            if (insiderRes.data) {
              setInsiderData(insiderRes.data.slice(0, 20));
            }
            if (instRes.data) {
              setInstitutionalData(instRes.data.slice(0, 10));
            }
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || '發生錯誤');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [ticker, isTaiwan]);

  const renderTaiwan = () => (
    <>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <span>📊</span> 近 30 天三大法人買賣超
          </h3>
          <span className="text-sm text-foreground/40 border border-foreground/10 px-3 py-1 rounded-full">
            Data Source: FinMind API
          </span>
        </div>

        <div className="bg-foreground/5 p-6 rounded-2xl border border-foreground/10">
          <h4 className="text-lg font-medium text-foreground/70 mb-4">買賣超金額/張數 (紅柱買超，綠柱賣超)</h4>
          
          {twInstError ? (
            <div className="h-[350px] w-full flex items-center justify-center bg-danger/5 rounded-xl border border-danger/20 text-danger/80 p-6 text-center">
              <div>
                <div className="text-3xl mb-2">⚠️</div>
                <p>{twInstError}</p>
              </div>
            </div>
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={twInstData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--foreground)" strokeOpacity={0.1} />
                  <XAxis dataKey="date" stroke="var(--foreground)" strokeOpacity={0.6} tick={{ fontSize: 12 }} />
                  <YAxis stroke="var(--foreground)" strokeOpacity={0.6} tickFormatter={(value) => `${(value/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)', borderRadius: '12px' }}
                    formatter={(value: any) => [Number(value).toLocaleString(), '淨買賣']}
                  />
                  <Legend />
                  <Bar dataKey="foreign" name="外資" fill="#ef4444" radius={[4, 4, 0, 0]}>
                    {twInstData.map((entry, index) => (
                      <Cell key={`cell-foreign-${index}`} fill={entry.foreign >= 0 ? '#ef4444' : '#22c55e'} />
                    ))}
                  </Bar>
                  <Bar dataKey="trust" name="投信" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                    {twInstData.map((entry, index) => (
                      <Cell key={`cell-trust-${index}`} fill={entry.trust >= 0 ? '#ef4444' : '#22c55e'} />
                    ))}
                  </Bar>
                  <Bar dataKey="dealer" name="自營商" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {twInstData.map((entry, index) => (
                      <Cell key={`cell-dealer-${index}`} fill={entry.dealer >= 0 ? '#ef4444' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6 border-t border-foreground/10 pt-12">
          <h3 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <span>🐋</span> 近 1 年大戶持股比例 (400張以上)
          </h3>
          <span className="text-sm text-foreground/40 border border-foreground/10 px-3 py-1 rounded-full">
            Data Source: 集保戶股權分散表
          </span>
        </div>

        <div className="bg-foreground/5 p-6 rounded-2xl border border-foreground/10 shadow-lg">
          <h4 className="text-lg font-medium text-foreground/70 mb-4">大戶籌碼集中度趨勢 (%)</h4>
          
          {twHoldingError ? (
            <div className="h-[350px] w-full flex items-center justify-center bg-danger/5 rounded-xl border border-danger/20 text-danger/80 p-6 text-center">
              <div>
                <div className="text-3xl mb-2">⚠️</div>
                <p>您目前的 FinMind Token 權限不足 (Level is free)，無法讀取股權分散表。</p>
                <p className="text-sm mt-2 opacity-70">原始訊息: {twHoldingError}</p>
              </div>
            </div>
          ) : (
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={twHoldingData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--foreground)" strokeOpacity={0.1} />
                  <XAxis dataKey="date" stroke="var(--foreground)" strokeOpacity={0.6} tick={{ fontSize: 12 }} />
                  <YAxis domain={['auto', 'auto']} stroke="var(--foreground)" strokeOpacity={0.6} tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)', borderRadius: '12px' }}
                    itemStyle={{ color: '#ec4899' }}
                    formatter={(value: any) => [`${value}%`, '大戶持股比例']}
                  />
                  <Line type="monotone" dataKey="percent" name="大戶持股比例" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: 'var(--background)' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const renderUS = () => {
    if (error) {
      return (
        <div className="w-full p-8 bg-danger/10 border border-danger/30 rounded-3xl text-center mt-12">
          <div className="text-danger text-4xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold text-danger mb-2">資料讀取失敗</h3>
          <p className="text-danger/80">{error}</p>
          <p className="text-sm mt-4 text-danger/60">
            如果是 PREMIUM_RESTRICTED，表示您的金鑰不包含此進階功能。
          </p>
        </div>
      );
    }

    const chartData = institutionalData.map(inst => ({
      name: inst.holder,
      shares: inst.shares,
      percentage: inst.shares ? (inst.shares / 1000000) : 0,
    }));

    return (
      <>
        {/* 13F Institutional Holders */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <span>🏛️</span> 前十大機構持倉 (13F)
            </h3>
            <span className="text-sm text-foreground/40 border border-foreground/10 px-3 py-1 rounded-full">
              Data Source: SEC 13F Filings
            </span>
          </div>
          
          {institutionalData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-foreground/5 p-6 rounded-2xl border border-foreground/10">
                <h4 className="text-lg font-medium text-foreground/70 mb-4">持股數量視覺化 (百萬股)</h4>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--foreground)" strokeOpacity={0.1} />
                      <XAxis type="number" stroke="var(--foreground)" strokeOpacity={0.6} />
                      <YAxis dataKey="name" type="category" width={120} stroke="var(--foreground)" strokeOpacity={0.8} tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--glass-border)', color: 'var(--foreground)', borderRadius: '12px' }}
                        formatter={(value: any) => [`${Number(value).toLocaleString(undefined, { maximumFractionDigits: 2 })}M`, '持股數 (百萬)']}
                      />
                      <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={`hsl(200, 80%, ${Math.max(40, 80 - index * 5)}%)`} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="overflow-x-auto bg-foreground/5 rounded-2xl border border-foreground/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-foreground/10 text-foreground/80 border-b border-foreground/20">
                    <tr>
                      <th className="p-4 font-semibold">機構名稱 (Holder)</th>
                      <th className="p-4 font-semibold text-right">持股數 (Shares)</th>
                      <th className="p-4 font-semibold text-right">變動日 (Date)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-foreground/5">
                    {institutionalData.map((inst, idx) => (
                      <tr key={idx} className="hover:bg-foreground/10 transition-colors">
                        <td className="p-4 text-foreground font-medium">{inst.holder}</td>
                        <td className="p-4 text-right font-mono text-indigo-300">
                          {inst.shares?.toLocaleString() || '-'}
                        </td>
                        <td className="p-4 text-right text-foreground/50">{inst.dateReported}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-foreground/50 bg-foreground/5 rounded-2xl">
              無機構持倉資料
            </div>
          )}
        </div>

        {/* Insider Trading */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6 border-t border-foreground/10 pt-12">
            <h3 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <span>🕵️‍♂️</span> 近期內部人交易 (高管動向)
            </h3>
            <span className="text-sm text-foreground/40 border border-foreground/10 px-3 py-1 rounded-full">
              Data Source: SEC Form 4
            </span>
          </div>

          {insiderData.length > 0 ? (
            <div className="overflow-x-auto bg-foreground/5 rounded-2xl border border-foreground/10 shadow-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-foreground/10 text-foreground/80 border-b border-foreground/20">
                  <tr>
                    <th className="p-4 font-semibold">交易日</th>
                    <th className="p-4 font-semibold">內部人姓名</th>
                    <th className="p-4 font-semibold">職位 (Title)</th>
                    <th className="p-4 font-semibold text-center">類型</th>
                    <th className="p-4 font-semibold text-right">股數</th>
                    <th className="p-4 font-semibold text-right">價格</th>
                    <th className="p-4 font-semibold text-right">總金額</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-foreground/5">
                  {insiderData.map((trade, idx) => {
                    const isBuy = trade.transactionType === 'P-Purchase';
                    const isSell = trade.transactionType === 'S-Sale';
                    const amount = trade.securitiesTransacted * trade.price;
                    
                    return (
                      <tr key={idx} className="hover:bg-foreground/10 transition-colors">
                        <td className="p-4 text-foreground/70">{trade.transactionDate}</td>
                        <td className="p-4 font-medium text-foreground">{trade.reportingName}</td>
                        <td className="p-4 text-foreground/60 text-xs max-w-[200px] truncate" title={trade.typeOfOwner}>{trade.typeOfOwner}</td>
                        <td className="p-4 text-center">
                          {isBuy ? (
                            <span className="bg-safe/20 text-safe border border-safe/30 px-2 py-1 rounded text-xs font-bold">買進 (Buy)</span>
                          ) : isSell ? (
                            <span className="bg-danger/20 text-danger border border-danger/30 px-2 py-1 rounded text-xs font-bold">賣出 (Sell)</span>
                          ) : (
                            <span className="bg-foreground/10 text-foreground/70 px-2 py-1 rounded text-xs">{trade.transactionType || 'Other'}</span>
                          )}
                        </td>
                        <td className="p-4 text-right font-mono">{trade.securitiesTransacted?.toLocaleString()}</td>
                        <td className="p-4 text-right font-mono">${trade.price?.toFixed(2)}</td>
                        <td className={`p-4 text-right font-mono font-medium ${isBuy ? 'text-safe' : isSell ? 'text-danger' : 'text-foreground/70'}`}>
                          {amount > 0 ? `$${amount.toLocaleString(undefined, {maximumFractionDigits: 0})}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center p-8 text-foreground/50 bg-foreground/5 rounded-2xl">
              近半年內無內部人交易紀錄
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {loading ? (
        <div className="w-full flex flex-col items-center justify-center p-24">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-foreground/60 animate-pulse">正在為您調閱籌碼與機構資料...</div>
        </div>
      ) : (
        isTaiwan ? renderTaiwan() : renderUS()
      )}
    </div>
  );
}

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '投資策略 — FINRA 融資槓桿信號系統',
  description:
    '透過 FINRA 融資餘額與流通貨幣的比值，搭配紅黃綠燈信號系統，評估市場槓桿水平並制定槓桿 ETF (TQQQ/UPRO) 的買賣時機策略。含歷史回測數據與實戰操作指南。',
  openGraph: {
    title: '投資策略 — FINRA 融資槓桿信號系統',
    description: '透過 FINRA 融資餘額與流通貨幣比值，制定槓桿 ETF 買賣時機策略。',
  },
};

export default function StrategyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

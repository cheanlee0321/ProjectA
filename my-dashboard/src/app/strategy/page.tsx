import ClientStrategyPage from './ClientStrategyPage';
import MacroCards from './components/MacroCards';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default function StrategyPage() {
  return (
    <ClientStrategyPage 
      macroCardsNode={
        <Suspense fallback={<MacroCardsSkeleton />}>
          <MacroCards />
        </Suspense>
      } 
    />
  );
}

function MacroCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 mb-16 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-[400px] bg-foreground/5 border border-foreground/10 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col p-6">
          <div className="h-6 bg-foreground/10 rounded w-1/2 mb-4"></div>
          <div className="h-10 bg-foreground/10 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-foreground/10 rounded w-full mt-auto"></div>
        </div>
      ))}
    </div>
  );
}

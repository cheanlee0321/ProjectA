import Link from 'next/link';
import ClientDCFCalculator from '@/components/dcf/ClientDCFCalculator';

export default function DCFModelPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <header className="px-8 py-6 border-b border-foreground/10 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-foreground/60 hover:text-foreground transition-colors group">
            <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <span className="text-3xl">🧮</span>
            互動式DCF模型
          </h1>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-12 lg:p-24 overflow-auto z-10">
        <div className="max-w-[1400px] mx-auto">
          <ClientDCFCalculator />
        </div>
      </main>
    </div>
  );
}

import Link from 'next/link';
import { notFound } from 'next/navigation';
import tocData from '@/data/howard_marks_toc.json';

type Props = { params: Promise<{ year: string }> | { year: string } };

export default async function MemoYearPage({ params }: Props) {
  const resolvedParams = await params;
  const yearGroup = tocData.find(y => y.year === resolvedParams.year);
  
  if (!yearGroup) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-amber-50/90 py-12 px-6 md:px-12 lg:px-24 relative overflow-hidden font-serif">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="mb-16">
          <Link href="/education/howard-marks-memos" className="inline-flex items-center text-amber-500/70 hover:text-amber-400 transition-colors mb-8 font-sans text-sm tracking-widest uppercase">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回目錄
          </Link>
          
          <div className="text-center border-b border-amber-900/30 pb-12">
            <p className="text-amber-500/60 uppercase tracking-[0.3em] text-sm mb-4">Chapter</p>
            <h1 className="text-4xl md:text-6xl font-bold text-amber-100 mb-6 tracking-tight">
              {yearGroup.year}
            </h1>
            <p className="text-xl italic text-amber-200/50">The Memo by Howard Marks</p>
          </div>
        </div>

        {/* Memos List */}
        <div className="grid grid-cols-1 gap-4">
          {yearGroup.memos.map((memo, index) => (
            <Link 
              key={memo.id} 
              href={`/education/howard-marks-memos/${memo.id}`}
              className="group block"
              prefetch={false}
            >
              <div className="relative p-6 rounded-xl bg-amber-950/20 border border-amber-900/20 backdrop-blur-sm transition-all duration-300 hover:bg-amber-900/30 hover:border-amber-500/30 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-500/50 text-xs font-sans tracking-wider mb-2 uppercase">Episode {index + 1}</p>
                    <h3 className="text-lg md:text-xl font-medium text-amber-100/90 group-hover:text-amber-400 transition-colors">
                      {memo.title}
                    </h3>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

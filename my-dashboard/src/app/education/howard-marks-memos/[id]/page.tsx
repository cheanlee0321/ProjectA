import Link from 'next/link';
import { notFound } from 'next/navigation';
import tocData from '@/data/howard_marks_toc.json';

// Flatten the TOC for easy lookup
const allMemos = tocData.flatMap(yearGroup => yearGroup.memos);

export async function generateStaticParams() {
  return allMemos.map((memo) => ({
    id: memo.id,
  }));
}

export default function MemoChapterPage({ params }: { params: { id: string } }) {
  const currentIndex = allMemos.findIndex(m => m.id === params.id);
  
  if (currentIndex === -1) {
    notFound();
  }

  const memo = allMemos[currentIndex];
  const prevMemo = currentIndex > 0 ? allMemos[currentIndex - 1] : null;
  const nextMemo = currentIndex < allMemos.length - 1 ? allMemos[currentIndex + 1] : null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-amber-50/90 py-12 px-6 md:px-12 lg:px-24 relative font-serif">
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-900/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Top Navigation */}
        <div className="mb-16 flex items-center justify-between border-b border-amber-900/30 pb-6">
          <Link href="/education/howard-marks-memos" className="inline-flex items-center text-amber-500/70 hover:text-amber-400 transition-colors font-sans text-sm tracking-widest uppercase">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回目錄
          </Link>
          <span className="text-amber-500/40 text-sm font-sans tracking-widest">{memo.year}</span>
        </div>

        {/* Article Header */}
        <article className="mb-20">
          <header className="mb-12 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-amber-100 mb-6 leading-tight">
              {memo.title}
            </h1>
            <p className="text-amber-500/50 uppercase tracking-[0.2em] text-sm">Howard Marks</p>
          </header>

          {/* Placeholder Content */}
          <div className="prose prose-invert prose-amber max-w-none">
            <div className="p-8 md:p-12 rounded-2xl bg-amber-950/20 border border-amber-900/30 text-center backdrop-blur-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-900/30 mb-6">
                <svg className="w-8 h-8 text-amber-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-amber-100 mb-4 font-sans">中文翻譯內容建置中</h2>
              <p className="text-amber-100/60 leading-relaxed font-sans font-light max-w-lg mx-auto">
                我們正在努力將這篇經典備忘錄翻譯為中文。<br />
                未來您將能在這裡以最舒適的排版閱讀大師的完整見解，敬請期待。
              </p>
            </div>
          </div>
        </article>

        {/* Bottom Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-amber-900/30 gap-6">
          {prevMemo ? (
            <Link 
              href={`/education/howard-marks-memos/${prevMemo.id}`}
              className="group flex flex-col items-start w-full sm:w-1/2 p-4 rounded-xl hover:bg-amber-950/30 transition-colors"
            >
              <span className="text-amber-500/50 text-xs font-sans tracking-widest uppercase mb-2 flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                上一章
              </span>
              <span className="text-amber-100/80 group-hover:text-amber-400 transition-colors line-clamp-1">{prevMemo.title}</span>
            </Link>
          ) : (
            <div className="w-full sm:w-1/2"></div>
          )}

          {nextMemo ? (
            <Link 
              href={`/education/howard-marks-memos/${nextMemo.id}`}
              className="group flex flex-col items-end w-full sm:w-1/2 p-4 rounded-xl hover:bg-amber-950/30 transition-colors text-right"
            >
              <span className="text-amber-500/50 text-xs font-sans tracking-widest uppercase mb-2 flex items-center">
                下一章
                <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
              <span className="text-amber-100/80 group-hover:text-amber-400 transition-colors line-clamp-1">{nextMemo.title}</span>
            </Link>
          ) : (
            <div className="w-full sm:w-1/2"></div>
          )}
        </div>
      </div>
    </main>
  );
}

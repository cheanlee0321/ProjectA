import Link from 'next/link';
import { notFound } from 'next/navigation';
import tocData from '@/data/howard_marks_toc.json';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';

// Flatten the TOC for easy lookup
const allMemos = tocData.flatMap(yearGroup => yearGroup.memos);

type Props = { params: Promise<{ id: string }> | { id: string } };

export default async function MemoChapterPage({ params }: Props) {
  const resolvedParams = await params;
  const currentIndex = allMemos.findIndex(m => m.id === resolvedParams.id);
  
  if (currentIndex === -1) {
    notFound();
  }

  const memo = allMemos[currentIndex];
  const prevMemo = currentIndex > 0 ? allMemos[currentIndex - 1] : null;
  const nextMemo = currentIndex < allMemos.length - 1 ? allMemos[currentIndex + 1] : null;

  let content = '';
  let isMarkdown = false;
  try {
    const mdPath = path.join(process.cwd(), 'src', 'data', 'memos', `${memo.year}_${memo.id}.md`);
    content = await fs.promises.readFile(mdPath, 'utf-8');
    isMarkdown = true;
  } catch (err) {
    try {
      const txtPath = path.join(process.cwd(), 'src', 'data', 'memos', `${memo.year}_${memo.id}.txt`);
      const rawContent = await fs.promises.readFile(txtPath, 'utf-8');
      
      const lines = rawContent.split(/\r?\n/);
    const processedLines: string[] = [];
    let currentParagraph = '';

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i].trim();
      
      if (!line) {
        if (currentParagraph) {
          processedLines.push(currentParagraph);
          currentParagraph = '';
        }
        continue;
      }

      if (currentParagraph) {
        const lastChar = currentParagraph.slice(-1);
        if (lastChar === '-') {
          currentParagraph = currentParagraph.slice(0, -1) + line;
        } else {
          currentParagraph += ' ' + line;
        }
      } else {
        currentParagraph = line;
      }
    }
      if (currentParagraph) {
        processedLines.push(currentParagraph);
      }
      
      content = processedLines.join('\n\n');
    } catch (txtErr) {
      content = '無法載入文章內容。';
      console.error('Error reading memo:', txtErr);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-amber-50/90 py-12 px-6 md:px-12 lg:px-24 relative font-serif">
      {/* Background Ambience */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-900/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-3xl mx-auto">
        {/* Top Navigation */}
        <div className="mb-16 flex items-center justify-between border-b border-amber-900/30 pb-6">
          <Link href={`/education/howard-marks-memos/year/${memo.year}`} className="inline-flex items-center text-amber-500/70 hover:text-amber-400 transition-colors font-sans text-sm tracking-widest uppercase">
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

          {/* Memo Content */}
          <div className="prose prose-invert prose-amber max-w-none font-sans font-light text-amber-100/90 leading-relaxed text-lg tracking-wide">
            {isMarkdown ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6">{paragraph}</p>
              ))
            )}
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

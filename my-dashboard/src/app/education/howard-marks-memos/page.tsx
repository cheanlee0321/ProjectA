import Link from 'next/link';
import tocData from '@/data/howard_marks_toc.json';

export const metadata = {
  title: 'The Memo by Howard Marks - 投資理財教學',
  description: '收錄霍華．馬克斯從 1990 年至今的經典備忘錄',
};

export default function HowardMarksMemosIndex() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-amber-50/90 py-12 px-6 md:px-12 lg:px-24 relative overflow-hidden font-serif">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-900/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="mb-16">
          <Link href="/education" className="inline-flex items-center text-amber-500/70 hover:text-amber-400 transition-colors mb-8 font-sans text-sm tracking-widest uppercase">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回教學資源
          </Link>
          
          <div className="text-center border-b border-amber-900/30 pb-12">
            <p className="text-amber-500/60 uppercase tracking-[0.3em] text-sm mb-4">The Complete Collection</p>
            <h1 className="text-4xl md:text-6xl font-bold text-amber-100 mb-6 tracking-tight">
              The Memo
            </h1>
            <p className="text-xl italic text-amber-200/50">by Howard Marks</p>
            <div className="mt-8 max-w-2xl mx-auto text-amber-100/60 leading-relaxed font-sans font-light">
              <p>
                從 1990 年開始，橡樹資本創辦人霍華．馬克斯寫下了一系列備忘錄。<br/>
                在這裡，您可以宛如閱讀一部跨越三十年的金融史詩，<br/>
                一步步跟隨大師的洞見，理解市場週期與投資的真諦。
              </p>
            </div>
          </div>
        </div>

        {/* Chapters Archive */}
        <div className="space-y-16">
          {tocData.map((yearGroup) => (
            <section key={yearGroup.year} className="relative pl-8 md:pl-0">
              {/* Year Marker */}
              <div className="md:absolute md:left-0 md:top-0 md:w-32 md:text-right md:-ml-40 mb-6 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-amber-500/30 font-sans tracking-tighter">
                  {yearGroup.year}
                </h2>
              </div>
              
              {/* Timeline Line (Mobile) */}
              <div className="absolute left-0 top-0 bottom-0 w-px bg-amber-900/30 md:hidden"></div>

              {/* Memos List */}
              <div className="grid grid-cols-1 gap-4">
                {yearGroup.memos.map((memo, index) => (
                  <Link 
                    key={memo.id} 
                    href={`/education/howard-marks-memos/${memo.id}`}
                    className="group block"
                  >
                    <div className="relative p-6 rounded-xl bg-amber-950/20 border border-amber-900/20 backdrop-blur-sm transition-all duration-300 hover:bg-amber-900/30 hover:border-amber-500/30 hover:-translate-y-1">
                      {/* Timeline dot (Mobile) */}
                      <div className="absolute left-[calc(-2rem-1px)] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-amber-700/50 group-hover:bg-amber-400 md:hidden transition-colors"></div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-amber-500/50 text-xs font-sans tracking-wider mb-2 uppercase">Chapter {index + 1}</p>
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
            </section>
          ))}
        </div>
        
        {/* Footer */}
        <div className="mt-24 pt-8 border-t border-amber-900/30 text-center text-amber-100/30 font-sans text-sm">
          <p>收錄至最新備忘錄。中文翻譯持續建置中。</p>
        </div>
      </div>
    </main>
  );
}

import { getReportById } from '@/app/actions/reports';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, ExternalLink, Calendar, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import DeleteReportButton from '@/components/reports/DeleteReportButton';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
  const report = await getReportById(id);
  if (!report) return { title: '報告未找到 | 投資決策中心' };
  
  return {
    title: `${report.title} - ${report.symbol} | 投資決策中心`,
  };
}

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userEmailPrefix = user?.email?.split('@')[0];
  
  const isDeveloper = userEmailPrefix === 'cheanlee0321';
  const isOwner = userEmailPrefix === report.author;
  const canDelete = isDeveloper || isOwner;

  // Fix old HTML content that has hardcoded tailwind classes
  const cleanContent = report.content
    .replace(/bg-gray-100 dark:bg-gray-800/g, 'bg-foreground/5 border border-foreground/10')
    .replace(/text-gray-500/g, 'text-foreground/50')
    .replace(/rounded-lg/g, 'rounded-2xl p-6');

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/reports" 
            className="inline-flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            返回圖書館
          </Link>
          
          {canDelete && (
            <DeleteReportButton reportId={report.id} />
          )}
        </div>

        <article className="bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-3xl p-8 md:p-12 shadow-sm">
          <header className="mb-12 border-b border-foreground/10 pb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link 
                href={`/fundamental/${report.symbol}`}
                className="px-3 py-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 font-bold rounded-lg transition-colors"
                title={`查看 ${report.symbol} 個股基本面分析`}
              >
                {report.symbol}
              </Link>
              <span className="text-sm font-medium text-foreground/50 uppercase px-2 py-1 bg-foreground/10 rounded-lg">
                {report.file_type}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6 leading-tight">
              {report.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-foreground/50">
              <div className="flex items-center gap-2">
                <User size={18} />
                <span className="font-medium">{report.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} />
                <span className="font-medium">{new Date(report.report_date).toLocaleDateString()}</span>
              </div>
            </div>
          </header>

          <div className="prose prose-blue dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-500 mb-16 prose-p:text-foreground/80 prose-headings:text-foreground">
            {report.file_type === 'gdoc' ? (
              <div className="p-6 bg-foreground/5 border border-foreground/10 rounded-2xl not-prose">
                <p className="text-center text-foreground/50 m-0">這是一份外部連結的 Google Doc 報告，我們無法直接顯示內文。請點擊下方的原始連結查看。</p>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: cleanContent }} />
            )}
          </div>

          <footer className="pt-8 border-t border-foreground/10 flex flex-col items-center">
            <p className="text-foreground/50 mb-4 font-medium">查看原始檔案</p>
            <a 
              href={report.original_file_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity"
            >
              {report.file_type === 'gdoc' ? (
                <>
                  <ExternalLink size={20} />
                  前往 Google Doc
                </>
              ) : (
                <>
                  <Download size={20} />
                  下載原始檔案
                </>
              )}
            </a>
          </footer>
        </article>
      </div>
    </main>
  );
}

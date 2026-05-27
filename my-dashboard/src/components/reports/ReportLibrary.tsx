'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, User, FileText, ExternalLink, FileType } from 'lucide-react';
import UploadReportModal from './UploadReportModal';

interface Report {
  id: string;
  symbol: string;
  title: string;
  author: string;
  report_date: string;
  file_type: string;
  created_at: string;
}

interface ReportLibraryProps {
  initialReports: Report[];
  userEmail: string | null;
  hideHeader?: boolean;
  hideSymbolFilter?: boolean;
}

export default function ReportLibrary({ initialReports, userEmail, hideHeader, hideSymbolFilter }: ReportLibraryProps) {
  const [reports, setReports] = useState(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterSymbol, setFilterSymbol] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'author'>('date');

  const filteredAndSortedReports = useMemo(() => {
    let result = [...reports];

    // Filter
    if (filterSymbol.trim()) {
      const lowerFilter = filterSymbol.toLowerCase();
      result = result.filter(r => r.symbol.toLowerCase().includes(lowerFilter));
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'author') {
        const authorCompare = a.author.localeCompare(b.author);
        if (authorCompare !== 0) return authorCompare;
        return new Date(b.report_date).getTime() - new Date(a.report_date).getTime();
      } else {
        return new Date(b.report_date).getTime() - new Date(a.report_date).getTime();
      }
    });

    return result;
  }, [reports, filterSymbol, sortBy]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'docx': return <FileType size={16} className="text-blue-500" />;
      case 'txt': return <FileText size={16} className="text-zinc-500" />;
      case 'gdoc': return <ExternalLink size={16} className="text-green-500" />;
      default: return <FileText size={16} className="text-zinc-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {!hideHeader && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold">投資報告圖書館</h2>
          
          {userEmail ? (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm font-medium"
            >
              <Plus size={18} />
              新增報告
            </button>
          ) : (
            <div className="text-sm text-foreground/60 px-4 py-2 bg-foreground/10 rounded-xl">
              請登入以上傳報告
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-foreground/5 border border-foreground/10 rounded-2xl">
        {!hideSymbolFilter && (
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
            <input 
              type="text" 
              placeholder="搜尋股票代號..." 
              value={filterSymbol}
              onChange={(e) => setFilterSymbol(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-foreground/20 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-foreground"
            />
          </div>
        )}
        <div className="flex gap-2">
          <button 
            onClick={() => setSortBy('date')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${sortBy === 'date' ? 'bg-foreground/20 text-foreground' : 'bg-transparent text-foreground/60 hover:bg-foreground/10'}`}
          >
            依日期排序
          </button>
          <button 
            onClick={() => setSortBy('author')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${sortBy === 'author' ? 'bg-foreground/20 text-foreground' : 'bg-transparent text-foreground/60 hover:bg-foreground/10'}`}
          >
            依作者排序
          </button>
        </div>
      </div>

      {filteredAndSortedReports.length === 0 ? (
        <div className="text-center py-20 px-4 bg-foreground/5 border border-dashed border-foreground/20 rounded-2xl">
          <FileText size={48} className="mx-auto text-foreground/20 mb-4" />
          <p className="text-foreground/50">目前沒有符合條件的報告</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedReports.map(report => (
            <Link href={`/reports/${report.id}`} key={report.id} className="group flex flex-col p-5 bg-foreground/5 border border-foreground/10 rounded-2xl hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all cursor-pointer h-full">
              <div className="flex justify-between items-start mb-3">
                <span className="inline-block px-2.5 py-1 text-xs font-semibold bg-blue-500/10 text-blue-600 rounded-lg">
                  {report.symbol}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 bg-foreground/5 rounded-lg">
                  {getFileIcon(report.file_type)}
                  <span className="text-[10px] font-medium uppercase text-foreground/50">{report.file_type}</span>
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors line-clamp-2 mb-4 flex-1">
                {report.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-foreground/50 pt-4 border-t border-foreground/10 mt-auto">
                <div className="flex items-center gap-1.5">
                  <User size={14} />
                  <span>{report.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  <span>{new Date(report.report_date).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {userEmail && (
        <UploadReportModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          userEmail={userEmail} 
        />
      )}
    </div>
  );
}

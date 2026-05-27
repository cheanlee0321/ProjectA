'use client';

import { useState, useTransition } from 'react';
import { uploadReport } from '@/app/actions/reports';
import { X, Upload, Link as LinkIcon, Loader2 } from 'lucide-react';

interface UploadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

export default function UploadReportModal({ isOpen, onClose, userEmail }: UploadReportModalProps) {
  const [isPending, startTransition] = useTransition();
  const [fileSource, setFileSource] = useState<'upload' | 'url'>('url');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const author = userEmail.split('@')[0];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    
    const formData = new FormData(e.currentTarget);
    formData.append('fileSource', fileSource);
    
    startTransition(async () => {
      const result = await uploadReport(formData);
      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || '發生錯誤');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="text-xl font-bold bg-gradient-to-r from-zinc-800 to-zinc-500 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">新增投資報告</h2>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">股票代號</label>
              <div className="flex gap-2">
                <select 
                  name="market"
                  className="w-1/2 px-2 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                >
                  <option value="TW">台股 (TW)</option>
                  <option value="US">美股 (US)</option>
                </select>
                <input 
                  name="symbol" 
                  required 
                  placeholder="例如: TSLA, 2330" 
                  className="w-1/2 px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">報告日期</label>
              <input 
                name="reportDate" 
                type="date" 
                required 
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-zinc-900 dark:text-zinc-100 [&::-webkit-calendar-picker-indicator]:dark:invert" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">報告標題</label>
            <input 
              name="title" 
              required 
              placeholder="輸入報告標題..." 
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">作者</label>
            <input 
              disabled 
              value={author} 
              className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-500 border border-zinc-200 dark:border-zinc-700 rounded-xl outline-none cursor-not-allowed" 
            />
            <p className="text-xs text-zinc-500">作者名稱由系統自動帶入</p>
          </div>

          <div className="pt-2">
            <div className="flex space-x-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl mb-4">
              <button
                type="button"
                disabled
                className="flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-all text-zinc-400 cursor-not-allowed"
                title="因supabase空間限制, 暫不開放."
              >
                <Upload size={16} />
                <span className="flex flex-col items-center leading-tight">
                  <span>上傳檔案</span>
                  <span className="text-[10px]">因空間限制暫不開放</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setFileSource('url')}
                className={`flex-1 flex justify-center items-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${fileSource === 'url' ? 'bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white' : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
              >
                <LinkIcon size={16} />
                Google Doc 連結
              </button>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800">
              {fileSource === 'upload' ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">選擇檔案 (.txt, .docx)</label>
                  <input 
                    name="file" 
                    type="file" 
                    accept=".txt,.docx"
                    required={fileSource === 'upload'}
                    className="block w-full text-sm text-zinc-500 dark:text-zinc-400
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      dark:file:bg-blue-900/30 dark:file:text-blue-400
                      hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50
                      transition-colors cursor-pointer"
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">貼上 Google Doc 連結</label>
                  <input 
                    name="url" 
                    type="url" 
                    required={fileSource === 'url'}
                    placeholder="https://docs.google.com/document/d/..." 
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors disabled:opacity-50"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? '處理中...' : '確認新增'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteReport } from '@/app/actions/reports';
import { Trash2, Loader2 } from 'lucide-react';

interface DeleteReportButtonProps {
  reportId: string;
}

export default function DeleteReportButton({ reportId }: DeleteReportButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteReport(reportId);
      if (result.success) {
        router.push('/reports');
      } else {
        alert(result.error || '刪除失敗');
        setShowConfirm(false);
      }
    });
  };

  if (showConfirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-zinc-500">確定要刪除？</span>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="px-3 py-1 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-1"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          確認刪除
        </button>
        <button
          onClick={() => setShowConfirm(false)}
          disabled={isPending}
          className="px-3 py-1 text-sm bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-lg transition-colors"
        >
          取消
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      title="刪除此報告"
    >
      <Trash2 size={16} />
      <span>刪除報告</span>
    </button>
  );
}

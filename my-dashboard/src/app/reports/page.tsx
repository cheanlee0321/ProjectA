import { createClient } from '@/lib/supabase/server';
import { getReports } from '@/app/actions/reports';
import ReportLibrary from '@/components/reports/ReportLibrary';

export const metadata = {
  title: '投資報告圖書館 | 投資決策中心',
};

export default async function ReportsPage() {
  const supabase = await createClient();
  
  // 平行發送請求，大幅縮短伺服器等待時間
  const [authResponse, reports] = await Promise.all([
    supabase.auth.getUser(),
    getReports('all', 'date')
  ]);

  const user = authResponse.data.user;

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-[40rem] h-[40rem] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <ReportLibrary 
          initialReports={reports || []} 
          userEmail={user?.email || null} 
        />
      </div>
    </main>
  );
}

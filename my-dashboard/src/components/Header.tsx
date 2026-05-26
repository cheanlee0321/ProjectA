import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/login/actions'
import ThemeToggle from './ThemeToggle'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto flex h-14 items-center px-4 justify-between">
        <div className="flex items-center">
          <Link href="/" className="font-bold flex items-center mr-6 text-lg">
            <span>📈 股市儀表板</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium transition-colors hover:text-blue-500">
              首頁
            </Link>
            {user && (
              <Link href="/settings" className="text-sm font-medium transition-colors hover:text-blue-500">
                設定 (API Key)
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <form action={logout}>
              <button className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
                登出
              </button>
            </form>
          ) : (
            <Link href="/login" className="text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-md">
              登入 / 註冊
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

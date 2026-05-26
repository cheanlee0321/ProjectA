'use client'

import { useState } from 'react'
import { toggleWatchlist } from '@/app/actions/watchlist'
import { useRouter } from 'next/navigation'

interface Props {
  symbol: string
  initialIsWatched: boolean
  isLoggedIn: boolean
}

export default function WatchlistButton({ symbol, initialIsWatched, isLoggedIn }: Props) {
  const [isWatched, setIsWatched] = useState(initialIsWatched)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleToggle = async () => {
    if (!isLoggedIn) {
      if (window.confirm('請先登入以使用追蹤功能。是否要前往登入頁面？')) {
        router.push('/login')
      }
      return
    }

    setLoading(true)
    try {
      // 樂觀更新 UI (Optimistic UI update)
      const prevWatched = isWatched
      setIsWatched(!isWatched)
      
      const res = await toggleWatchlist(symbol)
      
      if (!res.success) {
        // 失敗的話退回原本的狀態
        setIsWatched(prevWatched)
        alert(res.error || '操作失敗')
      }
    } catch (e) {
      setIsWatched(initialIsWatched)
      alert('發生錯誤，請稍後再試')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`ml-4 p-2 rounded-full transition-all duration-300 ${
        isWatched
          ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30'
          : 'bg-foreground/5 text-foreground/40 hover:bg-foreground/10 hover:text-foreground/80'
      } ${loading ? 'opacity-50 cursor-wait transform scale-95' : 'hover:scale-110 active:scale-90'}`}
      title={isWatched ? '從追蹤清單移除' : '加入追蹤清單'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isWatched ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-7 h-7"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    </button>
  )
}

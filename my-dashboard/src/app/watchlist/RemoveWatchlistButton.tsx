'use client'

import { useState } from 'react'
import { toggleWatchlist } from '@/app/actions/watchlist'

export default function RemoveWatchlistButton({ symbol }: { symbol: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isPending) return
    setIsPending(true)
    
    try {
      await toggleWatchlist(symbol)
    } catch (error) {
      console.error('Failed to remove from watchlist:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button 
      onClick={handleRemove}
      disabled={isPending}
      title="取消追蹤"
      className="relative z-20 p-2 rounded-full bg-rose-500/5 text-rose-500/70 hover:bg-rose-500/15 hover:text-rose-500 transition-all border border-transparent hover:border-rose-500/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md group"
      aria-label="取消追蹤"
    >
      {isPending ? (
        <span className="inline-block animate-spin text-sm">⏳</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 transition-transform">
          <path d="M3 6h18"></path>
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      )}
    </button>
  )
}

'use client'

import { useState, useRef, useEffect } from 'react'
import { updateTargetPrice } from '@/app/actions/watchlist'

export default function TargetPriceInput({ symbol, initialPrice }: { symbol: string, initialPrice: number | null }) {
  const [price, setPrice] = useState(initialPrice === null ? '' : initialPrice.toString())
  const [isPending, setIsPending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync state if initialPrice changes from server
  useEffect(() => {
    setPrice(initialPrice === null ? '' : initialPrice.toString())
  }, [initialPrice])

  const handleSave = async () => {
    if (isPending) return
    const trimmed = price.trim()
    const numPrice = parseFloat(trimmed)
    const finalPrice = (trimmed === '' || isNaN(numPrice)) ? null : numPrice
    
    // 如果跟伺服器一樣就不要再發送請求
    if (finalPrice === initialPrice) return;

    setIsPending(true)
    try {
      await updateTargetPrice(symbol, finalPrice)
    } catch (err) {
      console.error('Failed to update target price', err)
      // reset on error
      setPrice(initialPrice === null ? '' : initialPrice.toString())
    } finally {
      setIsPending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      inputRef.current?.blur() // Blur triggers handleSave
    }
  }

  return (
    <div className="flex items-center gap-3 pointer-events-auto relative z-20">
      <label htmlFor={`target-${symbol}`} className="text-foreground/80 text-base font-black tracking-wide">目標價</label>
      <div className="relative flex items-center">
        <span className="absolute left-3 text-foreground/50 text-base font-semibold">$</span>
        <input 
          ref={inputRef}
          id={`target-${symbol}`}
          type="number" 
          step="any"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          disabled={isPending}
          placeholder="設定"
          className="w-28 sm:w-32 pl-8 pr-4 py-2 text-base font-mono bg-background border-2 border-foreground/20 rounded-lg text-foreground focus:outline-none focus:border-indigo-500/60 focus:ring-4 focus:ring-indigo-500/20 disabled:opacity-50 transition-all text-right shadow-inner placeholder:text-foreground/30"
        />
        {isPending && (
          <span className="absolute -right-7 animate-spin text-base">⏳</span>
        )}
      </div>
    </div>
  )
}

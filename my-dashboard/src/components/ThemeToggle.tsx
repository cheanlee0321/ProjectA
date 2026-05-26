"use client";

import React from 'react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-24 right-6 z-50 glass-panel rounded-full p-3 w-12 h-12 flex items-center justify-center transition-transform hover:scale-110 shadow-lg text-xl border-foreground/10"
      aria-label="Toggle theme"
      title={theme === 'dark' ? '切換至明亮模式' : '切換至暗黑模式'}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}

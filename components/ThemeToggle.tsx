'use client'

import { useState, useEffect } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Sayfa yüklendiğinde mevcut temayı kontrol et
    const currentTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light'
    setTheme(currentTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 px-4 py-2 rounded-lg font-semibold transition-colors"
      style={{
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-text-primary)',
      }}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      type="button"
    >
      {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}


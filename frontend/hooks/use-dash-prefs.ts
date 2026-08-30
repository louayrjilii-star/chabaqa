'use client'

import { useCallback, useEffect, useState } from 'react'
import { useTheme } from 'next-themes'

export type DashLang = 'en' | 'ar'

const LANG_KEY = 'chabaqa_dash_lang'
const THEME_KEY = 'chabaqa_dash_theme'
const EVENT = 'dashpref-change'

function applyLang(lang: DashLang) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
  document.documentElement.setAttribute('lang', lang)
}

function readLang(): DashLang {
  if (typeof localStorage === 'undefined') return 'en'
  return (localStorage.getItem(LANG_KEY) as DashLang) || 'en'
}

function applyTheme(dark: boolean) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('dark', dark)
}

function readDarkPreference(): boolean {
  if (typeof localStorage === 'undefined') return false
  return localStorage.getItem(THEME_KEY) === 'dark'
}

function emit() {
  window.dispatchEvent(new Event(EVENT))
}

export function useDashPrefs() {
  const { setTheme } = useTheme()
  const [lang, setLang] = useState<DashLang>('en')
  const [dark, setDark] = useState(readDarkPreference)

  useEffect(() => {
    const sync = () => {
      const nextLang = readLang()
      setLang(nextLang)
      applyLang(nextLang)
    }
    sync()
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])

  useEffect(() => {
    const syncTheme = () => {
      const nextDark = readDarkPreference()
      setDark(nextDark)
      applyTheme(nextDark)
      setTheme(nextDark ? 'dark' : 'light')
    }
    syncTheme()
    window.addEventListener('storage', syncTheme)
    return () => window.removeEventListener('storage', syncTheme)
  }, [setTheme])

  const toggleDark = useCallback(() => {
    setDark((currentDark) => {
      const nextDark = !currentDark
      localStorage.setItem(THEME_KEY, nextDark ? 'dark' : 'light')
      applyTheme(nextDark)
      setTheme(nextDark ? 'dark' : 'light')
      return nextDark
    })
  }, [setTheme])

  const toggleLang = useCallback(() => {
    const next: DashLang = readLang() === 'en' ? 'ar' : 'en'
    localStorage.setItem(LANG_KEY, next)
    applyLang(next)
    emit()
  }, [])

  return { dark, lang, toggleDark, toggleLang }
}

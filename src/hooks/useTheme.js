import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'csh-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

/**
 * Safely reads the persisted theme preference.
 * Returns null when nothing is stored or storage is unavailable.
 */
function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

/**
 * Safely persists the theme preference. No-ops when storage is unavailable.
 */
function persistTheme(theme) {
  try {
    window.localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Ignore: private mode / disabled storage must never break theming.
  }
}

/**
 * Returns the matchMedia query list for the dark colour scheme, or null
 * when matchMedia is not implemented (e.g. older jsdom).
 */
function getDarkMediaQuery() {
  try {
    if (typeof window.matchMedia !== 'function') return null
    return window.matchMedia(DARK_QUERY)
  } catch {
    return null
  }
}

/**
 * Resolves the initial theme: a stored preference wins; otherwise the
 * system colour-scheme preference; otherwise light.
 */
function resolveInitialTheme() {
  const stored = readStoredTheme()
  if (stored) return stored
  const mql = getDarkMediaQuery()
  return mql && mql.matches ? 'dark' : 'light'
}

/**
 * Theme hook with light/dark support.
 *
 * - Persists an explicit user choice under the `csh-theme` localStorage key.
 * - Without an explicit choice, it follows the OS colour-scheme preference
 *   live; once the user toggles manually, the manual choice wins and the
 *   system is no longer followed.
 * - Applies the active theme to <html data-theme="...">.
 */
export default function useTheme() {
  const [theme, setTheme] = useState(resolveInitialTheme)
  // True until the user makes (or has previously made) an explicit choice.
  const [followSystem, setFollowSystem] = useState(() => readStoredTheme() === null)

  // Reflect the active theme on the document root for CSS to consume.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // While following the system, mirror live OS preference changes.
  useEffect(() => {
    if (!followSystem) return undefined
    const mql = getDarkMediaQuery()
    if (!mql) return undefined

    const handleChange = (event) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', handleChange)
      return () => mql.removeEventListener('change', handleChange)
    }
    // Legacy Safari fallback.
    if (typeof mql.addListener === 'function') {
      mql.addListener(handleChange)
      return () => mql.removeListener(handleChange)
    }
    return undefined
  }, [followSystem])

  const toggleTheme = useCallback(() => {
    setFollowSystem(false)
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      persistTheme(next)
      return next
    })
  }, [])

  return { theme, toggleTheme }
}

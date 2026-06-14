import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useTheme from '../hooks/useTheme'

const STORAGE_KEY = 'csh-theme'

/**
 * Builds a controllable matchMedia mock so tests can drive the
 * system colour-scheme preference and its change events.
 */
function mockMatchMedia({ matches = false } = {}) {
  const listeners = new Set()
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_event, cb) => listeners.add(cb),
    removeEventListener: (_event, cb) => listeners.delete(cb),
    // Legacy API some code paths still rely on.
    addListener: (cb) => listeners.add(cb),
    removeListener: (cb) => listeners.delete(cb),
    dispatch: (next) => {
      mql.matches = next
      listeners.forEach((cb) => cb({ matches: next }))
    },
  }
  const fn = vi.fn(() => mql)
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: fn,
  })
  return mql
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  delete window.matchMedia
})

describe('useTheme', () => {
  it('initialises from a stored preference', () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    mockMatchMedia({ matches: false })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('reflects the stored theme on documentElement', () => {
    localStorage.setItem(STORAGE_KEY, 'dark')
    mockMatchMedia({ matches: false })

    renderHook(() => useTheme())

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('falls back to matchMedia when there is no stored value', () => {
    mockMatchMedia({ matches: true })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
  })

  it('defaults to light when no stored value and system prefers light', () => {
    mockMatchMedia({ matches: false })

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
  })

  it('toggleTheme flips the theme and updates documentElement', () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    mockMatchMedia({ matches: false })

    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('persists the theme to localStorage on toggle', () => {
    localStorage.setItem(STORAGE_KEY, 'light')
    mockMatchMedia({ matches: false })

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })

    expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
  })

  it('follows system changes while there is no stored preference', () => {
    const mql = mockMatchMedia({ matches: false })

    const { result } = renderHook(() => useTheme())
    expect(result.current.theme).toBe('light')

    act(() => {
      mql.dispatch(true)
    })

    expect(result.current.theme).toBe('dark')
  })

  it('stops following the system once the user toggles manually', () => {
    const mql = mockMatchMedia({ matches: false })

    const { result } = renderHook(() => useTheme())

    act(() => {
      result.current.toggleTheme()
    })
    expect(result.current.theme).toBe('dark')

    // System now switches to light, but the manual preference must win.
    act(() => {
      mql.dispatch(false)
    })

    expect(result.current.theme).toBe('dark')
  })

  it('does not throw when matchMedia is unavailable', () => {
    delete window.matchMedia

    expect(() => renderHook(() => useTheme())).not.toThrow()
  })
})

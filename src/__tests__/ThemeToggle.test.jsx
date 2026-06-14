import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from '../components/ThemeToggle/ThemeToggle'

function mockMatchMedia({ matches = false } = {}) {
  const mql = {
    matches,
    media: '(prefers-color-scheme: dark)',
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
  }
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: vi.fn(() => mql),
  })
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  mockMatchMedia({ matches: false })
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  document.documentElement.removeAttribute('data-theme')
  delete window.matchMedia
})

describe('ThemeToggle', () => {
  it('renders a button', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('has an accessible name', () => {
    render(<ThemeToggle />)
    expect(screen.getByRole('button')).toHaveAccessibleName()
  })

  it('toggles the data-theme attribute on click', () => {
    localStorage.setItem('csh-theme', 'light')
    render(<ThemeToggle />)
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')

    fireEvent.click(screen.getByRole('button'))

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
  })

  it('updates the accessible name to reflect the next action', () => {
    localStorage.setItem('csh-theme', 'light')
    render(<ThemeToggle />)

    // In light mode the action is to activate dark mode.
    expect(
      screen.getByRole('button', { name: /modo oscuro/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button'))

    // In dark mode the action is to activate light mode.
    expect(
      screen.getByRole('button', { name: /modo claro/i }),
    ).toBeInTheDocument()
  })
})

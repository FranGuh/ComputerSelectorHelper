import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SpecBar from '../components/SpecBar/SpecBar'
import { getBarWidth } from '../utils/parseSpecs'

describe('getBarWidth', () => {
  it('returns 50 for half of the max', () => {
    expect(getBarWidth(8, 16)).toBe(50)
  })

  it('returns 100 for the max value', () => {
    expect(getBarWidth(16, 16)).toBe(100)
  })

  it('returns 0 for zero or invalid inputs', () => {
    expect(getBarWidth(0, 16)).toBe(0)
    expect(getBarWidth(8, 0)).toBe(0)
    expect(getBarWidth(8, undefined)).toBe(0)
  })

  it('never exceeds 100', () => {
    expect(getBarWidth(20, 16)).toBe(100)
  })
})

describe('SpecBar component', () => {
  it('renders a fill with the proportional width', () => {
    const { container } = render(<SpecBar value={8} max={16} metric="ram" ariaLabel="8 GB" />)
    const fill = container.querySelector('.SpecBar__fill')
    expect(fill).toBeTruthy()
    expect(fill.style.width).toBe('50%')
  })

  it('applies the metric-specific class', () => {
    const { container } = render(<SpecBar value={8} max={16} metric="storage" ariaLabel="x" />)
    expect(container.querySelector('.SpecBar--storage')).toBeTruthy()
  })

  it('exposes an accessible label', () => {
    const { getByRole } = render(<SpecBar value={8} max={16} metric="ram" ariaLabel="8 GB de RAM" />)
    expect(getByRole('img', { name: '8 GB de RAM' })).toBeTruthy()
  })

  it('renders an empty fill for a zero value', () => {
    const { container } = render(<SpecBar value={0} max={16} metric="ram" ariaLabel="N/A" />)
    expect(container.querySelector('.SpecBar__fill').style.width).toBe('0%')
  })
})

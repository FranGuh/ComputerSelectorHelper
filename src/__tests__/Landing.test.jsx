import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import Landing from '../pages/Landing/Landing'
import { addEntry, getHistory } from '../utils/historyStore'

beforeEach(() => {
  localStorage.clear()
})

const renderLanding = () => render(
  <HelmetProvider>
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  </HelmetProvider>
)

describe('Landing — recent history (F-02)', () => {
  it('does not render the history section when there is no history', () => {
    renderLanding()
    expect(screen.queryByText(/tus consultas recientes/i)).not.toBeInTheDocument()
  })

  it('renders history cards from localStorage', () => {
    addEntry({
      encodedAnswers: 'abc',
      summary: { processor: 'Intel i7', ram: '16 GB', gpu: 'RTX 4050', budget: 'high' },
    })
    renderLanding()
    expect(screen.getByText(/tus consultas recientes/i)).toBeInTheDocument()
    expect(screen.getByText(/intel i7/i)).toBeInTheDocument()
    expect(screen.getByText(/16 GB/)).toBeInTheDocument()
    expect(screen.getByText(/RTX 4050/)).toBeInTheDocument()
    expect(screen.getByText(/\$12,000/)).toBeInTheDocument()
  })

  it('links each history card back to the quiz with its encoded plan', () => {
    addEntry({
      encodedAnswers: 'plan123',
      summary: { processor: 'Intel i5', ram: '8 GB', gpu: 'Iris Xe', budget: 'low' },
    })
    renderLanding()
    const link = screen.getByRole('link', { name: /intel i5/i })
    expect(link).toHaveAttribute('href', '/quiz?plan=plan123')
  })

  it('clears history when the clear button is clicked', () => {
    addEntry({
      encodedAnswers: 'abc',
      summary: { processor: 'Intel i7', ram: '16 GB', gpu: 'RTX 4050', budget: 'high' },
    })
    renderLanding()
    fireEvent.click(screen.getByRole('button', { name: /limpiar/i }))
    expect(screen.queryByText(/tus consultas recientes/i)).not.toBeInTheDocument()
    expect(getHistory()).toHaveLength(0)
  })
})

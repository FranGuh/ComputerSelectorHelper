import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Recommendation from '../components/Recommendation/Recommendation'
import questions from '../constants/questions'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

beforeEach(() => {
  localStorage.clear()
  mockNavigate.mockClear()
})

const renderWithRouter = () => render(
  <MemoryRouter>
    <Recommendation />
  </MemoryRouter>
)

// Walks the full quiz, picking the first option for every question.
// For the technical-level question (INF-01) it picks "yes" or "no" on demand.
const completeQuiz = ({ technical = true } = {}) => {
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i]
    const checkboxes = screen.queryAllByRole('checkbox')
    const radios = screen.queryAllByRole('radio')
    if (q.id === 'isTechnical') {
      fireEvent.click(radios[technical ? 0 : 1])
    } else if (checkboxes.length > 0) {
      fireEvent.click(checkboxes[0])
    } else if (radios.length > 0) {
      fireEvent.click(radios[0])
    }
    const nextButton = screen.getByRole('button', { name: /siguiente|ver resultados/i })
    fireEvent.click(nextButton)
  }
}

vi.mock('../utils/convertToSpecs', () => ({
  default: vi.fn((answers) => ({
    processor: 'Intel i5 / Ryzen 5',
    ram: '12 GB',
    storage: '256 GB SSD',
    gpu: 'Intel Iris Xe / Radeon Vega',
    os: 'Windows 11',
    budget: answers.budget || 'medium',
    touchscreen: false,
    portability: 'Media o baja',
    battery: 'Media (4-7h)',
    warnings: ['⚠️ Advertencia crítica de prueba', 'Nota informativa de prueba'],
    rationale: ['Test rationale'],
    flags: { isTechnical: answers.isTechnical === 'yes' },
    laptopClass: [
      {
        id: 'test-1',
        name: 'Test Laptop 1',
        use: 'General use',
        specs: 'Intel i5, 8 GB RAM, 256 GB SSD',
        gpu: 'Intel Iris Xe',
        price: '$10,000 MXN',
        portability: 'Media',
        image: 'https://example.com/1.jpg',
        link: 'https://example.com/1',
      },
      {
        id: 'test-2',
        name: 'Test Laptop 2',
        use: 'Gaming',
        specs: 'Intel i7, 16 GB RAM, 512 GB SSD, RTX 4050',
        gpu: 'RTX 4050',
        price: '$15,000 MXN',
        portability: 'Media',
        image: 'https://example.com/2.jpg',
        link: 'https://example.com/2',
      },
      { id: 'test-3', name: 'Test Laptop 3', use: 'X', specs: 'i5', gpu: 'Iris Xe', price: '$11,000 MXN', portability: 'Media', image: '', link: '' },
      { id: 'test-4', name: 'Test Laptop 4', use: 'X', specs: 'i5', gpu: 'Iris Xe', price: '$12,000 MXN', portability: 'Media', image: '', link: '' },
      { id: 'generic-1', name: 'Clase genérica', isGeneric: true, use: 'X', specs: 'i5', gpu: 'Iris Xe', price: 'Consultar precio', portability: 'Media', image: '', link: '' },
    ],
  })),
}))

describe('Recommendation — Quiz flow', () => {
  it('renders with first question', () => {
    renderWithRouter()
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('shows checkbox options for first question', () => {
    renderWithRouter()
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('next button is disabled when no selection', () => {
    renderWithRouter()
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    expect(nextButton).toBeDisabled()
  })

  it('next button is enabled after selection', () => {
    renderWithRouter()
    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(firstCheckbox)
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    expect(nextButton).toBeEnabled()
  })

  it('advances to next question on click', () => {
    renderWithRouter()
    const firstQuestion = screen.getByRole('heading', { level: 2 }).textContent
    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(firstCheckbox)
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    fireEvent.click(nextButton)
    const secondQuestion = screen.getByRole('heading', { level: 2 }).textContent
    expect(secondQuestion).not.toBe(firstQuestion)
  })

  it('completes quiz and shows results', () => {
    renderWithRouter()
    completeQuiz()
    // Should show results — component renders "Especificaciones Recomendadas" heading
    expect(screen.getByText(/especificaciones recomendadas/i)).toBeInTheDocument()
  })
})

describe('Recommendation — Results page', () => {
  it('shows laptop cards after quiz completion', () => {
    renderWithRouter()
    completeQuiz()
    expect(screen.getByText('Test Laptop 1')).toBeInTheDocument()
    expect(screen.getByText('Test Laptop 2')).toBeInTheDocument()
  })

  it('shows spec cards on results page', () => {
    renderWithRouter()
    completeQuiz()
    expect(screen.getByText('Procesador')).toBeInTheDocument()
    expect(screen.getByText('RAM')).toBeInTheDocument()
    expect(screen.getByText('Almacenamiento')).toBeInTheDocument()
    expect(screen.getByText('Gráficos')).toBeInTheDocument()
  })

  it('shows reset button on results page', () => {
    renderWithRouter()
    completeQuiz()
    expect(screen.getByRole('button', { name: /reiniciar/i })).toBeInTheDocument()
  })

  it('resets quiz when reset button is clicked', () => {
    renderWithRouter()
    completeQuiz()
    const resetButton = screen.getByRole('button', { name: /reiniciar/i })
    fireEvent.click(resetButton)
    // Should be back to first question
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.queryByText(/especificaciones recomendadas/i)).not.toBeInTheDocument()
  })
})

describe('Recommendation — Technical level (INF-01)', () => {
  it('technical user sees the rationale expanded and all warnings', () => {
    renderWithRouter()
    completeQuiz({ technical: true })
    expect(screen.getByText('Test rationale')).toBeInTheDocument()
    expect(screen.getByText(/advertencia crítica de prueba/i)).toBeInTheDocument()
    expect(screen.getByText(/nota informativa de prueba/i)).toBeInTheDocument()
  })

  it('non-technical user sees a collapsed rationale and only critical warnings', () => {
    renderWithRouter()
    completeQuiz({ technical: false })
    expect(screen.queryByText('Test rationale')).not.toBeInTheDocument()
    expect(screen.getByText(/advertencia crítica de prueba/i)).toBeInTheDocument()
    expect(screen.queryByText(/nota informativa de prueba/i)).not.toBeInTheDocument()
  })
})

describe('Recommendation — compare deep-link', () => {
  it('caps the compare deep-link at 3 non-generic models and excludes generics', () => {
    renderWithRouter()
    completeQuiz()
    fireEvent.click(screen.getByRole('button', { name: /comparar/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/compare?models=test-1,test-2,test-3')
  })
})

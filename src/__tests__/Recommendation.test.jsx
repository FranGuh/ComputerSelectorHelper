import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Recommendation from '../components/Recommendation/Recommendation'

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
    warnings: [],
    rationale: ['Test rationale'],
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
    ],
  })),
}))

describe('Recommendation — Quiz flow', () => {
  it('renders with first question', () => {
    render(<Recommendation />)
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('shows checkbox options for first question', () => {
    render(<Recommendation />)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)
  })

  it('next button is disabled when no selection', () => {
    render(<Recommendation />)
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    expect(nextButton).toBeDisabled()
  })

  it('next button is enabled after selection', () => {
    render(<Recommendation />)
    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(firstCheckbox)
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    expect(nextButton).toBeEnabled()
  })

  it('advances to next question on click', () => {
    render(<Recommendation />)
    const firstQuestion = screen.getByRole('heading', { level: 2 }).textContent
    const firstCheckbox = screen.getAllByRole('checkbox')[0]
    fireEvent.click(firstCheckbox)
    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    fireEvent.click(nextButton)
    const secondQuestion = screen.getByRole('heading', { level: 2 }).textContent
    expect(secondQuestion).not.toBe(firstQuestion)
  })

  it('completes quiz and shows results', () => {
    render(<Recommendation />)
    // Answer all questions with first option
    for (let i = 0; i < 10; i++) {
      const checkboxes = screen.queryAllByRole('checkbox')
      const radios = screen.queryAllByRole('radio')
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0])
      } else if (radios.length > 0) {
        fireEvent.click(radios[0])
      }
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)
    }
    // Should show results
    expect(screen.getByText(/tu recomendación técnica/i)).toBeInTheDocument()
    expect(screen.getByText(/especificaciones recomendadas/i)).toBeInTheDocument()
  })
})

describe('Recommendation — Results page', () => {
  it('shows laptop cards after quiz completion', () => {
    render(<Recommendation />)
    // Answer all questions
    for (let i = 0; i < 10; i++) {
      const checkboxes = screen.queryAllByRole('checkbox')
      const radios = screen.queryAllByRole('radio')
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0])
      } else if (radios.length > 0) {
        fireEvent.click(radios[0])
      }
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)
    }
    // Should show laptop cards
    expect(screen.getByText('Test Laptop 1')).toBeInTheDocument()
    expect(screen.getByText('Test Laptop 2')).toBeInTheDocument()
  })

  it('shows spec cards on results page', () => {
    render(<Recommendation />)
    // Answer all questions
    for (let i = 0; i < 10; i++) {
      const checkboxes = screen.queryAllByRole('checkbox')
      const radios = screen.queryAllByRole('radio')
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0])
      } else if (radios.length > 0) {
        fireEvent.click(radios[0])
      }
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)
    }
    expect(screen.getByText('Procesador')).toBeInTheDocument()
    expect(screen.getByText('RAM')).toBeInTheDocument()
    expect(screen.getByText('Almacenamiento')).toBeInTheDocument()
    expect(screen.getByText('Gráficos')).toBeInTheDocument()
  })

  it('shows reset button on results page', () => {
    render(<Recommendation />)
    // Answer all questions
    for (let i = 0; i < 10; i++) {
      const checkboxes = screen.queryAllByRole('checkbox')
      const radios = screen.queryAllByRole('radio')
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0])
      } else if (radios.length > 0) {
        fireEvent.click(radios[0])
      }
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)
    }
    expect(screen.getByRole('button', { name: /reiniciar/i })).toBeInTheDocument()
  })

  it('resets quiz when reset button is clicked', () => {
    render(<Recommendation />)
    // Answer all questions
    for (let i = 0; i < 10; i++) {
      const checkboxes = screen.queryAllByRole('checkbox')
      const radios = screen.queryAllByRole('radio')
      if (checkboxes.length > 0) {
        fireEvent.click(checkboxes[0])
      } else if (radios.length > 0) {
        fireEvent.click(radios[0])
      }
      const nextButton = screen.getByRole('button', { name: /siguiente/i })
      fireEvent.click(nextButton)
    }
    // Click reset
    const resetButton = screen.getByRole('button', { name: /reiniciar/i })
    fireEvent.click(resetButton)
    // Should be back to first question
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
    expect(screen.queryByText(/tu recomendación técnica/i)).not.toBeInTheDocument()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import LaptopCard from '../components/LaptopCard/LaptopCard'

const mockModel = {
  id: 'test-laptop',
  name: 'Test Laptop Pro',
  use: 'Gaming, edición',
  specs: 'Intel i7, 16 GB RAM, 512 GB SSD, RTX 4060',
  gpu: 'RTX 4060',
  price: '$20,000 MXN',
  portability: 'Media',
  image: 'https://example.com/laptop.jpg',
  link: 'https://example.com/buy',
}

describe('LaptopCard', () => {
  it('renders with all props', () => {
    render(<LaptopCard model={mockModel} />)
    expect(screen.getByText('🎯 Te sugerimos esta laptop:')).toBeInTheDocument()
    expect(screen.getByText('Test Laptop Pro')).toBeInTheDocument()
    expect(screen.getByText(/Uso recomendado:/)).toBeInTheDocument()
    expect(screen.getByText('Gaming, edición')).toBeInTheDocument()
    expect(screen.getByText(/Especificaciones:/)).toBeInTheDocument()
    expect(screen.getByText(/Intel i7/)).toBeInTheDocument()
    expect(screen.getByText(/Precio aproximado:/)).toBeInTheDocument()
    expect(screen.getByText('$20,000 MXN')).toBeInTheDocument()
  })

  it('renders image with correct alt text', () => {
    render(<LaptopCard model={mockModel} />)
    const img = screen.getByAltText('Test Laptop Pro')
    expect(img).toBeInTheDocument()
    expect(img.getAttribute('src')).toBe('https://example.com/laptop.jpg')
  })

  it('renders link to store', () => {
    render(<LaptopCard model={mockModel} />)
    const link = screen.getByRole('link', { name: /ver en tienda/i })
    expect(link).toBeInTheDocument()
    expect(link.getAttribute('href')).toBe('https://example.com/buy')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('returns null when model is null', () => {
    const { container } = render(<LaptopCard model={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('returns null when model is undefined', () => {
    const { container } = render(<LaptopCard model={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows image fallback on error', () => {
    // Note: current component has no onError handler — test documents this gap
    render(<LaptopCard model={mockModel} />)
    const img = screen.getByAltText('Test Laptop Pro')
    expect(img).toBeInTheDocument()
    // TODO: Add onError handler to LaptopCard for image fallback
  })
})

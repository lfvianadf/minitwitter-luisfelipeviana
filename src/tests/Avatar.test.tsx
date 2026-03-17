import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '@/components/ui/Avatar'

describe('Avatar', () => {
  it('renderiza imagem quando src é fornecido', () => {
    render(<Avatar name="João Silva" src="https://example.com/avatar.jpg" />)
    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg')
    expect(img).toHaveAttribute('alt', 'João Silva')
  })

  it('renderiza iniciais quando não há src', () => {
    render(<Avatar name="João Silva" />)
    expect(screen.getByText('JS')).toBeInTheDocument()
  })

  it('renderiza inicial única para nome simples', () => {
    render(<Avatar name="Maria" />)
    expect(screen.getByText('M')).toBeInTheDocument()
  })

  it('aplica tamanho sm corretamente', () => {
    render(<Avatar name="Alice" size="sm" />)
    const avatar = screen.getByText('A').parentElement
    expect(avatar?.className).toMatch(/w-8/)
  })

  it('aplica tamanho lg corretamente', () => {
    render(<Avatar name="Alice" size="lg" />)
    const avatar = screen.getByText('A').parentElement
    expect(avatar?.className).toMatch(/w-14/)
  })

  it('usa tamanho md como padrão', () => {
    render(<Avatar name="Alice" />)
    const avatar = screen.getByText('A').parentElement
    expect(avatar?.className).toMatch(/w-10/)
  })
})

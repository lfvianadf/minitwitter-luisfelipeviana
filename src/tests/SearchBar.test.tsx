import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '@/components/post/SearchBar'

describe('SearchBar', () => {
  it('renderiza o input com placeholder correto', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Buscar posts...')).toBeInTheDocument()
  })

  it('exibe o valor atual no input', () => {
    render(<SearchBar value="react" onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('react')).toBeInTheDocument()
  })

  it('chama onChange ao digitar', async () => {
    const onChange = vi.fn()
    render(<SearchBar value="" onChange={onChange} />)
    await userEvent.type(screen.getByPlaceholderText('Buscar posts...'), 'b')
    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('não exibe botão de limpar quando value está vazio', () => {
    render(<SearchBar value="" onChange={vi.fn()} />)
    expect(screen.queryByLabelText('Limpar busca')).not.toBeInTheDocument()
  })

  it('exibe botão de limpar quando há valor', () => {
    render(<SearchBar value="algo" onChange={vi.fn()} />)
    expect(screen.getByLabelText('Limpar busca')).toBeInTheDocument()
  })

  it('chama onChange com string vazia ao clicar em limpar', async () => {
    const onChange = vi.fn()
    render(<SearchBar value="algo" onChange={onChange} />)
    await userEvent.click(screen.getByLabelText('Limpar busca'))
    expect(onChange).toHaveBeenCalledWith('')
  })
})

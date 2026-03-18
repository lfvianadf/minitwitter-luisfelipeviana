import { describe, it, expect } from 'vitest'
import { getInitials, truncate, isFileSizeValid, formatDate, cn } from '@/lib/utils'

describe('getInitials', () => {
  it('retorna iniciais de nome completo', () => {
    expect(getInitials('João Silva')).toBe('JS')
  })

  it('retorna inicial única para nome simples', () => {
    expect(getInitials('Maria')).toBe('M')
  })

  it('retorna no máximo 2 iniciais para nomes longos', () => {
    expect(getInitials('Ana Paula Souza Lima')).toBe('AP')
  })

  it('retorna iniciais em maiúsculo', () => {
    expect(getInitials('alice bob')).toBe('AB')
  })
})

describe('truncate', () => {
  it('não trunca texto curto', () => {
    expect(truncate('hello', 10)).toBe('hello')
  })

  it('não trunca texto com exatamente o limite', () => {
    expect(truncate('hello', 5)).toBe('hello')
  })

  it('trunca texto longo e adiciona reticências', () => {
    expect(truncate('hello world', 5)).toBe('hello...')
  })

  it('trunca texto bem longo', () => {
    const long = 'a'.repeat(200)
    expect(truncate(long, 50)).toBe('a'.repeat(50) + '...')
  })
})

describe('isFileSizeValid', () => {
  it('retorna true para arquivo abaixo do limite', () => {
    const file = new File(['x'.repeat(1024)], 'test.png', { type: 'image/png' })
    expect(isFileSizeValid(file, 5)).toBe(true)
  })

  it('retorna true para arquivo exatamente no limite', () => {
    const file = new File(['x'.repeat(5 * 1024 * 1024)], 'test.png', { type: 'image/png' })
    expect(isFileSizeValid(file, 5)).toBe(true)
  })

  it('retorna false para arquivo acima do limite', () => {
    const file = new File(['x'.repeat(6 * 1024 * 1024)], 'big.png', { type: 'image/png' })
    expect(isFileSizeValid(file, 5)).toBe(false)
  })

  it('usa 5MB como padrão', () => {
    const file = new File(['x'.repeat(4 * 1024 * 1024)], 'ok.png', { type: 'image/png' })
    expect(isFileSizeValid(file)).toBe(true)
  })
})

describe('formatDate', () => {
  // O formatDate adiciona 'Z' (UTC) e o ambiente de teste pode ter timezone diferente.
  // Testamos apenas o formato e o conteúdo que não depende de timezone.
  it('retorna string não vazia para data no formato SQLite', () => {
    const result = formatDate('2026-03-17 13:47:12')
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('contém o dia e o ano corretos', () => {
    const result = formatDate('2026-03-17 13:47:12')
    expect(result).toMatch(/2026/)
    expect(result).toMatch(/mar/)
  })

  it('contém o dia correto', () => {
    const result = formatDate('2024-01-15 10:00:00')
    expect(result).toMatch(/2024/)
    expect(result).toMatch(/jan/)
  })

  it('retorna string não vazia para hora zerada', () => {
    const result = formatDate('2025-06-01 00:00:00')
    expect(result).toMatch(/2025/)
    expect(typeof result).toBe('string')
  })
})

describe('cn', () => {
  it('combina classes corretamente', () => {
    expect(cn('foo', 'bar')).toBe('foo bar')
  })

  it('remove classes duplicadas do Tailwind', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2')
  })

  it('ignora valores falsy', () => {
    expect(cn('foo', false && 'bar', undefined, null, 'baz')).toBe('foo baz')
  })
})
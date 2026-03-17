import { describe, it, expect, beforeEach } from 'vitest'
import { getStoredToken } from '@/lib/token'

const STORE_KEY = '@minitwitter:auth'

describe('getStoredToken', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna null quando não há nada no localStorage', () => {
    expect(getStoredToken()).toBeNull()
  })

  it('retorna o token quando está salvo corretamente', () => {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ state: { token: 'meu-token-jwt', user: null, isAuthenticated: true } })
    )
    expect(getStoredToken()).toBe('meu-token-jwt')
  })

  it('retorna null quando o token é null na store', () => {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ state: { token: null, user: null, isAuthenticated: false } })
    )
    expect(getStoredToken()).toBeNull()
  })

  it('retorna null quando o JSON é inválido', () => {
    localStorage.setItem(STORE_KEY, 'json-invalido{{{')
    expect(getStoredToken()).toBeNull()
  })

  it('retorna null quando a estrutura não tem state.token', () => {
    localStorage.setItem(STORE_KEY, JSON.stringify({ outro: 'formato' }))
    expect(getStoredToken()).toBeNull()
  })
})

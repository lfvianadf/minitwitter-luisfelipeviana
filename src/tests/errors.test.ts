import { describe, it, expect } from 'vitest'
import axios from 'axios'
import { getAxiosErrorMessage } from '@/lib/errors'

function makeAxiosError(status: number, message?: string) {
  const error = new axios.AxiosError('error')
  error.response = {
    status,
    data: { message },
    headers: {},
    config: {} as any,
    statusText: '',
  }
  return error
}

describe('getAxiosErrorMessage', () => {
  it('retorna mensagem para erro 403', () => {
    const error = makeAxiosError(403)
    expect(getAxiosErrorMessage(error)).toBe('Você não tem permissão para realizar essa ação.')
  })

  it('retorna mensagem para erro 401', () => {
    const error = makeAxiosError(401)
    expect(getAxiosErrorMessage(error)).toBe('Sessão expirada. Faça login novamente.')
  })

  it('retorna mensagem da API para erro 400 com message', () => {
    const error = makeAxiosError(400, 'E-mail já está em uso.')
    expect(getAxiosErrorMessage(error)).toBe('E-mail já está em uso.')
  })

  it('retorna mensagem da API para outros erros com message', () => {
    const error = makeAxiosError(500, 'Erro interno do servidor.')
    expect(getAxiosErrorMessage(error)).toBe('Erro interno do servidor.')
  })

  it('retorna fallback quando não há mensagem na API', () => {
    const error = makeAxiosError(500)
    expect(getAxiosErrorMessage(error, 'Erro genérico.')).toBe('Erro genérico.')
  })

  it('retorna fallback padrão para erros não-axios', () => {
    expect(getAxiosErrorMessage(new Error('qualquer'))).toBe('Ocorreu um erro.')
  })

  it('retorna fallback padrão para valor null', () => {
    expect(getAxiosErrorMessage(null)).toBe('Ocorreu um erro.')
  })
})

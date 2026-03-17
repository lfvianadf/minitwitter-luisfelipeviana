import axios from 'axios'

export function getAxiosErrorMessage(error: unknown, fallback = 'Ocorreu um erro.'): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const data = error.response?.data
    const message = data?.message || data?.error

    if (status === 403) return 'Você não tem permissão para realizar essa ação.'
    if (status === 401) return 'Sessão expirada. Faça login novamente.'
    if (status === 400 && message) return message
    if (message) return message
  }
  return fallback
}
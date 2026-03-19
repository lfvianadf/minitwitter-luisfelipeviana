import axios from 'axios'
import { getStoredToken } from '@/lib/token'

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? ''

      // Nunca redireciona em rotas de autenticação
      // O hook próprio trata o erro e exibe o toast
      const isAuthRoute =
        url.includes('/auth/login') ||
        url.includes('/auth/register') ||
        url.includes('/auth/logout') ||
        url === '/auth/login' ||
        url === '/auth/register'

      // Só redireciona se há token salvo (sessão expirada)
      // Se não há token, é tentativa de login com credenciais erradas — não redireciona
      const hasToken = !!getStoredToken()

      if (!isAuthRoute && hasToken) {
        localStorage.removeItem('@minitwitter:auth')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
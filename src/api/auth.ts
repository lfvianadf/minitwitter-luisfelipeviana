import { api } from './axios'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '@/types'

interface RawLoginResponse {
  token: string
  user?: { id: number; name: string; email: string }
  id?: number
  name?: string
  email?: string
}

function normalizeUser(raw: { id: number | string; name: string; email: string }): User {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
  }
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<void> => {
    await api.post('/auth/register', payload)
    // API retorna 201 com o user criado, sem token — fluxo segue para o login
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post<RawLoginResponse>('/auth/login', payload)
    const rawUser = data.user ?? { id: data.id!, name: data.name!, email: data.email! }
    return { token: data.token, user: normalizeUser(rawUser) }
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout')
  },
}
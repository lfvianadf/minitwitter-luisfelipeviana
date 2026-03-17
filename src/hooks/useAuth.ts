import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/auth.store'
import type { LoginPayload, RegisterPayload } from '@/types'
import { getAxiosErrorMessage } from '@/lib/errors'

export function useLogin() {
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: ({ user, token }) => {
      setAuth(user, token)
      toast.success(`Bem-vindo de volta, ${user.name.split(' ')[0]}!`)
      navigate('/')
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, 'Credenciais inválidas.'))
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: () => {
      toast.success('Conta criada! Faça login para continuar.')
      navigate('/login')
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, 'Erro ao criar conta.'))
    },
  })
}

export function useLogout() {
  const { clearAuth } = useAuthStore()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuth()
      toast.success('Até logo!')
      navigate('/login')
    },
    onError: () => {
      clearAuth()
      navigate('/login')
    },
  })
}
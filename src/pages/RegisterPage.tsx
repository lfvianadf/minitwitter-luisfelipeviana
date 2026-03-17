import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Twitter } from 'lucide-react'

export function RegisterPage() {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500 shadow-xl shadow-brand-500/30">
            <Twitter className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl text-slate-900 dark:text-white">
              Criar conta
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Junte-se à comunidade do MiniTwitter
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="card p-6 shadow-xl shadow-black/5">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

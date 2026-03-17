import { Link } from 'react-router-dom'
import { Twitter } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-50 dark:bg-brand-900/20">
          <Twitter className="w-10 h-10 text-brand-500" />
        </div>
        <div>
          <h1 className="font-display font-bold text-6xl text-slate-900 dark:text-white">
            404
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
            Essa página não existe.
          </p>
        </div>
        <Link to="/" className="btn-primary inline-flex">
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}

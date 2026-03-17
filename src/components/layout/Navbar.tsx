import { Link, useNavigate } from 'react-router-dom'
import { Moon, Sun, LogOut, PenSquare, Twitter } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { useThemeStore } from '@/store/theme.store'
import { useLogout } from '@/hooks/useAuth'
import { Avatar } from '@/components/ui/Avatar'

export function Navbar() {
  const { user, isAuthenticated } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const { mutate: logout, isPending } = useLogout()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Twitter className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-slate-900 dark:text-white hidden sm:block">
            Mini<span className="text-brand-500">Twitter</span>
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn-ghost p-2.5 rounded-xl"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {isAuthenticated && user ? (
            <>
              {/* New post */}
              <button
                onClick={() => navigate('/?new=true')}
                className="btn-primary flex items-center gap-2 hidden sm:flex"
              >
                <PenSquare className="w-4 h-4" />
                Publicar
              </button>
              <button
                onClick={() => navigate('/?new=true')}
                className="btn-primary p-2.5 sm:hidden"
                aria-label="Novo post"
              >
                <PenSquare className="w-4 h-4" />
              </button>

              {/* User avatar + logout */}
              <div className="flex items-center gap-2 pl-1">
                <Avatar name={user.name} src={user.avatar} size="sm" />
                <button
                  onClick={() => logout()}
                  disabled={isPending}
                  className="btn-ghost p-2.5 rounded-xl text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  aria-label="Sair"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost">
                Entrar
              </Link>
              <Link to="/register" className="btn-primary">
                Cadastrar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

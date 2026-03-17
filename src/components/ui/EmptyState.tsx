import { SearchX, Newspaper } from 'lucide-react'

interface EmptyStateProps {
  type?: 'search' | 'feed'
  search?: string
}

export function EmptyState({ type = 'feed', search }: EmptyStateProps) {
  if (type === 'search') {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <SearchX className="w-7 h-7 text-slate-400" />
        </div>
        <div>
          <p className="font-display font-semibold text-slate-700 dark:text-slate-300">
            Nenhum resultado
          </p>
          <p className="text-sm text-slate-400 mt-1">
            Não encontramos posts para{' '}
            <span className="font-medium text-brand-500">"{search}"</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
        <Newspaper className="w-7 h-7 text-slate-400" />
      </div>
      <div>
        <p className="font-display font-semibold text-slate-700 dark:text-slate-300">
          Feed vazio
        </p>
        <p className="text-sm text-slate-400 mt-1">
          Seja o primeiro a publicar algo!
        </p>
      </div>
    </div>
  )
}

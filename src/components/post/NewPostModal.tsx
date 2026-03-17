import { useState } from 'react'
import { PenSquare } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { Modal } from '@/components/ui/Modal'
import { PostForm } from './PostForm'

export function FloatingNewPost() {
  const { isAuthenticated } = useAuthStore()
  const [open, setOpen] = useState(false)

  if (!isAuthenticated) return null

  return (
    <>
      {/* FAB - only on mobile */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-30 sm:hidden w-14 h-14 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white shadow-xl shadow-brand-500/40 flex items-center justify-center active:scale-95 transition-all duration-150"
        aria-label="Novo post"
      >
        <PenSquare className="w-6 h-6" />
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Nova publicação"
      >
        <PostForm onSuccess={() => setOpen(false)} />
      </Modal>
    </>
  )
}

import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { PostFeed } from '@/components/post/PostFeed'
import { PostForm } from '@/components/post/PostForm'
import { SearchBar } from '@/components/post/SearchBar'
import { Modal } from '@/components/ui/Modal'
import { useDebounce } from '@/hooks/useDebounce'

export function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [showNewPostModal, setShowNewPostModal] = useState(false)

  // Open new post modal if ?new=true is in URL
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowNewPostModal(true)
      setSearchParams({}, { replace: true })
    }
  }, [searchParams, setSearchParams])

  return (
    <div className="space-y-5">
      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Inline create form (desktop) — only when not searching */}
      {isAuthenticated && !search && (
        <div className="hidden sm:block">
          <PostForm />
        </div>
      )}

      {/* Feed */}
      <PostFeed search={debouncedSearch} />

      {/* Mobile new post modal */}
      <Modal
        isOpen={showNewPostModal}
        onClose={() => setShowNewPostModal(false)}
        title="Nova publicação"
      >
        <PostForm onSuccess={() => setShowNewPostModal(false)} />
      </Modal>
    </div>
  )
}

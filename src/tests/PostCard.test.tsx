import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PostCard } from '@/components/post/PostCard'
import type { NormalizedPost } from '@/types'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: () => ({ user: { id: 'user-1', name: 'Test User' } }),
}))
vi.mock('@/hooks/usePosts', () => ({
  useLikePost: () => ({ mutate: vi.fn() }),
  useDeletePost: () => ({ mutate: vi.fn(), isPending: false }),
}))

const mockPost: NormalizedPost = {
  id: 'post-1',
  title: 'Test Post Title',
  content: 'This is the post content.',
  authorId: 'other-user',
  author: { id: 'other-user', name: 'Other User' },
  likesCount: 5,
  likedByMe: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

describe('PostCard', () => {
  it('renders post title and content', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    expect(screen.getByText('This is the post content.')).toBeInTheDocument()
  })

  it('shows likes count', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does NOT show edit/delete buttons when user is not the author', () => {
    render(<PostCard post={mockPost} />)
    expect(screen.queryByLabelText('Editar post')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Deletar post')).not.toBeInTheDocument()
  })

  it('shows edit/delete buttons when user is the author', () => {
    const ownPost: NormalizedPost = { ...mockPost, authorId: 'user-1' }
    render(<PostCard post={ownPost} />)
    expect(screen.getByLabelText('Editar post')).toBeInTheDocument()
    expect(screen.getByLabelText('Deletar post')).toBeInTheDocument()
  })
})

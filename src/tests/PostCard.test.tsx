import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostCard } from '@/components/post/PostCard'
import type { NormalizedPost } from '@/types'

vi.mock('@/store/auth.store', () => ({
  useAuthStore: () => ({ user: { id: 'user-1', name: 'Test User' } }),
}))

const mockLike = vi.fn()
const mockDelete = vi.fn()
const mockUpdate = vi.fn()

vi.mock('@/hooks/usePosts', () => ({
  useLikePost: () => ({ mutate: mockLike }),
  useDeletePost: () => ({ mutate: mockDelete, isPending: false }),
  useUpdatePost: () => ({ mutate: mockUpdate, isPending: false }),
}))

const basePost: NormalizedPost = {
  id: 'post-1',
  title: 'Título do Post',
  content: 'Conteúdo do post de teste.',
  authorId: 'other-user',
  author: { id: 'other-user', name: 'Outro Usuário' },
  likesCount: 5,
  likedByMe: false,
  createdAt: '2026-03-17 13:47:12',
  updatedAt: '2026-03-17 13:47:12',
}

describe('PostCard — renderização', () => {
  it('exibe título e conteúdo', () => {
    render(<PostCard post={basePost} />)
    expect(screen.getByText('Título do Post')).toBeInTheDocument()
    expect(screen.getByText('Conteúdo do post de teste.')).toBeInTheDocument()
  })

  it('exibe nome do autor', () => {
    render(<PostCard post={basePost} />)
    expect(screen.getByText('Outro Usuário')).toBeInTheDocument()
  })

  it('exibe contador de likes', () => {
    render(<PostCard post={basePost} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('exibe imagem quando imageUrl está presente', () => {
    const post = { ...basePost, imageUrl: 'https://example.com/img.jpg' }
    render(<PostCard post={post} />)
    const img = screen.getByRole('img', { name: 'Título do Post' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
  })

  it('não exibe imagem quando imageUrl é undefined', () => {
    render(<PostCard post={basePost} />)
    expect(screen.queryByRole('img', { name: 'Título do Post' })).not.toBeInTheDocument()
  })
})

describe('PostCard — permissões', () => {
  it('não exibe botões editar/deletar para posts de outros usuários', () => {
    render(<PostCard post={basePost} />)
    expect(screen.queryByLabelText('Editar post')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Deletar post')).not.toBeInTheDocument()
  })

  it('exibe botões editar/deletar para posts do próprio usuário', () => {
    const ownPost = { ...basePost, authorId: 'user-1' }
    render(<PostCard post={ownPost} />)
    expect(screen.getByLabelText('Editar post')).toBeInTheDocument()
    expect(screen.getByLabelText('Deletar post')).toBeInTheDocument()
  })
})

describe('PostCard — interações', () => {
  it('abre modal de confirmação ao clicar em deletar', async () => {
    const user = userEvent.setup()
    const ownPost = { ...basePost, authorId: 'user-1' }
    render(<PostCard post={ownPost} />)
    await user.click(screen.getByLabelText('Deletar post'))
    // Usa match parcial para evitar problema com pontuação
    expect(screen.getByText(/Tem certeza que deseja deletar/i)).toBeInTheDocument()
  })

  it('fecha modal ao cancelar', async () => {
    const user = userEvent.setup()
    const ownPost = { ...basePost, authorId: 'user-1' }
    render(<PostCard post={ownPost} />)
    await user.click(screen.getByLabelText('Deletar post'))
    await user.click(screen.getByRole('button', { name: 'Cancelar' }))
    await waitFor(() => {
      expect(screen.queryByText(/Tem certeza que deseja deletar/i)).not.toBeInTheDocument()
    })
  })

  it('abre modal de edição ao clicar em editar', async () => {
    const user = userEvent.setup()
    const ownPost = { ...basePost, authorId: 'user-1' }
    render(<PostCard post={ownPost} />)
    await user.click(screen.getByLabelText('Editar post'))
    expect(screen.getByText('Editar post')).toBeInTheDocument()
  })

  it('chama like ao clicar no botão de curtir', async () => {
    const user = userEvent.setup()
    render(<PostCard post={basePost} />)
    await user.click(screen.getByRole('button'))
    expect(mockLike).toHaveBeenCalledWith('post-1')
  })
})
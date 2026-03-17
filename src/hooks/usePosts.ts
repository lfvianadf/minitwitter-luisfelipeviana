import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { postsApi } from '@/api/posts'
import type { CreatePostPayload, NormalizedPost, UpdatePostPayload } from '@/types'
import { getAxiosErrorMessage } from '@/lib/errors'

const POSTS_KEY = 'posts'

// ─── List / Infinite scroll ──────────────────────────────────────────────────

export function useInfinitePosts(search = '') {
  return useInfiniteQuery({
    queryKey: [POSTS_KEY, search],
    queryFn: ({ pageParam = 1 }) =>
      postsApi.list({ page: pageParam as number, limit: 10, search: search || undefined }),
    initialPageParam: 1,
    getNextPageParam: (last) => {
      const totalPages = last.totalPages ?? 1
      return last.page < totalPages ? last.page + 1 : undefined
    },
  })
}

// ─── Create ──────────────────────────────────────────────────────────────────

export function useCreatePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (payload: CreatePostPayload) => postsApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [POSTS_KEY] })
      toast.success('Post publicado!')
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, 'Erro ao criar post.'))
    },
  })
}

// ─── Update ──────────────────────────────────────────────────────────────────

export function useUpdatePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePostPayload }) =>
      postsApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [POSTS_KEY] })
      toast.success('Post atualizado!')
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, 'Erro ao atualizar post.'))
    },
  })
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export function useDeletePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [POSTS_KEY] })
      toast.success('Post deletado.')
    },
    onError: (error) => {
      toast.error(getAxiosErrorMessage(error, 'Erro ao deletar post.'))
    },
  })
}

// ─── Like (optimistic update) ────────────────────────────────────────────────

export function useLikePost() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => postsApi.like(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [POSTS_KEY] })
      const previous = qc.getQueriesData({ queryKey: [POSTS_KEY] })

      qc.setQueriesData({ queryKey: [POSTS_KEY] }, (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        const data = old as {
          pages: Array<{ data: NormalizedPost[] }>
        }
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === id
                ? {
                    ...post,
                    likedByMe: !post.likedByMe,
                    likesCount: post.likedByMe
                      ? post.likesCount - 1
                      : post.likesCount + 1,
                  }
                : post
            ),
          })),
        }
      })

      return { previous }
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        context.previous.forEach(([key, value]) => {
          qc.setQueryData(key, value)
        })
      }
      toast.error('Erro ao curtir post.')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: [POSTS_KEY] })
    },
  })
}

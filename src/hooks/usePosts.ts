import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { postsApi } from '@/api/posts'
import { useLikesStore } from '@/store/likes.store'
import type { CreatePostPayload, NormalizedPost, UpdatePostPayload } from '@/types'
import { getAxiosErrorMessage } from '@/lib/errors'

const POSTS_KEY = 'posts'

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

export function useLikePost() {
  const qc = useQueryClient()
  const { setLiked } = useLikesStore()

  return useMutation({
    mutationFn: (id: string) => postsApi.like(id),

    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: [POSTS_KEY] })
      const previous = qc.getQueriesData({ queryKey: [POSTS_KEY] })

      // Captura o estado atual do post antes de alterar
      let wasLiked = false
      qc.setQueriesData({ queryKey: [POSTS_KEY] }, (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        const data = old as { pages: Array<{ data: NormalizedPost[] }> }
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id !== id) return post
              wasLiked = post.likedByMe
              return {
                ...post,
                likedByMe: !post.likedByMe,
                likesCount: post.likedByMe
                  ? post.likesCount - 1
                  : post.likesCount + 1,
              }
            }),
          })),
        }
      })

      return { previous, wasLiked }
    },

    onSuccess: (result, id, context) => {
      // Persiste no localStorage
      setLiked(id, result.liked)

      // Garante que likedByMe e likesCount estão em sincronia
      // usando o wasLiked capturado no onMutate como referência
      qc.setQueriesData({ queryKey: [POSTS_KEY] }, (old: unknown) => {
        if (!old || typeof old !== 'object') return old
        const data = old as { pages: Array<{ data: NormalizedPost[] }> }
        return {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id !== id) return post
              // Se a API confirma o estado esperado, mantém o contador do optimistic
              // Se por algum motivo divergiu, corrige baseado no wasLiked
              const wasLiked = context?.wasLiked ?? false
              const expectedLiked = !wasLiked
              if (result.liked === expectedLiked) {
                // API confirmou — mantém tudo como está (optimistic foi correto)
                return post
              }
              // API divergiu (raro) — corrige o contador também
              return {
                ...post,
                likedByMe: result.liked,
                likesCount: result.liked
                  ? post.likesCount + 1
                  : post.likesCount - 1,
              }
            }),
          })),
        }
      })
    },

    onError: (_err, _id, context) => {
      // Rollback completo
      if (context?.previous) {
        context.previous.forEach(([key, value]) => {
          qc.setQueryData(key, value)
        })
      }
      toast.error('Erro ao curtir post.')
    },
  })
}
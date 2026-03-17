import { api } from './axios'
import type {
  CreatePostPayload,
  UpdatePostPayload,
  PostsQuery,
  NormalizedPost,
} from '@/types'

// Formato real que a API do Elysia retorna
interface RawPost {
  id: number
  title: string
  content: string
  image: string | null
  authorId: number
  authorName: string
  likesCount: number
  likedByMe?: boolean
  createdAt: string
}

interface RawPostsResponse {
  posts: RawPost[]
  total: number
  page: number
  limit: number
}

function normalizePost(raw: RawPost): NormalizedPost {
  return {
    id: String(raw.id),
    title: raw.title,
    content: raw.content,
    imageUrl: raw.image ?? undefined,
    authorId: String(raw.authorId),
    author: {
      id: String(raw.authorId),
      name: raw.authorName,
    },
    likesCount: raw.likesCount ?? 0,
    likedByMe: raw.likedByMe ?? false,
    createdAt: raw.createdAt,
    updatedAt: raw.createdAt,
  }
}

export const postsApi = {
  list: async (query: PostsQuery = {}) => {
    const { data } = await api.get<RawPostsResponse>('/posts', { params: query })
    const totalPages = Math.ceil(data.total / (query.limit ?? 10))
    return {
      data: data.posts.map(normalizePost),
      page: data.page,
      limit: data.limit,
      total: data.total,
      totalPages,
    }
  },

  getById: async (id: string): Promise<NormalizedPost> => {
    const { data } = await api.get<RawPost>(`/posts/${id}`)
    return normalizePost(data)
  },

  create: async (payload: CreatePostPayload): Promise<NormalizedPost> => {
    const body = {
      title: payload.title,
      content: payload.content,
      ...(payload.imageUrl ? { image: payload.imageUrl } : {}),
    }
    const { data } = await api.post<RawPost>('/posts', body)
    return normalizePost(data)
  },

  update: async (id: string, payload: UpdatePostPayload): Promise<NormalizedPost> => {
    const body = {
      ...(payload.title ? { title: payload.title } : {}),
      ...(payload.content ? { content: payload.content } : {}),
      ...(payload.imageUrl ? { image: payload.imageUrl } : {}),
    }
    const { data } = await api.put<RawPost>(`/posts/${id}`, body)
    return normalizePost(data)
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`)
  },

  like: async (id: string): Promise<{ likesCount: number; likedByMe: boolean }> => {
    const { data } = await api.post<{
      likesCount?: number
      likes_count?: number
      likedByMe?: boolean
      liked_by_me?: boolean
    }>(`/posts/${id}/like`)
    return {
      likesCount: data.likesCount ?? data.likes_count ?? 0,
      likedByMe: data.likedByMe ?? data.liked_by_me ?? false,
    }
  },
}
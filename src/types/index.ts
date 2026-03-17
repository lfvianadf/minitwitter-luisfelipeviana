// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string | number
  name: string
  email: string
  avatar?: string
  createdAt?: string
  created_at?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export interface Post {
  id: string | number
  title: string
  content: string
  // backend pode retornar image_url ou imageUrl
  imageUrl?: string
  image_url?: string
  // backend pode retornar author_id ou authorId
  authorId?: string | number
  author_id?: string | number
  author: {
    id: string | number
    name: string
    avatar?: string
  }
  // backend pode retornar likes_count ou likesCount
  likesCount?: number
  likes_count?: number
  // backend pode retornar liked_by_me ou likedByMe
  likedByMe?: boolean
  liked_by_me?: boolean
  createdAt?: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
}

// Helper para normalizar o post independente do formato da API
export function normalizePost(raw: Post): NormalizedPost {
  return {
    id: String(raw.id),
    title: raw.title,
    content: raw.content,
    imageUrl: raw.imageUrl ?? raw.image_url,
    authorId: String(raw.authorId ?? raw.author_id ?? raw.author?.id),
    author: {
      id: String(raw.author.id),
      name: raw.author.name,
      avatar: raw.author.avatar,
    },
    likesCount: raw.likesCount ?? raw.likes_count ?? 0,
    likedByMe: raw.likedByMe ?? raw.liked_by_me ?? false,
    createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? raw.updated_at ?? new Date().toISOString(),
  }
}

export interface NormalizedPost {
  id: string
  title: string
  content: string
  imageUrl?: string
  authorId: string
  author: {
    id: string
    name: string
    avatar?: string
  }
  likesCount: number
  likedByMe: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePostPayload {
  title: string
  content: string
  imageUrl?: string
  image_url?: string
}

export interface UpdatePostPayload {
  title?: string
  content?: string
  imageUrl?: string
  image_url?: string
}

// ─── Pagination ──────────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[]
  page: number
  limit: number
  total: number
  totalPages?: number
  total_pages?: number
}

export interface PostsQuery {
  page?: number
  limit?: number
  search?: string
}

// ─── API Error ───────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  statusCode?: number
  status?: number
}

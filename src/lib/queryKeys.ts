export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    list: (search?: string) => ['posts', search ?? ''] as const,
    detail: (id: string) => ['posts', id] as const,
  },
} as const

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LikesState {
  likedIds: Record<string, boolean> // postId -> true/false
  setLiked: (postId: string, liked: boolean) => void
  isLiked: (postId: string) => boolean
}

export const useLikesStore = create<LikesState>()(
  persist(
    (set, get) => ({
      likedIds: {},

      setLiked: (postId, liked) =>
        set((state) => ({
          likedIds: { ...state.likedIds, [postId]: liked },
        })),

      isLiked: (postId) => get().likedIds[postId] ?? false,
    }),
    {
      name: '@minitwitter:likes',
    }
  )
)
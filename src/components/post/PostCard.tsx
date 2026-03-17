import { useState } from 'react'
import { Heart, Trash2, Pencil, ImageOff } from 'lucide-react'
import { cn, formatDate } from '@/lib/utils'
import { useAuthStore } from '@/store/auth.store'
import { useLikePost, useDeletePost } from '@/hooks/usePosts'
import { Avatar } from '@/components/ui/Avatar'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PostEditModal } from './PostEditModal'
import type { NormalizedPost } from '@/types'

interface PostCardProps {
  post: NormalizedPost
}

export function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore()
  const { mutate: likePost } = useLikePost()
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isLikeAnimating, setIsLikeAnimating] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Compara como string para garantir que funciona com IDs numéricos do SQLite
  const isOwner = user && String(user.id) === String(post.authorId)

  const handleLike = () => {
    if (!user) return
    setIsLikeAnimating(true)
    likePost(String(post.id))
    setTimeout(() => setIsLikeAnimating(false), 350)
  }

  return (
    <>
      <article className="card p-5 space-y-4 animate-in hover:shadow-md transition-shadow duration-200">
        {/* Author */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar name={post.author.name} src={post.author.avatar} size="md" />
            <div className="min-w-0">
              <p className="font-display font-semibold text-slate-900 dark:text-slate-100 truncate">
                {post.author.name}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDate(post.createdAt)}
              </p>
            </div>
          </div>

          {/* Owner actions */}
          {isOwner && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setShowEditModal(true)}
                className="btn-ghost p-2 rounded-lg text-slate-400 hover:text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20"
                aria-label="Editar post"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="btn-ghost p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                aria-label="Deletar post"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h2 className="font-display font-semibold text-slate-900 dark:text-slate-100 text-base leading-snug">
            {post.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
        </div>

        {/* Image */}
        {post.imageUrl && !imgError && (
          <div className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full max-h-80 object-cover"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        {post.imageUrl && imgError && (
          <div className="rounded-xl bg-slate-100 dark:bg-slate-800 h-24 flex items-center justify-center gap-2 text-slate-400">
            <ImageOff className="w-5 h-5" />
            <span className="text-sm">Imagem indisponível</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-4 pt-1 border-t border-slate-100 dark:border-slate-700/50">
          <button
            onClick={handleLike}
            disabled={!user}
            className={cn(
              'flex items-center gap-1.5 text-sm transition-all duration-150',
              'hover:text-rose-500 disabled:opacity-50 disabled:cursor-not-allowed',
              post.likedByMe
                ? 'text-rose-500'
                : 'text-slate-400 dark:text-slate-500'
            )}
          >
            <Heart
              className={cn(
                'w-4 h-4 transition-all duration-150',
                post.likedByMe && 'fill-rose-500',
                isLikeAnimating && 'animate-pulse-like'
              )}
            />
            <span className="font-mono font-medium tabular-nums">
              {post.likesCount}
            </span>
          </button>

          {!user && (
            <span className="text-xs text-slate-400 ml-auto">
              Faça login para curtir
            </span>
          )}
        </div>
      </article>

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deletePost(String(post.id))
          setShowDeleteConfirm(false)
        }}
        title="Deletar post"
        description="Tem certeza que deseja deletar este post? Essa ação não pode ser desfeita."
        confirmLabel="Deletar"
        isLoading={isDeleting}
      />

      {/* Edit Modal */}
      <PostEditModal
        post={post}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />
    </>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useUpdatePost } from '@/hooks/usePosts'
import { Modal } from '@/components/ui/Modal'
import { Spinner } from '@/components/ui/Spinner'
import type { NormalizedPost } from '@/types'

const schema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(120, 'Máximo 120 caracteres'),
  content: z.string().min(1, 'Conteúdo obrigatório').max(1000, 'Máximo 1000 caracteres'),
  imageUrl: z.string().url('URL inválida').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface PostEditModalProps {
  post: NormalizedPost
  isOpen: boolean
  onClose: () => void
}

export function PostEditModal({ post, isOpen, onClose }: PostEditModalProps) {
  const { mutate: updatePost, isPending } = useUpdatePost()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl ?? '',
    },
  })

  const onSubmit = (data: FormData) => {
    updatePost(
      {
        id: String(post.id),
        payload: {
          title: data.title,
          content: data.content,
          imageUrl: data.imageUrl || undefined,
        },
      },
      { onSuccess: onClose }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar post">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="edit-title" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Título
          </label>
          <input id="edit-title" {...register('title')} type="text" className="input-base" />
          {errors.title && (
            <p className="text-xs text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-content" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Conteúdo
          </label>
          <textarea id="edit-content" {...register('content')} rows={5} className="input-base resize-none" />
          {errors.content && (
            <p className="text-xs text-red-500">{errors.content.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="edit-imageUrl" className="text-sm font-medium text-slate-700 dark:text-slate-300">
            URL da imagem (opcional)
          </label>
          <input
            id="edit-imageUrl"
            {...register('imageUrl')}
            type="url"
            placeholder="https://..."
            className="input-base"
          />
          {errors.imageUrl && (
            <p className="text-xs text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="btn-primary flex items-center gap-2"
          >
            {isPending && <Spinner size="sm" className="text-white" />}
            Salvar
          </button>
        </div>
      </form>
    </Modal>
  )
}
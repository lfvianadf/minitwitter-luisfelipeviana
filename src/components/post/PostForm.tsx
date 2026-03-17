import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ImageIcon, X, UploadCloud } from 'lucide-react'
import { useState, useRef } from 'react'
import { useCreatePost } from '@/hooks/usePosts'
import { Spinner } from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabaseClient'

async function uploadImage(file: File): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error('Imagem muito grande. Máximo 5MB.')
  const key = `${crypto.randomUUID()}.${file.name.split('.').pop()}`

  const { error } = await supabase.storage
    .from(import.meta.env.VITE_SUPABASE_BUCKET)
    .upload(key, file, { cacheControl: '3600', upsert: false })

  if (error) throw new Error('Falha ao enviar imagem.')

  const { data } = supabase.storage
    .from(import.meta.env.VITE_SUPABASE_BUCKET)
    .getPublicUrl(key)

  return data.publicUrl
}

const schema = z.object({
  title: z.string().min(1, 'Título obrigatório').max(120, 'Máximo 120 caracteres'),
  content: z.string().min(1, 'Conteúdo obrigatório').max(1000, 'Máximo 1000 caracteres'),
})

type FormData = z.infer<typeof schema>

export function PostForm({ onSuccess }: { onSuccess?: () => void }) {
  const { mutate: createPost, isPending } = useCreatePost()
  const [showImage, setShowImage] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const handleFile = async (file: File) => {
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    try {
      setImageUrl(await uploadImage(file))
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar imagem.')
      setPreview(null)
    } finally {
      setUploading(false)
    }
  }

  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    setImageUrl(null)
  }

  const onSubmit = (data: FormData) => {
    if (uploading) return toast.error('Aguarde o upload terminar.')
    createPost(
      { title: data.title, content: data.content, imageUrl: imageUrl ?? undefined },
      {
        onSuccess: () => {
          reset()
          clearImage()
          setShowImage(false)
          onSuccess?.()
        },
      }
    )
  }

  const contentValue = watch('content', '')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-5 space-y-4">
      <h2 className="font-display font-bold text-slate-900 dark:text-slate-100 text-base">
        Nova publicação
      </h2>

      <div className="space-y-1.5">
        <input {...register('title')} type="text" placeholder="Título do seu post..." className="input-base font-display font-semibold text-base" />
        {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <textarea {...register('content')} placeholder="O que está acontecendo?" rows={4} className="input-base resize-none" />
        <div className="flex justify-between items-center">
          {errors.content ? <p className="text-xs text-red-500">{errors.content.message}</p> : <span />}
          <span className={`text-xs tabular-nums ${contentValue.length > 900 ? 'text-red-500' : contentValue.length > 800 ? 'text-amber-500' : 'text-slate-400'}`}>
            {contentValue.length}/1000
          </span>
        </div>
      </div>

      {showImage && (
        <div
          className="relative rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-300 transition-colors cursor-pointer overflow-hidden"
          onClick={() => !preview && inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f) }}
        >
          {preview ? (
            <>
              <img src={preview} alt="Preview" className={`w-full max-h-52 object-cover ${uploading ? 'opacity-50' : ''}`} />
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50">
                  <Spinner size="md" />
                </div>
              )}
              {!uploading && (
                <button type="button" onClick={(e) => { e.stopPropagation(); clearImage() }}
                  className="absolute top-2 right-2 bg-slate-900/70 text-white rounded-full p-1">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center gap-2 py-8 text-slate-400">
              <UploadCloud className="w-6 h-6" />
              <p className="text-sm">Arraste ou clique para selecionar · máx. 5MB</p>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }} />
        </div>
      )}

      <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50">
        <button type="button" onClick={() => { if (showImage) clearImage(); setShowImage(v => !v) }}
          className={`btn-ghost flex items-center gap-2 text-slate-500 ${showImage ? 'text-brand-500' : ''}`}>
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline text-sm">Imagem</span>
        </button>
        <button type="submit" disabled={isPending || uploading} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {(isPending || uploading) && <Spinner size="sm" className="text-white" />}
          {uploading ? 'Enviando…' : 'Publicar'}
        </button>
      </div>
    </form>
  )
}
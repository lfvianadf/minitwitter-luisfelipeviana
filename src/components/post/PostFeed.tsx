import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfinitePosts } from '@/hooks/usePosts'
import { PostCard } from './PostCard'
import { PostSkeletonList } from '@/components/ui/PostSkeleton'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'

interface PostFeedProps {
  search?: string
}

export function PostFeed({ search = '' }: PostFeedProps) {
  const { ref, inView } = useInView({ threshold: 0.1 })

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isError,
  } = useInfinitePosts(search)

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) return <PostSkeletonList count={4} />

  if (isError) {
    return (
      <div className="card p-8 text-center">
        <p className="text-slate-500 dark:text-slate-400">
          Erro ao carregar posts. Verifique se o backend está rodando em{' '}
          <code className="font-mono text-brand-500">http://localhost:3000</code>
        </p>
      </div>
    )
  }

  const posts = data?.pages.flatMap((p) => p.data) ?? []

  if (posts.length === 0) {
    return <EmptyState type={search ? 'search' : 'feed'} search={search} />
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={String(post.id)} post={post} />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={ref} className="flex justify-center py-4">
        {isFetchingNextPage && <Spinner size="md" />}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-sm text-slate-400">Você chegou ao fim do feed ✦</p>
        )}
      </div>
    </div>
  )
}

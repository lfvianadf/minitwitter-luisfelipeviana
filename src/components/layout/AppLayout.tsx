import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { FloatingNewPost } from '@/components/post/NewPostModal'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <FloatingNewPost />
    </div>
  )
}

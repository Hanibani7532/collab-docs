'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, LogOut, Plus, Sparkles, FolderOpen, Share2, Activity } from 'lucide-react'
import DocumentList from '@/components/DocumentList'
import UploadButton from '@/components/UploadButton'

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null)
  const [owned, setOwned] = useState([])
  const [shared, setShared] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const loadData = async () => {
    const authRes = await fetch('/api/auth')
    const authData = await authRes.json()
    if (!authData.currentUser) {
      router.push('/login')
      return
    }
    setUser(authData.currentUser)

    const docsRes = await fetch('/api/documents')
    if (docsRes.ok) {
      const docsData = await docsRes.json()
      setOwned(docsData.owned || [])
      setShared(docsData.shared || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreate = async () => {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled document' }),
    })
    if (res.ok) {
      const data = await res.json()
      router.push(`/docs/${data.document.id}`)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this document permanently?')) return
    const res = await fetch(`/api/documents/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setOwned((prev: any) => prev.filter((d: any) => d.id !== id))
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
  }

  // Kinetic Text Loader
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06060b] text-white">
        <div className="relative flex items-center justify-center mb-4">
          <div className="w-16 h-16 rounded-full border-t-2 border-b-2 border-indigo-500 animate-spin" />
          <FileText className="w-6 h-6 text-indigo-400 absolute animate-pulse" />
        </div>
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-400 animate-pulse">
          Syncing Workspace...
        </p>
      </div>
    )
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div className="min-h-screen bg-[#06060b] text-zinc-100 relative overflow-hidden pb-20">
      {/* Perspective Grid + Aurora Background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.15) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 60%, transparent 100%)',
        }}
      />
      <div className="pointer-events-none fixed -top-32 left-1/3 w-[550px] h-[350px] bg-indigo-600/20 rounded-full blur-[130px]" />
      <div className="pointer-events-none fixed top-20 right-1/4 w-[450px] h-[300px] bg-fuchsia-600/15 rounded-full blur-[130px]" />

      {/* Spotlight Notch Navbar */}
      <div className="sticky top-4 z-30 max-w-5xl mx-auto px-4">
        <header className="relative rounded-2xl backdrop-blur-xl bg-zinc-900/75 border border-white/10 px-5 py-3 flex items-center justify-between shadow-[0_10px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Top Spotlight Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-white via-zinc-200 to-indigo-400 bg-clip-text text-transparent">
              CollabDocs
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Masked Avatar Pill */}
            <div className="flex items-center gap-2.5 bg-zinc-950/80 border border-white/10 pl-1.5 pr-3.5 py-1 rounded-full">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center text-xs font-bold ring-2 ring-indigo-500/30">
                {initials}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-zinc-200 leading-tight">{user?.name}</p>
                <p className="text-[10px] font-mono text-zinc-500 leading-tight">{user?.email}</p>
              </div>
            </div>

            {/* Corner Button for Switch User */}
            <button
              onClick={handleLogout}
              className="group relative flex items-center gap-1.5 px-3.5 py-2 bg-zinc-900/90 hover:bg-zinc-800 border border-white/10 rounded-xl text-xs font-medium text-zinc-300 hover:text-white transition-all"
            >
              <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-rose-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              Switch User
            </button>
          </div>
        </header>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-8">
        {/* Agent Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          {/* Main Aurora Hero Bento Card (2 Cols) */}
          <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-zinc-900/60 border border-white/10 p-7 flex flex-col justify-between backdrop-blur-xl group">
            <div className="absolute -right-20 -top-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-500 pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono uppercase tracking-wider mb-4">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Agent Bento Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Welcome back,{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  {user?.name}
                </span>
              </h1>
              <p className="text-zinc-400 text-sm mt-2 max-w-lg leading-relaxed">
                Author rich HTML documents, import Markdown files cleanly, and assign real-time RBAC permissions across your team.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-7 pt-5 border-t border-white/10">
              <UploadButton />

              {/* Radial Glow Button */}
              <button
                onClick={handleCreate}
                className="relative group/btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-sm font-bold border border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.65)] hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.9),rgba(255,255,255,0))]" />
                <Plus className="w-4 h-4 relative z-10 text-indigo-200 group-hover/btn:rotate-90 transition-transform duration-300" />
                <span className="relative z-10">New Document</span>
              </button>
            </div>
          </div>

          {/* Bento Stats Counter Column */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
            <div className="relative overflow-hidden rounded-3xl bg-zinc-900/60 border border-white/10 p-5 backdrop-blur-xl flex items-center justify-between group hover:border-indigo-500/40 transition-all">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Owned Docs</p>
                <p className="text-3xl font-black text-white mt-1 tracking-tight">{owned.length}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 mt-1">
                  <Activity className="w-3 h-3" /> Full Access
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6" />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl bg-zinc-900/60 border border-white/10 p-5 backdrop-blur-xl flex items-center justify-between group hover:border-fuchsia-500/40 transition-all">
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-zinc-400">Shared With Me</p>
                <p className="text-3xl font-black text-white mt-1 tracking-tight">{shared.length}</p>
                <span className="inline-flex items-center gap-1 text-[11px] text-fuchsia-400 mt-1">
                  <Share2 className="w-3 h-3" /> Collaborative
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 group-hover:scale-110 transition-transform">
                <Share2 className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <DocumentList owned={owned} shared={shared} onDelete={handleDelete} />
      </main>
    </div>
  )
}
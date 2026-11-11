'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, LogIn, UserPlus, Sparkles, Terminal } from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
}

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth')
      .then((r) => r.json())
      .then((data) => {
        setUsers(data.users || [])
        setLoading(false)
      })
  }, [])

  const loginAs = async (userId: string) => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) router.push('/dashboard')
  }

  const handleCustomLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    })
    if (res.ok) router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#06060b] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Perspective Grid Background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-25"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(99,102,241,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(99,102,241,0.18) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 45%, #000 50%, transparent 100%)',
        }}
      />

      {/* Aurora Hero Background */}
      <div className="pointer-events-none fixed -top-40 left-1/4 w-[500px] h-[500px] bg-indigo-600/25 rounded-full blur-[130px] animate-pulse" />
      <div className="pointer-events-none fixed -bottom-40 right-1/4 w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[130px]" />

      {/* Glow Border Card Container */}
      <div className="relative group max-w-md w-full z-10">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 rounded-3xl blur opacity-40 group-hover:opacity-75 transition duration-700" />
        
        <div className="relative bg-zinc-950/90 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 rounded-xl bg-zinc-900 border border-indigo-500/40 text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.3)]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-zinc-200 to-indigo-400 bg-clip-text text-transparent">
                  CollabDocs
                </span>
                <p className="text-[10px] font-mono uppercase tracking-widest text-indigo-400">
                  Real-time Workspace
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
              <Sparkles className="w-3 h-3 text-indigo-400" /> v1.0
            </span>
          </div>

          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            Pick an instant sandbox identity to test granular RBAC sharing, or initialize a new session below.
          </p>

          {/* Corner Buttons for Quick Demo Accounts */}
          <div className="space-y-2.5 mb-7">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Instant Sandbox Nodes
            </p>
            {loading ? (
              <div className="space-y-2">
                <div className="h-14 rounded-xl bg-zinc-900/90 border border-white/5 animate-pulse" />
                <div className="h-14 rounded-xl bg-zinc-900/90 border border-white/5 animate-pulse" />
              </div>
            ) : (
              users.map((u) => (
                <button
                  key={u.id}
                  onClick={() => loginAs(u.id)}
                  className="group/btn relative w-full flex items-center justify-between p-3.5 bg-zinc-900/60 hover:bg-zinc-900 border border-white/10 hover:border-indigo-500/40 rounded-xl transition-all duration-300 text-left overflow-hidden"
                >
                  {/* Animated Corner Borders */}
                  <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-indigo-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-indigo-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-indigo-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-indigo-400 opacity-0 group-hover/btn:opacity-100 transition-opacity" />

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600 text-white flex items-center justify-center font-bold text-xs shadow-[0_0_15px_rgba(99,102,241,0.4)]">
                      {u.name[0]?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-100 text-sm group-hover/btn:text-indigo-300 transition-colors">
                        {u.name}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">{u.email}</p>
                    </div>
                  </div>
                  <LogIn className="w-4 h-4 text-zinc-500 group-hover/btn:text-indigo-400 group-hover/btn:translate-x-1 transition-all" />
                </button>
              ))
            )}
          </div>

          <form onSubmit={handleCustomLogin} className="border-t border-white/10 pt-5 space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
              Custom Identity
            </p>
            <input
              type="text"
              placeholder="Display Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
            />
            <input
              type="email"
              required
              placeholder="developer@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-900/90 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 transition-all"
            />

            {/* Radial Glow Button */}
            <button
              type="submit"
              className="relative group/radial w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white overflow-hidden bg-zinc-900 border border-indigo-500/50 shadow-[0_0_25px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.5)] transition-all"
            >
              <span className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.8),rgba(255,255,255,0))]" />
              <UserPlus className="w-4 h-4 relative z-10 text-indigo-300 group-hover/radial:scale-110 transition-transform" />
              <span className="relative z-10">Initialize Workspace</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
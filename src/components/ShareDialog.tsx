'use client'

import { useState } from 'react'
import { Share2, Trash2, X, ShieldCheck } from 'lucide-react'

interface ShareItem {
  id: string
  role: string
  user: {
    id: string
    name: string
    email: string
  }
}

interface ShareDialogProps {
  documentId: string
  initialShares: ShareItem[]
}

export default function ShareDialog({ documentId, initialShares }: ShareDialogProps) {
  const [open, setOpen] = useState(false)
  const [shares, setShares] = useState<ShareItem[]>(initialShares)
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'VIEW' | 'EDIT'>('VIEW')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to share document')
        return
      }

      setShares((prev) => {
        const filtered = prev.filter((s) => s.user.id !== data.share.user.id)
        return [...filtered, data.share]
      })
      setEmail('')
    } catch {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (userId: string) => {
    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (res.ok) {
        setShares((prev) => prev.filter((s) => s.user.id !== userId))
      }
    } catch {
      alert('Failed to revoke access')
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* Shared Tooltip Avatars Stack */}
      {shares.length > 0 && (
        <div className="hidden sm:flex items-center -space-x-2">
          {shares.slice(0, 4).map((s) => (
            <div
              key={s.user.id}
              title={`${s.user.name} (${s.role})`}
              className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 text-white text-xs font-bold flex items-center justify-center ring-2 ring-zinc-950 hover:scale-110 hover:z-10 transition-transform cursor-pointer"
            >
              {s.user.name[0]?.toUpperCase()}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share Sheet
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative bg-zinc-950 border border-white/15 rounded-3xl shadow-[0_0_60px_rgba(99,102,241,0.25)] w-full max-w-md p-6 text-zinc-100">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">Access & Share Sheet</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleShare} className="space-y-3 mb-6">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Collaborator Email
                </label>
                <div className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="test@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'VIEW' | 'EDIT')}
                    className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200"
                  >
                    <option value="VIEW">VIEW ONLY</option>
                    <option value="EDIT">CAN EDIT</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-xs text-rose-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg disabled:opacity-50"
              >
                {loading ? 'Authorizing...' : 'Grant Permission'}
              </button>
            </form>

            <div>
              <h4 className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-2.5">
                Authorized Nodes ({shares.length})
              </h4>
              {shares.length === 0 ? (
                <p className="text-xs text-zinc-500 py-3 text-center border border-dashed border-white/10 rounded-xl">
                  Private document. Only you have access.
                </p>
              ) : (
                <ul className="divide-y divide-white/10 border border-white/10 rounded-2xl bg-zinc-900/50 overflow-hidden">
                  {shares.map((s) => (
                    <li
                      key={s.user.id}
                      className="flex items-center justify-between px-3.5 py-2.5 text-sm"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 flex items-center justify-center text-xs font-bold">
                          {s.user.name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-200 text-xs">{s.user.name}</p>
                          <p className="text-[11px] font-mono text-zinc-500">{s.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-indigo-300 border border-white/10">
                          {s.role === 'EDIT' ? 'Editor' : 'Viewer'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemove(s.user.id)}
                          className="text-zinc-500 hover:text-rose-400 p-1"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
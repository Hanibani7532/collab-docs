'use client'

import Link from 'next/link'
import { FileText, Trash2, Users, Clock, ArrowUpRight, Sparkles } from 'lucide-react'

interface DocItem {
  id: string
  title: string
  updatedAt: string
  owner?: { name: string; email: string }
  sharedRole?: string
}

interface DocumentListProps {
  owned: DocItem[]
  shared: DocItem[]
  onDelete: (id: string) => void
}

export default function DocumentList({ owned, shared, onDelete }: DocumentListProps) {
  return (
    <div className="space-y-12">
      {/* My Documents Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2.5 uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
            My Documents
            <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-900 text-indigo-400 border border-white/10">
              {owned.length}
            </span>
          </h2>
        </div>

        {owned.length === 0 ? (
          <div className="relative overflow-hidden border border-dashed border-white/15 rounded-3xl p-10 text-center bg-zinc-900/30 backdrop-blur-sm">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-zinc-200">Workspace is empty</h3>
            <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
              Initialize a new document or import a <span className="text-indigo-400 font-mono">.txt / .md</span> file above.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {owned.map((doc) => (
              <div key={doc.id} className="group relative">
                {/* Glow Border Card Backdrop */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />

                <div className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/90 p-5 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <Link href={`/docs/${doc.id}`} className="block flex-1">
                    <div className="flex items-start justify-between gap-2">
                      {/* Folder Preview Animated Icon */}
                      <div className="relative w-11 h-9 rounded-lg bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center">
                        <div className="absolute -top-1.5 left-1.5 w-4 h-2 rounded-t bg-indigo-500/40" />
                        <div className="w-7 h-5 bg-white/90 rounded-sm shadow-sm group-hover:-translate-y-1.5 group-hover:rotate-3 transition-transform duration-300 flex items-center justify-center">
                          <FileText className="w-3.5 h-3.5 text-indigo-600" />
                        </div>
                      </div>

                      <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    {/* Line Hover Link Title */}
                    <h3 className="font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors truncate mt-4 text-base relative inline-block max-w-full">
                      {doc.title}
                      <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-indigo-400 mt-0.5" />
                    </h3>

                    <p className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 mt-1.5">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      {new Date(doc.updatedAt).toLocaleString()}
                    </p>
                  </Link>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                      Owner
                    </span>
                    <button
                      type="button"
                      onClick={() => onDelete(doc.id)}
                      className="text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Shared With Me Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2.5 uppercase tracking-wider font-mono">
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_10px_#d946ef]" />
            Shared With Me
            <span className="text-xs px-2 py-0.5 rounded-md bg-zinc-900 text-fuchsia-400 border border-white/10">
              {shared.length}
            </span>
          </h2>
        </div>

        {shared.length === 0 ? (
          <div className="border border-dashed border-white/15 rounded-3xl p-8 text-center bg-zinc-900/30 backdrop-blur-sm">
            <Users className="w-6 h-6 text-fuchsia-400 mx-auto mb-2 opacity-80" />
            <p className="text-sm font-semibold text-zinc-300">No external shares yet</p>
            <p className="text-xs text-zinc-500 mt-0.5">
              Documents shared with your account appear in this highlight grid.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shared.map((doc) => (
              <Link key={doc.id} href={`/docs/${doc.id}`} className="group relative block">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-50 transition duration-500" />

                <div className="relative flex flex-col justify-between rounded-2xl border border-white/10 bg-zinc-900/90 p-5 backdrop-blur-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="p-2.5 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
                        <Users className="w-5 h-5" />
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-600 group-hover:text-fuchsia-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>

                    <h3 className="font-bold text-zinc-100 group-hover:text-fuchsia-300 transition-colors truncate mt-4 text-base">
                      {doc.title}
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1 truncate">
                      Owner: <span className="font-mono text-zinc-300">{doc.owner?.name || doc.owner?.email}</span>
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-3 border-t border-white/10">
                    <span
                      className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${
                        doc.sharedRole === 'EDIT'
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {doc.sharedRole === 'EDIT' ? 'Can Edit' : 'View Only'}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      {new Date(doc.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
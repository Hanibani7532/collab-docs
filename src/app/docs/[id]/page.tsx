'use client'

import { useEffect, useState, useRef, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Check, Loader2, Lock } from 'lucide-react'
import Editor from '@/components/Editor'
import ShareDialog from '@/components/ShareDialog'

export default function DocumentEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const [doc, setDoc] = useState<any>(null)
  const [role, setRole] = useState<'OWNER' | 'EDIT' | 'VIEW' | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [errorMsg, setErrorMsg] = useState('')
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch(`/api/documents/${id}`)
      .then(async (res) => {
        if (res.status === 401) {
          router.push('/login')
          return null
        }
        if (!res.ok) {
          setErrorMsg('You do not have permission to view this document.')
          return null
        }
        return res.json()
      })
      .then((data) => {
        if (data?.document) {
          setDoc(data.document)
          setRole(data.role)
          setTitle(data.document.title)
          setContent(data.document.content)
        }
      })
  }, [id, router])

  const triggerSave = (newTitle: string, newContent: string) => {
    if (role !== 'OWNER' && role !== 'EDIT') return

    setSaveStatus('saving')
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)

    saveTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/documents/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: newTitle, content: newContent }),
        })
        setSaveStatus(res.ok ? 'saved' : 'error')
      } catch {
        setSaveStatus('error')
      }
    }, 600)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setTitle(val)
    triggerSave(val, content)
  }

  const handleContentChange = (html: string) => {
    setContent(html)
    triggerSave(title, html)
  }

  if (errorMsg) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#06060b] text-zinc-100 p-4">
        <div className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-md text-center shadow-2xl">
          <Lock className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-1">Access Denied</h2>
          <p className="text-xs text-zinc-400 mb-5">{errorMsg}</p>
          <Link
            href="/dashboard"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
          >
            Return to Workspace
          </Link>
        </div>
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06060b] text-zinc-400 font-mono text-xs uppercase tracking-widest">
        Loading Editor Surface...
      </div>
    )
  }

  const editable = role === 'OWNER' || role === 'EDIT'

  return (
    <div className="min-h-screen bg-[#06060b] text-zinc-100 relative pb-16">
      <div className="pointer-events-none fixed -top-32 left-1/3 w-[500px] h-[300px] bg-indigo-600/15 rounded-full blur-[130px]" />

      {/* Spotlight Floating Header */}
      <div className="sticky top-4 z-30 max-w-5xl mx-auto px-4">
        <header className="relative rounded-2xl backdrop-blur-xl bg-zinc-900/80 border border-white/10 px-4 py-2.5 flex items-center justify-between gap-4 shadow-2xl">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-indigo-400 to-transparent" />

          <div className="flex items-center gap-3 flex-1">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>

            {editable ? (
              <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                className="text-base font-bold text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-indigo-400 focus:outline-none px-2 py-1 flex-1 max-w-md"
              />
            ) : (
              <h1 className="text-base font-bold text-white px-2">{title}</h1>
            )}
          </div>

          <div className="flex items-center gap-3">
            {editable ? (
              <span className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-zinc-950/80 border border-white/10 px-3 py-1 rounded-full">
                {saveStatus === 'saving' && (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                    Syncing...
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Synced
                  </>
                )}
                {saveStatus === 'error' && (
                  <span className="text-rose-400">Sync failed</span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                View Only
              </span>
            )}

            {role === 'OWNER' && (
              <ShareDialog documentId={doc.id} initialShares={doc.shares || []} />
            )}
          </div>
        </header>
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-8">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/30 to-fuchsia-500/30 rounded-2xl blur opacity-75 pointer-events-none" />
          <div className="relative">
            <Editor
              initialContent={content}
              editable={editable}
              onChange={handleContentChange}
            />
          </div>
        </div>
      </main>
    </div>
  )
}